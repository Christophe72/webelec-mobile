package com.webelec.backend.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.webelec.backend.model.Devis;
import com.webelec.backend.model.DevisLigne;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
public class DevisPdfService {

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public byte[] generateDevisPdf(Devis devis) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdfDoc = new PdfDocument(writer);
            Document document = new Document(pdfDoc);

            // Title
            Paragraph title = new Paragraph("DEVIS")
                    .setFontSize(24)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(title);

            // Devis info
            Paragraph devisInfo = new Paragraph()
                    .add("Numéro: " + devis.getNumero() + "\n")
                    .add("Date d'émission: " + devis.getDateEmission().format(DATE_FORMATTER) + "\n")
                    .add("Date d'expiration: " + devis.getDateExpiration().format(DATE_FORMATTER) + "\n")
                    .add("Statut: " + (devis.getStatut() != null ? devis.getStatut() : "-") + "\n")
                    .setMarginBottom(20);
            document.add(devisInfo);

            // Client info
            if (devis.getClient() != null) {
                Paragraph clientTitle = new Paragraph("Informations Client")
                        .setFontSize(14)
                        .setBold()
                        .setMarginBottom(10);
                document.add(clientTitle);

                Paragraph clientInfo = new Paragraph()
                        .add("Client: " + devis.getClient().getNom() + " " + devis.getClient().getPrenom() + "\n")
                        .add("Email: " + (devis.getClient().getEmail() != null ? devis.getClient().getEmail() : "-") + "\n")
                        .add("Téléphone: " + (devis.getClient().getTelephone() != null ? devis.getClient().getTelephone() : "-") + "\n")
                        .add("Adresse: " + (devis.getClient().getAdresse() != null ? devis.getClient().getAdresse() : "-") + "\n")
                        .setMarginBottom(20);
                document.add(clientInfo);
            }

            // Lines table
            Paragraph linesTitle = new Paragraph("Détails")
                        .setFontSize(14)
                        .setBold()
                        .setMarginBottom(10);
            document.add(linesTitle);

            // Table with 4 columns: Description, Quantité, Prix Unit., Total
            float[] columnWidths = {4, 1, 2, 2};
            Table table = new Table(UnitValue.createPercentArray(columnWidths));
            table.setWidth(UnitValue.createPercentValue(100));

            // Header
            addTableHeader(table, "Description");
            addTableHeader(table, "Quantité");
            addTableHeader(table, "Prix Unit. (€)");
            addTableHeader(table, "Total (€)");

            // Lines
            if (devis.getLignes() != null && !devis.getLignes().isEmpty()) {
                for (DevisLigne ligne : devis.getLignes()) {
                    table.addCell(new Cell().add(new Paragraph(ligne.getDescription())));
                    table.addCell(new Cell().add(new Paragraph(String.valueOf(ligne.getQuantite()))).setTextAlignment(TextAlignment.CENTER));
                    table.addCell(new Cell().add(new Paragraph(formatMoney(ligne.getPrixUnitaire()))).setTextAlignment(TextAlignment.RIGHT));
                    table.addCell(new Cell().add(new Paragraph(formatMoney(ligne.getTotal()))).setTextAlignment(TextAlignment.RIGHT));
                }
            }

            document.add(table);

            // Totals
            Table totalsTable = new Table(UnitValue.createPercentArray(new float[]{7, 2}));
            totalsTable.setWidth(UnitValue.createPercentValue(100));
            totalsTable.setMarginTop(20);

            addTotalRow(totalsTable, "Total HT:", devis.getMontantHT());
            addTotalRow(totalsTable, "TVA:", devis.getMontantTVA());
            addTotalRowBold(totalsTable, "Total TTC:", devis.getMontantTTC());

            document.add(totalsTable);

            // Footer
            Paragraph footer = new Paragraph("\n\nMerci pour votre confiance!")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginTop(30)
                    .setFontSize(10);
            document.add(footer);

            document.close();
            return baos.toByteArray();

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération du PDF", e);
        }
    }

    private void addTableHeader(Table table, String text) {
        Cell headerCell = new Cell()
                .add(new Paragraph(text).setBold())
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setTextAlignment(TextAlignment.CENTER);
        table.addHeaderCell(headerCell);
    }

    private void addTotalRow(Table table, String label, BigDecimal amount) {
        table.addCell(new Cell().add(new Paragraph(label)).setTextAlignment(TextAlignment.RIGHT));
        table.addCell(new Cell().add(new Paragraph(formatMoney(amount))).setTextAlignment(TextAlignment.RIGHT));
    }

    private void addTotalRowBold(Table table, String label, BigDecimal amount) {
        table.addCell(new Cell().add(new Paragraph(label).setBold()).setTextAlignment(TextAlignment.RIGHT));
        table.addCell(new Cell().add(new Paragraph(formatMoney(amount)).setBold()).setTextAlignment(TextAlignment.RIGHT));
    }

    private String formatMoney(BigDecimal amount) {
        if (amount == null) {
            return "0,00";
        }
        return String.format("%,.2f", amount).replace(',', ' ').replace('.', ',');
    }
}
