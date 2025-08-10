import { Category } from "@/lib/generated/prisma";

export interface CategoryResponse {
  data: Category;
  error?: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
  total: number;
  error?: string;
}

