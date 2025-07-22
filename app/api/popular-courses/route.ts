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
            lessons: {
              select: { id: true },
            },
          },
        },
        purchases: {
          select: { id: true },
        },
      },
    });

    const formattedCourses = courses.map((course) => {
      console.log("[POPULAR_COURSES] Processing course:", course);
      return {
        id: course.id,
        name: course.title,
        category: course.category?.name || "Uncategorized",
        categoryColor: course.category?.color || "bg-gray-300",
        instructor: course.instructor?.fullName || "Unknown",
        sales: course.purchases.length,
        price: course.price?.toString() || "0.00",
        lessons: course.modules.reduce(
          (total, mod) => total + mod.lessons.length,
          0
        ),
      };
    });

    return NextResponse.json({ courses: formattedCourses });
  } catch (error) {
    // Type guard to check if error is an instance of Error
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[POPULAR_COURSES_ERROR]", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error", details: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
