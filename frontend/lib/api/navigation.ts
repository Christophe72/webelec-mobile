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

export async function fetchNavigation(): Promise<NavigationResponse> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE;
  if (!apiBase) {
    throw new Error("NEXT_PUBLIC_API_BASE is not defined");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${apiBase}/navigation`, {
      cache: "no-store",
      credentials: "include",
      signal: controller.signal
    });

    if (res.status === 200) {
      return (await res.json()) as NavigationResponse;
    }

    if (res.status === 401) {
      throw new Error("UNAUTHORIZED");
    }

    if (res.status === 403 || res.status === 404) {
      return { sections: [] };
    }

    if (!res.ok) {
      throw new Error("Navigation fetch failed");
    }

    return (await res.json()) as NavigationResponse;
  } finally {
    clearTimeout(timeout);
  }
}
