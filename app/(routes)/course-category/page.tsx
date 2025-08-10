import { Suspense } from "react";
import CategoryList from "./_components/category-list";
import { LumaSpin } from "@/components/luma-spin";

const CourseCategoryPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <LumaSpin />
        </div>
      }
    >
      <CategoryList />
    </Suspense>
  );
};

export default CourseCategoryPage;
