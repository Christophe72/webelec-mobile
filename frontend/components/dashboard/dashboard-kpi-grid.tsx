import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface KpiItem {
  label: string;
  value: number | string;
  isCurrency: boolean;
  change: string;
  hint: string;
}

interface DashboardKpiGridProps {
  kpiData: KpiItem[];
  currency: Intl.NumberFormat;
}

export function DashboardKpiGrid({ kpiData, currency }: DashboardKpiGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi) => (
        <Card key={kpi.label} className="border-border/60">
          <CardHeader className="space-y-1">
            <CardDescription className="text-xs uppercase tracking-wide">
              {kpi.label}
            </CardDescription>
            <CardTitle className="text-2xl">
              {typeof kpi.value === "number"
                ? kpi.isCurrency
                  ? currency.format(kpi.value)
                  : kpi.value
                : kpi.value}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted">
            <span className="font-semibold text-foreground">{kpi.change}</span>{" "}
            {kpi.hint}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
