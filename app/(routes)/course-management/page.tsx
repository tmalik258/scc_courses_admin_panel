"use client";

import type React from "react";
import { useEffect, useState, useTransition } from "react";
import {
  Plus,
  Search,
  Clock,
  Edit,
  Trash2,
  ChevronDown,
  CircleAlertIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Breadcrumb } from "@/components/breadcrumb";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCourseData } from "@/hooks/useCourseData";
import { formatDistanceToNow } from "date-fns";
import { LumaSpin } from "@/components/luma-spin";
import { DashedSpinner } from "@/components/dashed-spinner";

const CourseManagementPage: React.FC = () => {
  const router = useRouter();
  const { courses, refreshCourses, loading, error } = useCourseData();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Category");
  const [sortBy, setSortBy] = useState("Recently");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (courses.length === 0) {
      refreshCourses();
    }
  }, [courses.length, refreshCourses]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "published" ? course.isPublished : !course.isPublished);
    const matchesCategory =
      selectedCategory === "All Category" ||
      course.category.name === selectedCategory;
    return matchesSearch && matchesTab && matchesCategory;
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
    console.log("Edit course:", courseId);
    router.push(`/course-management/edit/${courseId}`);
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
        window.location.reload();
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

      {/* Header */}
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

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden border-0 shadow-sm">
            <div className="relative">
              {/* Course Image with Gradient Background */}
              <div className="flex items-center justify-center relative px-5">
                <Image
                  width={200}
                  height={200}
                  decoding="async"
                  src={course.thumbnailUrl || "/images/course_placeholder.jpg"}
                  alt={course.title}
                  className="w-full h-56 object-cover rounded-xl"
                />
                {/* Category Badge */}
                <div className="absolute top-2 left-7">
                  <Badge
                    className={`text-xs font-medium px-2 py-1 ${
                      course.category.color || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {course.category.name}
                  </Badge>
                </div>
                {/* Edited Time */}
                <div className="absolute top-2 right-7 flex items-center text-white text-xs bg-black/20 rounded-full px-2 py-1">
                  <Clock className="w-3 h-3 mr-1" />
                  Edited{" "}
                  {formatDistanceToNow(new Date(course.updatedAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>

            <CardContent className="px-5 flex flex-col justify-between h-full">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base leading-tight">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {course.instructor.fullName || "Unknown"}
                </p>
              </div>

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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-red-500 border-red-500 hover:bg-red-50 bg-white"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                      <div
                        className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                        aria-hidden="true"
                      >
                        <CircleAlertIcon className="opacity-80" size={16} />
                      </div>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this course? All
                          associated modules, lessons, and resources will be
                          permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(course.id)}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
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
    </div>
  );
};

export default CourseManagementPage;
