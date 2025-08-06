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
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const { courses, refreshCourses } = useCourseData();
  const router = useRouter();

  useEffect(() => {
    if (courses.length === 0) {
      refreshCourses();
    }
  }, [courses.length, refreshCourses]);

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

  const totalPages = Math.ceil(filteredCourses.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, endIndex);

  const handleEdit = (course: CourseWithRelations) => {
    router.push(`/course-management/edit/${course.id}`);
  };

  const handleDelete = async (courseId: string) => {
    if (deletingIds.has(courseId)) return;

    setDeletingIds((prev) => new Set(prev).add(courseId));

    try {
      const delay = new Promise((resolve) => setTimeout(resolve, 500));
      const res = fetch(`/api/courses/${courseId}`, { method: "DELETE" });
      const [apiResponse] = await Promise.all([res, delay]);

      if (!apiResponse.ok) {
        const data = await apiResponse.json();
        throw new Error(data?.error || "Failed to delete course.");
      }

      setErrorMessage(null);
      refreshCourses();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Failed to delete course:", err.message);
      setErrorMessage(`Failed to delete course: ${err.message}`);
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

  useEffect(() => {
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
