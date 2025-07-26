"use client";

import type React from "react";
import { useEffect, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { useCourseData } from "@/hooks/useCourseData";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

const resourceSchema = z.object({
  title: z.string().min(1, "Resource title is required"),
  url: z.string().url("Invalid URL").min(1, "Resource URL is required"),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

interface ResourcesStepProps {
  onPrev: () => void;
}

const ResourcesStep: React.FC<ResourcesStepProps> = ({ onPrev }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const { selectedCourse, isUpdating, handleUpdateResource, handleUpdateCourse } = useCourseData();
  const [resourceId, setResourceId] = useState<string | undefined>(
    selectedCourse?.resources[0]?.id
  );
  const router = useRouter();

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: selectedCourse?.resources[0]?.title || "",
      url: selectedCourse?.resources[0]?.url || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const firstResource = selectedCourse?.resources[0];
    form.reset({
      title: firstResource?.title || "",
      url: firstResource?.url || "",
    });
    setResourceId(firstResource?.id);
  }, [form, selectedCourse]);

  const handleSave = useCallback(async () => {
    if (!courseId || !resourceId) return;
    try {
      const values = form.getValues();
      await handleUpdateResource(courseId, resourceId, {
        title: values.title,
        url: values.url,
      });
      await handleUpdateCourse(courseId, { isPublished: true });
      toast.success("Course published successfully!");
      router.push("/course-management");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error saving resource details:", err.message);
      } else {
        console.error("Error saving resource details:", err);
      }
      toast.error("Failed to save resource details.");
    }
  }, [courseId, resourceId, form, handleUpdateResource, handleUpdateCourse, router]);

  useEffect(() => {
    const subscription = form.watch(() => {
      if (form.formState.isValid) {
        handleSave();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, handleSave]);

  const handlePrevious = useCallback(() => {
    if (typeof onPrev === 'function' && !isUpdating) {
      onPrev();
    }
  }, [isUpdating, onPrev]);

  return (
    <Form {...form}>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource Title</FormLabel>
              <FormControl>
                <Input placeholder="Resource Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/resource" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isUpdating}
          className="px-6 bg-transparent"
        >
          Previous
        </Button>
      </div>
    </Form>
  );
};

export default ResourcesStep;