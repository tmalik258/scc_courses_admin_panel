// app/dashboard/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: {
      totalStudents: 1200,
      totalCourses: 80,
      purchasedCourses: 320,
      totalRevenue: 500000,
      studentGrowth: [
        { month: "Jan", value: 200 },
        { month: "Feb", value: 250 },
        { month: "Mar", value: 300 },
        { month: "Apr", value: 400 },
        { month: "May", value: 450 },
        { month: "Jun", value: 500 },
      ],
      recentCourses: [
        { id: "1", title: "Intro to React", timeAgo: "2 days ago" },
        { id: "2", title: "Advanced CSS", timeAgo: "5 days ago" },
      ],
      popularCourses: [
        {
          title: "React Masterclass", // Changed name to title
          category: "Web Development",
          categoryColor: "blue",
          instructor: "John Doe",
          enrollments: 120, // Changed sales to enrollments
          price: "₹1999",
          lessons: 12,
        },
        {
          title: "Next.js Complete Guide", // Changed name to title
          category: "Web Development",
          categoryColor: "green",
          instructor: "Jane Smith",
          enrollments: 90, // Changed sales to enrollments
          price: "₹2499",
          lessons: 15,
        },
      ],
    },
  });
}
