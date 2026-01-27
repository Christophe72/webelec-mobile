"use client";

import { useEffect, useState } from "react";
import { bffFetch } from "@/lib/api/bffFetch";
import { useAuth } from "@/lib/hooks/useAuth";

type RgieThemeOption =
  | "all"
  | "ddr"
  | "influences_externes"
  | "installations_existantes"
  | "pv"
  | "sdb_2025"
  | "sections"
  | "surintensites"
  | "tableaux"
  | "terre"
  | "ve";

interface RgieRegleApi {
  id: string;
  symptomes: string[];
  gravite: {
    niveau: number;
    sur_5: string;
  };
  rgie: {
    livre: number;
    article: string;
    nature: string;
    seuil: string;
    verbatim: string;
  };
  tags: string[];
  theme?: string;
}

interface RgieResponse {
  count: number;
  items: RgieRegleApi[];
}

const THEME_OPTIONS: { value: RgieThemeOption; label: string }[] = [
  { value: "all", label: "Tous les thèmes" },
  { value: "ddr", label: "DDR" },
  { value: "influences_externes", label: "Influences externes" },
  { value: "installations_existantes", label: "Installations existantes" },
  { value: "pv", label: "PV" },
  { value: "sdb_2025", label: "Salles de bains 2025" },
  { value: "sections", label: "Sections" },
  { value: "surintensites", label: "Surintensités" },
  { value: "tableaux", label: "Tableaux" },
  { value: "terre", label: "Terre" },
  { value: "ve", label: "VE" }
];

export function RgiePanel() {
  const [theme, setTheme] = useState<RgieThemeOption>("ddr");
  const [data, setData] = useState<RgieRegleApi[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { status, token } = useAuth();

  const requireAuth = () => {
    if (status === "authenticated" && token) return token;
    setError("Vous devez être connecté pour accéder aux données.");
    return null;
  };

  async function load() {
    try {
      const authToken = requireAuth();
      if (!authToken) return;
      setLoading(true);
      setError(null);

      const params =
        theme === "all"
          ? ""
          : `?${new URLSearchParams({ theme }).toString()}`;

      const json = await bffFetch<RgieResponse>(`/api/rgie${params}`, authToken);
      setData(json.items ?? []);
      setTotal(json.count ?? json.items?.length ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (status !== "authenticated" || !token) return;
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, status, token]);

  return (
    <section className="mx-auto mt-8 w-full max-w-5xl rounded-2xl border border-zinc-200/70 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted">
            MCP RGIE
          </p>
          <h2 className="text-xl font-semibold">
            Pack RGIE synthétique (démo)
          </h2>
          <p className="mt-1 text-xs text-muted">
            Données locales MCP servies via <code>/api/rgie</code>.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <select
           title="Sélectionner le thème RGIE"
            value={theme}
            onChange={(e) => setTheme(e.target.value as RgieThemeOption)}
            className="rounded-lg border border-zinc-200 bg-white/70 px-3 py-2 text-sm text-foreground shadow-inner dark:border-zinc-700 dark:bg-zinc-900/60"
          >
            {THEME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={load}
            className="rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-foreground shadow-sm hover:-translate-y-px hover:shadow-md dark:border-zinc-700"
          >
            Rafraîchir
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-700/50 dark:bg-red-900/40 dark:text-red-100">
          {error}
        </div>
      )}

      <div className="mt-4 text-xs text-muted">
        {loading
          ? "Chargement des règles RGIE…"
          : `Règles chargées : ${data.length} (sur ${total})`}
      </div>

      <div className="mt-4 max-h-96 space-y-3 overflow-y-auto pr-1 text-sm">
        {loading && data.length === 0 ? (
          <p className="text-muted">Chargement…</p>
        ) : data.length === 0 ? (
          <p className="text-muted">Aucune règle trouvée.</p>
        ) : (
          data.map((regle) => (
            <article
              key={regle.id}
              className="rounded-lg border border-zinc-200 bg-white/70 p-3 text-xs shadow-sm dark:border-zinc-700 dark:bg-zinc-900/60"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-medium text-foreground">
                  {!regle.rgie.verbatim.includes("synthétique") && regle.rgie.verbatim.length > 20 ? (
                    <div className="mb-1 text-sm">
                      {regle.rgie.verbatim.length > 80
                        ? regle.rgie.verbatim.slice(0, 80) + "..."
                        : regle.rgie.verbatim}
                    </div>
                  ) : null}
                  <div className="text-xs">
                    {regle.rgie.article} · {regle.rgie.nature} ·{" "}
                    <span className="text-muted">seuil {regle.rgie.seuil}</span>
                  </div>
                </div>
                {regle.theme && (
                  <span className="rounded-full bg-(--badge-bg) px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-(--badge-text)">
                    {regle.theme}
                  </span>
                )}
              </div>
              <div className="mt-1 text-muted">
                Gravité {regle.gravite.niveau}/5 ({regle.gravite.sur_5})
              </div>
              {regle.symptomes.length > 0 && (
                <ul className="mt-1 list-disc pl-4 text-foreground">
                  {regle.symptomes.slice(0, 2).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                  {regle.symptomes.length > 2 && (
                    <li className="text-muted">
                      + {regle.symptomes.length - 2} symptôme(s)…
                    </li>
                  )}
                </ul>
              )}
              {regle.tags.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-muted">
                  {regle.tags.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-zinc-200 px-2 py-0.5 dark:border-zinc-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default RgiePanel;

