import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Create a section inside a course
export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  const { courseId } = params;
  const body = await req.json();

  try {
    const newSection = await prisma.module.create({
      data: {
        ...body,
        courseId,
      },
    });

    return NextResponse.json(newSection, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Failed to create section" },
      { status: 500 }
    );
  }
}
