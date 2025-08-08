import {
  Lessons,
  Course as PrismaCourse,
  Resources,
} from "@/lib/generated/prisma";

export interface Course {
  id: string;
  name: string;
  category: string;
  instructor: string;
  sales: number;
  price: number;
  lessons: number;
}

export interface CreateCourseFormData {
  title: string;
  description?: string;
  categoryId: string;
  price: string;
  instructorId: string;
  thumbnailUrl?: string | null;
  isPublished?: boolean;
}

export interface CourseFormData {
  title: string;
  description?: string;
  categoryId: string;
  price?: number | null;
  instructorId: string;
  thumbnailUrl?: string | null;
  isPublished?: boolean;
}

export interface CourseWithRelations extends Omit<PrismaCourse, "price"> {
  price: number | null;
  category: { id: string; name: string; color: string | null };
  instructor: { id: string; fullName: string | null };
  modules: {
    id: string;
    title: string;
    lessons: Lessons[];
  }[];
  resources: Resources[];
}

export interface CourseWithRelationsResponse {
  success: boolean;
  course: CourseWithRelations;
}

export interface CoursesWithRelationsResponse {
  success: boolean;
  total: number;
  courses: CourseWithRelations[];
}

export interface CourseData {
  courses: CourseWithRelations[];
  loading: boolean;
  error: Error | null;
}

export interface CourseQueryResult {
  courses: CourseWithRelations[];
  loading: boolean;
  error: Error | null;
}

export interface PopularCourse {
  id: string;
  name: string;
  category: string;
  categoryColor: string;
  instructor: string;
  sales: number;
  price: string;
  lessons: number;
}
