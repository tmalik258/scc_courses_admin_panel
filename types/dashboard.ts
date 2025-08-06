export interface StudentGrowthPoint {
  month: string;
  value: number;
}

export interface RecentCourse {
  id: string;
  title: string;
  timeAgo: string;
}

export interface PopularCourse {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  instructor: string;
  enrollments: number;
  price: string;
  lessons: number;
}

export interface DashboardData {
  totalStudents: number;
  totalCourses: number;
  purchasedCourses: number;
  totalRevenue: number;
  studentGrowth: StudentGrowthPoint[];
  recentCourses: RecentCourse[];
  popularCourses: PopularCourse[];
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
