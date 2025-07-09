"use client";

import React from 'react';
import { Users, BookOpen, DollarSign, LayoutDashboard, Settings } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';

const Sidebar: React.FC = () => {
  const router = useRouter();
  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <div className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg cursor-pointer" onClick={() => router.push('/')}>
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </div>
          </li>
          <li>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => router.push('/course-management')}>
              <BookOpen className="w-5 h-5" />
              <span>Course Management</span>
            </div>
          </li>
          <li>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => router.push('/instructor-management')}>
              <Users className="w-5 h-5" />
              <span>Instructor Management</span>
            </div>
          </li>
          <li>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => router.push('/student-management')}>
              <Users className="w-5 h-5" />
              <span>Student Management</span>
            </div>
          </li>
          <li>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => router.push('/payment-management')}>
              <DollarSign className="w-5 h-5" />
              <span>Payment</span>
            </div>
          </li>
          <li>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => router.push('/settings')}>
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar