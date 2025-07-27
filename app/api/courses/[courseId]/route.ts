import { Course, Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import z from "zod";
import { validate as uuidValidate } from 'uuid';
import { Decimal } from "@prisma/client/runtime/library";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
        instructor: true,
        category: true,
        resources: true,
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

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params;
    console.log("Received courseId:", courseId);

    // Validate UUID
    if (!courseId || !uuidValidate(courseId)) {
      return NextResponse.json(
        { error: "Invalid or missing courseId" },
        { status: 400 }
      );
    }

    const {
      title,
      description,
      categoryId,
      price,
      instructorId,
      thumbnailUrl,
      isPublished,
    } = await req.json();

    console.log("Request data:", {
      title,
      description,
      categoryId,
      price,
      instructorId,
      thumbnailUrl,
      isPublished,
    });

    const updateData: Partial<Course> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
      updateData.price = price ? new Decimal(price) : null;
    if (instructorId !== undefined) updateData.instructorId = instructorId;
    if (thumbnailUrl !== undefined)
      updateData.thumbnailUrl = thumbnailUrl || null;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    const updated = await prisma.course.update({
      where: { id: courseId },
      data: updateData
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("Validation error:", error.errors);
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        console.log("Course not found:", error.message);
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 }
        );
      }
    }
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;

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
