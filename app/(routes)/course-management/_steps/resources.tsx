"use client";

import type React from "react";
import { useEffect, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { CourseFormData } from "@/types/course";

interface ResourcesStepProps {
  formData: CourseFormData;
  updateFormData: (data: Partial<CourseFormData>) => void;
  setCanProceed: (canProceed: boolean) => void;
}

const LOCAL_STORAGE_KEY = "courseResourcesStepData";

declare global {
  interface Window {
    clearResourcesStepStorage?: () => void;
  }
}

const resourceSchema = z.object({
  title: z.string().min(1, "Resource title is required"),
  url: z.string().url("Please enter a valid URL"),
});

const resourcesSchema = z.object({
  resources: z
    .array(resourceSchema)
    .min(1, "At least one resource is required"),
});

type ResourcesFormValues = z.infer<typeof resourcesSchema>;

const ResourcesStep: React.FC<ResourcesStepProps> = ({
  formData,
  updateFormData,
  setCanProceed,
}) => {
  const form = useForm<ResourcesFormValues>({
    resolver: zodResolver(resourcesSchema),
    defaultValues: {
      resources:
        formData.resources.length > 0
          ? formData.resources
          : [{ title: "", url: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "resources",
  });

  const addResource = useCallback(() => {
    append({ title: "", url: "" });
  }, [append]);

  const removeResource = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
      }
    },
    [remove, fields.length]
  );

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed?.resources) {
          form.reset(parsed);
          updateFormData(parsed);
        }
      } catch (error) {
        console.error("Failed to parse saved resources:", error);
      }
    }
  }, [form, updateFormData]);

  // Watch changes and save to localStorage
  useEffect(() => {
    const subscription = form.watch((values) => {
      const safeResources = (values.resources ?? []).map((r) => ({
        title: r?.title || "",
        url: r?.url || "",
      }));

      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ resources: safeResources })
      );

      updateFormData({ resources: safeResources });

      form
        .trigger()
        .then(setCanProceed)
        .catch(() => setCanProceed(false));
    });

    return () => subscription.unsubscribe();
  }, [form, updateFormData, setCanProceed]);

  // Helper to clear localStorage externally (after submit)
  const clearLocalStorage = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  // OPTIONAL: expose clearLocalStorage globally if needed
  window.clearResourcesStepStorage = clearLocalStorage;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Resources File
        </h2>
        <p className="text-gray-600">
          Add resource links and materials for your course
        </p>
      </div>

      <Form {...form}>
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Resources File {index + 1}
                </h3>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeResource(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              <FormField
                control={form.control}
                name={`resources.${index}.title`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Resources Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`resources.${index}.url`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Resources File URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {index < fields.length - 1 && (
                <hr className="my-6 border-gray-200" />
              )}
            </div>
          ))}

          <div className="flex justify-start pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={addResource}
              className="text-sky-500 border-sky-500 hover:bg-sky-50 bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Resources
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ResourcesStep;
