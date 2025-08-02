"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { formSchema } from "@/form-schemas/category";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { uploadImage } from "@/utils/supabase/uploadImage";
import ImageUploadWrapper from "@/components/image-upload-wrapper";
import { DashedSpinner } from "@/components/dashed-spinner";
import { fetchImage } from "@/utils/supabase/fetchImage";

interface CategoryFormProps {
  onSubmit: (
    values: z.infer<typeof formSchema>,
    icon: string | null
  ) => Promise<boolean>;
}

export default function CategoryForm({ onSubmit }: CategoryFormProps) {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [displayImageUrl, setDisplayImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      isActive: true,
      icon: "",
    },
  });

  const handleDeleteImage = async () => {
    setDisplayImageUrl(null);
    setUploadedImageUrl(null);
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

          // Update the form field with the uploaded image URL
          form.setValue("icon", imageUrl);

          toast.success(
            "Thumbnail uploaded successfully! Click 'Create' to save."
          );
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
    [form]
  );

  return (
    <Form {...form}>
      <form
        id="category-form"
        onSubmit={form.handleSubmit((values) =>
          onSubmit(values, uploadedImageUrl)
        )}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
      >
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Category Name
                </FormLabel>
                <FormControl>
                  <Input {...field} className="focus:border-0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-medium text-gray-700">
                  Active
                </FormLabel>
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
                onFileRemove={handleDeleteImage}
                isUploading={isUploading}
                uploadedImageUrl={displayImageUrl}
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
      </form>
    </Form>
  );
}
