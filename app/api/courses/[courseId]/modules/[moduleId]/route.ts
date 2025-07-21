import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// UPDATE a section
export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  const { courseId, moduleId } = params;
  const body = await req.json();

  try {
    const updatedSection = await prisma.module.update({
      where: { id: moduleId, courseId },
      data: body,
    });

    return NextResponse.json(updatedSection);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 }
    );
  }
}

// DELETE a section
export async function DELETE(
  _: Request,
  { params }: { params: { courseId: string; moduleId: string } }
) {
  const { courseId, moduleId } = params;

  try {
    await prisma.module.delete({
      where: { id: moduleId, courseId },
    });

    return NextResponse.json({ message: "Section deleted" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Failed to delete section" },
      { status: 500 }
    );
  }
}
