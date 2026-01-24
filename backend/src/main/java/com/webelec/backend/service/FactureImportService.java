package com.webelec.backend.service;

import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvValidationException;
import com.webelec.backend.dto.FactureImportResponse;
import com.webelec.backend.dto.FactureImportResponse.ImportRowResult;
import com.webelec.backend.dto.FactureImportRow;
import com.webelec.backend.exception.ConflictException;
import com.webelec.backend.model.Client;
import com.webelec.backend.model.Facture;
import com.webelec.backend.model.FactureLigne;
import com.webelec.backend.model.Societe;
import com.webelec.backend.repository.ClientRepository;
import com.webelec.backend.repository.FactureRepository;
import com.webelec.backend.repository.SocieteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

@Service
public class FactureImportService {

    private final FactureRepository factureRepository;
    private final ClientRepository clientRepository;
    private final SocieteRepository societeRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    public FactureImportService(FactureRepository factureRepository,
                                ClientRepository clientRepository,
                                SocieteRepository societeRepository) {
        this.factureRepository = factureRepository;
        this.clientRepository = clientRepository;
        this.societeRepository = societeRepository;
    }

    @Transactional
    public FactureImportResponse importFromCsv(MultipartFile file, Long societeId) {
        // Validate file and societe
        validateFileAndSociete(file, societeId);

        // Parse CSV
        List<FactureImportRow> rows = parseCsvFile(file);

        // Validate and convert each row
        List<ImportRowResult> results = new ArrayList<>();
        List<Facture> validFactures = new ArrayList<>();

        for (FactureImportRow row : rows) {
            ImportRowResult result = validateAndConvertRow(row, societeId);
            results.add(result);

            if (result.isSuccess() && result.getInvoiceNumero() != null) {
                // We'll build the facture in a second pass to have all clients created
                validFactures.add(null);  // Placeholder
            }
        }

        // Second pass: create factures with resolved clients
        List<Facture> facturesToSave = new ArrayList<>();
        for (int i = 0; i < results.size(); i++) {
            ImportRowResult result = results.get(i);
            if (result.isSuccess()) {
                FactureImportRow row = rows.get(i);
                try {
                    Facture facture = buildFactureFromRow(row, societeId, result);
                    facturesToSave.add(facture);
                } catch (Exception e) {
                    result.setSuccess(false);
                    result.addError("Erreur lors de la construction de la facture: " + e.getMessage());
                }
            }
        }

        // Bulk insert valid factures
        if (!facturesToSave.isEmpty()) {
            factureRepository.saveAll(facturesToSave);
        }

        // Build response
        return buildResponse(results);
    }

