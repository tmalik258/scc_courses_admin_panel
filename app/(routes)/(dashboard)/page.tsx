"use client";

import React from "react";
import { useRouter } from "nextjs-toploader/app";
import { useDashboardOverview } from "@/hooks/useDashboardOverview";
import StudentGrowthChart from "../_components/student-growth-chart";
import RecentCoursesList from "../_components/recent-courses-list";
import { PopularCourseTable } from "../_components/popular-course-table";
import MetricCard from "../_components/metric-card";
import { BookOpen, DollarSign, ShoppingCart, Users } from "lucide-react";
import { LumaSpin } from "@/components/luma-spin";

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const { overview, loading, error } = useDashboardOverview();

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <LumaSpin />
      </div>
    );

  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Course Overview
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Students"
            value={(overview?.totalStudents ?? 0).toLocaleString()}
            icon={<Users className="w-5 h-5 text-aqua-mist" />}
            onClick={() => router.push("/total-students")}
          />
          <MetricCard
            title="Total Courses"
            value={(overview?.totalCourses ?? 0).toLocaleString()}
            icon={<BookOpen className="w-5 h-5 text-aqua-mist" />}
            onClick={() => router.push("/total-courses")}
          />
          <MetricCard
            title="Purchased Course"
            value={(overview?.purchasedCourses ?? 0).toLocaleString()}
            icon={<ShoppingCart className="w-5 h-5 text-aqua-mist" />}
            onClick={() => router.push("/course-management")}
          />
          <MetricCard
            title="Total Revenue"
            value={`₹${(overview?.totalRevenue ?? 0).toLocaleString("en-IN", {
              minimumFractionDigits: 2,
            })}`}
            icon={<DollarSign className="w-5 h-5 text-aqua-mist" />}
            onClick={() => router.push("/payment-management")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <StudentGrowthChart
          data={(overview?.studentGrowth ?? []).map(
            ({ month, value }: { month: string; value: number }) => ({
              label: month,
              value,
            })
          )}
        />
        <RecentCoursesList courses={overview?.recentCourses ?? []} />
      </div>

      <PopularCourseTable />
    </div>
  );
};

export default DashboardPage;
