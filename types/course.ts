import { Course as PrismaCourse } from '@/lib/generated/prisma';

export interface Course {
  id: string
  name: string
  category: string
  instructor: string
  sales: number
  price: number
  lessons: number
}

export interface CourseFormData {
  title: string
  description: string
  category: string
  price: string
  instructor: string
  thumbnail: File | null
  modules: Array<{
    title: string
    sections: Array<{
      name: string
      reading: string
      videoUrl: string
    }>
  }>
  resources: Array<{
    title: string
    url: string
  }>
}

export interface CourseWithRelations extends PrismaCourse {
  category: { name: string; color: string | null };
  instructor: { id: string; fullName: string | null };
  modules: { id: string; title: string; sections: { id: string; name: string; reading?: string | null;
  videoUrl?: string | null; }[] }[];
  resources: { id: string; title: string; url: string }[];
}

export interface CourseData {
  courses: CourseWithRelations[];
  loading: boolean;
  error: Error | null;
}
