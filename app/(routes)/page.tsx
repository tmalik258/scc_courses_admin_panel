"use client";

import React from "react";
import { CourseData, RecentCourse, ChartDataPoint } from "@/types";
import StudentGrowthChart from "./_components/student-growth-chart";
import RecentCoursesList from "./_components/recent-courses-list";
import { PopularCourseTable } from "./_components/popular-course-table";
import MetricCard from "./_components/metric-card";
import { BookOpen, DollarSign, ShoppingCart, Users } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const chartData: ChartDataPoint[] = [
    { month: "Jan", value: 100 },
    { month: "Feb", value: 180 },
    { month: "Mar", value: 280 },
    { month: "Apr", value: 350 },
    { month: "May", value: 420 },
    { month: "Jun", value: 500 },
  ];

  const courses: CourseData[] = [
    {
      name: "Machine Learning with Python: From Basics to D...",
      category: "Data Science",
      categoryColor: "bg-blue-100 text-blue-600",
      instructor: "Dr. Nathan Cole",
      sales: 220,
      price: "₹1,350",
      lessons: 33,
    },
    {
      name: "Create E-Commerce Chatbots for WhatsApp",
      category: "WhatsApp Chatbots",
      categoryColor: "bg-purple-100 text-purple-600",
      instructor: "Anika Verma",
      sales: 92,
      price: "₹1,150",
      lessons: 40,
    },
    {
      name: "Create Smart Call Assistants using Voice AI",
      category: "AI Calling",
      categoryColor: "bg-green-100 text-green-600",
      instructor: "Luis Mendoza",
      sales: 198,
      price: "₹1,020",
      lessons: 35,
    },
    {
      name: "Text-to-Speech and Speech-to-Text for AI Cal...",
      category: "AI Calling",
      categoryColor: "bg-green-100 text-green-600",
      instructor: "Emily Zhang",
      sales: 176,
      price: "₹1,200",
      lessons: 25,
    },
    {
      name: "Flutter for Beginners: Build iOS & Android Apps",
      category: "App Development",
      categoryColor: "bg-orange-100 text-orange-600",
      instructor: "Sofia Martins",
      sales: 151,
      price: "₹1,110",
      lessons: 30,
    },
  ];

  const recentCourses: RecentCourse[] = [
    {
      title: "Machine Learning with Python: From Basics to Deployment",
      timeAgo: "Edited 30m ago",
    },
    {
      title: "Create E-Commerce Chatbots for WhatsApp",
      timeAgo: "Edited 1h ago",
    },
    {
      title: "No-Code WhatsApp Automation using Make & Zapier",
      timeAgo: "Edited 2h ago",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Course Overview
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Students"
            value="1,041"
            icon={<Users className="w-5 h-5 text-aqua-mist" />}
            onClick={() => router.push("/students")}
          />
          <MetricCard
            title="Total Courses"
            value="200"
            icon={<BookOpen className="w-5 h-5 text-aqua-mist" />}
            onClick={() => router.push("/total-courses")}
          />
          <MetricCard
            title="Purchased Course"
            value="540"
            icon={<ShoppingCart className="w-5 h-5 text-aqua-mist" />}
          />
          <MetricCard
            title="Total Revenue"
            value="₹100,350"
            icon={<DollarSign className="w-5 h-5 text-aqua-mist" />}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <StudentGrowthChart data={chartData} />
        <RecentCoursesList courses={recentCourses} />
      </div>
      <PopularCourseTable courses={courses} />
    </div>
  );
};

export default DashboardPage;
