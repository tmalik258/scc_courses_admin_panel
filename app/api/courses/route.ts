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
          }
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
        updatedAt: 'desc',
      },
    });

    return NextResponse.json({courses}, { status: 200 });
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
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export async function POST(req: Request) {
  try {
    const body: CourseFormData = await req.json();
    const {
      title,
      description,
      category,
      price,
      instructor,
      thumbnailUrl,
      modules,
      resources,
    } = body;

    // Validate required fields
    if (!title || !instructor || !category) {
      return NextResponse.json(
        { error: "Missing required fields: title, instructor, and category are required." },
        { status: 400 }
      );
    }

    // Validate UUID formats
    if (!isValidUUID(instructor)) {
      return NextResponse.json(
        { error: "Invalid instructor ID format. Must be a valid UUID." },
        { status: 400 }
      );
    }

    if (!isValidUUID(category)) {
      return NextResponse.json(
        { error: "Invalid category ID format. Must be a valid UUID." },
        { status: 400 }
      );
    }

    // Validate instructor exists and has correct role
    const instructor_profile = await prisma.profile.findFirst({
      where: { 
        id: instructor, 
        role: "INSTRUCTOR" 
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
      where: { id: category }
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
        categoryId: category,
        price: price ? new Decimal(price) : null,
        thumbnailUrl: thumbnailUrl || null,
      },
    });

    // Create modules and lessons
    if (modules && modules.length > 0) {
      for (const [index, mod] of modules.entries()) {
        const createdModule = await prisma.module.create({
          data: {
            title: mod.title,
            order_index: index,
            courseId: createdCourse.id,
          },
        });

        // Create lessons for this module
        if (mod.lessons && mod.lessons.length > 0) {
          for (const [lessonIndex, les] of mod.lessons.entries()) {
            await prisma.lessons.create({
              data: {
                title: les.name,
                content: les.reading || null,
                video_url: les.videoUrl || null,
                order_index: lessonIndex,
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
        await prisma.resources.create({
          data: {
            id: crypto.randomUUID(),
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
      if (error.message.includes('Invalid') && error.message.includes('UUID')) {
        return NextResponse.json(
          { error: "Invalid UUID format in request data." },
          { status: 400 }
        );
      }
      
      if (error.message.includes('Foreign key constraint')) {
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
