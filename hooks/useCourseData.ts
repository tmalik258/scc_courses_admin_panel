"use client";

import { useState, useCallback, useRef } from "react";
import {
  getCourses,
  getCourseById,
  updateCourse,
  updateModule,
  deleteCourse,
  createCourse,
  createModule,
  deleteModule,
  deleteResource,
  createResource,
  updateResource,
} from "@/actions/course-data";
import {
  CourseFormData,
  CourseWithRelations,
  CreateCourseFormData,
} from "@/types/course";
import { Lessons } from "@/lib/generated/prisma";

export const useCourseData = (
  initialLimit: number = 10,
  initialPage: number = 1
) => {
  const [courses, setCourses] = useState<CourseWithRelations[]>([]);
  const [selectedCourse, setSelectedCourse] =
    useState<CourseWithRelations | null>(null);
  const [page, setPage] = useState<number>(initialPage);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [limit, setLimit] = useState(initialLimit);
  const isFetchingRef = useRef<string | null>(null);

  const refreshCourses = useCallback(async () => {
    setLoading(true);
    try {
      const { courses, total } = await getCourses(page, limit);
      console.log("Refreshed courses:", courses);
      setCourses(courses);
      setTotalCount(total);
      setTotalPages(Math.ceil(total / limit));
      setPage(page);
      setError(null);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to fetch courses");
      console.error("Error in refreshCourses:", {
        message: error.message,
        cause: error.cause,
      });
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [limit, page]);

  const selectCourse = useCallback(async (courseId: string) => {
    if (isFetchingRef.current === courseId) return;
    isFetchingRef.current = courseId;
    setLoading(true);
    try {
      const course = await getCourseById(courseId);
      setSelectedCourse(course);
      setError(null);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to fetch course");
      console.error("Error in selectCourse:", {
        message: error.message,
        cause: error.cause,
      });
      setError(error);
      throw error;
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
        const error =
          err instanceof Error ? err : new Error("Failed to create course");
        console.error("Error in handleCreateCourse:", {
          message: error.message,
          cause: error.cause,
        });
        setError(error);
        throw error;
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
        return updatedCourse;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to update course");
        console.error("Error in handleUpdateCourse:", {
          message: error.message,
          cause: error.cause,
        });
        setError(error);
        throw error;
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
        const error =
          err instanceof Error ? err : new Error("Failed to delete course");
        console.error("Error in handleDeleteCourse:", {
          message: error.message,
          cause: error.cause,
        });
        setError(error);
        throw error;
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
        const error =
          err instanceof Error ? err : new Error("Failed to create module");
        console.error("Error in handleCreateModule:", {
          message: error.message,
          cause: error.cause,
        });
        setError(error);
        throw error;
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
        return updatedCourse;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to update module");
        console.error("Error in handleUpdateModule:", {
          message: error.message,
          cause: error.cause,
        });
        setError(error);
        throw error;
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
        const error =
          err instanceof Error ? err : new Error("Failed to delete module");
        console.error("Error in handleDeleteModule:", {
          message: error.message,
          cause: error.cause,
        });
        setError(error);
        throw error;
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
        const error =
          err instanceof Error ? err : new Error("Failed to create resource");
        console.error("Error in handleCreateResource:", {
          message: error.message,
          cause: error.cause,
        });
        setError(error);
        throw error;
      } finally {
        setIsCreating(false);
      }
    },
    [refreshCourses, selectedCourse]
  );

  const handleUpdateResource = useCallback(
    async (
      courseId: string,
      resourceId: string,
      data: { name: string; url: string }
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
        const error =
          err instanceof Error ? err : new Error("Failed to delete resource");
        console.error("Error in handleDeleteResource:", {
          message: error.message,
          cause: error.cause,
        });
        setError(error);
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [refreshCourses, selectedCourse]
  );

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
    handleCreateResource,
    handleUpdateResource,
    handleDeleteResource,
    loading,
    isCreating,
    isUpdating,
    error,
    page,
    setPage,
    totalCount,
    totalPages,
    limit,
    setLimit,
  };
};
