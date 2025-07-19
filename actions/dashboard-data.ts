import axios from "axios";

export interface DashboardData {
  totalStudents: number;
  totalCourses: number;
  purchasedCourses: number;
  totalRevenue: number;
  studentGrowth: { month: string; value: number }[];
  recentCourses: { title: string; timeAgo: string }[];
  popularCourses: {
    name: string;
    category: string;
    categoryColor: string;
    instructor: string;
    sales: number;
    price: string;
    lessons: number;
  }[];
}

export async function fetchDashboardData() {
  try {
    console.log("[DASHBOARD] Fetching dashboard data");
    const res = await axios.get("/api/dashboard");
    console.log("[DASHBOARD] Fetch dashboard successful:", res.data);
    return res.data;
  } catch (error) {
    console.error(
      "[DASHBOARD] Error fetching dashboard data:",
      error instanceof Error ? error.message : String(error)
    );
    throw error;
  }
}
