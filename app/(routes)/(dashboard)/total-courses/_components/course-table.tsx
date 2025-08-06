"use client";

import type React from "react";
import { ArrowUpDown } from "lucide-react";
import type { CourseWithRelations } from "@/types/course";
import CourseTableRow from "./course-table-row";

interface CourseTableProps {
  courses: CourseWithRelations[];
  onEdit: (course: CourseWithRelations) => void;
  onDelete: (courseId: string) => void;
}

export const CourseTable: React.FC<CourseTableProps> = ({
  courses,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="max-w-[calc(100vw-3rem)] sm:max-w-dvh md:max-w-[calc(100vw-19rem)] overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span>Course Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                Instructor&apos;s Name
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                Sale
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                Lessons
              </th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course) => (
              <CourseTableRow
                key={course.id}
                course={course}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
