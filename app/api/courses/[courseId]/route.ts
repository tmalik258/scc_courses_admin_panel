import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET a single course
export async function GET(
  _: Request,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        sections: true,
        instructor: true,
        category: true,
      },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// UPDATE a course
export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params;
  const body = await req.json();

  try {
    const updated = await prisma.course.update({
      where: { id: courseId },
      data: body,
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE a course
export async function DELETE(
  _: Request,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params;

  try {
    await prisma.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
