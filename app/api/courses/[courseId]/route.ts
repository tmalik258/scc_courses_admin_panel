import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { updateCourseSchema, UpdateData } from "@/types/course";
import { NextResponse } from "next/server";
import z from "zod";

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
  const { courseId } = await params;
  const body = await req.json();

  try {
    const validatedData = updateCourseSchema.parse(body);
    const { modules, resources, ...courseData } = validatedData;

    const updateData: UpdateData = { ...courseData };

    if (courseData.price !== undefined) {
      updateData.price = courseData.price
        ? parseFloat(courseData.price.toString())
        : null;
    }

    if (modules && modules.length > 0) {
      updateData.modules = {
        upsert: modules
          .filter((module) => module.title || module.lessons?.length)
          .map((module) => ({
            where: { id: module.id || crypto.randomUUID() },
            update: {
              title: module.title || undefined,
              lessons: {
                upsert:
                  module.lessons
                    ?.filter(
                      (lesson) =>
                        lesson.name || lesson.videoUrl || lesson.content
                    )
                    .map((lesson) => ({
                      where: { id: lesson.id || crypto.randomUUID() },
                      update: {
                        title: lesson.name || undefined,
                        content: lesson.content ?? null, // Handle undefined as null
                        video_url: lesson.videoUrl || undefined,
                        updated_at: new Date(),
                      },
                      create: {
                        course_id: courseId, // Correct for Lessons
                        title: lesson.name || "Untitled Lesson",
                        content: lesson.content ?? null, // Handle undefined as null
                        video_url: lesson.videoUrl,
                        updated_at: new Date(),
                      },
                    })) || [],
              },
            },
            create: {
              title: module.title || "Untitled Module",
              lessons: {
                create:
                  module.lessons
                    ?.filter(
                      (lesson) =>
                        lesson.name || lesson.videoUrl || lesson.content
                    )
                    .map((lesson) => ({
                      course_id: courseId, // Correct for Lessons
                      title: lesson.name || "Untitled Lesson",
                      content: lesson.content ?? null, // Handle undefined as null
                      video_url: lesson.videoUrl,
                      updated_at: new Date(),
                    })) || [],
              },
            },
          })),
      };
    }

    if (resources && resources.length > 0) {
      updateData.resources = {
        upsert: resources
          .filter((resource) => resource.title || resource.url)
          .map((resource) => ({
            where: { id: resource.id || crypto.randomUUID() },
            update: {
              name: resource.title || undefined,
              url: resource.url || undefined,
              updatedAt: new Date(),
            },
            create: {
              name: resource.title || "Untitled Resource",
              url: resource.url,
              updatedAt: new Date(),
            },
          })),
      };
    }

    console.log("Update data:", JSON.stringify(updateData, null, 2)); // Debug log

    const updated = await prisma.course.update({
      where: { id: courseId },
      data: updateData,
      include: { modules: { include: { lessons: true } }, resources: true },
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
    if (error instanceof Error) {
      console.error("Error updating course:", error.message);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
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
