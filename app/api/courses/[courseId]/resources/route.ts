import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const data = await request.json();
    const { courseId } = await params;
    const { name, url } = data;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      );
    }

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { error: "Resource name is required" },
        { status: 400 }
      );
    }

    if (!url || url.trim() === "") {
      return NextResponse.json(
        { error: "Resource URL is required" },
        { status: 400 }
      );
    }

    const newResource = await prisma.resources.create({
      data: {
        name,
        url,
        course_id: courseId,
      },
    });

    return NextResponse.json(newResource, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error("[Resource] Error creating resource:", error.message);
    } else {
      console.error("[Resource] Error creating resource:", error);
    }
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}