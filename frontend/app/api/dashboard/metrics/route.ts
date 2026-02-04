import { NextRequest, NextResponse } from "next/server";
import { proxyApi } from "../../proxy";

export async function GET(req: NextRequest) {
  try {
    const backendResponse = await proxyApi(req, "/dashboard/metrics");

    // Si le backend retourne une erreur, on la propage
    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          status: "error",
          error: `Backend error ${backendResponse.status}`,
          metrics: {
            activeSitesCount: 0,
            stockAlertsCount: 0,
            rgieAlertsCount: 0,
            criticalNotificationsCount: 0,
          },
        },
        { status: backendResponse.status }
      );
    }

    // Récupérer les métriques du backend
    const metrics = await backendResponse.json();

    // Wrapper dans le format attendu par le frontend
    return NextResponse.json({
      status: "success",
      metrics,
    });
  } catch (error) {
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
    );
  }
}
