"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
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

const LOCAL_STORAGE_KEY = "courseLessonsStepData";

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

  // Initialize default sections with a fallback
  const defaultSectionsRef = useRef<CourseLessonsFormValues["modules"]>(
    formData.modules?.length
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
        ]
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const form = useForm<CourseLessonsFormValues>({
    resolver: zodResolver(courseLessonsSchema),
    defaultValues: {
      modules: defaultSectionsRef.current,
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

  // Load saved data from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const validation = courseLessonsSchema.safeParse(parsed);
        if (validation.success) {
          form.reset(parsed);
        } else {
          console.warn("Invalid localStorage data:", validation.error);
          form.reset({ modules: defaultSectionsRef.current });
        }
      }
    } catch (error) {
      console.error("Error parsing localStorage data:", error);
      form.reset({ modules: defaultSectionsRef.current });
    }
  }, [form]);

  const watchedModules = useWatch({
    control: form.control,
    name: "modules",
  });

  // Sync form data with localStorage and parent
  useEffect(() => {
    const syncForm = debounce(async () => {
      try {
        if (!Array.isArray(watchedModules) || !watchedModules.length) {
          console.warn("No valid modules data to sync");
          setCanProceed(false);
          return;
        }

        const safeModules: CourseLessonsFormValues["modules"] =
          watchedModules.map((_module) => ({
            title: _module?.title || "",
            lessons: Array.isArray(_module?.lessons)
              ? _module.lessons.map((lesson) => ({
                  name: lesson?.name || "",
                  reading: lesson?.reading || "",
                  videoUrl: lesson?.videoUrl || "",
                }))
              : [],
          }));

        const payload = { modules: safeModules };

        // Save to localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
        }

        // Update parent formData only if changed
        const isDifferent =
          JSON.stringify(formData.modules) !== JSON.stringify(safeModules);
        if (isDifferent) {
          updateFormData(payload);
        }

        // Validate form
        const isValid = await form.trigger();
        setCanProceed(isValid);
      } catch (error) {
        console.error("Error in syncForm:", error);
        setCanProceed(false);
      }
    }, 400);

    syncForm();
    return () => syncForm.cancel();
  }, [form, setCanProceed, updateFormData, watchedModules, formData.modules]);

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
