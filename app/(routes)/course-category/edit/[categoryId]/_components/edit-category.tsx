"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, RotateCcw, Trash2 } from "lucide-react";
import { useCategoryForm } from "@/hooks/useCourseCategories";
import { uploadImage } from "@/utils/supabase/uploadImage";
import { Category } from "@/lib/generated/prisma";
import Image from "next/image";

interface EditCategoryPageProps {
  category: Category;
  categoryId: string;
}

export default function EditCategory({
  category,
  categoryId,
}: EditCategoryPageProps) {
  const router = useRouter();
  const { formData, handleChange, runValidation, errors } = useCategoryForm();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [existingIcon, setExistingIcon] = useState<string | null>(
    category.icon
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      toast.error("Category ID is required");
      router.push("/course-category");
      return;
    }

    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/course-category/${categoryId}`);
        const json: {
          success: boolean;
          data: Category;
          error?: string;
        } = await res.json();

        if (!json.success) {
          throw new Error(json.error || "Failed to fetch category");
        }

        const category = json.data;
        handleChange("name", category.name);
        handleChange("status", category.isActive ? "active" : "inactive");
        setExistingIcon(category.icon);
        setLoading(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch category"
        );
        toast.error("Failed to fetch category");
        router.push("/course-category");
      }
    };

    fetchCategory();
  }, [router, handleChange, categoryId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnail(file);
  };

  const handleDeleteImage = async () => {
    try {
      const res = await fetch(`/api/course-category/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          status: formData.status,
          thumbnail: "", // clears icon
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to delete image");
      }

      setExistingIcon(null);
      setThumbnail(null);
      toast.success("Image deleted successfully");
    } catch (err) {
      console.error("Error deleting image:", err);
      toast.error("Failed to delete image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!runValidation()) {
      toast.error("Please fix the form errors");
      return;
    }

    try {
      let thumbnailUrl = existingIcon;

      if (thumbnail) {
        thumbnailUrl = await uploadImage(thumbnail);
        if (!thumbnailUrl) {
          toast.error("Image upload failed");
          return;
        }
      }

      const res = await fetch(`/api/course-category/${categoryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          status: formData.status,
          thumbnail: thumbnailUrl || "",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to update category");
      }

      toast.success("Category updated successfully");
      router.push("/course-category");
    } catch (err) {
      console.error("Error updating category:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to update category"
      );
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-600">Error: {error}</p>
          <Button onClick={() => router.push("/course-category")}>
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="min-h-screen bg-white p-6">Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <span>Course Category</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-blue-500">Edit Category</span>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Edit Category
          </h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="px-6 bg-transparent"
              onClick={() => router.push("/course-category")}
            >
              Cancel
            </Button>
            <Button
              className="px-6 bg-blue-500 hover:bg-blue-600"
              onClick={handleSubmit}
            >
              Save Category
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="categoryId"
                className="text-sm font-medium text-gray-700"
              >
                Category ID
              </Label>
              <Input
                id="categoryId"
                value={categoryId || ""}
                readOnly
                className="bg-gray-50 text-gray-600"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="categoryName"
                className="text-sm font-medium text-gray-700"
              >
                Category Name
              </Label>
              <Input
                id="categoryName"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="border-gray-300"
              />
              {errors.name && (
                <span className="text-red-600 text-sm">{errors.name}</span>
              )}
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                Status
              </Label>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="active"
                    name="status"
                    value="active"
                    checked={formData.status === "active"}
                    onChange={() => handleChange("status", "active")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <Label
                    htmlFor="active"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Active
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="inactive"
                    name="status"
                    value="inactive"
                    checked={formData.status === "inactive"}
                    onChange={() => handleChange("status", "inactive")}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <Label
                    htmlFor="inactive"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Inactive
                  </Label>
                </div>
              </div>
              {errors.status && (
                <span className="text-red-600 text-sm">{errors.status}</span>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <Label className="text-sm font-medium text-gray-700">Logo</Label>
            <div className="w-48 h-48 bg-purple-100 rounded-2xl flex items-center justify-center">
              {existingIcon ? (
                <Image
                  width={100}
                  height={100}
                  src={existingIcon}
                  alt="Category thumbnail"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className="w-20 h-20 relative">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full text-purple-600"
                    fill="currentColor"
                  >
                    <path d="M50 15C35 15 23 27 23 42v16c0 4 3 7 7 7h4c4 0 7-3 7-7V42c0-10 8-18 18-18s18 8 18 18v16c0 4 3 7 7 7h4c4 0 7-3 7-7V42c0-15-12-27-27-27z" />
                    <circle cx="30" cy="50" r="3" />
                    <circle cx="70" cy="50" r="3" />
                    <circle cx="45" cy="45" r="2" />
                    <circle cx="55" cy="45" r="2" />
                    <path d="M45 65c0 3 2 5 5 5s5-2 5-5v-5h-10v5z" />
                    <path d="M40 70h20c2 0 4 2 4 4s-2 4-4 4H40c-2 0-4-2-4-4s2-4 4-4z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 p-0 h-auto font-normal"
                asChild
              >
                <label>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Change Image
                  <Input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </Button>
              {existingIcon && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 p-0 h-auto font-normal"
                  onClick={handleDeleteImage}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Image
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
