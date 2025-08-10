import { NextResponse } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";
import prisma from "@/lib/prisma";
import { CreateCourseFormData } from "@/types/course";

function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        category: {
          select: { id: true, name: true, color: true },
        },
        modules: {
          include: {
            lessons: true,
          },
        },
        instructor: {
          select: { id: true, fullName: true },
        },
        resources: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorCode =
      typeof error === "object" && error && "code" in error
        ? error.code
        : undefined;

    console.error("GET /api/courses error:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      code: errorCode,
    });

    console.log("Database URL:", process.env.DATABASE_URL);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body: CreateCourseFormData = await req.json();
    const { title, description, categoryId, price, instructorId } = body;

    if (!title || !instructorId || !categoryId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, instructor, and category are required.",
        },
        { status: 400 }
      );
    }

    if (!isValidUUID(instructorId) || !isValidUUID(categoryId)) {
      return NextResponse.json(
        { error: "Invalid instructor or category ID format." },
        { status: 400 }
      );
    }

    const instructor = await prisma.profile.findFirst({
      where: { id: instructorId, role: "INSTRUCTOR" },
    });

    if (!instructor) {
      return NextResponse.json(
        { error: "Instructor not found or invalid role." },
        { status: 404 }
      );
    }

    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    const createdCourse = await prisma.course.create({
      data: {
        title,
        description: description || null,
        instructorId,
        categoryId,
        price: price ? new Decimal(price) : 0,
      },
    });

    return NextResponse.json(
      { success: true, course: createdCourse },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorCode =
      typeof error === "object" && error && "code" in error
        ? error.code
        : undefined;

    console.error("POST /api/courses error:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      code: errorCode,
    });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id: courseId } = await req.json();

    if (!isValidUUID(courseId)) {
      return NextResponse.json(
        { error: "Invalid course ID format. Must be a valid UUID." },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    await prisma.resources.deleteMany({ where: { course_id: courseId } });

    const modules = await prisma.module.findMany({
      where: { courseId },
      select: { id: true },
    });

    const moduleIds = modules.map((m) => m.id);

    if (moduleIds.length > 0) {
      await prisma.lessons.deleteMany({
        where: { module_id: { in: moduleIds } },
      });
    }

    await prisma.module.deleteMany({ where: { courseId } });

    await prisma.course.delete({ where: { id: courseId } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
