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
        { title: "Intro to React", timeAgo: "2 days ago" },
        { title: "Advanced CSS", timeAgo: "5 days ago" },
      ],
      popularCourses: [
        {
          name: "React Masterclass",
          category: "Web Development",
          categoryColor: "blue",
          instructor: "John Doe",
          sales: 120,
          price: "₹1999",
          lessons: 12,
        },
        {
          name: "Next.js Complete Guide",
          category: "Web Development",
          categoryColor: "green",
          instructor: "Jane Smith",
          sales: 90,
          price: "₹2499",
          lessons: 15,
        },
      ],
    },
  });
}
