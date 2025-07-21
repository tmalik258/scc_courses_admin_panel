"use client";

import React, { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import { PopularCourse } from "@/types/course";

export const PopularCourseTable: React.FC = () => {
  const [courses, setCourses] = useState<PopularCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/popular-courses");
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await res.text();
          throw new Error(`Response is not JSON: ${text}`);
        }
        const data = await res.json();
        console.log("[PopularCourseTable] Fetched data:", data);
        if (data.error) {
          throw new Error(data.details || "API returned an error");
        }
        setCourses(data.courses || []); // Set the courses array, fallback to empty array
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error("Failed to load popular courses:", errorMessage);
        setError(errorMessage);
        setCourses([]); // Ensure courses is an array
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="mt-8 bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Popular Courses</h2>
      </div>
      {loading ? (
        <div className="p-6 text-sm text-gray-500">Loading...</div>
      ) : error ? (
        <div className="p-6 text-sm text-red-500">Error: {error}</div>
      ) : !courses.length ? (
        <div className="p-6 text-sm text-gray-500">
          No popular courses available.
        </div>
      ) : (
        <div className="w-full max-w-[calc(100vw-3rem)] sm:max-w-dvh md:max-w-[calc(100vw-20rem)] overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Course Name",
                  "Category",
                  "Instructor",
                  "Sale",
                  "Price",
                  "Lessons",
                  "Action",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {course.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${course.categoryColor}`}
                    >
                      {course.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.instructor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.sales}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${course.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {course.lessons}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
