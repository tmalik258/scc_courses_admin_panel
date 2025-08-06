"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpDown, CheckCircleIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Breadcrumb } from "@/components/breadcrumb";
import { useStudentData } from "@/hooks/useStudentData";
import { useParams } from "next/navigation";
import { LumaSpin } from "@/components/luma-spin";
import { toast } from "sonner";
import ImageUploadWrapper from "@/components/image-upload-wrapper";
import { DashedSpinner } from "@/components/dashed-spinner";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { uploadImage } from "@/utils/supabase/uploadImage";
import { fetchImage } from "@/utils/supabase/fetchImage";
import { useRouter } from "next/navigation";
import { Student } from "@/types/student";

// Zod schema for student form validation
const studentSchema = z.object({
  id: z.string().min(1, "Student ID is required"),
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name must be less than 100 characters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[+]?[\d\s\-()]+$/, "Please enter a valid phone number"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  avatarUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

type StudentFormValues = z.infer<typeof studentSchema>;

const StudentDetailsPage: React.FC = () => {
  const router = useRouter();
  const { studentId } = useParams<{ studentId: string }>();
  const {
    students,
    selectedStudent,
    selectStudent,
    handleUpdateStudent,
    handleDeleteStudent,
    loading,
    error,
  } = useStudentData();

  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [displayImageUrl, setDisplayImageUrl] = useState<string | null>(
    selectedStudent?.avatarUrl || null
  );
  const [courses, setCourses] = useState<
    Array<{ id: string; title: string; category: string; status: string }>
  >([]);

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      id: "",
      fullName: "",
      phone: "",
      email: "",
      avatarUrl: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (studentId && selectStudent && !selectedStudent) {
      const student = students.find((s: { id: string }) => s.id === studentId);
      if (student) {
        selectStudent(student);
      }
    }
  }, [studentId, selectStudent, selectedStudent, students]);

  useEffect(() => {
    if (selectedStudent) {
      console.log("Selected student courses:", selectedStudent.purchases);
      form.reset({
        id: selectedStudent.id,
        fullName: selectedStudent.fullName || "",
        phone: selectedStudent.phone || "",
        email: selectedStudent.email || "",
        avatarUrl: selectedStudent.avatarUrl || "",
      });

      (async () => {
        if (selectedStudent?.avatarUrl && selectedStudent.avatarUrl !== null) {
          setDisplayImageUrl(await fetchImage(selectedStudent.avatarUrl));
        } else {
          setDisplayImageUrl(null);
        }
      })();
      setUploadedImageUrl(selectedStudent.avatarUrl || null);

      // Map purchases to courses
      const studentCourses =
        selectedStudent.purchases?.map((p) => ({
          id: p.course.id,
          title: p.course.title,
          category: p.course.category,
          status: p.createdAt ? "completed" : "ongoing",
        })) || [];
      setCourses(studentCourses);
    }
  }, [selectedStudent, form]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  const handleSave = async (data: StudentFormValues) => {
    console.log("Submitting update:", data);

    try {
      await handleUpdateStudent({
        ...selectedStudent,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        avatarUrl: data.avatarUrl || "",
      } as Student);

      toast.success("Student updated successfully!");
      router.push("/student-management");
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update student. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await handleDeleteStudent(form.getValues("id"));
        toast.success("Student deleted successfully!");
        window.history.back();
      } catch (error) {
        toast.error("Failed to delete student. Please try again.");
        console.error("Delete error:", error);
      }
    }
  };

  const updateFormData = useCallback(
    (data: Partial<StudentFormValues>) => {
      form.reset((prev) => ({ ...prev, ...data }));
    },
    [form]
  );

  const handleCancel = () => {
    window.history.back();
  };

  const handleRemoveCourse = (courseId: string) => {
    if (
      confirm("Are you sure you want to remove this course from the student?")
    ) {
      setCourses((prev) => prev.filter((course) => course.id !== courseId));
      toast.success("Course removed successfully!");
    }
  };

  // Handle file upload to Supabase
  const handleFileUpload = useCallback(
    async (files: FileWithPreview[]) => {
      if (!files.length) return;
      const file = files[0].file;
      if (!(file instanceof File)) return;

      setIsUploading(true);
      try {
        console.log("Starting upload:", file.name);
        const imageUrl = await uploadImage(file);
        if (!imageUrl) throw new Error("No URL returned");
        console.log("Upload URL:", imageUrl);

        setDisplayImageUrl(await fetchImage(imageUrl));
        form.setValue("avatarUrl", imageUrl, { shouldValidate: true }); // ✅ Important line
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [form]
  );

  // Handle file removal
  const handleFileRemove = useCallback(() => {
    console.log("Removing thumbnail");
    setUploadedImageUrl(null);
    updateFormData({
      avatarUrl: "",
    });
  }, [updateFormData]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            Completed
          </Badge>
        );
      case "ongoing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2" />
            Ongoing
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <div className="w-2 h-2 rounded-full bg-gray-500 mr-2" />
            {status}
          </Badge>
        );
    }
  };

  const breadcrumbItems = [
    { label: "Student Management", href: "/student-management" },
    { label: "Student Details", active: true },
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
          Student Details
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
            Delete Student
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              {/* Student ID */}
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Student ID" {...field} disabled />
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Student Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
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

      {/* Course Enrolled Section */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Course Enrolled
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courses.map((course, index) => (
                  <tr
                    key={`${course.id}-${index}`}
                    className="hover:bg-gray-50"
                  >
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
                        {course.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(course.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleRemoveCourse(course.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Remove course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">
              No courses enrolled
            </div>
            <div className="text-gray-400">
              This student has no courses enrolled yet
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDetailsPage;
