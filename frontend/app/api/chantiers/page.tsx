// frontend/app/api/test/rgie/route.ts
import { NextRequest } from "next/server";
import {
  getAllRgieRegles,
  getRgieDataset,
  getRgieSchema,
  getRgieValidationReport,
  type RgieTheme,
} from "@/lib/rgie-local";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const theme = url.searchParams.get("theme") as RgieTheme | null;
  const withMeta = url.searchParams.get("meta") === "true";

  if (theme) {
    const data = getRgieDataset(theme);
    return Response.json({ theme, count: data.length, items: data });
  }

  const all = getAllRgieRegles();

  if (withMeta) {
    return Response.json({
      count: all.length,
      items: all,
      validation: getRgieValidationReport(),
      schema: getRgieSchema(),
    });
  }

  return Response.json({
    count: all.length,
    items: all,
  });
}
export default function ChantiersPage() {
  return (
    <div>
      <h1>Chantiers API</h1>
      {/* Ton contenu ici */}
    </div>
  );
}