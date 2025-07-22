import { NextResponse } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";
import prisma from "@/lib/prisma";
import { CourseFormData } from "@/types/course";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            color: true,
          },
        },
        modules: {
          include: {
            lessons: true,
          },
        },
        instructor: {
          select: {
            id: true,
            fullName: true,
          },
        },
        resources: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json({ courses }, { status: 200 });
  } catch (error) {
    console.error(
      "Error fetching courses:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// UUID validation helper function
function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export async function POST(req: Request) {
  try {
    const body: CourseFormData = await req.json();
    const {
      title,
      description,
      categoryId,
      price,
      instructorId,
      thumbnailUrl,
      modules,
      resources,
    } = body;

    // Validate required fields
    if (!title || !instructorId || !categoryId) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: title, instructor, and category are required.",
        },
        { status: 400 }
      );
    }

    // Validate UUID formats
    if (!isValidUUID(instructorId)) {
      return NextResponse.json(
        { error: "Invalid instructor ID format. Must be a valid UUID." },
        { status: 400 }
      );
    }

    if (!isValidUUID(categoryId)) {
      return NextResponse.json(
        { error: "Invalid category ID format. Must be a valid UUID." },
        { status: 400 }
      );
    }

    // Validate instructor exists and has correct role
    const instructor_profile = await prisma.profile.findFirst({
      where: {
        id: instructorId,
        role: "INSTRUCTOR",
      },
    });

    if (!instructor_profile) {
      return NextResponse.json(
        { error: "Instructor not found or does not have instructor role." },
        { status: 404 }
      );
    }

    // Validate category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      return NextResponse.json(
        { error: "Category not found." },
        { status: 404 }
      );
    }

    // Create the course
    const createdCourse = await prisma.course.create({
      data: {
        title,
        description: description || null,
        instructorId: instructor_profile.id,
        categoryId: categoryExists.id,
        price: price ? new Decimal(price) : null,
        thumbnailUrl: thumbnailUrl || null,
      },
    });

    // Create modules and lessons
    if (modules && modules.length > 0) {
      for (const [, mod] of modules.entries()) {
        if (!mod.title) {
          return NextResponse.json(
            { error: "Module title is required." },
            { status: 400 }
          );
        }
        const createdModule = await prisma.module.create({
          data: {
            title: mod.title,
            courseId: createdCourse.id,
          },
        });

        // Create lessons for this module
        if (mod.lessons && mod.lessons.length > 0) {
          for (const [, les] of mod.lessons.entries()) {
            if (!les.name) {
              return NextResponse.json(
                { error: "Lesson name is required." },
                { status: 400 }
              );
            }
            await prisma.lessons.create({
              data: {
                title: les.name,
                content: les.content || null,
                video_url: les.videoUrl || null,
                updated_at: new Date(),
                is_free: false,
                module_id: createdModule.id,
                course_id: createdCourse.id,
              },
            });
          }
        }
      }
    }

    // Create resources
    if (resources && resources.length > 0) {
      for (const res of resources) {
        if (!res.title || !res.url) {
          return NextResponse.json(
            { error: "Resource title and URL are required." },
            { status: 400 }
          );
        }
        await prisma.resources.create({
          data: {
            name: res.title,
            url: res.url,
            course_id: createdCourse.id,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json(
      { success: true, course: createdCourse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating course:", error);

    // More specific error handling
    if (error instanceof Error) {
      // Check for specific Prisma errors
      if (error.message.includes("Invalid") && error.message.includes("UUID")) {
        return NextResponse.json(
          { error: "Invalid UUID format in request data." },
          { status: 400 }
        );
      }

      if (error.message.includes("Foreign key constraint")) {
        return NextResponse.json(
          { error: "Invalid reference to instructor or category." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // Validate UUID
    if (!id || !isValidUUID(id)) {
      return NextResponse.json(
        { error: "Invalid course ID format. Must be a valid UUID." },
        { status: 400 }
      );
    }

    // Check if course exists
    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found." }, { status: 404 });
    }

    // Delete associated resources, modules, and lessons
    await prisma.resources.deleteMany({
      where: { course_id: id },
    });

    await prisma.lessons.deleteMany({
      where: { course_id: id },
    });

    await prisma.module.deleteMany({
      where: { courseId: id },
    });

    // Delete the course
    await prisma.course.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
