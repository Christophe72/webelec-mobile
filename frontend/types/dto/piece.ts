export interface PieceUploadDTO {
  type: string;
  file: File | Blob;
  interventionId?: string;
  devisId?: string;
  factureId?: string;
}

export interface PieceDTO {
  id: string;
  url: string;
  type: string;
  filename?: string;
}
