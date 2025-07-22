// app/api/metrics/route.ts

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [coursesCount, studentsCount, instructorsCount, revenueResult] =
      await Promise.all([
        prisma.course.count({ where: { isPublished: true } }),
        prisma.profile.count({ where: { role: "STUDENT" } }),
        prisma.profile.count({ where: { role: "INSTRUCTOR" } }),
        prisma.invoice.aggregate({ _sum: { totalAmount: true } }),
      ]);

    return NextResponse.json({
      metrics: {
        totalCourses: coursesCount,
        totalStudents: studentsCount,
        totalInstructors: instructorsCount,
        totalRevenue: revenueResult._sum.totalAmount?.toNumber() || 0,
      },
    });
  } catch (error) {
    console.error("Failed to fetch metrics:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
