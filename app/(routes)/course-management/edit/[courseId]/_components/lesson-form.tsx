"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CourseLessonsFormValues } from "@/types/course";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { VideoUploadField } from "@/components/videoUploadField";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import RichTextEditor from "@/components/rich-text-editor";

interface SectionFormProps {
  moduleIndex: number;
  sectionIndex: number;
  form: UseFormReturn<CourseLessonsFormValues>;
  isLast: boolean;
  onDelete: () => void;
}

const SectionForm: React.FC<SectionFormProps> = React.memo(
  ({ moduleIndex, sectionIndex, form, isLast, onDelete }) => {
    // const descriptionPath = `modules.${moduleIndex}.lessons.${sectionIndex}.description`;

    return (
      <div className="space-y-4 relative">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-900">
            Section {moduleIndex + 1}-{sectionIndex + 1}
          </h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Section Name */}
        <FormField
          control={form.control}
          name={`modules.${moduleIndex}.lessons.${sectionIndex}.name`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Section Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Is Free */}
        <FormField
          control={form.control}
          name={`modules.${moduleIndex}.lessons.${sectionIndex}.isFree`}
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-medium">
                Mark as Free
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Reading Content */}
        <FormField
          control={form.control}
          name={`modules.${moduleIndex}.lessons.${sectionIndex}.content`}
          render={({ field }) => {
            const value = typeof field.value === "string" ? field.value : "";

            const plainTextLength = value
              .replace(/<[^>]*>?/gm, "")
              .trim().length;
            const isValidLength =
              plainTextLength >= 100 && plainTextLength <= 1000;

            return (
              <FormItem>
                <FormLabel>Reading</FormLabel>
                <FormControl>
                  <RichTextEditor
                    content={value}
                    onChange={(content) => {
                      field.onChange(content);
                    }}
                    placeholder="Enter reading content (min 100 characters, max 1000 characters)"
                  />
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

        {/* Video Upload */}
        <FormField
          control={form.control}
          name={`modules.${moduleIndex}.lessons.${sectionIndex}.videoUrl`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video Learning</FormLabel>
              <FormControl>
                <VideoUploadField
                  label={`Section ${moduleIndex + 1}-${sectionIndex + 1} Video`}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={form.formState.isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isLast && <hr className="my-6 border-gray-200" />}
      </div>
    );
  }
);

SectionForm.displayName = "SectionForm";

export default SectionForm;
