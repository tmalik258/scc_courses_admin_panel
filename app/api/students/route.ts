import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const students = await prisma.profile.findMany({
      where: { role: "STUDENT" },
      include: {
        purchases: {
          include: {
            course: true,
          },
        },
      },
    });
    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}