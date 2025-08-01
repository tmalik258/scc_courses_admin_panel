import { Category } from "@/lib/generated/prisma";

export interface CategoryResponse {
  data: Category;
  error?: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
  error?: string;
}

