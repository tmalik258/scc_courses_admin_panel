"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getCourses, getCourseById, updateCourse, deleteCourse, createCourse } from "@/actions/course-data";
import { CourseFormData, CourseWithRelations, CreateCourseFormData } from "@/types/course";

export const useCourseData = () => {
  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseWithRelations | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const isFetchingRef = useRef<string | null>(null); // Track ongoing fetch by courseId

  const refreshCourses = useCallback(async () => {
    setLoading(true);
    try {
      const { courses } = await getCourses();
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
  }, []);

  const selectCourse = useCallback(async (courseId: string) => {
    // Prevent duplicate fetches for the same courseId
    if (isFetchingRef.current === courseId) {
      return;
    }
    isFetchingRef.current = courseId;
    setLoading(true);
    try {
      const course = await getCourseById(courseId);
      setSelectedCourse(course);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Unknown error"));
      }
      console.error("Error fetching course:", err);
    } finally {
      setLoading(false);
      isFetchingRef.current = null;
    }
  }, []);

  const handleCreateCourse = useCallback(async (data: CreateCourseFormData) => {
    setLoading(true);
    try {
      const newCourse = await createCourse(data);
      await refreshCourses();
      setError(null);
      return newCourse;
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Unknown error"));
      }
      console.error("Error creating course:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshCourses]);

  const handleUpdateCourse = useCallback(async (courseId: string, data: Partial<CourseFormData>) => {
    setLoading(true);
    try {
      const updatedCourse = await updateCourse(courseId, data);
      setSelectedCourse(updatedCourse);
      await refreshCourses();
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Unknown error"));
      }
      console.error("Error updating course:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshCourses]);

  const handleDeleteCourse = useCallback(async (courseId: string) => {
    setLoading(true);
    try {
      await deleteCourse(courseId);
      await refreshCourses();
      setSelectedCourse(null);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Unknown error"));
      }
      console.error("Error deleting course:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [refreshCourses]);

  useEffect(() => {
    refreshCourses();
  }, [refreshCourses]);

  return {
    courses,
    selectedCourse,
    setSelectedCourse,
    refreshCourses,
    selectCourse,
    handleCreateCourse,
    handleUpdateCourse,
    handleDeleteCourse,
    loading,
    error,
  };
};