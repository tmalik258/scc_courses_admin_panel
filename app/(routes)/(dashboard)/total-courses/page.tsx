"use client"

import React, { useState } from "react"
import type { Course } from "@/types/course"
import { Breadcrumb } from "@/components/breadcrumb"
import { CoursesHeader } from "./_components/course-header"
import { CourseTable } from "./_components/course-table"
import { Pagination } from "@/components/pagination"

const CoursesPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState("")
  const [entriesPerPage, setEntriesPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // Mock data - in real app, this would come from API
  const allCourses: Course[] = [
    {
      id: "CRS2025001",
      name: "Machine Learning with Python: From Basics to Deployment",
      category: "Data Science",
      instructor: "Andrew",
      sales: 105,
      price: 1350,
      lessons: 33,
    },
    {
      id: "CRS2025002",
      name: "Machine Learning with Python: From Basics to Deployment",
      category: "Data Science",
      instructor: "Andrew",
      sales: 105,
      price: 1350,
      lessons: 33,
    },
    {
      id: "CRS2025003",
      name: "Machine Learning with Python: From Basics to Deployment",
      category: "Data Science",
      instructor: "Andrew",
      sales: 105,
      price: 1350,
      lessons: 33,
    },
    {
      id: "CRS2025004",
      name: "Machine Learning with Python: From Basics to Deployment",
      category: "Data Science",
      instructor: "Andrew",
      sales: 105,
      price: 1350,
      lessons: 33,
    },
    {
      id: "CRS2025005",
      name: "Machine Learning with Python: From Basics to Deployment",
      category: "Data Science",
      instructor: "Andrew",
      sales: 105,
      price: 1350,
      lessons: 33,
    },
    {
      id: "CRS2025006",
      name: "Web Development Fundamentals: HTML, CSS & JavaScript",
      category: "Web Development",
      instructor: "Sarah",
      sales: 89,
      price: 999,
      lessons: 28,
    },
    {
      id: "CRS2025007",
      name: "React.js Complete Guide: From Beginner to Advanced",
      category: "Frontend",
      instructor: "Mike",
      sales: 156,
      price: 1599,
      lessons: 45,
    },
    {
      id: "CRS2025008",
      name: "Node.js Backend Development Masterclass",
      category: "Backend",
      instructor: "David",
      sales: 78,
      price: 1299,
      lessons: 38,
    },
    {
      id: "CRS2025009",
      name: "Database Design and SQL Fundamentals",
      category: "Database",
      instructor: "Lisa",
      sales: 92,
      price: 899,
      lessons: 25,
    },
    {
      id: "CRS2025010",
      name: "Mobile App Development with React Native",
      category: "Mobile Development",
      instructor: "John",
      sales: 67,
      price: 1799,
      lessons: 52,
    },
    {
      id: "CRS2025011",
      name: "DevOps and Cloud Computing Essentials",
      category: "DevOps",
      instructor: "Alex",
      sales: 134,
      price: 1999,
      lessons: 41,
    },
    {
      id: "CRS2025012",
      name: "UI/UX Design Principles and Figma Mastery",
      category: "Design",
      instructor: "Emma",
      sales: 203,
      price: 1199,
      lessons: 35,
    },
  ]

  // Filter courses based on search
  const filteredCourses = allCourses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      course.category.toLowerCase().includes(searchValue.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchValue.toLowerCase()) ||
      course.id.toLowerCase().includes(searchValue.toLowerCase()),
  )

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const endIndex = startIndex + entriesPerPage
  const currentCourses = filteredCourses.slice(startIndex, endIndex)

  const handleEdit = (course: Course) => {
    console.log("Edit course:", course)
    // In real app, this would open edit modal or navigate to edit page
  }

  const handleDelete = (courseId: string) => {
    console.log("Delete course:", courseId)
    // In real app, this would show confirmation dialog and delete course
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchValue, entriesPerPage])

  const breadcrumbItems = [
    { label: "Dashboard", href: "/" },
    { label: "Total Courses", active: true },
  ]

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

      <CourseTable courses={currentCourses} onEdit={handleEdit} onDelete={handleDelete} />

      <div className="mt-6">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  )
}

export default CoursesPage
