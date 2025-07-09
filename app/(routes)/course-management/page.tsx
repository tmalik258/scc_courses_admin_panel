"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Search, Clock, Edit, Trash2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Breadcrumb } from "@/components/breadcrumb"
import { useRouter } from "nextjs-toploader/app"

interface Course {
  id: string
  title: string
  category: string
  categoryColor: string
  mentor: string
  editedTime: string
  status: "published" | "draft"
}

const CourseManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Category")
  const [sortBy, setSortBy] = useState("Recently")
  const router = useRouter();

  // Mock course data matching the screenshot
  const courses: Course[] = [
    {
      id: "1",
      title: "Zapier 101: Automate Tasks Without Code",
      category: "Make Automations",
      categoryColor: "bg-yellow-100 text-yellow-700",
      mentor: "Mentor's Name",
      editedTime: "2h ago",
      status: "published",
    },
    {
      id: "2",
      title: "Responsive Web Design with HTML, CSS & Flexbox",
      category: "Web Development",
      categoryColor: "bg-cyan-100 text-cyan-700",
      mentor: "Mentor's Name",
      editedTime: "2h ago",
      status: "published",
    },
    {
      id: "3",
      title: "AI Voice Bots with Google Dialogflow & Twilio",
      category: "AI Calling",
      categoryColor: "bg-green-100 text-green-700",
      mentor: "Mentor's Name",
      editedTime: "2h ago",
      status: "draft",
    },
    {
      id: "4",
      title: "Flutter for Beginners: Build iOS & Android Apps",
      category: "App Development",
      categoryColor: "bg-red-100 text-red-700",
      mentor: "Mentor's Name",
      editedTime: "2h ago",
      status: "published",
    },
    {
      id: "5",
      title: "Flutter for Beginners: Build iOS & Android Apps",
      category: "App Development",
      categoryColor: "bg-red-100 text-red-700",
      mentor: "Mentor's Name",
      editedTime: "2h ago",
      status: "draft",
    },
    {
      id: "6",
      title: "Flutter for Beginners: Build iOS & Android Apps",
      category: "App Development",
      categoryColor: "bg-red-100 text-red-700",
      mentor: "Mentor's Name",
      editedTime: "2h ago",
      status: "published",
    },
  ]

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || course.status === activeTab
    return matchesSearch && matchesTab
  })

  const handleEdit = (courseId: string) => {
    console.log("Edit course:", courseId)
  }

  const handleDelete = (courseId: string) => {
    console.log("Delete course:", courseId)
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Course Management", active: true },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Course Management</h1>
        <Button className="bg-sky-400 hover:bg-sky-500 text-white px-6 py-2 rounded-lg cursor-pointer" onClick={() => router.push('/course-management/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Courses
        </Button>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("all")}
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "all"
                ? "border-sky-500 text-sky-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("published")}
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "published"
                ? "border-sky-500 text-sky-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setActiveTab("draft")}
            className={`pb-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === "draft"
                ? "border-sky-500 text-sky-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Draft
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search for courses"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-80 bg-gray-50 border-gray-200"
          />
        </div>
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100">
                {selectedCategory}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSelectedCategory("All Category")}>All Category</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory("Web Development")}>
                Web Development
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory("App Development")}>
                App Development
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory("AI Calling")}>AI Calling</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedCategory("Make Automations")}>
                Make Automations
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100">
                {sortBy}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("Recently")}>Recently</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("Oldest")}>Oldest</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("A-Z")}>A-Z</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("Z-A")}>Z-A</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden border-0 shadow-sm">
            <div className="relative">
              {/* Course Image with Gradient Background */}
              <div className="h-48 bg-gradient-to-br from-indigo-400 via-purple-500 to-indigo-600 flex items-center justify-center relative">
                {/* 3D Illustration Placeholder */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <div className="w-20 h-16 bg-yellow-400 rounded-lg transform rotate-12 opacity-90"></div>
                    <div className="absolute -top-2 -right-2 w-12 h-12 bg-green-400 rounded-full"></div>
                    <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-blue-400 rounded"></div>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <Badge className={`${course.categoryColor} text-xs font-medium px-2 py-1`}>{course.category}</Badge>
                </div>

                {/* Edited Time */}
                <div className="absolute top-4 right-4 flex items-center text-white text-xs bg-black/20 rounded-full px-2 py-1">
                  <Clock className="w-3 h-3 mr-1" />
                  Edited {course.editedTime}
                </div>
              </div>
            </div>

            <CardContent className="p-5">
              <h3 className="font-semibold text-gray-900 mb-2 text-base leading-tight">{course.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{course.mentor}</p>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-sky-500 border-sky-500 hover:bg-sky-50 bg-white"
                  onClick={() => handleEdit(course.id)}
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-red-500 border-red-500 hover:bg-red-50 bg-white"
                  onClick={() => handleDelete(course.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No courses found</div>
          <div className="text-gray-400">Try adjusting your search or filters</div>
        </div>
      )}
    </div>
  )
}

export default CourseManagementPage
