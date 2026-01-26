const kpis = [
  {
    label: "Chiffre d'affaires (mois)",
    value: "48 600 €",
    hint: "Évolution stable sur 30 jours",
  },
  {
    label: "Devis en attente",
    value: "18",
    hint: "dont 6 à relancer",
  },
  {
    label: "Factures en retard",
    value: "7",
    hint: "encours à risque",
  },
  {
    label: "Stock critique",
    value: "4",
    hint: "articles sous seuil",
  },
];

const clients = [
  {
    client: "Sophie Lambert",
    chantier: "Villa Braine",
    derniereIntervention: "18/01/2026",
    encours: "4 600 €",
    statut: "Factures en attente",
  },
  {
    client: "Marc Delvaux",
    chantier: "Atelier Liège",
    derniereIntervention: "22/01/2026",
    encours: "1 600 €",
    statut: "Paiement partiel",
  },
  {
    client: "Julie Henrard",
    chantier: "Immeuble Namur",
    derniereIntervention: "25/01/2026",
    encours: "980 €",
    statut: "Devis à valider",
  },
  {
    client: "Thomas Beka",
    chantier: "Commerce Mons",
    derniereIntervention: "12/01/2026",
    encours: "3 600 €",
    statut: "Relance nécessaire",
  },
  {
    client: "Ateliers Vanden",
    chantier: "Hall industriel",
    derniereIntervention: "20/01/2026",
    encours: "7 600 €",
    statut: "Factures en attente",
  },
];

const filters = [
  {
    label: "Période",
    value: "30 derniers jours",
  },
  {
    label: "Statut factures",
    value: "Toutes",
  },
  {
    label: "Type de chantier",
    value: "Résidentiel",
  },
  {
    label: "Technicien",
    value: "Équipe A",
  },
];

export function DashboardPageContent() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="relative mx-auto w-full max-w-7xl px-4 py-8">
        <aside className="hidden w-64 shrink-0 flex-col gap-6 rounded-3xl border border-border/60 bg-card p-6 shadow-sm lg:fixed lg:left-8 lg:top-8 lg:flex lg:h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              WebElec
            </p>
            <h2 className="text-lg font-semibold">Tableau de bord</h2>
            <p className="text-sm text-muted">
              Pilotage des chantiers et de la facturation.
            </p>
          </div>
          <nav className="space-y-1 text-sm">
            {
              [
                "Tableau de bord",
                "Clients",
                "Chantiers",
                "Interventions",
                "Devis",
                "Factures",
                "Stock",
                "Conformité RGIE",
                "Catalogue",
                "Paramètres",
              ].map((item) => (
                <div
                  key={item}
                  className={
                    item === "Tableau de bord"
                      ? "rounded-full bg-foreground px-4 py-2 text-background"
                      : "rounded-full px-4 py-2 text-muted hover:bg-muted"
                  }
                >
                  {item}
                </div>
              ))
            }
          </nav>
          <div className="mt-auto rounded-2xl bg-muted/40 p-4 text-xs text-muted">
            <p className="font-medium text-foreground">
              Conformité RGIE
            </p>
            <p className="mt-2">
              Dernier audit : 14/01/2026 · Prochaine vérification à planifier
            </p>
          </div>
        </aside>

        <section className="flex flex-1 flex-col gap-6 lg:ml-72">
          <header className="flex flex-col gap-4 rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.2em] text-muted">
                Pilotage
              </p>
              <h1 className="text-2xl font-semibold">Tableau de bord</h1>
              <p className="text-sm text-muted">
                Synthèse des indicateurs clients, devis, factures et stock.
              </p>
            </div>
            <div className="flex w-full max-w-sm items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-4 py-2 text-sm text-muted">
              <span className="text-muted">Recherche</span>
              <span className="ml-auto rounded-full bg-card px-3 py-1 text-xs text-foreground/80 shadow-sm">
                Période : 30 jours
              </span>
            </div>
          </header>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted">
                  {kpi.label}
                </p>
                <p className="mt-3 text-2xl font-semibold text-foreground">
                  {kpi.value}
                </p>
                <p className="mt-2 text-xs text-muted">{kpi.hint}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Suivi des clients</h2>
                  <p className="text-sm text-muted">
                    Activité récente et encours par chantier.
                  </p>
                </div>
                <div className="rounded-full bg-muted/40 px-3 py-1 text-xs text-muted">
                  12 clients actifs ce mois
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full table-auto text-left text-sm">
                  <thead className="text-xs uppercase tracking-[0.18em] text-muted">
                    <tr className="border-b border-border/60">
                      <th className="pb-3 pr-4">Client</th>
                      <th className="pb-3 pr-4">Chantier en cours</th>
                      <th className="pb-3 pr-4 text-right">Dernière intervention</th>
                      <th className="pb-3 pr-4 text-right">Encours</th>
                      <th className="pb-3 text-left">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground/90">
                    {clients.map((row) => (
                      <tr
                        key={row.client}
                        className="border-b border-border/60 last:border-b-0 hover:bg-muted/20"
                      >
                        <td className="py-4 pr-4 align-middle font-medium text-foreground">
                          {row.client}
                        </td>
                        <td className="py-4 pr-4 align-middle text-foreground/85">
                          {row.chantier}
                        </td>
                        <td className="py-4 pr-4 text-right align-middle text-foreground/80">
                          {row.derniereIntervention}
                        </td>
                        <td className="py-4 pr-4 text-right align-middle font-medium text-foreground">
                          {row.encours}
                        </td>
                        <td className="py-4 align-middle">
                          <span className="inline-flex items-center rounded-full bg-muted/40 px-3 py-1 text-xs text-muted">
                            {row.statut}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="flex flex-col gap-4">
              <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
                <h3 className="text-sm font-semibold">Filtres</h3>
                <div className="mt-4 space-y-4 text-sm">
                  {filters.map((filter) => (
                    <div key={filter.label}>
                      <p className="text-xs uppercase tracking-[0.18em] text-muted">
                        {filter.label}
                      </p>
                      <div className="mt-2 rounded-xl bg-muted/40 px-3 py-2 text-foreground/90">
                        {filter.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-border/60 bg-foreground p-6 text-background shadow-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-background/70">
                  Priorités du jour
                </p>
                <h3 className="mt-2 text-lg font-semibold">
                  3 relances clients à effectuer
                </h3>
                <p className="mt-3 text-sm text-background/80">
                  Planifier les interventions sur les chantiers à risque de délai.
                </p>
                <div className="mt-4 rounded-full bg-background/10 px-4 py-2 text-xs text-background/80">
                  Prochaine revue : 29/01/2026
                </div>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

export default DashboardPageContent;
