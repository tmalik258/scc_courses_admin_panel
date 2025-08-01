"use client";

import { useRouter } from "next/navigation";
import { Plus, Search, ArrowUpDown, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Category } from "@/lib/generated/prisma";
import { categoryStyles } from "@/lib/categoryStyles";
import { useCategoryData } from "@/hooks/useCategoryData";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { DashedSpinner } from "@/components/dashed-spinner";
import { fetchImage } from "@/utils/supabase/fetchImage";

export default function CourseCategoryPage() {
  const router = useRouter();
  const {
    categories,
    loading,
    deleting,
    refreshCategories,
    handleDeleteCategory,
  } = useCategoryData();
  const [searchTerm, setSearchTerm] = useState<string>("");

  const placeholderImage =
  "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80";

  useEffect(() => {
    if (categories.length === 0) {
      refreshCategories();
    }
  }, [categories.length, refreshCategories]);

  const handleDelete = async (id: string) => {
    try {
      await handleDeleteCategory(id);
      toast.success("Category deleted successfully!");
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error("Failed to delete category");
    }
  };

  const isValidImageSrc = (src: string | undefined | null): boolean => {
    return (
      !!src &&
      (src.startsWith("/") ||
        src.startsWith("http://") ||
        src.startsWith("https://"))
    );
  };


  const setIcon = async (icon: string | null) => {
    if (icon && icon !== null && isValidImageSrc(icon)) {
      return await fetchImage(icon);
    } else {
      return placeholderImage
    }
  };


  const sortedCategories = [...categories].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const getCategoryStyle = (name: string) => {
    return (
      categoryStyles.find((c) => c.name === name) || {
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
      }
    );
  };

  const CategoryIcon = ({ icon, alt }: { icon: string | null, alt: string }) => {
    const [src, setSrc] = useState<string>(placeholderImage);

    useEffect(() => {
      let isMounted = true;
      setIcon(icon).then((result) => {
        if (isMounted && result) setSrc(result);
      });
      return () => { isMounted = false; };
    }, [icon]);

    return (
      <Image
        src={src}
        alt={alt}
        width={32}
        height={32}
        className="rounded-full w-full h-full object-cover"
      />
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-900">
              Course Categories{" "}
              <span className="text-gray-500">({categories.length})</span>
            </h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
          <Button
            onClick={() => router.push("/course-category/create")}
            className="bg-sky-500 hover:bg-sky-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Category ID</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Name <ArrowUpDown className="w-4 h-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <div className="flex justify-center">
                    <DashedSpinner />
                  </div>
                </TableCell>
              </TableRow>
            ) : sortedCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              sortedCategories.map((category: Category) => {
                const { bgColor, textColor } = getCategoryStyle(category.name);
                return (
                  <TableRow key={category.id}>
                    <TableCell className="font-mono text-sm text-gray-600">
                      {category.id}
                    </TableCell>
                    <TableCell>
                      <div className="h-8 w-8">
                        <CategoryIcon icon={category.icon} alt={category.name} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${bgColor} ${textColor} font-medium`}>
                        {category.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={category.isActive ? "default" : "secondary"}
                        className={
                          category.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                        }
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() =>
                            router.push(`/course-category/edit/${category.id}`)
                          }
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 border-sky-200 text-sky-600 hover:bg-sky-50 bg-transparent cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(category.id)}
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 border-red-200 text-red-600 hover:bg-red-50 bg-transparent cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={deleting}
                        >
                          {deleting ? (
                            <DashedSpinner />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
