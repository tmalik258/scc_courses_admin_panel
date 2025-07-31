"use client";

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const router = useRouter();

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="w-4 h-4 mx-2" />}
          {item.href ? (
            <div onClick={() => router.push(item.href || '')} className="hover:text-gray-700 cursor-pointer">
              {item.label}
            </div>
          ) : (
            <span className={item.active ? 'text-aqua-mist font-medium' : ''}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};