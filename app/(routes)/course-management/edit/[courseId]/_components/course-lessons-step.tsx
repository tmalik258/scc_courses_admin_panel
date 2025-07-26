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
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useCourseData } from "@/hooks/useCourseData";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const moduleSchema = z.object({
  title: z.string().min(1, "Module title is required"),
  lessons: z
    .array(
      z.object({
        name: z.string().min(1, "Lesson name is required"),
        videoUrl: z.string().url("Invalid URL").optional(),
        isFree: z.boolean(),
      })
    )
    .min(1, "At least one lesson is required"),
});

type ModuleFormValues = z.infer<typeof moduleSchema>;

interface CourseLessonsStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const CourseLessonsStep: React.FC<CourseLessonsStepProps> = ({ onNext, onPrev }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const { selectedCourse, isUpdating, handleUpdateModule } = useCourseData();
  const [moduleId, setModuleId] = useState<string | undefined>(
    selectedCourse?.modules[0]?.id
  );

  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: selectedCourse?.modules[0]?.title || "",
      lessons:
        selectedCourse?.modules[0]?.lessons?.map(lesson => ({
          name: lesson.name || "",
          videoUrl: lesson.videoUrl || "",
          isFree: lesson.isFree !== undefined ? Boolean(lesson.isFree) : false,
        })) || [{ name: "", videoUrl: "", isFree: false }],
    },
    mode: "onChange",
  });

  useEffect(() => {
    const firstModule = selectedCourse?.modules[0];
    form.reset({
      title: firstModule?.title || "",
      lessons:
        firstModule?.lessons?.map(lesson => ({
          name: lesson.name || "",
          videoUrl: lesson.videoUrl || "",
          isFree: lesson.isFree !== undefined ? Boolean(lesson.isFree) : false,
        })) || [{ name: "", videoUrl: "", isFree: false }],
    });
    setModuleId(firstModule?.id);
  }, [selectedCourse, form]);

  const handleSave = useCallback(async () => {
    if (!courseId || !moduleId) return;
    try {
      const values = form.getValues();
      await handleUpdateModule(courseId, moduleId, {
        title: values.title,
        lessons: values.lessons,
      });
      onNext();
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error saving module details:", err.message);
      } else {
        console.error("Error saving module details:", err);
      }
      toast.error("Failed to save module details.");
    }
  }, [courseId, moduleId, form, handleUpdateModule, onNext]);

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
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Module Title</FormLabel>
              <FormControl>
                <Input placeholder="Module Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("lessons").map((_, index) => (
          <div key={index} className="space-y-2">
            <FormField
              control={form.control}
              name={`lessons.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lesson {index + 1} Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Lesson Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`lessons.${index}.videoUrl`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/video" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`lessons.${index}.isFree`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Free Access</FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={isUpdating}
          className="px-6 bg-transparent"
        >
          Previous
        </Button>
      </div>
    </Form>
  );
};

export default CourseLessonsStep;