"use client";

import type React from "react";
import { useEffect, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCategoryData } from "@/hooks/useCategoryData";
import { DashedSpinner } from "@/components/dashed-spinner";
import { useInstructorData } from "@/hooks/useInstructorData";
import { uploadImage } from "@/utils/supabase/uploadImage";
import { CheckCircleIcon } from "lucide-react";
import { type FileWithPreview } from "@/hooks/use-file-upload";
import { toast } from "sonner";
import FileUploadWrapper from "@/components/file-upload-wrapper";
import RichTextEditor from "@/components/rich-text-editor";
import { useCourseData } from "@/hooks/useCourseData";
import { useParams } from "next/navigation";

const courseDetailsSchema = z.object({
  title: z
    .string()
    .min(1, "Course title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(100, "Description must be at least 100 characters")
    .max(1000, "Description must be less than 1000 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^₹?\d+(\.\d{1,2})?$/, "Please enter a valid price"),
  instructor: z.string().min(1, "Please select an instructor"),
});

type CourseDetailsFormValues = z.infer<typeof courseDetailsSchema>;

interface CourseDetailsStepProps {
  onNext: () => void;
}

const CourseDetailsStep: React.FC<CourseDetailsStepProps> = ({ onNext }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const { selectedCourse, handleUpdateCourse } = useCourseData();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    selectedCourse?.thumbnailUrl || null
  );

  const {
    categories,
    loading: categoryLoading,
    error: categoryError,
  } = useCategoryData();
  const {
    instructors,
    loading: instructorsLoading,
    error: instructorsError,
  } = useInstructorData();

  const form = useForm<CourseDetailsFormValues>({
    resolver: zodResolver(courseDetailsSchema),
    defaultValues: {
      title: selectedCourse?.title || "",
      description: selectedCourse?.description || "",
      category: selectedCourse?.category?.id || "",
      price: selectedCourse?.price?.toString() || "",
      instructor: selectedCourse?.instructor?.id || "",
    },
    mode: "onChange",
  });

  // Sync form with selectedCourse
  useEffect(() => {
    form.reset({
      title: selectedCourse?.title || "",
      description: selectedCourse?.description || "",
      category: selectedCourse?.category?.id || "",
      price: selectedCourse?.price?.toString() || "",
      instructor: selectedCourse?.instructor?.id || "",
    });
    setUploadedImageUrl(selectedCourse?.thumbnailUrl || null);
  }, [form, selectedCourse]);

  // Handle file upload
  const handleFileUpload = useCallback(
    async (files: FileWithPreview[]) => {
      if (!courseId || files.length === 0) return;

      const fileWithPreview = files[0];
      const file = fileWithPreview.file;

      if (!(file instanceof File)) return;

      setIsUploading(true);
      try {
        const imageUrl = await uploadImage(file);
        if (imageUrl) {
          setUploadedImageUrl(imageUrl);
          await handleUpdateCourse(courseId, { thumbnailUrl: imageUrl });
          toast.success("Thumbnail uploaded successfully!");
        } else {
          toast.error("Failed to upload thumbnail. Please try again.");
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error uploading image:", error.message);
        } else {
          console.error("Error uploading image:", error);
        }
        toast.error("An error occurred while uploading. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [courseId, handleUpdateCourse]
  );

  // Handle file removal
  const handleFileRemove = useCallback(async () => {
    if (!courseId) return;
    setIsUploading(true);
    setUploadedImageUrl(null);
    await handleUpdateCourse(courseId, { thumbnailUrl: null });
    setIsUploading(false);
  }, [courseId, handleUpdateCourse]);

  // Save and navigate
  const handleSave = useCallback(async () => {
    const values = form.getValues();
    if (!courseId) return;
    try {
      await handleUpdateCourse(courseId, {
        title: values.title,
        description: values.description,
        categoryId: values.category,
        price: values.price,
        instructorId: values.instructor,
        thumbnailUrl: uploadedImageUrl,
      });
      if (form.formState.isValid) {
        onNext();
      }
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error saving course details:", err.message);
        toast.error(err.message);
      } else {
        console.error("Error saving course details:", err);
        toast.error("Failed to save course details.");
      }
      toast.error("Failed to save course details.");
    }
  }, [form, courseId, handleUpdateCourse, uploadedImageUrl, onNext]);

  useEffect(() => {
    const subscription = form.watch(() => {
      if (form.formState.isValid) {
        handleSave();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, handleSave]);

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title</FormLabel>
                <FormControl>
                  <Input placeholder="Course Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              const plainTextLength = field.value
                ? field.value.replace(/<[^>]*>?/gm, "").trim().length
                : 0;
              const isValidLength =
                plainTextLength >= 100 && plainTextLength <= 1000;
              return (
                <FormItem>
                  <FormLabel>Course Description</FormLabel>
                  <FormControl>
                    <RichTextEditor onChange={field.onChange} content={field.value} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription
                    className={isValidLength ? "" : "text-red-500"}
                  >
                    Min 100 characters and max 1000 characters required (
                    {plainTextLength}/1000)
                  </FormDescription>
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                {categoryError ? (
                  <p className="text-red-500">{categoryError.message}</p>
                ) : (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        {categoryLoading ? (
                          <SelectValue placeholder={<DashedSpinner />} />
                        ) : (
                          <SelectValue placeholder="Choose Category" />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!categoryLoading &&
                        categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Example ₹1,350" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instructor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructor</FormLabel>
                {instructorsError ? (
                  <p className="text-red-500">{instructorsError.message}</p>
                ) : (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        {instructorsLoading ? (
                          <SelectValue placeholder={<DashedSpinner />} />
                        ) : (
                          <SelectValue placeholder="Choose Instructor Name" />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!instructorsLoading &&
                        instructors.map((instructor) => (
                          <SelectItem key={instructor.id} value={instructor.id}>
                            {instructor.fullName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="lg:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thumbnail
          </label>
          <div className="relative">
            <FileUploadWrapper
              onFilesAdded={handleFileUpload}
              onFileRemove={handleFileRemove}
              isUploading={isUploading}
              uploadedImageUrl={uploadedImageUrl}
              maxSizeMB={2}
            />
            {isUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl z-10">
                <div className="flex flex-col items-center gap-2">
                  <DashedSpinner />
                  <span className="text-sm text-gray-600">Uploading...</span>
                </div>
              </div>
            )}
          </div>
          {uploadedImageUrl && !isUploading && (
            <div className="mt-2 text-sm text-green-600 flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4" />
              Thumbnail uploaded successfully!
            </div>
          )}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-2 text-xs text-gray-500">
              Current URL: {uploadedImageUrl || "None"}
            </div>
          )}
        </div>
      </div>
    </Form>
  );
};

export default CourseDetailsStep;