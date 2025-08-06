import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      prisma.profile.findMany({
        where: { role: "STUDENT" },
        skip,
        take: limit,
        include: {
          purchases: {
            include: {
              course: true,
            },
          },
        },
      }),
      prisma.profile.count({
        where: { role: "STUDENT" },
      }),
    ]);

    return NextResponse.json({ students, total });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}
