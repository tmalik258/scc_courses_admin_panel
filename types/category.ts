export interface CategoryWithRelations {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  isActive: boolean;
  createdAt: string; // ISO string from Prisma
  courses: { id: string; title: string }[];
  status: "active" | "inactive";
}

export interface CategoriesResponse {
  success: boolean;
  data: CategoryWithRelations[];
  error?: string;
}
