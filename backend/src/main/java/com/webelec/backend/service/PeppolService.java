package com.webelec.backend.service;

import com.webelec.backend.dto.PeppolResultDTO;
import com.webelec.backend.dto.UblDTO;
import com.webelec.backend.exception.ResourceNotFoundException;
import com.webelec.backend.model.Client;
import com.webelec.backend.model.Facture;
import com.webelec.backend.model.FactureLigne;
import com.webelec.backend.model.Societe;
import com.webelec.backend.repository.FactureRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class PeppolService {

    private final FactureRepository factureRepository;

    public PeppolService(FactureRepository factureRepository) {
        this.factureRepository = factureRepository;
    }

    @Transactional(readOnly = true)
    public UblDTO generateUbl(Long factureId) {
        Facture facture = loadFacture(factureId);
        validateFactureForPeppol(facture);

        String contenu = buildUbl(facture);

        return new UblDTO(contenu, factureId);
    }

    @Transactional(readOnly = true)
    public PeppolResultDTO envoyer(Long factureId) {
        Facture facture = loadFacture(factureId);
        validateFactureForPeppol(facture);

        return new PeppolResultDTO("SENT", "Envoi Peppol simule pour la facture " + facture.getNumero());
    }

    private Facture loadFacture(Long factureId) {
        return factureRepository.findById(factureId)
                .orElseThrow(() -> new ResourceNotFoundException("Facture non trouvee"));
    }

    private void validateFactureForPeppol(Facture facture) {
        List<String> issues = new ArrayList<>();

        if (isBlank(facture.getNumero())) {
            issues.add("numero");
        }
        if (facture.getDateEmission() == null) {
            issues.add("dateEmission");
        }
        if (facture.getDateEcheance() == null) {
            issues.add("dateEcheance");
        }
        if (facture.getMontantHT() == null) {
            issues.add("montantHT");
        }
        if (facture.getMontantTVA() == null) {
            issues.add("montantTVA");
        }
        if (facture.getMontantTTC() == null) {
            issues.add("montantTTC");
        }
        if (facture.getSociete() == null) {
            issues.add("societe");
        }
        if (facture.getClient() == null) {
            issues.add("client");
        } else {
            if (isBlank(facture.getClient().getNom())) {
                issues.add("client.nom");
            }
            if (isBlank(facture.getClient().getPrenom())) {
                issues.add("client.prenom");
            }
        }
        if (facture.getLignes() == null || facture.getLignes().isEmpty()) {
            issues.add("lignes");
        }

        if (!issues.isEmpty()) {
            throw new IllegalArgumentException(
                    "Facture incomplete pour Peppol: " + String.join(", ", issues));
        }
    }

    private String buildUbl(Facture facture) {
        Societe societe = facture.getSociete();
        Client client = facture.getClient();

        StringBuilder builder = new StringBuilder();
        builder.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        builder.append("<Invoice>\n");
        builder.append("  <ID>").append(escapeXml(facture.getNumero())).append("</ID>\n");
        builder.append("  <IssueDate>").append(facture.getDateEmission()).append("</IssueDate>\n");
        builder.append("  <DueDate>").append(facture.getDateEcheance()).append("</DueDate>\n");
        builder.append("  <AccountingSupplierParty>\n");
        builder.append("    <PartyName>").append(escapeXml(societe.getNom())).append("</PartyName>\n");
        builder.append("    <CompanyID>").append(escapeXml(societe.getTva())).append("</CompanyID>\n");
        builder.append("    <ContactEmail>").append(escapeXml(societe.getEmail())).append("</ContactEmail>\n");
        builder.append("  </AccountingSupplierParty>\n");
        builder.append("  <AccountingCustomerParty>\n");
        builder.append("    <PartyName>").append(escapeXml(client.getNom())).append(" ")
                .append(escapeXml(client.getPrenom())).append("</PartyName>\n");
        builder.append("    <ContactEmail>").append(escapeXml(client.getEmail())).append("</ContactEmail>\n");
        builder.append("  </AccountingCustomerParty>\n");
        builder.append("  <LegalMonetaryTotal>\n");
        builder.append("    <LineExtensionAmount>")
                .append(facture.getMontantHT().toPlainString())
                .append("</LineExtensionAmount>\n");
        builder.append("    <TaxExclusiveAmount>")
                .append(facture.getMontantHT().toPlainString())
                .append("</TaxExclusiveAmount>\n");
        builder.append("    <TaxInclusiveAmount>")
                .append(facture.getMontantTTC().toPlainString())
                .append("</TaxInclusiveAmount>\n");
        builder.append("    <PayableAmount>")
                .append(facture.getMontantTTC().toPlainString())
                .append("</PayableAmount>\n");
        builder.append("  </LegalMonetaryTotal>\n");

        int lineNumber = 1;
        for (FactureLigne ligne : facture.getLignes()) {
            builder.append("  <InvoiceLine>\n");
            builder.append("    <ID>").append(lineNumber++).append("</ID>\n");
            builder.append("    <InvoicedQuantity>")
                    .append(ligne.getQuantite())
                    .append("</InvoicedQuantity>\n");
            builder.append("    <LineExtensionAmount>")
                    .append(ligne.getTotal().toPlainString())
                    .append("</LineExtensionAmount>\n");
            builder.append("    <Item>\n");
            builder.append("      <Description>")
                    .append(escapeXml(ligne.getDescription()))
                    .append("</Description>\n");
            builder.append("    </Item>\n");
            builder.append("    <Price>\n");
            builder.append("      <PriceAmount>")
                    .append(ligne.getPrixUnitaire().toPlainString())
                    .append("</PriceAmount>\n");
            builder.append("    </Price>\n");
            builder.append("  </InvoiceLine>\n");
        }

        builder.append("</Invoice>\n");

        return builder.toString();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String escapeXml(String value) {
        if (value == null) {
            return "";
        }
        return value
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&apos;");
    }
}