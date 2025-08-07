"use server";

import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { CourseWithRelations } from "@/types/course";

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
