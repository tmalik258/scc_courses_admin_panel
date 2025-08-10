import { LumaSpin } from "@/components/luma-spin";
import { Suspense } from "react";
import Instructors from "./_components/instructors";

const InstructorManagementPageWrapper = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <LumaSpin />
        </div>
      }
    >
      <Instructors />
    </Suspense>
  );
};

export default InstructorManagementPageWrapper;
