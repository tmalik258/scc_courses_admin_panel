import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const data = await request.json();
    const { courseId } = await params;
    const { title, lessons } = data;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    if (!title) {
      console.error("[Course Module] Invalid module data:", data);
      return NextResponse.json(
        { error: "Module title is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(lessons) || lessons.length === 0) {
      console.error("[Course Module] Invalid lessons data:", lessons);
      return NextResponse.json(
        { error: "At least one lesson is required" },
        { status: 400 }
      );
    }

    const newModule = await prisma.module.create({
      data: {
        title,
        course: { connect: { id: courseId } },
        lessons: { createMany: { data: lessons } },
      },
    });

    return NextResponse.json(newModule, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("[Course Module] Error creating module:", error.message);
    } else {
      console.error("[Course Module] Error creating module:", error);
    }
    return NextResponse.json(
      { error: "Failed to create module" },
      { status: 500 }
    );
  }
}