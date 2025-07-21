import { CategoriesResponse } from "@/types/category";
import axios from "axios";

export async function getAllCategories(): Promise<CategoriesResponse> {
  try {
    const response = await axios.get<CategoriesResponse>("/api/categories");
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
