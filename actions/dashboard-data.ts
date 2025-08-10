import axios from "axios";
import { DashboardData } from "@/types/dashboard";

export async function fetchDashboardOverview(): Promise<DashboardData> {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/dashboard`);

    if (!response.data.data) {
      console.error(
        "[DASHBOARD] Response missing 'data' property:",
        response.data
      );
      throw new Error("Invalid response format: missing 'data' property");
    }

    const { data } = response.data;

    return {
      totalStudents: data.totalStudents || 0,
      totalCourses: data.totalCourses || 0,
      purchasedCourses: data.purchasedCourses || 0,
      totalRevenue: data.totalRevenue || 0,
      studentGrowth: Array.isArray(data.studentGrowth)
        ? data.studentGrowth
        : [],
      recentCourses: Array.isArray(data.recentCourses)
        ? data.recentCourses.slice(0, 5)
        : [],
      popularCourses: Array.isArray(data.popularCourses)
        ? data.popularCourses
        : [],
    };
  } catch (error) {
    console.error("[DASHBOARD] Failed to fetch overview:", error);
    throw new Error("Failed to fetch dashboard overview");
  }
}
