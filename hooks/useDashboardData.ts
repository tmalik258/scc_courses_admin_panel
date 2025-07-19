import { useState, useEffect } from "react";
import { fetchDashboardData, DashboardData } from "@/actions/dashboard-data";

export function useDashboardData() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshDashboard = async () => {
    setLoading(true);
    try {
      console.log("[DASHBOARD] Refreshing dashboard data");
      const data = await fetchDashboardData();
      setDashboardData(data.data);
      console.log("[DASHBOARD] Refreshed dashboard data:", data.data);
    } catch (err) {
      console.error(
        "[DASHBOARD] Error refreshing dashboard data:",
        err instanceof Error ? err.message : String(err)
      );
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  return { dashboardData, refreshDashboard, loading, error };
}
