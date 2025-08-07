// ✅ get-admin-courses.ts
"use server";

import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";

export async function getAdminCourses({
  search = "",
  page = 1,
  limit = 10,
}: {
  search?: string;
  page?: number;
  limit?: number;
}) {
  const skip = (page - 1) * limit;

  const isUUID = /^[0-9a-fA-F-]{36}$/.test(search);

  const where: Prisma.CourseWhereInput | undefined = search
    ? {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            category: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          {
            instructor: {
              fullName: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          ...(isUUID ? [{ id: search }] : []),
        ],
      }
    : undefined;

  const [courses, totalCount] = await Promise.all([
    prisma.course.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        instructor: {
          select: {
            id: true,
            fullName: true,
          },
        },
        modules: {
          include: {
            lessons: true,
          },
        },
        resources: true,
      },
    }),
    prisma.course.count({ where }),
  ]);

  const serializedCourses = courses.map((course) => ({
    ...course,
    price: course.price ? course.price.toNumber() : null,
  }));

  return {
    courses: serializedCourses,
    totalCount,
  };
}
