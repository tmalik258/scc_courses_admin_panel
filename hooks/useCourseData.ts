"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getCourses,
  getCourseById,
  updateCourse,
  updateModule,
  updateResource,
  deleteCourse,
  createCourse,
  createModule,
  deleteModule,
} from "@/actions/course-data";
import {
  CourseFormData,
  CourseWithRelations,
  CreateCourseFormData,
} from "@/types/course";

export const useCourseData = () => {
  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [selectedCourse, setSelectedCourse] =
    useState<CourseWithRelations | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const isFetchingRef = useRef<string | null>(null);

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
    if (isFetchingRef.current === courseId) return;
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

  const handleCreateCourse = useCallback(
    async (data: CreateCourseFormData) => {
      setIsCreating(true);
      try {
        const { course: newCourse } = await createCourse(data);
        console.log("[useCourseData] New course created:", newCourse);
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
        setIsCreating(false);
      }
    },
    [refreshCourses]
  );

  const handleUpdateCourse = useCallback(
    async (courseId: string, data: Partial<CourseFormData>) => {
      setIsUpdating(true);
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
        setIsUpdating(false);
      }
    },
    [refreshCourses]
  );

  const handleCreateModule = useCallback(
    async (courseId: string, data: { title: string; lessons: CourseFormData["modules"][0]["lessons"] }) => {
      setIsCreating(true);
      try {
        const newModule = await createModule(courseId, data);
        console.log("[useCourseData] New module created:", newModule);
        if (selectedCourse) {
          setSelectedCourse({
            ...selectedCourse,
            modules: [...selectedCourse.modules, newModule],
          });
        }
        await refreshCourses();
        setError(null);
        return newModule;
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("Unknown error"));
        }
        console.error("Error creating module:", err);
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [refreshCourses, selectedCourse]
  );

  const handleUpdateModule = useCallback(
    async (
      courseId: string,
      moduleId: string,
      data: { title: string; lessons: CourseFormData["modules"][0]["lessons"] }
    ) => {
      setIsUpdating(true);
      try {
        const updatedCourse = await updateModule(courseId, moduleId, data);
        setSelectedCourse(updatedCourse);
        await refreshCourses();
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("Unknown error"));
        }
        console.error("Error updating module:", err);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [refreshCourses]
  );
  
  const handleDeleteModule = useCallback(
    async (courseId: string, moduleId: string) => {
      setIsUpdating(true);
      try {
        await deleteModule(courseId, moduleId);
        if (selectedCourse) {
          setSelectedCourse({
            ...selectedCourse,
            modules: selectedCourse.modules.filter(module => module.id !== moduleId),
          });
        }
        await refreshCourses();
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("Unknown error"));
        }
        console.error("Error deleting module:", err);
        throw new Error("Failed to delete module", { cause: err });
      } finally {
        setIsUpdating(false);
      }
    },
    [refreshCourses, selectedCourse]
  );

  const handleUpdateResource = useCallback(
    async (
      courseId: string,
      resourceId: string,
      data: { title: string; url: string }
    ) => {
      setIsUpdating(true);
      try {
        const updatedCourse = await updateResource(courseId, resourceId, data);
        setSelectedCourse(updatedCourse);
        await refreshCourses();
        setError(null);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error("Unknown error"));
        }
        console.error("Error updating resource:", err);
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [refreshCourses]
  );

  const handleDeleteCourse = useCallback(
    async (courseId: string) => {
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
    },
    [refreshCourses]
  );

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
    handleCreateModule,
    handleUpdateModule,
    handleDeleteModule,
    handleUpdateResource,
    loading,
    isCreating,
    isUpdating,
    error,
  };
};
