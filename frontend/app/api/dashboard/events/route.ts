import { NextRequest, NextResponse } from "next/server";
import { proxyApi } from "../../proxy";
import type { DashboardEvent } from "@/types/dashboard";

function isDashboardEventArray(value: unknown): value is DashboardEvent[] {
  if (!Array.isArray(value)) return false;
  return value.every(
    (item) =>
      item &&
      typeof item === "object" &&
      typeof (item as { id?: unknown }).id === "string" &&
      typeof (item as { severity?: unknown }).severity === "string" &&
      typeof (item as { message?: unknown }).message === "string" &&
      typeof (item as { entityType?: unknown }).entityType === "string" &&
      typeof (item as { entityId?: unknown }).entityId === "string" &&
      typeof (item as { createdAt?: unknown }).createdAt === "string"
  );
}

export async function GET(req: NextRequest) {
  try {
    const backendResponse = await proxyApi(req, "/dashboard/events");

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          status: "error",
          error: `Backend error ${backendResponse.status}`,
          events: [],
        },
        { status: backendResponse.status }
      );
    }

    const payload = await backendResponse.json();
    const events = isDashboardEventArray(payload)
      ? payload
      : isDashboardEventArray((payload as { events?: unknown })?.events)
      ? (payload as { events: DashboardEvent[] }).events
      : [];

    return NextResponse.json({
      status: "success",
      events,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Erreur inconnue",
        events: [],
      },
      { status: 500 }
    );
  }
}
