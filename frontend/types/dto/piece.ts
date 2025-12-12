export interface PieceUploadDTO {
  type: string;
  file: File | Blob;
  interventionId?: number;
  devisId?: number;
  factureId?: number;
}

export interface PieceJustificativeResponse {
  id: number;
  filename: string;
  originalFilename: string;
  contentType: string;
  fileSize: number;
  type: string;
  downloadUrl: string;
  uploadDate: string;
  interventionId?: number;
  devisId?: number;
  factureId?: number;
}

// Legacy alias for backward compatibility
export type PieceDTO = PieceJustificativeResponse;
