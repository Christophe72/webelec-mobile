/**
 * API Adapter for invoice import
 * Handles communication with the backend import endpoint
 */

import { InvoiceImportResponse, InvoiceImportRequest } from "../domain/types";
import { bffFetch } from "@/lib/api/bffFetch";

export interface IInvoiceImportAdapter {
  import(request: InvoiceImportRequest): Promise<InvoiceImportResponse>;
}

/**
 * HTTP adapter for production use
 */
export class HttpInvoiceImportAdapter implements IInvoiceImportAdapter {
  constructor(private token: string) {}

  async import(request: InvoiceImportRequest): Promise<InvoiceImportResponse> {
    const formData = new FormData();
    formData.append("file", request.file);
    formData.append("societeId", request.societeId.toString());

    return bffFetch<InvoiceImportResponse>("/api/factures/import", this.token, {
      method: "POST",
      body: formData,
    });
  }
}

/**
 * Mock adapter for testing and development
 */
export class MockInvoiceImportAdapter implements IInvoiceImportAdapter {
  async import(request: InvoiceImportRequest): Promise<InvoiceImportResponse> {
    void request;
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate a partial success scenario
    const mockResults = [
      {
        rowNumber: 2,
        success: true,
        invoiceNumero: "FAC-2025-001",
        errors: [],
        warnings: ["Nouveau client créé: Dupont Marc"],
      },
      {
        rowNumber: 3,
        success: true,
        invoiceNumero: "FAC-2025-002",
        errors: [],
        warnings: [],
      },
      {
        rowNumber: 4,
        success: false,
        invoiceNumero: "FAC-2025-003",
        errors: [
          "Le numéro de facture existe déjà: FAC-2025-003",
          "Le montant HT est obligatoire",
        ],
        warnings: [],
      },
    ];

    return {
      totalRows: 3,
      successCount: 2,
      errorCount: 1,
      results: mockResults,
      status: "PARTIAL_SUCCESS",
      message: "Import partiel: 2 réussies, 1 échec sur 3 lignes",
    };
  }
}
