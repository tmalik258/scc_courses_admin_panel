import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import React from 'react';
import { Toaster } from "@/components/ui/sonner"

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 pt-0">
          {children}
        </main>
        <Toaster />
      </div>
    </div>
  );
};

export default DashboardLayout;