"use client";

import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LumaSpin } from '@/components/luma-spin';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleNavigate = (path: string) => {
    startTransition(() => {
      router.push(path);
    });
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar onNavigate={handleNavigate} />
        <main className="flex-1 p-6 pt-0 w-full">
          {isPending ? <div className="flex items-center justify-center h-full"><LumaSpin /></div> : children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;