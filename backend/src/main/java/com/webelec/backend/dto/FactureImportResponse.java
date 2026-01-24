package com.webelec.backend.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Response DTO for invoice import operations.
 * Contains overall statistics and detailed results for each row.
 */
public class FactureImportResponse {

    private int totalRows;
    private int successCount;
    private int errorCount;
    private List<ImportRowResult> results;
    private ImportStatus status;
    private String message;

    public FactureImportResponse() {
    }

    public FactureImportResponse(int totalRows, int successCount, int errorCount,
                                 List<ImportRowResult> results, ImportStatus status, String message) {
        this.totalRows = totalRows;
        this.successCount = successCount;
        this.errorCount = errorCount;
        this.results = results;
        this.status = status;
        this.message = message;
    }

    public int getTotalRows() {
        return totalRows;
    }

    public void setTotalRows(int totalRows) {
        this.totalRows = totalRows;
    }

    public int getSuccessCount() {
        return successCount;
    }

    public void setSuccessCount(int successCount) {
        this.successCount = successCount;
    }

    public int getErrorCount() {
        return errorCount;
    }

    public void setErrorCount(int errorCount) {
        this.errorCount = errorCount;
    }

    public List<ImportRowResult> getResults() {
        return results;
    }

    public void setResults(List<ImportRowResult> results) {
        this.results = results;
    }

    public ImportStatus getStatus() {
        return status;
    }

    public void setStatus(ImportStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * Result for a single row in the import
     */
    public static class ImportRowResult {
        private int rowNumber;
        private boolean success;
        private String invoiceNumero;
        private List<String> errors = new ArrayList<>();
        private List<String> warnings = new ArrayList<>();

        public ImportRowResult() {
        }

        public ImportRowResult(int rowNumber, boolean success, String invoiceNumero,
                               List<String> errors, List<String> warnings) {
            this.rowNumber = rowNumber;
            this.success = success;
            this.invoiceNumero = invoiceNumero;
            if (errors != null) {
                this.errors = errors;
            }
            if (warnings != null) {
                this.warnings = warnings;
            }
        }

        public int getRowNumber() {
            return rowNumber;
        }

        public void setRowNumber(int rowNumber) {
            this.rowNumber = rowNumber;
        }

        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public String getInvoiceNumero() {
            return invoiceNumero;
        }

        public void setInvoiceNumero(String invoiceNumero) {
            this.invoiceNumero = invoiceNumero;
        }

        public List<String> getErrors() {
            return errors;
        }

        public void setErrors(List<String> errors) {
            this.errors = errors;
        }

        public List<String> getWarnings() {
            return warnings;
        }

        public void setWarnings(List<String> warnings) {
            this.warnings = warnings;
        }

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
        COMPLETE_SUCCESS,
        PARTIAL_SUCCESS,
        COMPLETE_FAILURE
    }

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