"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  getCourseById,
  updateCourse,
  updateModule,
  deleteCourse,
  createCourse,
  createModule,
  deleteModule,
  deleteResource,
  createResource,
} from "@/actions/course-data";
import { getAdminCourses } from "@/actions/get-admin-courses";
import {
  CourseFormData,
  CourseWithRelations,
  CreateCourseFormData,
} from "@/types/course";
import { Lessons } from "@/lib/generated/prisma";

export const useCourseData = (page: number, limit: number, search: string) => {
  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [selectedCourse, setSelectedCourse] =
    useState<CourseWithRelations | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const isFetchingRef = useRef<string | null>(null);

  const refreshCourses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAdminCourses({ page, limit, search });
      if (!response || !Array.isArray(response.courses)) {
        throw new Error("Invalid course data format received");
      }
      setCourses(response.courses);
      setTotalCount(response.totalCount || 0);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    refreshCourses();
  }, [refreshCourses]);

  const selectCourse = useCallback(async (courseId: string) => {
    if (isFetchingRef.current === courseId) return;
    isFetchingRef.current = courseId;
    setLoading(true);
    try {
      const course = await getCourseById(courseId);
      setSelectedCourse(course);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
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
        await refreshCourses();
        setError(null);
        return newCourse;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
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
        setError(err instanceof Error ? err : new Error("Unknown error"));
        console.error("Error updating course:", err);
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
        setError(err instanceof Error ? err : new Error("Unknown error"));
        console.error("Error deleting course:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [refreshCourses]
  );

  const handleCreateModule = useCallback(
    async (
      courseId: string,
      data: { title: string; lessons: Partial<Lessons>[] }
    ) => {
      setIsCreating(true);
      try {
        const newModule = await createModule(courseId, data);
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
        setError(err instanceof Error ? err : new Error("Unknown error"));
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
      data: { title: string; lessons: Partial<Lessons>[] }
    ) => {
      setIsUpdating(true);
      try {
        const updatedCourse = await updateModule(courseId, moduleId, data);
        setSelectedCourse(updatedCourse);
        await refreshCourses();
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
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
            modules: selectedCourse.modules.filter(
              (module) => module.id !== moduleId
            ),
          });
        }
        await refreshCourses();
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        console.error("Error deleting module:", err);
        throw new Error("Failed to delete module", { cause: err });
      } finally {
        setIsUpdating(false);
      }
    },
    [refreshCourses, selectedCourse]
  );

  const handleCreateResource = useCallback(
    async (courseId: string, data: { name: string; url: string }) => {
      setIsCreating(true);
      try {
        const newResource = await createResource(courseId, data);
        if (selectedCourse) {
          setSelectedCourse({
            ...selectedCourse,
            resources: [...selectedCourse.resources, newResource],
          });
        }
        await refreshCourses();
        setError(null);
        return newResource;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        console.error("Error creating resource:", err);
        throw err;
      } finally {
        setIsCreating(false);
      }
    },
    [refreshCourses, selectedCourse]
  );

  const handleDeleteResource = useCallback(
    async (courseId: string, resourceId: string) => {
      setIsUpdating(true);
      try {
        await deleteResource(courseId, resourceId);
        if (selectedCourse) {
          setSelectedCourse({
            ...selectedCourse,
            resources: selectedCourse.resources.filter(
              (resource) => resource.id !== resourceId
            ),
          });
        }
        await refreshCourses();
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
        console.error("Error deleting resource:", err);
        throw new Error("Failed to delete resource", { cause: err });
      } finally {
        setIsUpdating(false);
      }
    },
    [refreshCourses, selectedCourse]
  );

  return {
    courses,
    totalCount,
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
    handleCreateResource,
    handleDeleteResource,
    loading,
    isCreating,
    isUpdating,
    error,
  };
};
