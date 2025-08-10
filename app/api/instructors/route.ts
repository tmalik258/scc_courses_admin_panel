import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const isCourse = searchParams.get("course") === "true";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;
  try {
    const instructors = await prisma.profile.findMany({
      where: {
        role: "INSTRUCTOR",
      },
      ...(isCourse ? {} : { skip, take: limit }),
      include: {
        instructorCourses: true, // Courses taught by the instructor
      },
    });

    const total = await prisma.profile.count({
      where: {
        role: "INSTRUCTOR",
      },
    });

    return NextResponse.json({ instructors, total });
  } catch (error) {
    console.error("Error fetching instructors:", error);
    return NextResponse.json({ error: "Failed to fetch instructors" }, { status: 500 });
  }
}