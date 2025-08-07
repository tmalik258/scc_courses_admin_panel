"use client";

import React, { useState } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { CoursesHeader } from "./_components/course-header";
import { CourseTable } from "./_components/course-table";
import { Pagination } from "@/components/pagination";
import { useCourseData } from "@/hooks/useCourseData";
import { useRouter } from "next/navigation";
import { CourseWithRelations } from "@/types/course";

const CoursesPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const { courses, totalCount, errorMessage } = useCourseData(
    currentPage,
    entriesPerPage
  );

  const router = useRouter();

  const totalPages = Math.ceil(totalCount / entriesPerPage);

  const handleEdit = (course: CourseWithRelations) => {
    router.push(`/course-management/edit/${course.id}`);
  };

  const handleDelete = async (courseId: string) => {
    if (deletingIds.has(courseId)) return;

    setDeletingIds((prev) => new Set(prev).add(courseId));

    try {
      const res = await fetch(`/api/courses/${courseId}`, { method: "DELETE" });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Failed to delete course.");
      }

      // Refetch current page
      location.reload();
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to delete course:", err.message);
      } else {
        console.error("Failed to delete course:", err);
      }
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Total Courses", active: true },
  ];

  return (
    <div className="p-4 sm:p-6">
      <Breadcrumb items={breadcrumbItems} />

      <CoursesHeader
        totalCourses={totalCount}
        searchValue={searchValue}
        onSearchChange={(value) => {
          setSearchValue(value);
          setCurrentPage(1); // reset to first page
        }}
        entriesPerPage={entriesPerPage}
        onEntriesChange={(val) => {
          setEntriesPerPage(val);
          setCurrentPage(1);
        }}
      />

      {errorMessage && (
        <div className="text-red-600 bg-red-100 p-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      <CourseTable
        courses={courses}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingIds={deletingIds}
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
