// hooks/use-admin-courses.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { getCourses } from "@/actions/course-data";
import { CourseWithRelations } from "@/types/course";

export function useAdminCourses({
  page = 1,
  limit = 10,
  search = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const { courses, totalCount } = await getCourses({ page, limit, search });
      setCourses(courses);
      setTotalCount(totalCount);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    totalCount,
    loading,
    error,
    refreshCourses: fetchCourses,
  };
}
