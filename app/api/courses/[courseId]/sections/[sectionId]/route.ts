import { PrismaClient } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// UPDATE a section
export async function PUT(
  req: Request,
  { params }: { params: { sectionId: string } }
) {
  const { sectionId } = params;
  const body = await req.json();

  try {
    const updatedSection = await prisma.section.update({
      where: { id: sectionId },
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
  { params }: { params: { sectionId: string } }
) {
  const { sectionId } = params;

  try {
    await prisma.section.delete({
      where: { id: sectionId },
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
