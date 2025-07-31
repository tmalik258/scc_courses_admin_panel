"use client";

import { getAllCategories } from "@/actions/categories";
import { Category } from "@/lib/generated/prisma";
import { useCallback, useState } from "react";

export const useCategoryData = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const refreshCategories = useCallback(async () => {
    setLoading(true);
    try {
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

  return {
    categories,
    refreshCategories,
    loading,
    error,
  };
};
