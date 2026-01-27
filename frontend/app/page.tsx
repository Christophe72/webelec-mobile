"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

export default function Home() {
  const router = useRouter();
  const { status } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (status === "loading" || hasRedirected.current) return;
    hasRedirected.current = true;
    router.replace(status === "authenticated" ? "/dashboard" : "/login");
  }, [status, router]);

  return null;
}
