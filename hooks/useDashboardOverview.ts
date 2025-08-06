"use client";

import { useEffect, useState } from "react";
import { fetchDashboardOverview } from "@/actions/dashboard-data";
import { DashboardData } from "@/types/dashboard";

export function useDashboardOverview() {
  const [overview, setOverview] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refreshDashboard() {
    try {
      const data = await fetchDashboardOverview();
      setOverview(data);
      setError(null);
    } catch (err) {
      console.error("[DASHBOARD] Hook error:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshDashboard();
  }, []);

  return { overview, loading, error, refreshDashboard };
}
