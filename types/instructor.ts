import { Category } from "@/lib/generated/prisma";

export interface Course {
  id: string;
  title: string;
  category: Category;
  totalLessons: number;
}

export interface Instructor {
  id: string;
  fullName: string | null;
  role: string;
  bio: string | null;
  phone: string | null;
  avatarUrl: string | null;
  instructorCourses: Course[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
