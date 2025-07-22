import { LumaSpin } from "@/components/luma-spin";
import { Suspense } from "react";
import AddCourse from "./_components/add-course";

const CreatePage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <LumaSpin />
        </div>
      }
    >
      <AddCourse />
    </Suspense>
  );
};

export default CreatePage;
