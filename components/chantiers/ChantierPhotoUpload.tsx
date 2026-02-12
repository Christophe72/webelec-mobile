"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  chantierId: number;
}

export default function ChantierPhotoUpload({ chantierId }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("chantierId", chantierId.toString());

    try {
      setLoading(true);
      setMessage(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/photos/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Erreur upload");
      }

      setMessage("Photo ajoutée au chantier.");
      window.dispatchEvent(
        new CustomEvent("chantier-photo-uploaded", {
          detail: { chantierId },
        }),
      );
    } catch {
      setMessage("Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="app-accent px-4 py-2 rounded-lg cursor-pointer block text-center">
        📷 Prendre une photo
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleCapture}
          className="hidden"
        />
      </label>

      {preview && (
        <Image
          src={preview}
          alt="Preview"
          width={500}
          height={500}
          className="rounded-lg border border-[var(--surface-border)]"
        />
      )}

      {loading && <p className="text-sm app-muted">Envoi en cours...</p>}
      {message && <p className="text-sm app-muted">{message}</p>}
    </div>
  );
}
