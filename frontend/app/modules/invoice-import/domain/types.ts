/**
 * Domain types for invoice import module
 */

export interface ImportRowResult {
  rowNumber: number;
  success: boolean;
  invoiceNumero: string;
  errors: string[];
  warnings: string[];
}

export interface InvoiceImportResponse {
  totalRows: number;
  successCount: number;
  errorCount: number;
  results: ImportRowResult[];
  status: ImportStatus;
  message: string;
}

export type ImportStatus = 'COMPLETE_SUCCESS' | 'PARTIAL_SUCCESS' | 'COMPLETE_FAILURE';

export interface InvoiceImportRequest {
  file: File;
  societeId: number;
}

export interface InvoiceImportConfig {
  maxFileSize?: number; // in bytes, default 10MB
  allowedFileTypes?: string[]; // default ['.csv']
  autoCreateClients?: boolean; // default true
}

export const DEFAULT_IMPORT_CONFIG: Required<InvoiceImportConfig> = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['.csv'],
  autoCreateClients: true,
};
