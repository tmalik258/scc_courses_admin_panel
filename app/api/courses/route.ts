import { NextResponse } from "next/server";
import { Decimal } from "@prisma/client/runtime/library";
import prisma from "@/lib/prisma";
import { CourseFormData } from "@/types/course";

// UUID validation helper
function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// GET: Fetch all popular courses
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
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// POST: Create a new popular course
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
        price: price ? new Decimal(price) : null,
        thumbnailUrl: thumbnailUrl || null,
      },
    });

    if (modules?.length) {
      for (const mod of modules) {
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

        for (const lesson of mod.lessons || []) {
          if (!lesson.name) {
            return NextResponse.json(
              { error: "Lesson name is required." },
              { status: 400 }
            );
          }

          await prisma.lessons.create({
            data: {
              title: lesson.name,
              content: lesson.content || null,
              video_url: lesson.videoUrl || null,
              updated_at: new Date(),
              is_free: false,
              module_id: createdModule.id,
              course_id: createdCourse.id,
            },
          });
        }
      }
    }

    if (resources?.length) {
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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a popular course
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
    await prisma.lessons.deleteMany({ where: { course_id: courseId } });
    await prisma.module.deleteMany({ where: { courseId: courseId } });
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
