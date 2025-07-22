import { DashboardData } from "@/types/dashboard";
<<<<<<< HEAD

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
    console.log("[DASHBOARD] Fetch dashboard successful:", data);

    // Ensure recentCourses is an array and handle undefined cases
    const recentCourses = Array.isArray(data.data?.recentCourses)
      ? data.data.recentCourses.slice(0, 5) // Limit to 5 items if needed
      : [];

    return {
      totalStudents: data.data?.totalStudents || 0,
      totalCourses: data.data?.totalCourses || 0,
      purchasedCourses: data.data?.purchasedCourses || 0,
      totalRevenue: data.data?.totalRevenue || 0,
      studentGrowth: Array.isArray(data.data?.studentGrowth)
        ? data.data.studentGrowth
        : [],
      recentCourses,
      popularCourses: Array.isArray(data.data?.popularCourses)
        ? data.data.popularCourses
        : [],
    };
  } catch (error) {
    console.error("[DASHBOARD] Failed to fetch overview:", error);
    throw new Error("Failed to fetch dashboard overview");
=======
import axios from "axios";

export async function fetchDashboardData(): Promise<DashboardData> {
  try {
    console.log("[DASHBOARD] Fetching dashboard data");
    const res = await axios.get("/api/dashboard");

    const data = res.data as DashboardData;

    // Optional sanity check
    if (!data.recentCourses || !Array.isArray(data.recentCourses)) {
      data.recentCourses = [];
    }

    console.log("[DASHBOARD] Fetch dashboard successful:", data);
    return data;
  } catch (error) {
    console.error(
      "[DASHBOARD] Error fetching dashboard data:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
>>>>>>> f36f6b2fd06aae270a731b5f1165902bfff00487
  }
}
