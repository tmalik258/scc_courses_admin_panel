"use client";

import type React from "react";
import { useEffect, useCallback, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { useCourseData } from "@/hooks/useCourseData";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import ModuleSection from "./module-form";
import { useFieldArray } from "react-hook-form";
import { Plus } from "lucide-react";
import { DashedSpinner } from "@/components/dashed-spinner";
import { CourseLessonsFormValues, moduleSchema } from "@/form-schemas/course";

interface CourseLessonsStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const CourseLessonsStep: React.FC<CourseLessonsStepProps> = ({
  onNext,
  onPrev,
}) => {
  const { courseId } = useParams<{ courseId: string }>();
  const {
    selectCourse,
    selectedCourse,
    isCreating,
    isUpdating,
    handleUpdateModule,
    handleCreateModule,
    handleDeleteModule,
  } = useCourseData();
  const [expandedModule, setExpandedModule] = useState<number | null>(0);

  useEffect(() => {
    if (courseId) {
      selectCourse(courseId);
    }
  }, [courseId, selectCourse]);

  const form = useForm<CourseLessonsFormValues>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      modules: selectedCourse?.modules?.length
        ? selectedCourse.modules.map((module) => ({
            id: module.id || undefined,
            title: module.title || "",
            lessons: module.lessons?.map((lesson) => ({
              title: lesson.title || "",
              content: lesson.content || "",
              video_url: lesson.video_url || "",
              is_free:
                lesson.is_free !== undefined ? Boolean(lesson.is_free) : false,
            })) || [{ title: "", content: "", video_url: "", is_free: false }],
          }))
        : [
            {
              id: undefined,
              title: "",
              lessons: [
                { title: "", content: "", video_url: "", is_free: false },
              ],
            },
          ],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "modules",
  });

  useEffect(() => {
    const modules = selectedCourse?.modules?.length
      ? selectedCourse.modules.map((module) => ({
          id: module.id || undefined,
          title: module.title || "",
          lessons: module.lessons?.map((lesson) => ({
            title: lesson.title || "",
            content: lesson.content || "",
            video_url: lesson.video_url || "",
            is_free:
              lesson.is_free !== undefined ? Boolean(lesson.is_free) : false,
          })) || [{ title: "", content: "", video_url: "", is_free: false }],
        }))
      : [
          {
            id: undefined,
            title: "",
            lessons: [
              { title: "", content: "", video_url: "", is_free: false },
            ],
          },
        ];
    form.reset({ modules });
    if (modules.length > 0) setExpandedModule(0);
    else setExpandedModule(null);
  }, [selectedCourse, form]);

  const handleSaveModule = useCallback(
    async (moduleIndex: number) => {
      const moduleData = form.getValues(`modules.${moduleIndex}`);
      if (!courseId) return;

      try {
        if (moduleData.id) {
          await handleUpdateModule(courseId, moduleData.id, {
            title: moduleData.title,
            lessons: moduleData.lessons,
          });
          toast.success(`Module ${moduleIndex + 1} updated successfully!`);
        } else {
          const newModule = await handleCreateModule(courseId, {
            title: moduleData.title,
            lessons: moduleData.lessons,
          });
          if (newModule?.id) {
            form.setValue(`modules.${moduleIndex}.id`, newModule.id, {
              shouldValidate: true,
            });
            toast.success(`Module ${moduleIndex + 1} created successfully!`);
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          const errorMessage = err.message || "Failed to save module";
          console.error(
            `Error saving module ${moduleIndex + 1}:`,
            errorMessage
          );
          toast.error(
            `Failed to save module ${moduleIndex + 1}: ${errorMessage}`
          );
        } else {
          console.error(`Error saving module ${moduleIndex + 1}:`, err);
          toast.error(`Failed to save module ${moduleIndex + 1}.`);
        }
      }
    },
    [form, courseId, handleUpdateModule, handleCreateModule]
  );

  const addModule = useCallback(() => {
    append({
      id: undefined,
      title: "",
      lessons: [{ title: "", content: "", video_url: "", is_free: false }],
    });
    setExpandedModule(fields.length);
  }, [append, fields]);

  const deleteModule = useCallback(
    async (moduleIndex: number) => {
      const moduleData = form.getValues(`modules.${moduleIndex}`);
      if (moduleData.id && courseId) {
        try {
          await handleDeleteModule(courseId, moduleData.id);
          remove(moduleIndex);
          toast.success(`Module ${moduleIndex + 1} deleted successfully!`);
        } catch (err) {
          if (err instanceof Error) {
            console.error(
              `Error deleting module ${moduleIndex + 1}:`,
              err.message
            );
          } else {
            console.error(`Error deleting module ${moduleIndex + 1}:`, err);
          }
          toast.error(`Failed to delete module ${moduleIndex + 1}.`);
        }
      } else {
        remove(moduleIndex);
      }
      if (expandedModule === moduleIndex) setExpandedModule(null);
      else if (expandedModule !== null && expandedModule >= fields.length - 1) {
        setExpandedModule(fields.length - 2 >= 0 ? fields.length - 2 : null);
      }
    },
    [form, courseId, handleDeleteModule, remove, expandedModule, fields]
  );

  const handleNext = useCallback(() => {
    if (form.formState.isValid) {
      onNext();
    }
  }, [form.formState.isValid, onNext]);

  const handleToggle = useCallback((index: number) => {
    setExpandedModule((prev) => (prev === index ? null : index));
  }, []);

  return (
    <FormProvider {...form}>
      <div className="space-y-6">
        {fields.map((field, index) => (
          <ModuleSection
            key={field.id}
            moduleIndex={index}
            form={form}
            isExpanded={expandedModule !== null && expandedModule === index}
            isUpdating={isUpdating}
            isCreating={isCreating}
            onToggle={() => handleToggle(index)}
            onDelete={() => deleteModule(index)}
            onSave={() => handleSaveModule(index)}
          />
        ))}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={isUpdating || isCreating}
            className="px-6 bg-transparent cursor-pointer"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={addModule}
            className="text-sky-500 border-sky-500 hover:bg-sky-50 bg-transparent cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Module
          </Button>
          <Button
            onClick={handleNext}
            disabled={isUpdating || isCreating || !form.formState.isValid}
            className="bg-sky-500 hover:bg-sky-600 px-6 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isUpdating || isCreating ? <DashedSpinner /> : "Continue"}
          </Button>
        </div>
      </div>
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <pre className="text-xs overflow-auto">
            {/* Add debug info if needed */}
            {JSON.stringify(form.getValues(), null, 2)}
          </pre>
        </div>
      )}
    </FormProvider>
  );
};

export default CourseLessonsStep;
