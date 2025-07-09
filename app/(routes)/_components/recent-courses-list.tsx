import React from 'react';
import { Clock } from 'lucide-react';
import { RecentCourse } from '@/types';

interface RecentCoursesListProps {
  courses: RecentCourse[];
}

const RecentCoursesList: React.FC<RecentCoursesListProps> = ({ courses }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Viewed Course</h2>
      <div className="space-y-4">
        {courses.map((course, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">{course.title}</h3>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {course.timeAgo}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentCoursesList;