// hooks/useAdminCourses.ts
import { useState, useEffect } from "react";
import { CourseWithRelations } from "@/types/course";
import { getAdminCourses } from "@/actions/get-admin-courses";

export const useAdminCourses = (
  searchValue: string,
  currentPage: number,
  entriesPerPage: number
) => {
  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      try {
        const { courses, totalCount } = await getAdminCourses({
          search: searchValue,
          page: currentPage,
          limit: entriesPerPage,
        });

        setCourses(courses);
        setTotalCount(totalCount);
        setErrorMessage(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setErrorMessage("Failed to load courses.");
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [searchValue, currentPage, entriesPerPage]);

  return {
    courses,
    totalCount,
    loading,
    errorMessage,
  };
};
