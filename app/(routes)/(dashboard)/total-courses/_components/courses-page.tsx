"use client";

import React, { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { CoursesHeader } from "./course-header";
import { CourseTable } from "./course-table";
import { Pagination } from "@/components/pagination";
import { useCourseData } from "@/hooks/useCourseData";
import { useRouter, useSearchParams } from "next/navigation";
import { CourseWithRelations } from "@/types/course";
import { toast } from "sonner";
import { DashedSpinner } from "@/components/dashed-spinner";

const CoursesPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");

  // Get initial page from URL or default to 1
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const {
    courses,
    page,
    setPage,
    limit,
    setLimit,
    handleDeleteCourse,
    totalPages,
    totalCount,
    loading,
    error,
    refreshCourses,
  } = useCourseData(10, initialPage);

  // Update URL when page changes
  useEffect(() => {
    if (typeof window === "undefined") return; // Skip during SSR
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", page.toString());
    router.push(`?${currentParams.toString()}`, { scroll: false });
  }, [page, router, searchParams]);

  useEffect(() => {
    refreshCourses();
  }, [page, refreshCourses, limit]);

  useEffect(() => {
    if (error) {
      console.error("Error occurred:", error.message);
      toast.error("Error: " + error.message);
    }
  }, [error]);

  // Sync entriesPerPage with limit
  const handleEntriesChange = (newEntries: number) => {
    setLimit(newEntries);
    setPage(1); // Reset to first page when changing entries per page
  };

  const handleEdit = (course: CourseWithRelations) => {
    router.push(`/course-management/edit/${course.id}`);
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Total Courses", active: true },
  ];

  return (
    <div className="p-4 sm:p-6">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col min-h-[calc(100vh-10rem)]">
        <CoursesHeader
          totalCourses={totalCount}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          entriesPerPage={limit}
          onEntriesChange={handleEntriesChange}
        />
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center">
              <DashedSpinner size={24} />
            </div>
          ) : (
            <CourseTable
              courses={courses}
              onEdit={handleEdit}
              onDelete={handleDeleteCourse}
            />
          )}
        </div>
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
