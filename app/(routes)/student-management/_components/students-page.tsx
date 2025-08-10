"use client";

import React, { useEffect, useState } from "react";
import { useStudentData } from "@/hooks/useStudentData";
import { Search, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb } from "@/components/breadcrumb";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/pagination";
import { toast } from "sonner";
import { DashedSpinner } from "@/components/dashed-spinner";

const StudentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get initial page from URL or default to 1
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const {
    students,
    refreshStudents,
    handleDeleteStudent,
    loading,
    page,
    setPage,
    totalPages,
    limit,
    error,
  } = useStudentData(3, initialPage);

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
      console.error("Error occurred:", error.message);
      toast.error("Error: " + error.message);
    }
  }, [error]);

  const filteredStudents = students.filter(
    (student) =>
      student.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone?.includes(searchQuery)
  );

  const handleEdit = (studentId: string) => {
    router.push(`/student-management/${studentId}`);
  };

  const handleDelete = (studentId: string) => {
    handleDeleteStudent(studentId);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const currentPage = page;

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Student Management", active: true },
  ];

  return (
    <div className="p-6 px-2 md:w-[calc(100vw-20rem)]">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex max-sm:flex-col max-sm:gap-4 items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            All Students{" "}
            <span className="text-sky-500">({students.length})</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-80 bg-gray-50 border-gray-200"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} rowSpan={6}>
                    <DashedSpinner size={24} />
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Avatar className="h-10 w-10 overflow-hidden">
                        {student.avatarUrl && (
                          <AvatarImage
                            src={student.avatarUrl}
                            alt={student.fullName || "Avatar"}
                            className="h-full w-full object-cover"
                          />
                        )}
                        <AvatarFallback className="bg-gray-200">
                          {student.fullName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {student.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(student.id)}
                          className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg"
                          title="Edit student"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="Delete student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No students found</div>
          <div className="text-gray-400">Try adjusting your search</div>
        </div>
      )}

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

export default StudentsPage;
