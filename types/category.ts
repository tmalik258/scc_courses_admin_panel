import { Category } from "@/lib/generated/prisma";

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
  error?: string;
}
