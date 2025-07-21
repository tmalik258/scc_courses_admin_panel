"use client";

import React, { useState } from "react";
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
  const { courses } = useCourseData();
  const router = useRouter();

  // Filter courses based on search
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      course.category?.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
      course.instructor?.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
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

  const handleDelete = (courseId: string) => {
    console.log("Delete course:", courseId);
    // In real app, this would show confirmation dialog and delete course
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
        totalCourses={200}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        entriesPerPage={entriesPerPage}
        onEntriesChange={setEntriesPerPage}
      />

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
