"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useCategoryData } from "@/hooks/useCategoryData";
import { LumaSpin } from "@/components/luma-spin";
import CategoryForm from "./_components/category-form";
import { DashedSpinner } from "@/components/dashed-spinner";

export default function EditCategoryPage() {
  const router = useRouter();
  const { categoryId } = useParams<{ categoryId: string }>();
  const {
    selectedCategory: category,
    selectCategory,
    handleUpdateCategory,
    loading,
    isUpdating,
    error,
  } = useCategoryData();

  useEffect(() => {
    if (!categoryId) {
      toast.error("Category ID is required");
      router.push("/course-category");
      return;
    }
  }, [router, categoryId]);

  useEffect(() => {
    if (!category && categoryId) {
      selectCategory(categoryId);
    }
  }, [category, selectCategory, categoryId]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LumaSpin />
      </div>
    );
  }

  return (
    <div className="h-full p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <span>Course Category</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-blue-500">Edit Category</span>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Edit Category
          </h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="px-6 bg-transparent cursor-pointer"
              onClick={() => router.push("/course-category")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="category-form"
              className="px-6 bg-blue-500 hover:bg-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUpdating}
            >
              {isUpdating ? <><DashedSpinner invert={true} /> Updating</> : "Update"}
            </Button>
          </div>
        </div>
        <CategoryForm
          category={category}
          categoryId={categoryId}
          onSubmit={handleUpdateCategory}
        />
      </div>
    </div>
  );
}