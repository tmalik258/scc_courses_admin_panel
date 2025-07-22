import { DashboardData } from "@/types/dashboard";

export async function fetchDashboardOverview(): Promise<DashboardData> {
  try {
    console.log("[DASHBOARD] Fetching dashboard data");
    const response = await fetch(
      "http://localhost:3000/api/dashboard?type=dashboard"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log("[DASHBOARD] Raw response:", JSON.stringify(data, null, 2));

    if (!data.data) {
      console.error("[DASHBOARD] Response missing 'data' property:", data);
      throw new Error("Invalid response format: missing 'data' property");
    }

    return {
      totalStudents: data.data.totalStudents || 0,
      totalCourses: data.data.totalCourses || 0,
      purchasedCourses: data.data.purchasedCourses || 0,
      totalRevenue: data.data.totalRevenue || 0,
      studentGrowth: Array.isArray(data.data.studentGrowth)
        ? data.data.studentGrowth
        : [],
      recentCourses: Array.isArray(data.data.recentCourses)
        ? data.data.recentCourses.slice(0, 5)
        : [],
      popularCourses: Array.isArray(data.data.popularCourses)
        ? data.data.popularCourses
        : [],
    };
  } catch (error) {
    console.error("[DASHBOARD] Failed to fetch overview:", error);
    throw new Error("Failed to fetch dashboard overview");
  }
}