    private void validateFileAndSociete(MultipartFile file, Long societeId) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Le fichier est vide");
        }

        String filename = file.getOriginalFilename();
        if (filename == null || !filename.toLowerCase().endsWith(".csv")) {
            throw new IllegalArgumentException("Seuls les fichiers CSV sont supportés");
        }

        if (!societeRepository.existsById(societeId)) {
            throw new IllegalArgumentException("La société spécifiée n'existe pas");
        }
    }

    private List<FactureImportRow> parseCsvFile(MultipartFile file) {
        List<FactureImportRow> rows = new ArrayList<>();

        try (CSVReader reader = new CSVReaderBuilder(
                new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))
                .withSkipLines(1)  // Skip header row
                .build()) {

            String[] line;
            int rowNumber = 2;  // Start at 2 (1 is header)

            while ((line = reader.readNext()) != null) {
                // Skip empty rows
                if (isEmptyRow(line)) {
                    continue;
                }

                FactureImportRow row = new FactureImportRow();
                row.setRowNumber(rowNumber);
                row.setNumero(getColumn(line, 0));
                row.setDateEmission(getColumn(line, 1));
                row.setDateEcheance(getColumn(line, 2));
                row.setMontantHT(getColumn(line, 3));
                row.setMontantTVA(getColumn(line, 4));
                row.setMontantTTC(getColumn(line, 5));
                row.setStatut(getColumn(line, 6));
                row.setClientNom(getColumn(line, 7));
                row.setClientPrenom(getColumn(line, 8));
                row.setClientEmail(getColumn(line, 9));
                row.setClientTelephone(getColumn(line, 10));
                row.setClientAdresse(getColumn(line, 11));
                row.setLignes(getColumn(line, 12));

                rows.add(row);
                rowNumber++;
            }

        } catch (IOException | CsvValidationException e) {
            throw new RuntimeException("Erreur lors de la lecture du fichier CSV: " + e.getMessage(), e);
        }

        if (rows.isEmpty()) {
            throw new IllegalArgumentException("Le fichier CSV ne contient aucune donnée");
        }

        return rows;
    }

    private boolean isEmptyRow(String[] line) {
        if (line == null || line.length == 0) {
            return true;
        }
        for (String cell : line) {
            if (cell != null && !cell.trim().isEmpty()) {
                return false;
            }
        }
        return true;
    }

    private String getColumn(String[] line, int index) {
        if (index < line.length) {
            String value = line[index];
            return (value != null && !value.trim().isEmpty()) ? value.trim() : null;
        }
        return null;
    }

    private ImportRowResult validateAndConvertRow(FactureImportRow row, Long societeId) {
        ImportRowResult result = new ImportRowResult();
        result.setRowNumber(row.getRowNumber());
        result.setSuccess(true);

        // Validate required fields
        if (isBlank(row.getNumero())) {
            result.addError("Le numéro de facture est obligatoire");
        } else {
            result.setInvoiceNumero(row.getNumero());

            // Check uniqueness
            if (factureRepository.existsByNumeroAndSocieteId(row.getNumero(), societeId)) {
                result.addError("Le numéro de facture existe déjà: " + row.getNumero());
            }
        }

        // Parse and validate dates
        LocalDate dateEmission = parseDate(row.getDateEmission(), result, "dateEmission");
        LocalDate dateEcheance = parseDate(row.getDateEcheance(), result, "dateEcheance");

        if (dateEmission != null && dateEcheance != null && dateEcheance.isBefore(dateEmission)) {
            result.addWarning("La date d'échéance est antérieure à la date d'émission");
        }

        // Parse and validate amounts
        BigDecimal montantHT = parseDecimal(row.getMontantHT(), result, "montantHT");
        BigDecimal montantTVA = parseDecimal(row.getMontantTVA(), result, "montantTVA");
        BigDecimal montantTTC = parseDecimal(row.getMontantTTC(), result, "montantTTC");

        if (montantHT != null && montantTVA != null && montantTTC != null) {
            BigDecimal calculated = montantHT.add(montantTVA);
            if (calculated.compareTo(montantTTC) != 0) {
                result.addWarning(String.format("Incohérence: HT (%.2f) + TVA (%.2f) = %.2f ≠ TTC (%.2f)",
                        montantHT, montantTVA, calculated, montantTTC));
            }
        }

        // Validate statut
        if (isBlank(row.getStatut())) {
            result.addError("Le statut est obligatoire");
        }

        // Validate client fields
        if (isBlank(row.getClientNom())) {
            result.addError("Le nom du client est obligatoire");
        }
        if (isBlank(row.getClientPrenom())) {
            result.addError("Le prénom du client est obligatoire");
        }

        // Parse line items
        parseLignes(row.getLignes(), result);

        // Determine final success
        result.setSuccess(!result.hasErrors());

        return result;
    }

    private Facture buildFactureFromRow(FactureImportRow row, Long societeId, ImportRowResult result) {
        // Resolve client
        Client client = resolveClient(row, societeId, result);
        if (client == null) {
            throw new IllegalStateException("Client non résolu");
        }

        // Get societe
        Societe societe = societeRepository.findById(societeId)
                .orElseThrow(() -> new IllegalStateException("Société non trouvée"));

        // Parse dates and amounts
        LocalDate dateEmission = LocalDate.parse(row.getDateEmission(), DATE_FORMATTER);
        LocalDate dateEcheance = LocalDate.parse(row.getDateEcheance(), DATE_FORMATTER);
        BigDecimal montantHT = new BigDecimal(row.getMontantHT());
        BigDecimal montantTVA = new BigDecimal(row.getMontantTVA());
        BigDecimal montantTTC = new BigDecimal(row.getMontantTTC());

        // Create facture
        Facture facture = new Facture();
        facture.setNumero(row.getNumero());
        facture.setDateEmission(dateEmission);
        facture.setDateEcheance(dateEcheance);
        facture.setMontantHT(montantHT);
        facture.setMontantTVA(montantTVA);
        facture.setMontantTTC(montantTTC);
        facture.setStatut(row.getStatut());
        facture.setSociete(societe);
        facture.setClient(client);

        // Parse and add line items
        List<FactureLigne> lignes = parseLignesForFacture(row.getLignes(), facture);
        facture.setLignes(lignes);

        return facture;
    }

    private Client resolveClient(FactureImportRow row, Long societeId, ImportRowResult result) {
        // Strategy 1: Lookup by email if provided
        if (!isBlank(row.getClientEmail())) {
            Client existing = clientRepository.findByEmail(row.getClientEmail());
            if (existing != null) {
                if (!existing.getSociete().getId().equals(societeId)) {
                    result.addError("Le client avec cet email appartient à une autre société");
                    return null;
                }
                result.addWarning("Client existant trouvé par email: " + row.getClientEmail());
                return existing;
            }
        }

        // Strategy 2: Lookup by nom+prenom+societe (requires new repository method)
        // For now, we'll skip this and go directly to creation

        // Strategy 3: Create new client
        Societe societe = societeRepository.findById(societeId)
                .orElseThrow(() -> new IllegalStateException("Société non trouvée"));

        Client newClient = new Client();
        newClient.setNom(row.getClientNom());
        newClient.setPrenom(row.getClientPrenom());
        newClient.setEmail(row.getClientEmail());
        newClient.setTelephone(row.getClientTelephone());
        newClient.setAdresse(row.getClientAdresse());
        newClient.setSociete(societe);

        Client saved = clientRepository.save(newClient);
        result.addWarning("Nouveau client créé: " + saved.getNom() + " " + saved.getPrenom());

        return saved;
    }

    private void parseLignes(String lignesData, ImportRowResult result) {
        if (isBlank(lignesData)) {
            result.addError("Les lignes de facture sont obligatoires");
            return;
        }

        String[] lines = lignesData.split(";");
        if (lines.length == 0) {
            result.addError("Au moins une ligne de facture est requise");
            return;
        }

        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].trim();
            if (isBlank(line)) {
                continue;
            }

            String[] parts = line.split("\\|");
            if (parts.length != 4) {
                result.addError(String.format("Ligne %d: format invalide (attendu: desc|qty|prix|total)", i + 1));
                continue;
            }

            // Validate each part
            if (isBlank(parts[0])) {
                result.addError(String.format("Ligne %d: description obligatoire", i + 1));
            }

            try {
                int quantite = Integer.parseInt(parts[1].trim());
                if (quantite <= 0) {
                    result.addError(String.format("Ligne %d: quantité doit être positive", i + 1));
                }
            } catch (NumberFormatException e) {
                result.addError(String.format("Ligne %d: quantité invalide", i + 1));
            }

            try {
                new BigDecimal(parts[2].trim());
            } catch (NumberFormatException e) {
                result.addError(String.format("Ligne %d: prix unitaire invalide", i + 1));
            }

            try {
                new BigDecimal(parts[3].trim());
            } catch (NumberFormatException e) {
                result.addError(String.format("Ligne %d: total invalide", i + 1));
            }
        }
    }

    private List<FactureLigne> parseLignesForFacture(String lignesData, Facture facture) {
        List<FactureLigne> lignes = new ArrayList<>();

        if (isBlank(lignesData)) {
            return lignes;
        }

        String[] lines = lignesData.split(";");
        for (String line : lines) {
            line = line.trim();
            if (isBlank(line)) {
                continue;
            }

            String[] parts = line.split("\\|");
            if (parts.length != 4) {
                continue;
            }

            FactureLigne ligne = new FactureLigne();
            ligne.setDescription(parts[0].trim());
            ligne.setQuantite(Integer.parseInt(parts[1].trim()));
            ligne.setPrixUnitaire(new BigDecimal(parts[2].trim()));
            ligne.setTotal(new BigDecimal(parts[3].trim()));
            ligne.setFacture(facture);

            lignes.add(ligne);
        }

        return lignes;
    }

    private LocalDate parseDate(String value, ImportRowResult result, String fieldName) {
        if (isBlank(value)) {
            result.addError(String.format("Le champ %s est obligatoire", fieldName));
            return null;
        }

        try {
            return LocalDate.parse(value, DATE_FORMATTER);
        } catch (DateTimeParseException e) {
            result.addError(String.format("%s: format invalide (attendu: YYYY-MM-DD)", fieldName));
            return null;
        }
    }

    private BigDecimal parseDecimal(String value, ImportRowResult result, String fieldName) {
        if (isBlank(value)) {
            result.addError(String.format("Le champ %s est obligatoire", fieldName));
            return null;
        }

        try {
            BigDecimal decimal = new BigDecimal(value);
            if (decimal.compareTo(BigDecimal.ZERO) < 0) {
                result.addError(String.format("%s ne peut pas être négatif", fieldName));
                return null;
            }
            return decimal;
        } catch (NumberFormatException e) {
            result.addError(String.format("%s: format numérique invalide", fieldName));
            return null;
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private FactureImportResponse buildResponse(List<ImportRowResult> results) {
        int successCount = (int) results.stream().filter(r -> r.isSuccess()).count();
        int errorCount = results.size() - successCount;

        FactureImportResponse response = new FactureImportResponse();
        response.setTotalRows(results.size());
        response.setSuccessCount(successCount);
        response.setErrorCount(errorCount);
        response.setResults(results);

        response.calculateStatus();

        return response;
    }
}