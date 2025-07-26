import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import z from "zod";

const moduleSchema = z.object({
  title: z.string().optional(),
  lessons: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().optional(),
        videoUrl: z.string().url().optional(),
      })
    )
    .optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  const { courseId, moduleId } = await params;
  const body = await req.json();

  try {
    const validatedData = moduleSchema.parse(body);
    const { title, lessons } = validatedData;

    const updateData = {
      title: title,
      lessons: lessons
        ? {
            upsert: lessons.map((lesson) => ({
              where: { id: lesson.id || crypto.randomUUID() },
              update: {
                title: lesson.name || undefined,
                video_url: lesson.videoUrl || undefined,
                updated_at: new Date(),
              },
              create: {
                course_id: courseId,
                title: lesson.name || "Untitled Lesson",
                video_url: lesson.videoUrl,
                updated_at: new Date(),
              },
            })),
          }
        : undefined,
    };

    const updatedModule = await prisma.module.update({
      where: { id: moduleId, courseId: courseId },
      data: updateData,
      include: { lessons: true },
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { modules: { include: { lessons: true } }, resources: true },
    });

    return NextResponse.json(course || updatedModule);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("Validation error:", error.errors);
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        console.log("Module not found:", error.message);
        return NextResponse.json(
          { error: "Module not found" },
          { status: 404 }
        );
      }
    }
    if (error instanceof Error) {
      console.error("Error updating module:", error.message);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}