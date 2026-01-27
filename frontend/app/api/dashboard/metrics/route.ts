import { NextResponse } from "next/server"

const API_BASE = process.env.API_BASE_URL ?? "http://localhost:8080"

export async function GET(request: Request) {
  try {
    // Si JWT en localStorage, il faut le récupérer depuis le header Authorization
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json(
        {
          status: "error",
          error: "Authorization header manquant",
          metrics: {
            activeSitesCount: 0,
            stockAlertsCount: 0,
            rgieAlertsCount: 0,
            criticalNotificationsCount: 0,
          },
        },
        { status: 401 }
      )
    }

    const res = await fetch(`${API_BASE}/api/dashboard/metrics`, {
      headers: {
        authorization: authHeader,
      },
      cache: "no-store",
    })

    if (!res.ok) {
      console.error(`Backend error ${res.status}`)
      return NextResponse.json(
        {
          status: "error",
          error: `Backend ${res.status}`,
          metrics: {
            activeSitesCount: 0,
            stockAlertsCount: 0,
            rgieAlertsCount: 0,
            criticalNotificationsCount: 0,
          },
        },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error("Erreur proxy metrics:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Erreur inconnue",
        metrics: {
          activeSitesCount: 0,
          stockAlertsCount: 0,
          rgieAlertsCount: 0,
          criticalNotificationsCount: 0,
        },
      },
      { status: 500 }
    )
  }
}
