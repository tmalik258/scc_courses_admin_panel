// app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  format,
  startOfMonth,
  subMonths,
  subDays,
  formatDistanceToNow,
} from "date-fns";
import {
  DashboardData,
  StudentGrowthPoint,
  RecentCourse,
  PopularCourse,
} from "@/types/dashboard";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type !== "dashboard") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  try {
    // Fetch total students
    const totalStudents = await prisma.profile.count({
      where: { role: "STUDENT" },
    });

    // Fetch total courses
    const totalCourses = await prisma.course.count();

    // Fetch total purchased courses
    const purchasedCourses = await prisma.purchase.count();

    // Fetch total revenue
    const totalRevenueResult = await prisma.invoice.aggregate({
      where: { status: "SUCCESS" },
      _sum: { totalAmount: true },
    });
    const totalRevenue = Number(totalRevenueResult._sum.totalAmount) || 0;

    // Fetch student growth (last 6 months)
    const studentGrowth: StudentGrowthPoint[] = await Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const monthStart = startOfMonth(subMonths(new Date(), 5 - i));
        return prisma.profile
          .count({
            where: {
              role: "STUDENT",
              createdAt: {
                gte: monthStart,
                lt: startOfMonth(subMonths(new Date(), 4 - i)),
              },
            },
          })
          .then((count: number) => ({
            month: format(monthStart, "MMM"),
            value: count,
          }));
      })
    );

    // Fetch recent courses (last 7 days)
    const recentCourses: RecentCourse[] = await prisma.course
      .findMany({
        where: {
          createdAt: { gte: subDays(new Date(), 7) },
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      })
      .then((courses) =>
        courses.map((course) => ({
          id: course.id,
          title: course.title,
          timeAgo: formatDistanceToNow(course.createdAt, { addSuffix: true }),
        }))
      );

    // Fetch popular courses (most purchases in last 30 days)
    const popularCourses: PopularCourse[] = await prisma.course
      .findMany({
        where: {
          purchases: {
            some: {
              createdAt: { gte: subDays(new Date(), 30) },
            },
          },
        },
        select: {
          id: true,
          title: true,
          price: true,
          category: { select: { name: true, color: true } },
          instructor: { select: { fullName: true } },
          purchases: { select: { id: true } },
          modules: { select: { lessons: { select: { id: true } } } },
        },
        orderBy: {
          purchases: { _count: "desc" },
        },
        take: 5,
      })
      .then((courses) =>
        courses.map((course) => ({
          id: course.id,
          title: course.title,
          category: course.category.name,
          categoryColor: course.category.color || "blue",
          instructor: course.instructor.fullName || "Unknown",
          enrollments: course.purchases.length,
          price: `₹${course.price?.toFixed(2) || "0.00"}`,
          lessons: course.modules.reduce(
            (acc: number, mod: { lessons: { id: string }[] }) =>
              acc + mod.lessons.length,
            0
          ),
        }))
      );

    const response: DashboardData = {
      totalStudents,
      totalCourses,
      purchasedCourses,
      totalRevenue,
      studentGrowth,
      recentCourses,
      popularCourses,
    };

    return NextResponse.json({ data: response });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
