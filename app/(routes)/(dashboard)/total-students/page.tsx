"use client";

import React, { useState } from "react";
import { Student } from "@/types/student";
import { Breadcrumb } from "@/components/breadcrumb";
import { StudentsHeader } from "./_components/student-header";
import { StudentTable } from "./_components/student-table";
import { Pagination } from "@/components/pagination";
import { useStudentData } from "@/hooks/useStudentData";
import { useRouter } from "next/navigation";

const StudentsPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const { students } = useStudentData();
  const router = useRouter();

  // Filter students based on search
  const filteredStudents = students.filter(
    (student) =>
      student.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
      student.id.toLowerCase().includes(searchValue.toLowerCase()) ||
      student.phone?.includes(searchValue)
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredStudents.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  const handleEdit = (student: Student) => {
    router.push(`/student-management/${student.id}`);
  };

  const handleDelete = (studentId: string) => {
    console.log("Delete student:", studentId);
    // In real app, this would show confirmation dialog and delete student
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Total Students", active: true },
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />

      <StudentsHeader
        totalStudents={filteredStudents.length}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        entriesPerPage={entriesPerPage}
        onEntriesChange={setEntriesPerPage}
      />

      <StudentTable
        students={currentStudents}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default StudentsPage;
