"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface RevenuePoint {
  month: string;
  ca: number;
}

interface StockPoint {
  name: string;
  stock: number;
}

interface DashboardChartsProps {
  revenueSeries: RevenuePoint[];
  stockSeries: StockPoint[];
  currency: Intl.NumberFormat;
  numberFormatter: Intl.NumberFormat;
}

export function DashboardCharts({
  revenueSeries,
  stockSeries,
  currency,
  numberFormatter,
}: DashboardChartsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Évolution CA (6 mois)</CardTitle>
          <CardDescription>Chiffre d&apos;affaires mensuel.</CardDescription>
        </CardHeader>
        <CardContent>
          {revenueSeries.length === 0 ? (
            <p className="text-sm text-muted">Aucune donnée disponible.</p>
          ) : (
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={revenueSeries}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        valueFormatter={(value) => currency.format(value)}
                      />
                    }
                  />
                  <Area
                    dataKey="ca"
                    type="natural"
                    fill="var(--chart-1)"
                    fillOpacity={0.35}
                    stroke="var(--chart-1)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>Stock par référence</CardTitle>
          <CardDescription>Top références disponibles.</CardDescription>
        </CardHeader>
        <CardContent>
          {stockSeries.length === 0 ? (
            <p className="text-sm text-muted">Aucun produit en stock.</p>
          ) : (
            <ChartContainer>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockSeries} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) =>
                      typeof value === "string" ? value.slice(0, 10) : value
                    }
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        valueFormatter={(value) =>
                          numberFormatter.format(value)
                        }
                      />
                    }
                  />
                  <Bar
                    dataKey="stock"
                    fill="var(--chart-2)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
