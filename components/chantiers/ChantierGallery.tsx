"use client";

import { useEffect, useMemo, useState } from "react";

interface Photo {
  id: number;
  fileName: string;
  createdAt: string;
}

interface Props {
  chantierId: number;
}

export default function ChantierGallery({ chantierId }: Props) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTick, setReloadTick] = useState(0);

  const apiBase = useMemo(
    () => (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, ""),
    [],
  );

  useEffect(() => {
    const handlePhotoUploaded = (
      event: Event,
    ) => {
      const detail = (event as CustomEvent<{ chantierId: number }>).detail;
      if (detail?.chantierId === chantierId) {
        setReloadTick((current) => current + 1);
      }
    };

    window.addEventListener("chantier-photo-uploaded", handlePhotoUploaded);
    return () => {
      window.removeEventListener("chantier-photo-uploaded", handlePhotoUploaded);
    };
  }, [chantierId]);

  useEffect(() => {
    let isActive = true;

    async function loadPhotos() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${apiBase}/api/photos/chantier/${chantierId}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error("Erreur de chargement des photos.");
        }

        const data = (await response.json()) as Photo[];
        if (isActive) {
          setPhotos(data);
        }
      } catch {
        if (isActive) {
          setError("Impossible de charger les photos.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadPhotos();

    return () => {
      isActive = false;
    };
  }, [apiBase, chantierId, reloadTick]);

  function buildPhotoUrl(fileName: string) {
    const normalizedPath = fileName.startsWith("/") ? fileName : `/${fileName}`;
    return `${apiBase}${normalizedPath}`;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Photos du chantier</h2>

      {loading && <p className="text-sm app-muted">Chargement...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && photos.length === 0 && (
        <p className="text-sm app-muted">Aucune photo.</p>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => {
            const photoUrl = buildPhotoUrl(photo.fileName);
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={photo.id}
                src={photoUrl}
                alt={`Photo chantier ${photo.id}`}
                className="rounded-lg object-cover h-24 w-full cursor-pointer app-surface"
                onClick={() => setSelected(photoUrl)}
              />
            );
          })}
        </div>
      )}

      {selected && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-60"
          onClick={() => setSelected(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selected}
            alt="Photo chantier"
            className="max-h-full max-w-full rounded-xl"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
