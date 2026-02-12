function buildHeaders(token: string, init?: RequestInit): Headers {
  const headers = new Headers(init?.headers ?? undefined);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}

async function fetchBinary(token: string, endpoint: string): Promise<Response> {
  const res = await fetch(`/api${endpoint}`, {
    headers: buildHeaders(token),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  return res;
}

async function downloadFile(
  token: string,
  endpoint: string,
  fallbackFilename: string,
): Promise<void> {
  const res = await fetchBinary(token, endpoint);
  const blob = await res.blob();
  const contentDisposition = res.headers.get("Content-Disposition");
  let filename = fallbackFilename;

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
    if (filenameMatch) {
      filename = filenameMatch[1];
    }
  }

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export function downloadFacturePdf(token: string, factureId: number): Promise<void> {
  return downloadFile(token, `/factures/${factureId}/pdf`, `facture-${factureId}.pdf`);
}

export function downloadFactureCsv(token: string, factureId: number): Promise<void> {
  return downloadFile(token, `/factures/${factureId}/csv`, `facture-${factureId}.csv`);
}
