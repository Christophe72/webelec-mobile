export default function DashboardPage() {
  return (
    <div className="p-4 pb-24 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Tableau de bord</h1>
        <p className="app-muted text-sm">
          Aujourd’hui, gardons le cap.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card title="Interventions" value="3" />
        <Card title="Chantiers actifs" value="5" />
        <Card title="Devis en attente" value="2" />
        <Card title="Factures impayées" value="1" />
      </div>

      {/* Action rapide */}
      <div className="app-accent rounded-xl p-4">
        <p className="font-semibold">Action rapide</p>
        <div className="flex gap-3 mt-3">
          <button className="app-accent-btn px-3 py-2 rounded-lg text-sm font-medium">
            + Intervention
          </button>
          <button className="app-accent-btn px-3 py-2 rounded-lg text-sm font-medium">
            📷 Photo
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="app-surface p-4">
      <p className="text-sm app-muted">{title}</p>
      <p className="text-xl font-bold mt-1">
        {value}
      </p>
    </div>
  );
}
