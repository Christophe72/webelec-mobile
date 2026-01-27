"use client";

import { useEffect, useState } from "react";
import { fetchNavigation } from "@/lib/api/navigation";
import SidebarSection from "@/components/sidebar/SidebarSection";
import { useAuth } from "@/lib/hooks/useAuth";
import type { NavigationResponse } from "@/lib/api/navigation";

export default function Sidebar() {
  const { status, token } = useAuth();
  const [navigation, setNavigation] = useState<NavigationResponse | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !token) return;
    let isActive = true;

    const load = async () => {
      try {
        const data = await fetchNavigation(token);
        if (!isActive) return;
        setNavigation(data);
      } catch {
        if (!isActive) return;
        setNavigation({ sections: [] });
      }
    };

    void load();
    return () => {
      isActive = false;
    };
  }, [status, token]);

  if (status !== "authenticated" || !navigation || navigation.sections.length === 0) {
    return null;
  }

  return (
    <aside>
      {navigation.sections.map((section) => (
        <SidebarSection key={section.code} section={section} />
      ))}
    </aside>
  );
}
