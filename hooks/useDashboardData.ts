import { useState, useEffect } from "react";
import { fetchDashboardData } from "@/actions/dashboard-data";
import { DashboardData } from "@/types/dashboard";

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
      setDashboardData(data);
    } catch (err) {
      console.error(
        "[DASHBOARD] Error refreshing dashboard data:",
        err instanceof Error ? err.message : String(err)
      );
      setError("Failed to load dashboard data");
      setDashboardData(null); // Reset data on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  return { dashboardData, refreshDashboard, loading, error };
}
