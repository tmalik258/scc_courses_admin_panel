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

interface StudentGrowthPoint {
  month: string;
  value: number;
}

interface RecentCourse {
  id: string;
  title: string;
  timeAgo: string;
}

interface PopularCourse {
  id: string;
  title: string;
  category: string;
  categoryColor: string;
  instructor: string;
  enrollments: number;
  price: string;
  lessons: number;
}

interface DashboardData {
  totalStudents: number;
  totalCourses: number;
  purchasedCourses: number;
  totalRevenue: number;
  studentGrowth: StudentGrowthPoint[];
  recentCourses: RecentCourse[];
  popularCourses: PopularCourse[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  if (type !== "dashboard") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  try {
    const totalStudents = await prisma.profile.count({
      where: { role: "STUDENT" },
    });

    const totalCourses = await prisma.course.count();

    const purchasedCourses = await prisma.purchase.count();

    const totalRevenueResult = await prisma.invoice.aggregate({
      where: { status: "SUCCESS" },
      _sum: { totalAmount: true },
    });
    const totalRevenue = Number(totalRevenueResult._sum.totalAmount) || 0;

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
