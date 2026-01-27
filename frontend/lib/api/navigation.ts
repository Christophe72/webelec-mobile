import { bffFetch } from "@/lib/api/bffFetch";

export interface NavigationResponse {
  sections: NavigationSection[];
}

export interface NavigationSection {
  code: string;
  label: string;
  items: NavigationItem[];
}

export interface NavigationItem {
  code: string;
  label: string;
  route: string;
  icon: string;
  active: boolean;
}

export async function fetchNavigation(token: string): Promise<NavigationResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    return await bffFetch<NavigationResponse>("/api/navigation", token, {
      credentials: "include",
      signal: controller.signal
    });
  } catch (err) {
    const status = (err as { status?: number } | null)?.status;
    if (status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    if (status === 403 || status === 404) {
      return { sections: [] };
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
