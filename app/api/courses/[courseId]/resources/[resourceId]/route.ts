import { Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import z from "zod";

const resourceSchema = z.object({
  name: z.string().optional(),
  url: z.string().url().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string; resourceId: string }> }
) {
  const { courseId, resourceId } = await params;
  const body = await req.json();

  try {
    const validatedData = resourceSchema.parse(body);
    const { name, url } = validatedData;

    const updateData = {
      name: name,
      url: url,
      updatedAt: new Date(),
    };

    const updatedResource = await prisma.resources.update({
      where: { id: resourceId, course_id: courseId },
      data: updateData,
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { modules: { include: { lessons: true } }, resources: true },
    });

    return NextResponse.json(course || updatedResource);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("Validation error:", error.errors);
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        console.log("Resource not found:", error.message);
        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 }
        );
      }
    }
    if (error instanceof Error) {
      console.error("Error updating resource:", error.message);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}