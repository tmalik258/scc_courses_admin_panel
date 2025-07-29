"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  DollarSign,
  LayoutDashboard,
  Search,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { signout } from "@/actions/auth";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { DashedSpinner } from "./dashed-spinner";

const Header = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Initial fetch of user
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
    };
    fetchUser();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === "SIGNED_OUT") {
        router.push("/login");
      }
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [supabase.auth, router]);

  const handleRedirect = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const dashboardItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
    },
    {
      id: "course-management",
      label: "Course Management",
      icon: BookOpen,
      href: "/course-management",
    },
    {
      id: "instructor-management",
      label: "Instructor Management",
      icon: Users,
      href: "/instructor-management",
    },
    {
      id: "student-management",
      label: "Student Management",
      icon: Users,
      href: "/student-management",
    },
    {
      id: "payment-management",
      label: "Payment",
      icon: DollarSign,
      href: "/payment-management",
    },
  ];

  const handleSignout = async () => {
    setIsLoggingOut(true);
    const result = await signout();
    if (result?.error) {
      toast.error(result.error);
    }
    setIsLoggingOut(false);
  };

  return (
    <>
      <header className="flex sticky top-0 z-50 items-center justify-between px-4 md:px-6 py-4 border-b border-gray-100 bg-white">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.89 8.66699H27.7789M5.55664 17.0003H27.7789H9.72331M5.55664 25.3337H19.4455"
              stroke="#1C1C1C"
              strokeWidth="1.5625"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Logo */}
        <div className="flex items-center flex-1">
          <div className="w-20 h-10 md:h-12 bg-white rounded-full flex items-center justify-center">
            <div
              className="flex items-center justify-center w-full h-full cursor-pointer"
              onClick={() => handleRedirect("/")}
            >
              <Image
                src="/logo.png"
                width={150}
                height={150}
                decoding="async"
                className="w-full h-full object-contain"
                alt="logo"
              />
            </div>
          </div>
        </div>

        {/* User Section */}
        <div className="flex items-center space-x-3 md:flex-1 justify-end">
          <div className="md:hidden mr-2">
            <Search className="w-5 h-5 text-gray-600" />
          </div>
          {user ? (
            // Admin Dropdown
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 focus:outline-none cursor-pointer">
                <Image
                  src={user?.app_metadata?.avatar_url || "/images/profile.jpg"}
                  width={30}
                  height={30}
                  decoding="async"
                  className="w-8 h-8 md:w-10 md:h-10 rounded-lg object-cover object-top"
                  alt="Profile"
                />
                <span className="text-gray-700 hidden md:block">
                  {user?.app_metadata?.full_name}
                </span>
                <svg
                  className="w-4 h-4 text-gray-400 hidden md:block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="!all-[initial]">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem> */}
                {/* <DropdownMenuSeparator /> */}
                <DropdownMenuItem
                  className="text-red-600 cursor-pointer"
                  onClick={handleSignout}
                >
                  {isLoggingOut && <DashedSpinner className="mr-2" />}
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Login buttons
            <div className="flex items-center space-x-2 md:space-x-3">
              <button
                onClick={() => handleRedirect("/login")}
                className="text-gray-700 md:hover:text-aqua-mist max-md:px-4 max-md:py-2 max-md:rounded-md max-md:bg-aqua-mist max-md:hover:bg-aqua-depth max-md:text-white transition-colors cursor-pointer text-sm md:text-base px-2 md:px-0"
              >
                Log in
              </button>
              <Button
                onClick={() => handleRedirect("/signup")}
                className="bg-aqua-mist hover:bg-aqua-depth cursor-pointer text-sm md:text-base px-3 md:px-4 py-2 max-md:hidden"
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`${
          isMobileMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        } md:hidden fixed top-0 z-50 bg-black bg-opacity-50 transition-all duration-300 ease-in-out`}
        onClick={toggleMobileMenu}
      >
        <div
          className={`bg-white w-screen ${
            isMobileMenuOpen ? "clip-path-inset-0" : "clip-path-inset-full"
          } transition-all duration-300 ease-in-out shadow-lg`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="w-14 flex items-center space-x-2">
              <Image
                src="/logo.png"
                width={150}
                height={150}
                decoding="async"
                className="w-full h-fullobject-contain"
                alt="logo"
              />
            </div>
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Mobile Navigation */}
          <nav className="p-4 space-y-4">
            {dashboardItems.map((item) => (
              <div
                key={item.href}
                onClick={() => handleRedirect(item.href)}
                className="flex gap-4 items-center text-gray-700 hover:text-aqua-mist transition-colors cursor-pointer py-2 px-3 rounded-lg hover:bg-gray-50"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </div>
            ))}

            {/* Mobile Auth Section */}
            {!user && (
              <div className="pt-4 border-t border-gray-200 space-y-3">
                <button
                  onClick={() => handleRedirect("/login")}
                  className="block w-full text-left text-gray-700 hover:text-aqua-mist transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
                >
                  Log in
                </button>
                <Button
                  onClick={() => handleRedirect("/signup")}
                  className="w-full bg-aqua-mist hover:bg-aqua-depth"
                >
                  Register
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
