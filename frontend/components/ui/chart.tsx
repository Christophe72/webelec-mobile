"use client";

import type { PropsWithChildren } from "react";
import { Tooltip, type TooltipProps } from "recharts";
import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label: string;
    color: string;
  }
>;

interface ChartContainerProps extends PropsWithChildren {
  className?: string;
}

export function ChartContainer({ children, className }: ChartContainerProps) {
  return <div className={cn("h-64 w-full", className)}>{children}</div>;
}

export function ChartTooltip(props: TooltipProps<number, string>) {
  return <Tooltip {...props} />;
}

interface ChartTooltipPayload {
  value?: number | string;
}

interface ChartTooltipContentProps {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string | number;
  labelFormatter?: (label: string) => string;
  valueFormatter?: (value: number) => string;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  labelFormatter,
  valueFormatter,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null;

  const first = payload[0];
  const rawValue =
    typeof first.value === "number" ? first.value : Number(first.value ?? 0);
  const labelText = label !== undefined ? String(label) : "";
  const formattedLabel =
    labelText && labelFormatter ? labelFormatter(labelText) : labelText;
  const formattedValue = valueFormatter ? valueFormatter(rawValue) : rawValue;

  return (
    <div className="rounded-lg border border-border/60 bg-background px-3 py-2 text-xs shadow-md">
      {formattedLabel && (
        <p className="text-muted-foreground">{formattedLabel}</p>
      )}
      <p className="text-sm font-semibold text-foreground">{formattedValue}</p>
    </div>
  );
}
