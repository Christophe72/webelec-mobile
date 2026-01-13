import { mockDb } from "@/lib/mock-db";
import type { PieceJustificativeResponse } from "@/types";

type PieceRecord = (typeof mockDb.pieces)[number];

export function toPieceResponse(
  piece: PieceRecord
): PieceJustificativeResponse {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, ...rest } = piece;
  return rest;
}

export function getPieceRecord(id: number): PieceRecord | null {
  return mockDb.pieces.find((piece) => piece.id === id) ?? null;
}

export function listPiecesBy(
  key: "interventionId" | "devisId" | "factureId",
  value: number
): PieceJustificativeResponse[] {
  return mockDb.pieces
    .filter((piece) => piece[key] === value)
    .map((piece) => toPieceResponse(piece));
}
