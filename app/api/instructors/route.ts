import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const instructors = await prisma.profile.findMany({
      where: {
        role: "INSTRUCTOR",
      },
      include: {
        instructorCourses: true, // Courses taught by the instructor
      },
    });

    return NextResponse.json(instructors);
  } catch (error) {
    console.error("Error fetching instructors:", error);
    return NextResponse.json({ error: "Failed to fetch instructors" }, { status: 500 });
  }
}