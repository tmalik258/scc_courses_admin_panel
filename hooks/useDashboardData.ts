// hooks/useDashboardData.ts
import { useState, useEffect } from "react";
import { fetchDashboardData } from "@/actions/dashboard-data";

interface RecentCourse {
  id: string; // Add id field
  title: string;
  timeAgo: string;
}

interface PopularCourse {
  title: string;
  enrollments: number;
}

export interface DashboardData {
  totalStudents: number;
  totalCourses: number;
  purchasedCourses: number;
  totalRevenue: number;
  studentGrowth: {
    month: string;
    value: number;
  }[];
  recentCourses: RecentCourse[];
  popularCourses: PopularCourse[];
}

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
      setDashboardData({
        ...data.data,
        recentCourses: data.data.recentCourses || [], // Ensure recentCourses is an array
      });
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
