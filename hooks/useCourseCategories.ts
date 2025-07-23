import { Category } from "@/lib/generated/prisma";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
  error?: string;
}

export const useCourseCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/course-category");
      const json: CategoriesResponse = await res.json();
      if (json.success) {
        setCategories(json.data);
      } else {
        toast.error(json.error || "Failed to fetch categories");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error("Failed to fetch categories");
    }
  };

  const removeCategory = async (id: string) => {
    try {
      const res = await fetch(`/api/course-category/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setCategories((prev) => prev.filter((category) => category.id !== id));
        toast.success("Category deleted successfully");
      } else {
        throw new Error(json.error || "Failed to delete category");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error("Failed to delete category");
    }
  };

  return {
    categories,
    searchTerm,
    setSearchTerm,
    removeCategory,
  };
};

export const useCategoryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    status: "active" as "active" | "inactive",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    status?: string;
  }>({});

  const handleChange = useCallback(
    (field: keyof typeof formData, value: string) => {
      console.log("handleChange called:", { field, value });
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    []
  );

  const runValidation = useCallback(() => {
    const newErrors: { name?: string; status?: string } = {};
    if (!formData.name) {
      newErrors.name = "Category name is required";
    }
    if (!formData.status) {
      newErrors.status = "Status is required";
    }
    setErrors(newErrors);
    console.log("runValidation result:", {
      valid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    });
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  return {
    formData,
    handleChange,
    runValidation,
    errors,
  };
};
