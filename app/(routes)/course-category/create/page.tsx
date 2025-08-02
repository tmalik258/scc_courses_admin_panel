"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useCategoryData } from "@/hooks/useCategoryData";
import CategoryForm from "./_components/category-form";
import { DashedSpinner } from "@/components/dashed-spinner";
import { useEffect } from "react";
import { toast } from "sonner";

export default function CreateCategoryPage() {
  const router = useRouter();
  const {
    handleCreateCategory,
    creating,
    error,
  } = useCategoryData();

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  return (
    <div className="h-full p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <span>Course Category</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-blue-500">Create Category</span>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create Category
          </h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="px-6 bg-transparent"
              onClick={() => router.push("/course-category")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="category-form"
              className="px-6 bg-blue-500 hover:bg-blue-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={creating}
            >
              {creating ? <><DashedSpinner invert={true} /> Creating</> : "Create"}
            </Button>
          </div>
        </div>
        <CategoryForm
          onSubmit={handleCreateCategory}
        />
      </div>
    </div>
  );
}