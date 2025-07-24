import { Course as PrismaCourse } from "@/lib/generated/prisma";
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

export interface CourseFormData {
  title: string;
  description?: string;
  categoryId: string;
  price?: string;
  instructorId: string;
  thumbnailUrl?: string | null;
  isPublished?: boolean;
  modules: {
    id?: string;
    title?: string; // Allow undefined to match backend schema
    lessons: {
      id?: string;
      name?: string; // Allow undefined to match backend schema
      content?: string;
      videoUrl?: string; // Can be undefined when no video is uploaded
      isFree?: boolean; // Add isFree field
    }[];
  }[];
  resources: {
    id?: string; // Add optional ID for resources
    title?: string; // Allow undefined to match backend schema
    url?: string;
  }[];
}

export interface CourseWithRelations extends PrismaCourse {
  category: { id: string; name: string; color: string | null };
  instructor: { id: string; fullName: string | null };
  modules: {
    id: string;
    title: string;
    lessons: {
      id: string;
      name: string;
      content?: string | null;
      videoUrl?: string | null;
      isFree?: boolean; // Add isFree field
    }[];
  }[];
  resources: { id: string; title: string; url: string }[];
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

// Updated lesson schema to handle video uploads properly and include isFree
const lessonSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Section name is required"),
  content: z
    .string()
    .min(100, "Reading content must be at least 100 characters")
    .max(1000, "Reading content must be less than 1000 characters"),
  videoUrl: z
    .string()
    .url("Please enter a valid video URL")
    .optional()
    .or(z.literal(""))
    .or(z.undefined()), // Allow undefined for when no video is uploaded
  isFree: z.boolean().default(false), // Add isFree field with default false
});

const moduleSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Module title is required"),
  lessons: z.array(lessonSchema).min(1, "At least one section is required"),
});

export const courseLessonsSchema = z.object({
  modules: z.array(moduleSchema).min(1, "At least one module is required"),
});

export type CourseLessonsFormValues = z.infer<typeof courseLessonsSchema>;

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
  modules: z
    .array(
      z.object({
        id: z.string().uuid().optional(), // Optional ID for updates
        title: z
          .string()
          .min(1, "Module title is required")
          .optional()
          .nullable()
          .transform((val) => (val === "" ? undefined : val)), // Convert empty string to undefined
        lessons: z
          .array(
            z.object({
              id: z.string().uuid().optional(), // Optional ID for updates
              name: z
                .string()
                .min(1, "Lesson name is required")
                .optional()
                .nullable()
                .transform((val) => (val === "" ? undefined : val)), // Convert empty string to undefined
              content: z
                .string()
                .optional()
                .nullable()
                .transform((val) => (val === "" ? undefined : val)),
              videoUrl: z
                .string()
                .optional()
                .nullable()
                .transform((val) => {
                  // Convert empty string to undefined
                  if (val === "" || val === null) return undefined;
                  return val;
                })
                .refine(
                  (val) =>
                    val === undefined ||
                    val === null ||
                    z.string().url().safeParse(val).success,
                  { message: "Invalid video URL" }
                ),
              isFree: z.boolean().default(false).optional(), // Add isFree field
            })
          )
          .optional()
          .nullable(),
      })
    )
    .optional()
    .nullable(),
  resources: z
    .array(
      z.object({
        id: z.string().uuid().optional(), // Add optional ID for resources
        title: z
          .string()
          .min(1, "Resource title is required")
          .optional()
          .nullable()
          .transform((val) => (val === "" ? undefined : val)), // Convert empty string to undefined
        url: z
          .string()
          .optional()
          .nullable()
          .refine(
            (val) =>
              val === undefined ||
              val === null ||
              val === "" ||
              z.string().url().safeParse(val).success,
            { message: "Invalid URL" }
          ),
      })
    )
    .optional()
    .nullable(),
});

export interface UpdateData {
  [key: string]: unknown;
}
