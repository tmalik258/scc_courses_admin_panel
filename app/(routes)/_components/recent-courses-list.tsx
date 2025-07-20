// components/recent-courses-list.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

// ✅ Define the correct type here OR make sure it's updated in @/types
interface RecentCourse {
  id: string;
  title: string;
  timeAgo: string;
}

const RecentCoursesList: React.FC = () => {
  const [courses, setCourses] = useState<RecentCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/recent-courses");
        const data = await res.json();
        setCourses(data.courses); // ✅ Make sure your API returns { courses: [...] }
      } catch (error) {
        console.error("Failed to load recent courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Recently Viewed Courses
      </h2>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : courses.length === 0 ? (
        <p className="text-sm text-gray-500">No recent courses found.</p>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  {course.title}
                </h3>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {course.timeAgo}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentCoursesList;
