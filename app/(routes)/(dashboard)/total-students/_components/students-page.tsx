"use client";

import React, { useEffect, useState } from "react";
import { Student } from "@/types/student";
import { Breadcrumb } from "@/components/breadcrumb";
import { StudentsHeader } from "./student-header";
import { StudentTable } from "./student-table";
import { Pagination } from "@/components/pagination";
import { useStudentData } from "@/hooks/useStudentData";
import { useRouter, useSearchParams } from "next/navigation";
import { DashedSpinner } from "@/components/dashed-spinner";
import { toast } from "sonner";

const StudentsPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial page from URL or default to 1
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const {
    students,
    page,
    totalPages,
    loading,
    refreshStudents,
    setPage,
    limit,
    setLimit,
    error,
    handleDeleteStudent,
  } = useStudentData(10, initialPage); // Initialize with 10 entries per page

  // Update URL when page changes
  useEffect(() => {
    if (typeof window === "undefined") return; // Skip during SSR
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", page.toString());
    router.push(`?${currentParams.toString()}`, { scroll: false });
  }, [page, router, searchParams]);

  useEffect(() => {
    refreshStudents();
  }, [refreshStudents, page, limit]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching students:", error.message);
      toast.error("Failed to fetch students. Please try again.");
    }
  }, [error]);

  // Sync entriesPerPage with limit
  const handleEntriesChange = (newEntries: number) => {
    setLimit(newEntries);
    setPage(1); // Reset to first page when changing entries per page
  };

  // Filter students based on search
  const filteredStudents = students.filter(
    (student) =>
      student.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
      student.id.toLowerCase().includes(searchValue.toLowerCase()) ||
      student.phone?.includes(searchValue)
  );

  const handleEdit = (student: Student) => {
    router.push(`/student-management/${student.id}`);
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Total Students", active: true },
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col min-h-[calc(100vh-10rem)]">
        <StudentsHeader
          totalStudents={filteredStudents.length}
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
            <StudentTable
              students={filteredStudents}
              onEdit={handleEdit}
              onDelete={handleDeleteStudent} // Use hook's delete function
            />
          )}
        </div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default StudentsPage;
