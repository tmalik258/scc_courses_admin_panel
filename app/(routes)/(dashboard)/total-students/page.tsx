import { Suspense } from "react";
import { LumaSpin } from "@/components/luma-spin";
import StudentsPage from "./_components/students-page";

const StudentsPageWrapper = () => (
  <Suspense fallback={<div className="flex items-center justify-center h-full"><LumaSpin /></div>}>
    <StudentsPage />
  </Suspense>
);

export default StudentsPageWrapper;