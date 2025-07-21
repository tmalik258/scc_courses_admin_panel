import axios from "axios";

export interface DashboardData {
  data: SetStateAction<DashboardData | null>;
  data: any;
  totalStudents: number;
  totalCourses: number;
  purchasedCourses: number;
  totalRevenue: number;
  studentGrowth: { month: string; value: number }[];
  recentCourses: { id: string; title: string; timeAgo: string }[]; // added `id` for component key
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
  }
}
