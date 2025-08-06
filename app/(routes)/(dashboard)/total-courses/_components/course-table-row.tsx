import { CourseWithRelations } from "@/types/course";
import { Edit, Trash2 } from "lucide-react";

interface CourseTableRowProps {
  course: CourseWithRelations;
  onEdit: (course: CourseWithRelations) => void;
  onDelete: (courseId: string) => void;
}

const CourseTableRow = ({ course, onEdit, onDelete }: CourseTableRowProps) => {
  return (
    <tr key={course.id} className="hover:bg-gray-50">
      <td className="px-3 sm:px-6 py-4">
        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
          {course.title}
        </div>
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {course.category.name}
        </span>
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
        <div className="text-sm text-gray-900">
          {course.instructor?.fullName}
        </div>
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
        <div className="text-sm text-gray-900">{course.title}</div>
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          ₹{course.price?.toString()}
        </div>
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden lg:table-cell">
        <div className="text-sm text-gray-900">{course.title}</div>
      </td>
      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-1 sm:space-x-2">
          <button
            onClick={() => onEdit(course)}
            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded"
            title="Edit course"
          >
            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => onDelete(course.id)}
            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded"
            title="Delete course"
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CourseTableRow;
