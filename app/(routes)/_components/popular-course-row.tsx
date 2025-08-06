"use client";

import { PopularCourse } from "@/types/course";
import { randomColorGenerator } from "@/utils/category";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface PopularCourseRowProps {
  course: PopularCourse;
  handleDeleteCourse: (courseId: string) => void;
}

const PopularCourseRow = ({
  course,
  handleDeleteCourse,
}: PopularCourseRowProps) => {
  const [color, setColor] = useState("");

  useEffect(() => {
    if (!color) setColor(randomColorGenerator());
  }, [color]);

  return (
    <tr key={course.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{course.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            color || "bg-gray-100 text-gray-700"
          }`}
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
          <button
            onClick={() => handleDeleteCourse(course.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default PopularCourseRow;
