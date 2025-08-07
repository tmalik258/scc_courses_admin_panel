"use server";

import axios from "axios";
import {
  CourseFormData,
  CourseWithRelations,
  CourseWithRelationsResponse,
  CreateCourseFormData,
} from "@/types/course";
import { Lessons, Resources } from "@/lib/generated/prisma";
import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";

export async function getAdminCourses({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search: string;
}): Promise<{ courses: CourseWithRelations[]; totalCount: number }> {
  try {
    const skip = (page - 1) * limit;
    const isUUID = /^[0-9a-fA-F-]{36}$/.test(search);

    const where: Prisma.CourseWhereInput = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { category: { name: { contains: search, mode: "insensitive" } } },
            {
              instructor: {
                fullName: { contains: search, mode: "insensitive" },
              },
            },
            ...(isUUID ? [{ id: search }] : []),
          ],
        }
      : {};

    const [courses, totalCount] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { id: true, name: true, color: true } },
          instructor: { select: { id: true, fullName: true } },
          modules: { include: { lessons: true } },
          resources: true,
        },
      }),
      prisma.course.count({ where }),
    ]);

    const serializedCourses = courses.map((course) => ({
      ...course,
      price: course.price ? Number(course.price) : null,
    }));

    return { courses: serializedCourses as CourseWithRelations[], totalCount };
  } catch (error) {
    console.error("Error in getAdminCourses:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw new Error("Failed to fetch courses", { cause: error });
  }
}

export async function getCourseById(
  courseId: string
): Promise<CourseWithRelations> {
  try {
    const response = await axios.get<CourseWithRelations>(
      `/api/courses/${courseId}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || "Failed to fetch course";
      throw new Error(errorMessage, { cause: error });
    }
    throw new Error("Failed to fetch course", { cause: error });
  }
}

export async function createCourse(
  data: CreateCourseFormData
): Promise<CourseWithRelationsResponse> {
  try {
    const response = await axios.post<CourseWithRelationsResponse>(
      "/api/courses",
      {
        ...data,
        isPublished: false,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || "Failed to create course";
      throw new Error(errorMessage, { cause: error });
    }
    throw new Error("Failed to create course", { cause: error });
  }
}

export async function updateCourse(
  courseId: string,
  data: Partial<CourseFormData>
): Promise<CourseWithRelations> {
  try {
    const response = await axios.put<CourseWithRelations>(
      `/api/courses/${courseId}`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || "Failed to update course";
      throw new Error(errorMessage, { cause: error });
    }
    throw new Error("Failed to update course", { cause: error });
  }
}

export async function deleteCourse(courseId: string): Promise<void> {
  try {
    await axios.delete(`/api/courses/${courseId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || "Failed to delete course";
      throw new Error(errorMessage, { cause: error });
    }
    throw new Error("Failed to delete course", { cause: error });
  }
}

export async function createModule(
  courseId: string,
  data: { title: string; lessons: Partial<Lessons>[] }
): Promise<CourseWithRelations["modules"][0]> {
  try {
    const response = await axios.post<CourseWithRelations["modules"][0]>(
      `/api/courses/${courseId}/modules`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || "Failed to create module";
      throw new Error(errorMessage, { cause: error });
    }
    throw new Error("Failed to create module", { cause: error });
  }
}

export async function updateModule(
  courseId: string,
  moduleId: string,
  data: { title: string; lessons: Partial<Lessons>[] }
): Promise<CourseWithRelations> {
  try {
    const response = await axios.put<CourseWithRelations>(
      `/api/courses/${courseId}/modules/${moduleId}`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || "Failed to update module";
      throw new Error(errorMessage, { cause: error });
    }
    throw new Error("Failed to update module", { cause: error });
  }
}

export async function deleteModule(
  courseId: string,
  moduleId: string
): Promise<void> {
  try {
    await axios.delete(`/api/courses/${courseId}/modules/${moduleId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || "Failed to delete module";
      throw new Error(errorMessage, { cause: error });
    }
    throw new Error("Failed to delete module", { cause: error });
  }
}

export async function createResource(
  courseId: string,
  data: { name: string; url: string }
): Promise<Resources> {
  try {
    const response = await axios.post<Resources>(
      `/api/courses/${courseId}/resources`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || "Failed to create resource";
      throw new Error(errorMessage, { cause: error });
    }
    throw new Error("Failed to create resource", { cause: error });
  }
}

export async function updateResource(
  courseId: string,
  resourceId: string,
  data: { name: string; url: string }
): Promise<CourseWithRelations> {
  try {
    const response = await axios.put<CourseWithRelations>(
      `/api/courses/${courseId}/resources/${resourceId}`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || "Failed to update resource";
      throw new Error(errorMessage, { cause: error });
    }
    throw new Error("Failed to update resource", { cause: error });
  }
}

export async function deleteResource(
  courseId: string,
  resourceId: string
): Promise<void> {
  try {
    await axios.delete(`/api/courses/${courseId}/resources/${resourceId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.error || "Failed to delete resource";
      throw new Error(errorMessage, { cause: error });
    }
    throw new Error("Failed to delete resource", { cause: error });
  }
}
