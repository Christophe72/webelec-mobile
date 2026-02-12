export default function ClientsPage() {
  return (
    <div className="p-4 pb-24 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Clients</h1>
        <p className="app-muted text-sm">
          Suivi des clients actifs et des dossiers en cours.
        </p>
      </div>

      <div className="space-y-3">
        <ClientRow name="Dupont Electricite" contact="Mme Dupont" city="Liege" />
        <ClientRow name="Atelier Meca Nord" contact="M. Leroy" city="Namur" />
        <ClientRow name="Residence Les Tilleuls" contact="Syndic Immo" city="Bruxelles" />
      </div>
    </div>
  );
}

function ClientRow({
  name,
  contact,
  city,
}: {
  name: string;
  contact: string;
  city: string;
}) {
  return (
    <div className="app-surface p-4">
      <p className="font-semibold">{name}</p>
      <p className="text-sm app-muted mt-1">{contact}</p>
      <p className="text-sm app-muted">{city}</p>
    </div>
  );
}
