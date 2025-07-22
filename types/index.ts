export interface CourseData {
  name: string;
  category: string;
  categoryColor: string;
  instructor: string;
  sales: number;
  price: string;
  lessons: number;
}

export interface RecentCourse {
  courseId: string;
  title: string;
  timeAgo: string;
}

export interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

export interface ChartDataPoint {
  month: string;
  value: number;
}
