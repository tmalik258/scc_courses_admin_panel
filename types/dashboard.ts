export interface DashboardData {
  totalStudents: number;
  totalCourses: number;
  purchasedCourses: number;
  totalRevenue: number;
  studentGrowth: { month: string; value: number }[];
  recentCourses: { id: string; title: string; timeAgo: string }[]; // added `id` for component key
  popularCourses?: CourseSummary[];
}

export interface CourseSummary {
  id: string;
  title: string;
  updatedAt: string;
  thumbnailUrl?: string | null;
  price?: number | null;
  instructor?: {
    id: string;
    fullName: string;
  } | null;
  category?: {
    id: string;
    name: string;
    color: string;
  } | null;
}
