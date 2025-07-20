"use client";

import React, { useState, useEffect } from "react";
import { Upload, ArrowUpDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/breadcrumb";
import { useStudentData } from "@/hooks/useStudentData";
import { useParams } from "next/navigation";
import { LumaSpin } from "@/components/luma-spin";

const StudentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { selectedStudent, selectStudent, handleUpdateStudent, handleDeleteStudent, loading, error } = useStudentData();
  const [studentData, setStudentData] = useState({
    id: "",
    fullName: "",
    phone: "",
    email: "",
    courses: [] as { id: string; title: string; category: string; status: string }[],
  });

  useEffect(() => {
    if (id) {
      selectStudent(id);
    }
  }, [id, selectStudent]);

  useEffect(() => {
    if (selectedStudent) {
      setStudentData({
        id: selectedStudent.id,
        fullName: selectedStudent.fullName || "",
        phone: selectedStudent.phone || "",
        email: selectedStudent.email || "",
        courses: selectedStudent.purchases.map((p) => ({
          id: p.course.id,
          title: p.course.title,
          category: p.course.category,
          status: p.createdAt ? "purchased" : "ongoing",
        })),
      });
    }
  }, [selectedStudent]);

  const handleSave = async () => {
    await handleUpdateStudent(studentData.id, {
      fullName: studentData.fullName,
      phone: studentData.phone,
      email: studentData.email,
    });
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this student?")) {
      await handleDeleteStudent(studentData.id);
      window.history.back();
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  const breadcrumbItems = [
    { label: "Student Management", href: "/student-management" },
    { label: "Student Details", active: true },
  ];

  if (loading) return <div className="flex items-center justify-center h-full"><LumaSpin /></div>;;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Student Details</h1>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleCancel} className="px-6 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-sky-500 hover:bg-sky-600 px-6">
            Save Profile
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-6"
          >
            Delete Student
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
            <Input
              placeholder="Student ID"
              value={studentData.id}
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <Input
              placeholder="Student Name"
              value={studentData.fullName}
              onChange={(e) => setStudentData({ ...studentData, fullName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <Input
              placeholder="Phone Number"
              value={studentData.phone}
              onChange={(e) => setStudentData({ ...studentData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <Input
              placeholder="Email"
              value={studentData.email}
              onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
            />
          </div>
        </div>

        <div className="lg:col-span-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile</label>
            <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-gray-600 mb-2">Upload Photo</div>
                  <div className="text-xs text-red-500">Max file size is 2 Mb</div>
                  <input type="file" accept="image/*" className="hidden" id="profile-upload" />
                  <label
                    htmlFor="profile-upload"
                    className="mt-4 inline-block cursor-pointer text-sky-500 hover:text-sky-600"
                  >
                    Browse Files
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Purchased</h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Course ID</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Course Title</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentData.courses.map((course, index) => (
                  <tr key={`${course.id}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        className={`${
                          course.status === "purchased"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mr-2 ${
                            course.status === "purchased" ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        />
                        {course.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Remove course">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsPage;