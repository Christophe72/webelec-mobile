import Link from "next/link";
// import { getChantiers } from "../../lib/api/chantier";
import { getChantiers } from "@/lib/api/chantier";

export default async function ChantiersPage() {
  const chantiers = await getChantiers();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Chantiers</h1>
        <Link
          href="/chantiers/new"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Nouveau chantier
        </Link>
      </div>

      <div className="space-y-4">
        {chantiers.map((c: { id: string | number; nom: string; adresse?: string | null }) => (
          <div
            key={c.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{c.nom}</p>
              <p className="text-sm">{c.adresse || "—"}</p>
            </div>

            <div className="flex gap-3">
              <Link href={`/chantiers/${c.id}`} className="text-blue-600 underline">
            Détails
              </Link>
              <Link href={`/chantiers/${c.id}/edit`} className="text-yellow-600 underline">
            Modifier
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
