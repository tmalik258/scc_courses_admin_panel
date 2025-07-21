// app/api/recent-courses/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const recentCourses = await prisma.course.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    const now = new Date();
    const coursesWithTimeAgo = recentCourses.map((course) => {
      const diffMs = now.getTime() - new Date(course.createdAt).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      let timeAgo = "just now";
      if (diffDays > 0)
        timeAgo = `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
      else if (diffHours > 0)
        timeAgo = `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      else if (diffMins > 0)
        timeAgo = `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;

      return {
        id: course.id,
        title: course.title,
        timeAgo,
      };
    });

    // ✅ FIX: Wrap in an object with `courses` key
    return NextResponse.json({ courses: coursesWithTimeAgo });
  } catch (error) {
    console.error("[RECENT_COURSES_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
