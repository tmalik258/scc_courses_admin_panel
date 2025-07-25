"use client";

import React from "react";
import {
  Users,
  BookOpen,
  DollarSign,
  LayoutDashboard,
  FolderKanban, // Optional: used for Course Category
} from "lucide-react";
import { usePathname } from "next/navigation";

const Sidebar = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      label: "Course Management",
      href: "/course-management",
      icon: BookOpen,
    },
    {
      label: "Course Category", // ✅ New item added here
      href: "/course-category",
      icon: FolderKanban,
    },
    {
      label: "Instructor Management",
      href: "/instructor-management",
      icon: Users,
    },
    {
      label: "Student Management",
      href: "/student-management",
      icon: Users,
    },
    {
      label: "Payment Management",
      href: "/payment-management",
      icon: DollarSign,
    },
  ];

  const nonDashboardRoutes = routes
    .filter((route) => route.href !== "/")
    .map((route) => route.href);

  const isDashboardActive = (pathname: string) => {
    return (
      pathname === "/" ||
      !nonDashboardRoutes.some((route) => pathname.startsWith(route))
    );
  };

  return (
    <aside className="w-64 bg-white shadow-sm min-h-[calc(100vh-5.1rem)] min-w-fit max-md:hidden">
      <nav className="p-4">
        <ul className="space-y-2">
          {routes.map((route) => (
            <li key={route.href}>
              <div
                className={`flex items-center space-x-3 px-3 py-2 ${
                  (route.href === "/" && isDashboardActive(pathname)) ||
                  (route.href !== "/" && pathname.startsWith(route.href))
                    ? "text-aqua-mist bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                } rounded-lg cursor-pointer`}
                onClick={() => onNavigate(route.href)}
              >
                <route.icon className="w-5 h-5" />
                <span className="font-medium">{route.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
