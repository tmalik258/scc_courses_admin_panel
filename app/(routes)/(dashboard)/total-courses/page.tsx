"use client";

import React, { useEffect, useState } from "react";
import type { CourseWithRelations } from "@/types/course";
import { Breadcrumb } from "@/components/breadcrumb";
import { CoursesHeader } from "./_components/course-header";
import { CourseTable } from "./_components/course-table";
import { Pagination } from "@/components/pagination";
import { useCourseData } from "@/hooks/useCourseData";
import { useRouter } from "next/navigation";

const CoursesPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { courses, refreshCourses } = useCourseData();
  const router = useRouter();

  useEffect(() => {
    if (courses.length === 0) {
      refreshCourses();
    }
  }, [courses.length, refreshCourses]);

  // Filter courses based on search
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      course.category?.name
        ?.toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      course.instructor?.fullName
        ?.toLowerCase()
        .includes(searchValue.toLowerCase()) ||
      course.id.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  const handleEdit = (course: CourseWithRelations) => {
    router.push(`/course-management/${course.id}`);
  };

  const handleDelete = async (courseId: string) => {
    try {
      const res = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to delete course.");
      }

      setErrorMessage(null);
      router.refresh(); // Reload data after deletion
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to delete course:", err.message);
      setErrorMessage(`Failed to delete course: ${err.message}`);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, entriesPerPage]);

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Total Courses", active: true },
  ];

  return (
    <div className="p-4 sm:p-6">
      <Breadcrumb items={breadcrumbItems} />

      <CoursesHeader
        totalCourses={filteredCourses.length}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        entriesPerPage={entriesPerPage}
        onEntriesChange={setEntriesPerPage}
      />

      {errorMessage && (
        <div className="text-red-600 bg-red-100 p-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <CourseTable
        courses={currentCourses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default CoursesPage;
