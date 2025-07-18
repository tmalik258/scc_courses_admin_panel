"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Upload, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Breadcrumb } from "@/components/breadcrumb"
import { useInstructorData } from "@/hooks/useInstructorData"
import { useParams } from "next/navigation"
import { Instructor } from "@/types/instructor"

const InstructorDetailsPage: React.FC = () => {
  const { instructorId } = useParams<{ instructorId: string }>()
  const { selectedInstructor, selectInstructor, handleUpdateInstructor, handleDeleteInstructor, loading, error } = useInstructorData()
  const [instructorData, setInstructorData] = useState<Instructor>({
    id: "",
    fullName: "",
    role: "",
    bio: "",
    phone: "",
    avatarUrl: "",
    courses: [],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  useEffect(() => {
    if (instructorId) {
      selectInstructor(instructorId as string)
    }
  }, [instructorId, selectInstructor])

  useEffect(() => {
    if (selectedInstructor) {
      setInstructorData({
        id: selectedInstructor.id,
        fullName: selectedInstructor.fullName || "",
        role: selectedInstructor.role || "",
        bio: selectedInstructor.bio || "",
        phone: selectedInstructor.phone || "",
        avatarUrl: selectedInstructor.avatarUrl || "",
        courses: selectedInstructor.courses || [],
        isActive: selectedInstructor.isActive,
        createdAt: selectedInstructor.createdAt,
        updatedAt: selectedInstructor.updatedAt,
      })
    }
  }, [selectedInstructor])

  const handleSave = async () => {
    await handleUpdateInstructor(instructorData.id, {
      fullName: instructorData.fullName,
      role: instructorData.role, // Should remain "INSTRUCTOR"
      bio: instructorData.bio,
      phone: instructorData.phone,
      avatarUrl: instructorData.avatarUrl,
    })
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this instructor?")) {
      await handleDeleteInstructor(instructorData.id)
      window.history.back()
    }
  }

  const handleCancel = () => {
    window.history.back()
  }

  const breadcrumbItems = [
    { label: "Instructor Management", href: "/instructor-management" },
    { label: "Instructor Details", active: true },
  ]

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Instructor Details</h1>
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
            Delete Instructor
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Instructor ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Instructor ID</label>
            <Input
              placeholder="Instructor ID"
              value={instructorData.id}
              disabled
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <Input
              placeholder="Instructor Full Name"
              value={instructorData.fullName ?? ""}
              onChange={(e) => setInstructorData({ ...instructorData, fullName: e.target.value })}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <Input
              placeholder="Instructor Role"
              value={instructorData.role}
              disabled // Role should be immutable or managed separately
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <Input
              placeholder="Bio"
              value={instructorData.bio ?? ""}
              onChange={(e) => setInstructorData({ ...instructorData, bio: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <Input
              placeholder="Phone Number"
              value={instructorData.phone ?? ""}
              onChange={(e) => setInstructorData({ ...instructorData, phone: e.target.value })}
            />
          </div>
        </div>

        {/* Right Column - Profile Upload */}
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

      {/* Course Assigned Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Assigned</h2>
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
                    Total Lessons
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {instructorData.courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
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
                      <div className="text-sm text-gray-900">{course.totalLessons}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorDetailsPage