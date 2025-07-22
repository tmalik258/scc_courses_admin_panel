"use client";

import type React from "react";
import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb } from "@/components/breadcrumb";
import { useInstructorData } from "@/hooks/useInstructorData";
import { LumaSpin } from "@/components/luma-spin";
import { useRouter } from "next/navigation";

const InstructorManagementPage: React.FC = () => {
  const { instructors, handleDeleteInstructor, loading } = useInstructorData();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.phone?.includes(searchQuery)
  );

  const handleEdit = (instructorId: string) => {
    router.push(`/instructor-management/${instructorId}`);
  };

  const handleDelete = (instructorId: string) => {
    handleDeleteInstructor(instructorId);
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Instructor Management", active: true },
  ];

  if (loading)
    return (
      <div className="flex items-center justify-center h-full">
        <LumaSpin />
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            All Instructor{" "}
            <span className="text-sky-500">({instructors.length})</span>
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
            />
          </div>
          <Button className="bg-sky-400 hover:bg-sky-500 text-white px-6 py-2 rounded-lg cursor-pointer">
            <Plus className="w-4 h-4 mr-2" />
            Add Instructor
          </Button>
        </div>
      </div>

      {/* Instructor Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>Instructor ID</span>
                    <div className="flex flex-col">
                      <button className="text-gray-400 hover:text-gray-600">
                        ▲
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        ▼
                      </button>
                    </div>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>Full Name</span>
                    <div className="flex flex-col">
                      <button className="text-gray-400 hover:text-gray-600">
                        ▲
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        ▼
                      </button>
                    </div>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInstructors.map((instructor) => (
                <tr key={instructor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{instructor.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          instructor.avatarUrl ||
                          "/images/instructor_placeholder.jpg"
                        }
                        alt={instructor.fullName || "Instructor"}
                      />
                      <AvatarFallback className="bg-gray-200">
                        {instructor.fullName
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "I"}
                      </AvatarFallback>
                    </Avatar>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {instructor.fullName || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {instructor.role}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {instructor.bio || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {instructor.phone || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(instructor.id)}
                        className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg"
                        title="Edit instructor"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(instructor.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete instructor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredInstructors.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No instructors found</div>
          <div className="text-gray-400">Try adjusting your search</div>
        </div>
      )}
    </div>
  );
};

export default InstructorManagementPage;
