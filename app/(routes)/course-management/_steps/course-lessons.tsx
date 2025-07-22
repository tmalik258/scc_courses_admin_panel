"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "lodash.debounce";

import {
  CourseFormData,
  CourseLessonsFormValues,
  courseLessonsSchema,
} from "@/types/course";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import ModuleSection from "./_components/section-form";
import { Plus } from "lucide-react";

interface CourseLessonsStepProps {
  formData: CourseFormData;
  updateFormData: (data: Partial<CourseFormData>) => void;
  setCanProceed: (canProceed: boolean) => void;
}

const CourseLessonsStep: React.FC<CourseLessonsStepProps> = ({
  formData,
  updateFormData,
  setCanProceed,
}) => {
  const [expandedModules, setExpandedModules] = useState<{
    [key: number]: boolean;
  }>({ 0: true });
  const [isClient, setIsClient] = useState(false);

  const form = useForm<CourseLessonsFormValues>({
    resolver: zodResolver(courseLessonsSchema),
    defaultValues: {
      modules: formData.modules?.length
        ? formData.modules.map((_module) => ({
            title: _module.title || "",
            lessons: (_module.lessons || []).map((lesson) => ({
              name: lesson.name || "",
              reading: lesson.reading || "",
              videoUrl: lesson.videoUrl || "",
            })),
          }))
        : [
            {
              title: "New Module",
              lessons: [{ name: "", reading: "", videoUrl: "" }],
            },
          ],
    },
    mode: "onChange",
  });

  const {
    fields: moduleFields,
    append: appendModule,
    remove: removeModule,
  } = useFieldArray({
    control: form.control,
    name: "modules",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sync form with updated formData prop only if necessary
  useEffect(() => {
    const currentFormValues = form.getValues().modules;
    const incomingModules = formData.modules?.length
      ? formData.modules.map((_module) => ({
          title: _module.title || "",
          lessons: (_module.lessons || []).map((lesson) => ({
            name: lesson.name || "",
            reading: lesson.reading || "",
            videoUrl: lesson.videoUrl || "",
          })),
        }))
      : [
          {
            title: "New Module",
            lessons: [{ name: "", reading: "", videoUrl: "" }],
          },
        ];

    // Deep comparison to avoid unnecessary resets
    if (JSON.stringify(currentFormValues) !== JSON.stringify(incomingModules)) {
      form.reset({ modules: incomingModules }, { keepDirty: true });
    }
  }, [form, formData.modules]);

  const toggleModule = useCallback((index: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  const addNewModule = useCallback(() => {
    appendModule({
      title: "New Module",
      lessons: [{ name: "", reading: "", videoUrl: "" }],
    });
  }, [appendModule]);

  // Sync form data with parent
  useEffect(() => {
    const debouncedUpdate = debounce(async () => {
      const values = form.getValues();
      const safeModules = values.modules.map((_module) => ({
        title: _module.title || "",
        lessons: _module.lessons.map((lesson) => ({
          name: lesson.name || "",
          reading: lesson.reading || "",
          videoUrl: lesson.videoUrl || "",
        })),
      }));

      // Only update if modules have changed to avoid unnecessary updates
      if (JSON.stringify(safeModules) !== JSON.stringify(formData.modules)) {
        updateFormData({ modules: safeModules });
      }
      const isValid = await form.trigger();
      setCanProceed(isValid);
    }, 400);

    const subscription = form.watch(() => {
      debouncedUpdate();
    });

    // Initial validation
    form.trigger().then(setCanProceed);

    return () => {
      subscription.unsubscribe();
      debouncedUpdate.cancel();
    };
  }, [form, updateFormData, setCanProceed, formData.modules]);

  if (!isClient) return null;

  return (
    <Form {...form}>
      <div className="space-y-6">
        {moduleFields.map((moduleField, moduleIndex) => (
          <ModuleSection
            key={moduleField.id}
            moduleIndex={moduleIndex}
            form={form}
            isExpanded={expandedModules[moduleIndex] || false}
            onToggle={() => toggleModule(moduleIndex)}
            onDelete={() => removeModule(moduleIndex)}
          />
        ))}
        <div className="flex justify-center pt-6">
          <Button
            type="button"
            onClick={addNewModule}
            className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Module
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default CourseLessonsStep;
