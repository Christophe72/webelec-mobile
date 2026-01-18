/**
 * API Adapter for invoice import
 * Handles communication with the backend import endpoint
 */

import { InvoiceImportResponse, InvoiceImportRequest } from '../domain/types';
import { getToken } from '@/lib/api/auth-storage';

const API_URL = process.env.NEXT_PUBLIC_API_BASE;

export interface IInvoiceImportAdapter {
  import(request: InvoiceImportRequest): Promise<InvoiceImportResponse>;
}

/**
 * HTTP adapter for production use
 */
export class HttpInvoiceImportAdapter implements IInvoiceImportAdapter {
  constructor(private baseUrl: string = API_URL || '') {
    if (!this.baseUrl) {
      throw new Error('API base URL is not configured');
    }
  }

  async import(request: InvoiceImportRequest): Promise<InvoiceImportResponse> {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('societeId', request.societeId.toString());

    const token = getToken();
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}/factures/import`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Import failed',
      }));
      throw new Error(errorData.message || 'Import failed');
    }

    return await response.json();
  }
}

/**
 * Mock adapter for testing and development
 */
export class MockInvoiceImportAdapter implements IInvoiceImportAdapter {
  async import(request: InvoiceImportRequest): Promise<InvoiceImportResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate a partial success scenario
    const mockResults = [
      {
        rowNumber: 2,
        success: true,
        invoiceNumero: 'FAC-2025-001',
        errors: [],
        warnings: ['Nouveau client créé: Dupont Marc'],
      },
      {
        rowNumber: 3,
        success: true,
        invoiceNumero: 'FAC-2025-002',
        errors: [],
        warnings: [],
      },
      {
        rowNumber: 4,
        success: false,
        invoiceNumero: 'FAC-2025-003',
        errors: [
          'Le numéro de facture existe déjà: FAC-2025-003',
          'Le montant HT est obligatoire',
        ],
        warnings: [],
      },
    ];

    return {
      totalRows: 3,
      successCount: 2,
      errorCount: 1,
      results: mockResults,
      status: 'PARTIAL_SUCCESS',
      message: 'Import partiel: 2 réussies, 1 échec sur 3 lignes',
    };
  }
}
