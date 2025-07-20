// app/api/popular-courses/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      take: 5,
      orderBy: {
        purchases: {
          _count: "desc",
        },
      },
      include: {
        category: {
          select: {
            name: true,
            color: true,
          },
        },
        instructor: {
          select: {
            fullName: true,
          },
        },
        modules: {
          select: {
            sections: {
              select: { id: true }, // to count lessons
            },
          },
        },
        purchases: {
          select: { id: true }, // for counting sales
        },
      },
    });

    const formattedCourses = courses.map((course) => ({
      id: course.id,
      name: course.title,
      category: course.category?.name || "Uncategorized",
      categoryColor: course.category?.color || "bg-gray-300",
      instructor: course.instructor?.fullName || "Unknown",
      sales: course.purchases.length,
      price: course.price?.toString() || "0.00",
      lessons: course.modules.reduce(
        (total, mod) => total + mod.sections.length,
        0
      ),
    }));

    return NextResponse.json({ courses: formattedCourses });
  } catch (error) {
    console.error("[POPULAR_COURSES_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
