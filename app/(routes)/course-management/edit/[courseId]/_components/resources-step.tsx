"use client";

import type React from "react";
import { useEffect, useCallback, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
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
import { useFieldArray } from "react-hook-form";
import { Plus, Trash2, Check } from "lucide-react";
import { DashedSpinner } from "@/components/dashed-spinner";
import { FileUploadField } from "@/components/fileUploadField";

const resourceSchema = z.object({
  resources: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1, "Resource title is required"),
        url: z
          .string()
          .url("Invalid URL")
          .min(1, "Resource URL is required")
          .or(z.literal("")),
      })
    )
    .min(1, "At least one resource is required"),
});

type ResourceFormValues = z.infer<typeof resourceSchema>;

interface ResourcesStepProps {
  onPrev: () => void;
}

const ResourcesStep: React.FC<ResourcesStepProps> = ({ onPrev }) => {
  const { courseId } = useParams<{ courseId: string }>();
  const {
    selectCourse,
    selectedCourse,
    isCreating,
    isUpdating,
    handleCreateResource,
    handleUpdateResource,
    handleDeleteResource,
    handleUpdateCourse,
  } = useCourseData();
  const [expandedResource, setExpandedResource] = useState<number | null>(0);
  const router = useRouter();

  useEffect(() => {
    if (courseId) {
      selectCourse(courseId);
    }
  }, [courseId, selectCourse]);

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      resources: selectedCourse?.resources?.length
        ? selectedCourse.resources.map((resource) => ({
            id: resource.id || undefined,
            name: resource.name || "",
            url: resource.url || "",
          }))
        : [{ id: undefined, name: "", url: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "resources",
  });

  useEffect(() => {
    const resources = selectedCourse?.resources?.length
      ? selectedCourse.resources.map((resource) => ({
          id: resource.id || undefined,
          name: resource.name || "",
          url: resource.url || "",
        }))
      : [{ id: undefined, name: "", url: "" }];
    form.reset({ resources });
    if (resources.length > 0) setExpandedResource(0);
    else setExpandedResource(null);
  }, [form, selectedCourse]);

  const handleSaveResource = useCallback(
    async (resourceIndex: number) => {
      const resourceData = form.getValues(`resources.${resourceIndex}`);
      if (!courseId) return;

      try {
        if (resourceData.id) {
          await handleUpdateResource(courseId, resourceData.id, {
            name: resourceData.name,
            url: resourceData.url,
          });
          toast.success(`Resource ${resourceIndex + 1} updated successfully!`);
        } else {
          const newResource = await handleCreateResource(courseId, {
            name: resourceData.name,
            url: resourceData.url || "", // Ensure url is not undefined
          });
          if (newResource?.id) {
            form.setValue(`resources.${resourceIndex}.id`, newResource.id, {
              shouldValidate: true,
            });
            toast.success(
              `Resource ${resourceIndex + 1} created successfully!`
            );
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error(
            `Error saving resource ${resourceIndex + 1}:`,
            err.message
          );
          toast.error(
            `Failed to save resource ${resourceIndex + 1}: ${err.message}`
          );
        } else {
          console.error(`Error saving resource ${resourceIndex + 1}:`, err);
          toast.error(`Failed to save resource ${resourceIndex + 1}.`);
        }
      }
    },
    [courseId, form, handleUpdateResource, handleCreateResource]
  );

  const addResource = useCallback(() => {
    append({ id: undefined, name: "", url: "" });
    setExpandedResource(fields.length);
  }, [append, fields]);

  const deleteResource = useCallback(
    async (resourceIndex: number) => {
      const resourceData = form.getValues(`resources.${resourceIndex}`);
      if (resourceData.id && courseId) {
        try {
          await handleDeleteResource(courseId, resourceData.id);
          remove(resourceIndex);
          toast.success(`Resource ${resourceIndex + 1} deleted successfully!`);
        } catch (err) {
          if (err instanceof Error) {
            console.error(
              `Error deleting resource ${resourceIndex + 1}:`,
              err.message
            );
          } else {
            console.error(`Error deleting resource ${resourceIndex + 1}:`, err);
          }
          toast.error(`Failed to delete resource ${resourceIndex + 1}.`);
        }
      } else {
        remove(resourceIndex);
      }
      if (expandedResource === resourceIndex) setExpandedResource(null);
      else if (
        expandedResource !== null &&
        expandedResource >= fields.length - 1
      ) {
        setExpandedResource(fields.length - 2 >= 0 ? fields.length - 2 : null);
      }
    },
    [courseId, form, handleDeleteResource, remove, expandedResource, fields]
  );

  const handlePublish = useCallback(async () => {
    if (!courseId) return;
    if (selectedCourse?.isPublished) {
      toast.success("Course is saved and is already published!");
      router.push("/course-management");
    }
    try {
      await handleUpdateCourse(courseId, { isPublished: true });
      toast.success("Course published successfully!");
      router.push("/course-management");
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error publishing course:", err.message);
      } else {
        console.error("Error publishing course:", err);
      }
      toast.error("Failed to publish course.");
    }
  }, [courseId, handleUpdateCourse, router, selectedCourse?.isPublished]);

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium">Resource {index + 1}</h4>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteResource(index)}
                    className="text-red-600 border-red-600 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isUpdating || isCreating}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveResource(index)}
                    disabled={isUpdating || isCreating}
                    className="text-green-600 border-green-600 hover:text-green-600 hover:bg-green-50 cursor-pointer transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name={`resources.${index}.name`}
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
                  name={`resources.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resource File</FormLabel>
                      <FormControl>
                        <FileUploadField
                          folderName={selectedCourse?.id || courseId || ""}
                          value={field.value}
                          onChange={(url) => field.onChange(url)}
                          disabled={isUpdating || isCreating}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={onPrev}
            disabled={isUpdating || isCreating}
            className="px-6 bg-transparent"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={addResource}
            className="text-sky-500 border-sky-500 hover:bg-sky-50 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
          </Button>
          <div className="space-x-4">
            <Button
              onClick={handlePublish}
              disabled={isUpdating || isCreating || !form.formState.isValid}
              className="bg-green-600 hover:bg-green-700 text-white px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating || isCreating ? (
                <DashedSpinner invert={true} />
              ) : null}
              {selectedCourse?.isPublished ? "Save & Continue" : "Publish"}
            </Button>
          </div>
        </div>
      </Form>
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(form.getValues(), null, 2)}
          </pre>
        </div>
      )}
    </FormProvider>
  );
};

export default ResourcesStep;
