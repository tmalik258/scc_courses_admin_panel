"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Breadcrumb } from "@/components/breadcrumb"
import type { Student } from "@/types/student"

const StudentManagementPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock student data
  const students: Student[] = [
    {
      id: "67775F553",
      profileImage: "/placeholder.svg?height=40&width=40",
      name: "Ahmad Husain",
      phone: "+1234567890",
      email: "ahmad@example.com",
    },
    {
      id: "67775F554",
      profileImage: "/placeholder.svg?height=40&width=40",
      name: "Sarah Wilson",
      phone: "+1234567891",
      email: "sarah@example.com",
    },
    {
      id: "67775F555",
      profileImage: "/placeholder.svg?height=40&width=40",
      name: "Mike Davis",
      phone: "+1234567892",
      email: "mike@example.com",
    },
    {
      id: "67775F556",
      profileImage: "/placeholder.svg?height=40&width=40",
      name: "Lisa Chen",
      phone: "+1234567893",
      email: "lisa@example.com",
    },
    {
      id: "67775F557",
      profileImage: "/placeholder.svg?height=40&width=40",
      name: "David Brown",
      phone: "+1234567894",
      email: "david@example.com",
    },
    {
      id: "67775F558",
      profileImage: "/placeholder.svg?height=40&width=40",
      name: "Emma Taylor",
      phone: "+1234567895",
      email: "emma@example.com",
    },
  ]

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.includes(searchQuery),
  )

  const handleEdit = (studentId: string) => {
    console.log("Edit student:", studentId)
    // Navigate to student details page
  }

  const handleDelete = (studentId: string) => {
    console.log("Delete student:", studentId)
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Student Management", active: true },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            All Students <span className="text-sky-500">({students.length})</span>
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
          <Button className="bg-sky-400 hover:bg-sky-500 text-white px-6 py-2 rounded-lg">
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>Student ID</span>
                    <div className="flex flex-col">
                      <button className="text-gray-400 hover:text-gray-600">▲</button>
                      <button className="text-gray-400 hover:text-gray-600">▼</button>
                    </div>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center space-x-1">
                    <span>Name</span>
                    <div className="flex flex-col">
                      <button className="text-gray-400 hover:text-gray-600">▲</button>
                      <button className="text-gray-400 hover:text-gray-600">▼</button>
                    </div>
                  </div>
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
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={student.profileImage || "/placeholder.svg"} alt={student.name} />
                      <AvatarFallback className="bg-gray-200">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.email}</div>
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
              ))}
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
    </div>
  )
}

export default StudentManagementPage
