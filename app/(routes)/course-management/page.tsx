import { Suspense } from "react";
import { LumaSpin } from "@/components/luma-spin";
import CoursesPage from "./_components/courses-page";

const CoursesPageWrapper = () => (
  <Suspense fallback={<div className="flex items-center justify-center h-full"><LumaSpin /></div>}>
    <CoursesPage />
  </Suspense>
);

export default CoursesPageWrapper;