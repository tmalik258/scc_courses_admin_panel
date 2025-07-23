"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useCategoryForm } from "@/hooks/useCourseCategories";
import { toast } from "sonner";
import { useState } from "react";

export default function CategoryDetailsPage() {
  const router = useRouter();
  const { formData, handleChange, runValidation, errors } = useCategoryForm();
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnail(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!runValidation()) {
      toast.error("Please fix the form errors");
      return;
    }
    if (!thumbnail) {
      toast.error("Thumbnail is required");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("thumbnail", thumbnail);

      const res = await fetch("/api/course-category", {
        method: "POST",
        body: formDataToSend,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to create category");
      }

      toast.success("Category created successfully");
      router.push("/course-category");
    } catch (err) {
      console.error("Error creating category:", err);
      toast.error(
        "Failed to create category: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <span>Course Category</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-blue-500">Category Details</span>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Category Details
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
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
                placeholder="Category Name"
                className="w-full"
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
                    className="w-4 h-4 text-blue-600 border-gray-300"
                  />
                  <Label htmlFor="active" className="text-sm cursor-pointer">
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
                    className="w-4 h-4 text-blue-600 border-gray-300"
                  />
                  <Label htmlFor="inactive" className="text-sm cursor-pointer">
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
            <Card className="border-2 border-dashed border-gray-200 bg-gray-50">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Category icon preview"
                    className="mt-2 h-16 w-16 object-cover rounded-full"
                  />
                )}
                <p className="text-sm text-gray-500 mt-2">Max file size: 2MB</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
