import Link from "next/link";

export default function ChantiersPage() {
  return (
    <div className="p-4 pb-24 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Chantiers</h1>
        <p className="app-muted text-sm">
          Vue rapide des chantiers planifies cette semaine.
        </p>
      </div>

      <div className="space-y-3">
        <SiteCard id={1} title="Ecole Sainte-Marie" status="En cours" />
        <SiteCard id={2} title="Bureaux Delta Park" status="A demarrer" />
        <SiteCard id={3} title="Entrepot Sud" status="Controle final" />
      </div>
    </div>
  );
}

function SiteCard({
  id,
  title,
  status,
}: {
  id: number;
  title: string;
  status: string;
}) {
  return (
    <Link href={`/chantiers/${id}`} className="block app-surface p-4 app-hover-surface">
      <p className="font-semibold">{title}</p>
      <p className="text-sm app-muted mt-1">{status}</p>
    </Link>
  );
}
