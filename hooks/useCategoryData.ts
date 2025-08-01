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

export const useCategoryData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [creating, setCreating] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const refreshCategories = useCallback(async () => {
    try {
      setLoading(true);
      const { data: categories } = await getAllCategories();
      setCategories(categories);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Unknown error"));
      }
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

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
        setCreating(true);
        const { data } = await createCategory({
          ...values,
          slug: values.name.toLowerCase().replace(/\s+/g, "-"),
        });

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
        setCreating(false);
      }
    },
    []
  );

  const handleDeleteCategory = useCallback(
    async (categoryId: string) => {
      try {
        setDeleting(true);
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
        setDeleting(false);
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
        setUpdating(true);
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
        setUpdating(false);
      }
    },
    []
  );

  return {
    categories,
    selectedCategory,
    selectCategory,
    handleCreateCategory,
    handleDeleteCategory,
    handleUpdateCategory,
    refreshCategories,
    loading,
    creating,
    deleting,
    updating,
    error,
  };
};
