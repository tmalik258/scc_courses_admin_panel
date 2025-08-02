"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpDown, CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Breadcrumb } from "@/components/breadcrumb";
import { useInstructorData } from "@/hooks/useInstructorData";
import { useParams } from "next/navigation";
import { LumaSpin } from "@/components/luma-spin";
import { toast } from "sonner";
import ImageUploadWrapper from "@/components/image-upload-wrapper";
import { DashedSpinner } from "@/components/dashed-spinner";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { uploadImage } from "@/utils/supabase/uploadImage";
import { fetchImage } from "@/utils/supabase/fetchImage";

// Zod schema for instructor form validation
const instructorSchema = z.object({
  id: z.string().min(1, "Instructor ID is required"),
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be less than 100 characters"),
  role: z.string().min(1, "Role is required"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  phone: z
    .string()
    .regex(/^[+]?[\d\s\-()]+$/, "Please enter a valid phone number")
    .optional(),
  avatarUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

type InstructorFormValues = z.infer<typeof instructorSchema>;

const InstructorDetailsPage: React.FC = () => {
  const { instructorId } = useParams<{ instructorId: string }>();
  const {
    selectedInstructor,
    selectInstructor,
    handleUpdateInstructor,
    handleDeleteInstructor,
    loading,
    error,
  } = useInstructorData();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [displayImageUrl, setDisplayImageUrl] = useState<string | null>(
    selectedInstructor?.avatarUrl || null
  );

  const form = useForm<InstructorFormValues>({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      id: "",
      fullName: "",
      role: "",
      bio: "",
      phone: "",
      avatarUrl: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (instructorId && selectInstructor && !selectedInstructor) {
      selectInstructor(instructorId as string);
    }
  }, [instructorId, selectInstructor, selectedInstructor]);

  useEffect(() => {
    if (selectedInstructor) {
      console.log(
        "Selected instructor courses:",
        selectedInstructor.instructorCourses
      );
      form.reset({
        id: selectedInstructor.id,
        fullName: selectedInstructor.fullName || "",
        role: selectedInstructor.role || "",
        bio: selectedInstructor.bio || "",
        phone: selectedInstructor.phone || "",
        avatarUrl: selectedInstructor.avatarUrl || "",
      });
      (async () => {
        if (
          selectedInstructor?.avatarUrl &&
          selectedInstructor.avatarUrl !== null
        ) {
          setDisplayImageUrl(await fetchImage(selectedInstructor.avatarUrl));
        } else {
          setDisplayImageUrl(null);
        }
      })();
      setUploadedImageUrl(selectedInstructor.avatarUrl || null);
    }
  }, [selectedInstructor, form]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  const handleSave = async (data: InstructorFormValues) => {
    try {
      await handleUpdateInstructor(data.id, {
        fullName: data.fullName,
        role: data.role,
        bio: data.bio || "",
        phone: data.phone || "",
        avatarUrl: data.avatarUrl || "",
      });
      toast.success("Instructor updated successfully!");
    } catch (error) {
      toast.error("Failed to update instructor. Please try again.");
      console.error("Update error:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this instructor?")) {
      try {
        await handleDeleteInstructor(form.getValues("id"));
        toast.success("Instructor deleted successfully!");
        window.history.back();
      } catch (error) {
        toast.error("Failed to delete instructor. Please try again.");
        console.error("Delete error:", error);
      }
    }
  };

  const updateFormData = useCallback(
    (data: Partial<InstructorFormValues>) => {
      form.reset((prev) => ({ ...prev, ...data }));
    },
    [form]
  );

  const handleCancel = () => {
    window.history.back();
  };

  // Handle file upload to Supabase
  const handleFileUpload = useCallback(
    async (files: FileWithPreview[]) => {
      if (files.length === 0) return;

      const fileWithPreview = files[0];
      const file = fileWithPreview.file;

      if (!(file instanceof File)) return;

      setIsUploading(true);

      try {
        console.log("Starting upload for file:", file.name);
        const imageUrl = await uploadImage(file);

        if (imageUrl) {
          console.log("Upload successful, URL:", imageUrl);
          setUploadedImageUrl(imageUrl);

          setDisplayImageUrl(await fetchImage(imageUrl));

          // Update form data immediately with the uploaded URL
          updateFormData({
            avatarUrl: imageUrl,
          });

          toast.success("Thumbnail uploaded successfully!");
        } else {
          console.error("Upload failed - no URL returned");
          toast.error("Failed to upload thumbnail. Please try again.");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("An error occurred while uploading. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [updateFormData]
  );

  // Handle file removal
  const handleFileRemove = useCallback(() => {
    console.log("Removing thumbnail");
    setUploadedImageUrl(null);
    updateFormData({
      avatarUrl: "",
    });
  }, [updateFormData]);

  const breadcrumbItems = [
    { label: "Instructor Management", href: "/instructor-management" },
    { label: "Instructor Details", active: true },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LumaSpin />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Instructor Details
        </h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-6 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(handleSave)}
            disabled={!form.formState.isValid || form.formState.isSubmitting}
            className="bg-sky-500 hover:bg-sky-600 px-6 disabled:opacity-50"
          >
            {form.formState.isSubmitting ? "Saving..." : "Save Profile"}
          </Button>
          <Button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-6"
          >
            Delete Instructor
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Instructor ID */}
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instructor ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Instructor ID" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Instructor Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Instructor Role"
                        {...field}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Input placeholder="Bio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Column - Profile Upload */}
            <div className="lg:col-span-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile
                </label>

                {/* File Upload Component with custom handlers */}
                <div className="relative">
                  <ImageUploadWrapper
                    onFilesAdded={handleFileUpload}
                    onFileRemove={handleFileRemove}
                    isUploading={isUploading}
                    uploadedImageUrl={displayImageUrl}
                    maxSizeMB={2}
                  />

                  {/* Upload Status Overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl z-10">
                      <div className="flex flex-col items-center gap-2">
                        <DashedSpinner />
                        <span className="text-sm text-gray-600">
                          Uploading...
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Success Message */}
                {uploadedImageUrl && !isUploading && (
                  <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    Thumbnail uploaded successfully!
                  </div>
                )}

                {/* Debug info - remove in production */}
                {process.env.NODE_ENV === "development" && (
                  <div className="mt-2 text-xs text-gray-500">
                    Current URL: {uploadedImageUrl || "None"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>

      {/* Course Assigned Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Course Assigned
        </h2>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Course ID</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <span>Course Title</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Lessons
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedInstructor?.instructorCourses?.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{course.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {course.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {course.category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {course.totalLessons}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {(!selectedInstructor?.instructorCourses ||
          selectedInstructor.instructorCourses.length === 0) && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              No courses assigned
            </div>
            <div className="text-gray-400">
              This instructor has no courses assigned yet
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDetailsPage;
