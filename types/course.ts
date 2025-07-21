import { Course as PrismaCourse } from "@/lib/generated/prisma";
import { z } from "zod"

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
  category: string;
  price?: string;
  instructor: string;
  thumbnailUrl?: string | null;
  sections: {
    title: string;
    lessons: {
      name: string;
      reading?: string;
      videoUrl?: string;
    }[];
  }[];
  resources: {
    title: string;
    url: string;
  }[];
} 

export interface CourseWithRelations extends PrismaCourse {
  category: { name: string; color: string | null };
  instructor: { id: string; fullName: string | null };
  modules: {
    id: string;
    title: string;
    sections: {
      id: string;
      name: string;
      reading?: string | null;
      videoUrl?: string | null;
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


// create schema
const sectionSchema = z.object({
  name: z.string().min(1, "Section name is required"),
  reading: z
    .string()
    .min(100, "Reading content must be at least 100 characters")
    .max(1000, "Reading content must be less than 1000 characters"),
  videoUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
})

const moduleSchema = z.object({
  title: z.string().min(1, "Module title is required"),
  lessons: z.array(sectionSchema).min(1, "At least one section is required"),
})

export const courseLessonsSchema = z.object({
  sections: z.array(moduleSchema).min(1, "At least one module is required"),
})

export type CourseLessonsFormValues = z.infer<typeof courseLessonsSchema>