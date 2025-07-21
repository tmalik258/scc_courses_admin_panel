import { PopularCourse } from "./course";

export interface DashboardData {
  totalStudents: number;
  totalCourses: number;
  purchasedCourses: number;
  totalRevenue: number;
  studentGrowth: { month: string; value: number }[];
  recentCourses: { id: string; title: string; timeAgo: string }[]; // added `id` for component key
  popularCourses: PopularCourse[];
}