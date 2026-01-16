interface DashboardViewToggleProps {
  value: "tableaux" | "graphiques";
  onChange: (value: "tableaux" | "graphiques") => void;
}

export function DashboardViewToggle({
  value,
  onChange,
}: DashboardViewToggleProps) {
  return (
    <div className="inline-flex rounded-full border border-border/60 bg-white/70 p-1 text-xs font-medium text-muted shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
      <button
        type="button"
        onClick={() => onChange("tableaux")}
        className={`rounded-full px-3 py-1 transition ${
          value === "tableaux"
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Tableaux
      </button>
      <button
        type="button"
        onClick={() => onChange("graphiques")}
        className={`rounded-full px-3 py-1 transition ${
          value === "graphiques"
            ? "bg-black text-white dark:bg-white dark:text-black"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        Graphiques
      </button>
    </div>
  );
}
