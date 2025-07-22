import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { format } from "date-fns";

export async function GET() {
  try {
    // Fetch total students (count of profiles with role STUDENT)
    const totalStudents = await prisma.profile.count({
      where: { role: "STUDENT" },
    });

    // Fetch total courses
    const totalCourses = await prisma.course.count({
      where: { isPublished: true },
    });

    // Fetch total purchased courses
    const purchasedCourses = await prisma.purchase.count();

    // Fetch total revenue from invoices
    const totalRevenueResult = await prisma.invoice.aggregate({
      _sum: { totalAmount: true },
      where: { status: "SUCCESS" },
    });
    const totalRevenue = totalRevenueResult._sum.totalAmount?.toNumber() || 0;

    // Fetch student growth (new students per month for the last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Define the type for groupBy result
    type StudentGrowthData = {
      createdAt: Date;
      _count: { id: number };
    };

    const studentGrowthData = await prisma.profile.groupBy({
      by: ["createdAt"],
      where: {
        role: "STUDENT",
        createdAt: { gte: sixMonthsAgo },
      },
      _count: { id: true },
    }) as StudentGrowthData[];

    // Process student growth data
    const studentGrowth: { month: string; value: number }[] = [];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const currentMonth = new Date(sixMonthsAgo);

    for (let i = 0; i < 6; i++) {
      const monthName = months[i];
      const monthData = studentGrowthData.filter(
        (data) => format(data.createdAt, "MMM") === monthName
      );
      const count = monthData.reduce((sum, data) => sum + data._count.id, 0);
      studentGrowth.push({ month: monthName, value: count });
      currentMonth.setMonth(currentMonth.getMonth() + 1);
    }

    // Fetch recent courses (last 2 published courses)
    const recentCourses = await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 2,
      select: {
        id: true,
        title: true,
        createdAt: true,
      },
    });

    // Format recent courses
    const formattedRecentCourses = recentCourses.map((course) => {
      const daysAgo = Math.floor(
        (new Date().getTime() - course.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        id: course.id,
        title: course.title,
        timeAgo: daysAgo === 0 ? "Today" : `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`,
      };
    });

    return NextResponse.json({
      data: {
        totalStudents,
        totalCourses,
        purchasedCourses,
        totalRevenue,
        studentGrowth,
        recentCourses: formattedRecentCourses,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}