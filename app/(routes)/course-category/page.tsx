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
import { useCourseCategories } from "@/hooks/useCourseCategories";
import { CategoryWithRelations } from "@/types/category";

export default function CourseCategoryPage() {
  const router = useRouter();
  const { categories, setSearchTerm, searchTerm, removeCategory } =
    useCourseCategories();

  const handleDelete = async (id: string) => {
    try {
      await removeCategory(id);
    } catch (err) {
      console.error("Error deleting category:", err);
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

  const placeholderImage =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACVSURBVHhe7dNBCQAwDAPB7v8v2C5p6CkI/IEeCmxEyAAzQz8wk2nGImYg3yI4gD0oIAACCCCAgAAIIIAAAggggAACCCCAgAAIIIAAAggggAACCCCAgAAIIIAAAggggAACCCCAgAAIIIAAAggggAACCCCAgAAIIIAAAggggAACCCCAgAAIIIAAAggggAACCCCAgAAIIIAAAggggAACCCDgB3eW0z6vA1yMAAAAAElFTkSuQmCC";

  // Sort categories by createdAt and assign displayId
  const sortedCategories = [...categories].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

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
            onClick={() =>
              router.push("/course-category/steps/category-details")
            }
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
              <TableHead>Courses</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              sortedCategories.map(
                (category: CategoryWithRelations, index: number) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-mono text-sm text-gray-600">
                      {`67775f553-${index + 1}`}
                    </TableCell>
                    <TableCell>
                      <div className="h-8 w-8">
                        <Image
                          src={
                            isValidImageSrc(category.icon)
                              ? category.icon!
                              : placeholderImage
                          }
                          alt={category.name}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {category.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          category.status === "active" ? "default" : "secondary"
                        }
                        className={
                          category.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                        }
                      >
                        {category.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-700">
                        {category.courses?.length ?? 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() =>
                            router.push(
                              `/course-category/steps/edit-category?id=${category.id}`
                            )
                          }
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 border-sky-200 text-sky-600 hover:bg-sky-50 bg-transparent"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(category.id)}
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
