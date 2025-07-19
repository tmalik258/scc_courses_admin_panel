"use client";

import React from "react";
import { useRouter } from "nextjs-toploader/app";
import { useDashboardData } from "@/hooks/useDashboardData";
import StudentGrowthChart from "./_components/student-growth-chart";
import RecentCoursesList from "./_components/recent-courses-list";
import { PopularCourseTable } from "./_components/popular-course-table";
import MetricCard from "./_components/metric-card";
import { BookOpen, DollarSign, ShoppingCart, Users } from "lucide-react";

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { dashboardData, loading, error } = useDashboardData();

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!dashboardData) return <div>No data available</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Course Overview
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Students"
            value={dashboardData.totalStudents.toLocaleString()}
            icon={<Users className="w-5 h-5 text-aqua-mist" />}
            onClick={() => router.push("/students")}
          />
          <MetricCard
            title="Total Courses"
            value={dashboardData.totalCourses.toLocaleString()}
            icon={<BookOpen className="w-5 h-5 text-aqua-mist" />}
            onClick={() => router.push("/total-courses")}
          />
          <MetricCard
            title="Purchased Course"
            value={dashboardData.purchasedCourses.toLocaleString()}
            icon={<ShoppingCart className="w-5 h-5 text-aqua-mist" />}
          />
          <MetricCard
            title="Total Revenue"
            value={`₹${dashboardData.totalRevenue.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}`}
            icon={<DollarSign className="w-5 h-5 text-aqua-mist" />}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <StudentGrowthChart data={dashboardData.studentGrowth} />
        <RecentCoursesList courses={dashboardData.recentCourses} />
      </div>
      <PopularCourseTable courses={dashboardData.popularCourses} />
    </div>
  );
};

export default DashboardPage;
