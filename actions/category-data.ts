import { Category } from "@/lib/generated/prisma";
import { CategoriesResponse, CategoryResponse } from "@/types/category";
import axios from "axios";

export async function getAllCategories(page = 1, limit = 10, course = false): Promise<CategoriesResponse> {
  try {
    const response = await axios.get<CategoriesResponse>(`${process.env.NEXT_PUBLIC_SITE_URL}/api/categories${course ? `?course=${course}` : `?page=${page}&limit=${limit}`}`);
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error fetching categories:", err.message);
      throw new Error("Failed to fetch categories: " + err.message);
    } else {
      console.error("Unknown error fetching categories:", err);
      throw new Error("Failed to fetch categories due to unknown error.");
    }
  }
}

export async function getCategoryById(id: string): Promise<CategoryResponse> {
  try {
    const response = await axios.get<CategoryResponse>(`${process.env.NEXT_PUBLIC_SITE_URL}/api/categories/${id}`);
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error fetching single category:", err.message);
      throw new Error("Failed to fetch category: " + err.message);
    } else {
      console.error("Unknown error fetching single category:", err);
      throw new Error("Failed to fetch category due to unknown error.");
    }
  }
}

export async function createCategory(data: Partial<Category>): Promise<CategoryResponse> {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/categories`, data);
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error creating category:", err.message);
      throw new Error("Failed to create category: " + err.message);
    } else {
      console.error("Unknown error creating category:", err);
      throw new Error("Failed to create category due to unknown error.");
    }
  }
}

export async function updateCategory(
  id: string,
  data: Partial<Category>
): Promise<CategoryResponse> {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_SITE_URL}/api/categories/${id}`, data);
    return response.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error updating category:", err.message);
      throw new Error("Failed to update category: " + err.message);
    } else {
      console.error("Unknown error updating category:", err);
      throw new Error("Failed to update category due to unknown error.");
    }
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    await axios.delete(`${process.env.NEXT_PUBLIC_SITE_URL}/api/categories/${id}`);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("Error deleting category:", err.message);
      throw new Error("Failed to delete category: " + err.message);
    } else {
      console.error("Unknown error deleting category:", err);
      throw new Error("Failed to delete category due to unknown error.");
    }
  }
}