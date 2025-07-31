import { Lessons, Course as PrismaCourse, Resources } from "@/lib/generated/prisma";
import { z } from "zod";

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

export interface CourseWithRelations extends PrismaCourse {
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

export const moduleSchema = z.object({
  modules: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string().min(1, "Module title is required"),
        lessons: z
          .array(
            z.object({
              title: z.string().min(1, "Lesson name is required"),
              content: z
                .string()
                .min(100, "Content must be at least 100 characters")
                .max(1000, "Content must be less than 1000 characters"),
              video_url: z.string().url("Invalid URL").optional(),
              is_free: z.boolean(),
            })
          )
          .min(1, "At least one lesson is required"),
      })
    )
    .min(1, "At least one module is required"),
});

export type CourseLessonsFormValues = z.infer<typeof moduleSchema>;

// Updated schema for API backend with better video URL handling and isFree support
export const updateCourseSchema = z.object({
  title: z.string().min(1, "Course title is required").optional(),
  description: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  price: z.union([z.number(), z.string()]).optional().nullable(),
  instructorId: z.string().uuid().optional(),
  thumbnailUrl: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) =>
        val === undefined ||
        val === null ||
        val === "" ||
        z.string().url().safeParse(val).success,
      {
        message: "Invalid URL",
      }
    ),
  isPublished: z.boolean().optional(),
});
