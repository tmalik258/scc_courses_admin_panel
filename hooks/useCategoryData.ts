"use client";

import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "@/actions/category-data";
import { Category } from "@/lib/generated/prisma";
import { useCallback, useState } from "react";
import { z } from "zod";
import { formSchema } from "@/form-schemas/category";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useCategoryData = (
  initialLimit: number = 10,
  initialPage: number = 1
) => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [page, setPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [limit, setLimit] = useState(initialLimit);

  const refreshCategories = useCallback(
    async () => {
      setLoading(true);
      try {
        const { data: categories, total } = await getAllCategories(page, limit);
        setCategories(categories);
        setTotalCount(total);
        setTotalPages(Math.ceil(total / limit));
        setPage(page);
        setError(null);
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to fetch categories");
        console.error("Error in refreshCategories:", {
          message: error.message,
          cause: error.cause,
        });
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [limit, page]
  );

  const selectCategory = useCallback(async (categoryId: string) => {
    try {
      setLoading(true);
      const { data } = await getCategoryById(categoryId);
      setSelectedCategory(data);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Unknown error"));
      }
      console.error("Error fetching single category:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCreateCategory = useCallback(
    async (
      values: z.infer<typeof formSchema>,
    ) => {
      try {
        setIsCreating(true);


        await createCategory(values);

        toast.success("Category updated successfully");
        router.push("/course-category");
        return true;
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
          toast.error(err.message);
        } else {
          setError(new Error("Unknown error"));
          toast.error("Failed to update category");
        }
        console.error("Error updating category:", err);
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    [router]
  );

  const handleDeleteCategory = useCallback(
    async (categoryId: string) => {
      try {
        setIsDeleting(true);  
        await deleteCategory(categoryId);
        await refreshCategories();
        setSelectedCategory(null);
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("Unknown error"));
        }
        console.error("Error deleting category:", err);
      } finally {
        setIsDeleting(false);
      }
    },
    [refreshCategories]
  );

  const handleUpdateCategory = useCallback(
    async (
      categoryId: string,
      values: z.infer<typeof formSchema>,
    ) => {
      try {
        setIsUpdating(true);
        const { data } = await updateCategory(categoryId, {
          ...values
        });

        setSelectedCategory(data);
        toast.success("Category updated successfully");
        return true;
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
          toast.error(err.message);
        } else {
          setError(new Error("Unknown error"));
          toast.error("Failed to update category");
        }
        console.error("Error updating category:", err);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  return {
    categories,
    selectedCategory,
    page,
    setPage,
    totalPages,
    totalCount,
    limit,
    setLimit,
    loading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    refreshCategories,
    selectCategory,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  };
};
