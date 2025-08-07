import { NextResponse } from "next/server";
import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const page = Number(searchParams.get("page") || "1");
    const limit = Number(searchParams.get("limit") || "6");
    const search = searchParams.get("search") || "";

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

    return NextResponse.json({
      courses: serializedCourses,
      totalCount,
    });
  } catch (error) {
    console.error("Error in GET /api/courses:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }
    await prisma.course.delete({ where: { id } });
    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/courses:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
