"use client";

import { useState, useEffect } from "react";
import { getAllCourses } from "@/actions/course-data";
import { CourseData, CourseWithRelations } from "@/types/course";

export const useCourseData = (): CourseData => {
  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  const refreshCourses = async () => {
    setLoading(true);
    try {
      const { courses } = await getAllCourses();
      setCourses(courses);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Unknown error"));
      }
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
      refreshCourses();
    }, []);

  return {
    courses,
    loading,
    error,
  };
};
