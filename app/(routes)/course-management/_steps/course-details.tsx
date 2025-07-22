"use client";

import type React from "react";
import { useEffect, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { CourseFormData } from "@/types/course";
import { useCategoryData } from "@/hooks/useCategoryData";
import { DashedSpinner } from "@/components/dashed-spinner";
import { useInstructorData } from "@/hooks/useInstructorData";
import { uploadImage } from "@/utils/supabase/uploadImage";
import { CheckCircleIcon } from "lucide-react";
import { type FileWithPreview } from "@/hooks/use-file-upload";
import { toast } from "sonner";
import FileUploadWrapper from "@/components/file-upload-wrapper";

const LOCAL_STORAGE_KEY = "courseDetailsStepData";

interface CourseDetailsStepProps {
  formData: CourseFormData;
  updateFormData: (data: Partial<CourseFormData>) => void;
  setCanProceed: (canProceed: boolean) => void;
}

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

const CourseDetailsStep: React.FC<CourseDetailsStepProps> = ({
  formData,
  updateFormData,
  setCanProceed,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(
    formData.thumbnailUrl || null
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
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: formData.price,
      instructor: formData.instructor,
    },
    mode: "onChange",
  });

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      form.reset(parsed);
      updateFormData(parsed);
    }
  }, [form, updateFormData]);

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

          // Update form data immediately with the uploaded URL
          updateFormData({
            thumbnailUrl: imageUrl,
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
      thumbnailUrl: "",
    });
  }, [updateFormData]);

  // Update form data when uploadedImageUrl changes
  useEffect(() => {
    if (uploadedImageUrl && uploadedImageUrl !== formData.thumbnailUrl) {
      updateFormData({
        thumbnailUrl: uploadedImageUrl,
      });
    }
  }, [uploadedImageUrl, formData.thumbnailUrl, updateFormData]);

  // Validate form on mount and when values change
  useEffect(() => {
    const isFormValid = form.formState.isValid;
    setCanProceed(isFormValid);

    const subscription = form.watch((values) => {
      const timeout = setTimeout(() => {
        const newData = {
          title: values.title || "",
          description: values.description || "",
          category: values.category || "",
          price: values.price || "",
          instructor: values.instructor || "",
        };

        updateFormData(newData);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));

        setCanProceed(form.formState.isValid);
      }, 300);

      return () => clearTimeout(timeout);
    });

    return () => subscription.unsubscribe();
  }, [form, updateFormData, setCanProceed]);

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Title */}
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

          {/* Course Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Description</FormLabel>
                <FormControl>
                  <div>
                    {/* Rich Text Editor Toolbar */}
                    <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex items-center gap-2 flex-wrap">
                      <Select defaultValue="normal">
                        <SelectTrigger className="w-20 h-8 text-xs">
                          <SelectValue placeholder="Normal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="h1">H1</SelectItem>
                          <SelectItem value="h2">H2</SelectItem>
                          <SelectItem value="h3">H3</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          type="button"
                        >
                          <span className="font-bold">B</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          type="button"
                        >
                          <span className="italic">I</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          type="button"
                        >
                          <span className="underline">U</span>
                        </Button>
                      </div>
                      <div className="w-px h-6 bg-gray-300"></div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          type="button"
                        >
                          ≡
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          type="button"
                        >
                          ≡
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          type="button"
                        >
                          ≡
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          type="button"
                        >
                          ≡
                        </Button>
                      </div>
                      <div className="w-px h-6 bg-gray-300"></div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          type="button"
                        >
                          {"<>"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          type="button"
                        >
                          {'"'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          type="button"
                        >
                          •
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          type="button"
                        >
                          1.
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      placeholder="Course Description....."
                      className="min-h-[200px] rounded-t-none border-t-0 resize-none"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormDescription className="text-red-500">
                  Min 100 characters and max 1000 characters required (
                  {(field.value || "").length}/1000)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
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

          {/* Price */}
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

          {/* Instructor */}
          <FormField
            control={form.control}
            name="instructor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructor</FormLabel>
                {instructorsError ? (
                  <p>{instructorsError.message}</p>
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

        {/* Right Column - Thumbnail Upload */}
        <div className="lg:col-span-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail
            </label>

            {/* File Upload Component with custom handlers */}
            <div className="relative">
              <FileUploadWrapper
                onFilesAdded={handleFileUpload}
                onFileRemove={handleFileRemove}
                isUploading={isUploading}
                uploadedImageUrl={uploadedImageUrl}
                maxSizeMB={2}
              />

              {/* Upload Status Overlay */}
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl z-10">
                  <div className="flex flex-col items-center gap-2">
                    <DashedSpinner />
                    <span className="text-sm text-gray-600">Uploading...</span>
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
    </Form>
  );
};

export default CourseDetailsStep;
