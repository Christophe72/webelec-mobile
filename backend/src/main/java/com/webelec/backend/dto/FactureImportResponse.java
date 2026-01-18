package com.webelec.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Response DTO for invoice import operations.
 * Contains overall statistics and detailed results for each row.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FactureImportResponse {

    private int totalRows;
    private int successCount;
    private int errorCount;
    private List<ImportRowResult> results;
    private ImportStatus status;
    private String message;

    /**
     * Result for a single row in the import
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ImportRowResult {
        private int rowNumber;
        private boolean success;
        private String invoiceNumero;

        @Builder.Default
        private List<String> errors = new ArrayList<>();

        @Builder.Default
        private List<String> warnings = new ArrayList<>();

        public void addError(String error) {
            if (this.errors == null) {
                this.errors = new ArrayList<>();
            }
            this.errors.add(error);
        }

        public void addWarning(String warning) {
            if (this.warnings == null) {
                this.warnings = new ArrayList<>();
            }
            this.warnings.add(warning);
        }

        public boolean hasErrors() {
            return errors != null && !errors.isEmpty();
        }

        public boolean hasWarnings() {
            return warnings != null && !warnings.isEmpty();
        }
    }

    /**
     * Overall status of the import operation
     */
    public enum ImportStatus {
        COMPLETE_SUCCESS,    // All rows imported successfully
        PARTIAL_SUCCESS,     // Some rows succeeded, some failed
        COMPLETE_FAILURE     // All rows failed
    }

    /**
     * Helper method to determine the overall status based on results
     */
    public void calculateStatus() {
        if (errorCount == 0) {
            this.status = ImportStatus.COMPLETE_SUCCESS;
            this.message = String.format("Import réussi: %d factures importées", successCount);
        } else if (successCount == 0) {
            this.status = ImportStatus.COMPLETE_FAILURE;
            this.message = String.format("Import échoué: %d erreurs sur %d lignes", errorCount, totalRows);
        } else {
            this.status = ImportStatus.PARTIAL_SUCCESS;
            this.message = String.format("Import partiel: %d réussies, %d échecs sur %d lignes",
                                        successCount, errorCount, totalRows);
        }
    }
}
