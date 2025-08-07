"use client";

import type React from "react";
import { useEffect, useState, useTransition } from "react";
import { Plus, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb } from "@/components/breadcrumb";
import { useRouter } from "next/navigation";
import { useCourseData } from "@/hooks/useCourseData";
import { LumaSpin } from "@/components/luma-spin";
import { DashedSpinner } from "@/components/dashed-spinner";
import { Pagination } from "@/components/pagination";
import CourseCard from "./_components/course-card";

const CourseManagementPage: React.FC = () => {
  const router = useRouter();
  const page = 1;
  const limit = 6;
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("All Category");
  const [sortBy, setSortBy] = useState("Recently");
  const [isPending, startTransition] = useTransition();

  const {
    courses,
    currentPage,
    totalPages,
    handlePageChange,
    refreshCourses,
    loading,
    error,
  } = useCourseData(page, limit, debouncedSearch);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    if (courses.length === 0 && !loading && !error) {
      refreshCourses();
    }
  }, [courses.length, refreshCourses, loading, error]);

  const filteredCourses = courses.filter((course) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "published" ? course.isPublished : !course.isPublished);
    const matchesCategory =
      selectedCategory === "All Category" ||
      course.category.name === selectedCategory;
    return matchesTab && matchesCategory;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortBy === "Recently")
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    if (sortBy === "Oldest")
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    if (sortBy === "A-Z") return a.title.localeCompare(b.title);
    if (sortBy === "Z-A") return b.title.localeCompare(a.title);
    return 0;
  });

  const handleEdit = (courseId: string) => {
    startTransition(() => {
      router.push(`/course-management/edit/${courseId}`);
    });
  };

  const handleDelete = async (courseId: string) => {
    try {
      const response = await fetch("/api/courses", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: courseId }),
      });

      if (response.ok) {
        refreshCourses();
      } else {
        const errorData = await response.json();
        console.error(
          "Failed to delete course:",
          errorData.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Unexpected error deleting course:", error);
    }
  };

  const handleRedirectToCreate = () => {
    startTransition(() => {
      router.push("/course-management/create");
    });
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Course Management", active: true },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LumaSpin />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500">
        Error loading courses: {error.message}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Course Management
        </h1>
        <Button
          className="bg-sky-400 hover:bg-sky-500 text-white px-6 py-2 rounded-lg cursor-pointer"
          disabled={isPending}
          onClick={handleRedirectToCreate}
        >
          {isPending ? (
            <DashedSpinner className="mr-2" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Add Courses
        </Button>
      </div>

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
              <Button
                variant="outline"
                className="bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              >
                {selectedCategory}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => setSelectedCategory("All Category")}
              >
                All Category
              </DropdownMenuItem>
              {[...new Set(courses.map((course) => course.category.name))].map(
                (category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              >
                {sortBy}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("Recently")}>
                Recently
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("Oldest")}>
                Oldest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("A-Z")}>
                A-Z
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("Z-A")}>
                Z-A
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
          />
        ))}
      </div>

      {sortedCourses.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-2">No courses found</div>
          <div className="text-gray-400">
            Try adjusting your search or filters
          </div>
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

export default CourseManagementPage;
