"use client";

import { useFieldArray, type UseFormReturn } from "react-hook-form";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit,
  Plus,
  Check,
  X,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import React, { useCallback, useState } from "react";
import type { CourseLessonsFormValues } from "@/form-schemas/course";
import { FormField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionForm from "./lesson-form";
import { DashedSpinner } from "@/components/dashed-spinner";

interface ModuleSectionProps {
  moduleIndex: number;
  form: UseFormReturn<CourseLessonsFormValues>;
  isExpanded: boolean;
  isUpdating?: boolean;
  isCreating?: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onSave: () => Promise<boolean>; // updated to return boolean
  onNext?: () => Promise<void>; // optional new callback
}

const ModuleSection: React.FC<ModuleSectionProps> = React.memo(
  ({
    moduleIndex,
    form,
    isExpanded,
    isUpdating,
    isCreating,
    onToggle,
    onDelete,
    onSave,
    onNext,
  }) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [tempTitle, setTempTitle] = useState("");

    const {
      fields: sectionFields,
      append: appendSection,
      remove: removeSection,
    } = useFieldArray({
      control: form.control,
      name: `modules.${moduleIndex}.lessons`,
    });

    const addSection = useCallback(() => {
      appendSection({ title: "", content: "", video_url: "", is_free: false });
    }, [appendSection]);

    const handleDeleteSection = useCallback(
      (sectionIndex: number) => {
        removeSection(sectionIndex);
      },
      [removeSection]
    );

    const handleEditClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        setTempTitle(form.getValues(`modules.${moduleIndex}.title`) || "");
        setIsEditingTitle(true);
      },
      [form, moduleIndex]
    );

    const handleSaveTitle = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        form.setValue(`modules.${moduleIndex}.title`, tempTitle);
        setIsEditingTitle(false);
      },
      [form, moduleIndex, tempTitle]
    );

    const handleCancelEdit = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      setIsEditingTitle(false);
    }, []);

    const handleInputKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault();
          form.setValue(`modules.${moduleIndex}.title`, tempTitle);
          setIsEditingTitle(false);
        } else if (e.key === "Escape") {
          e.preventDefault();
          setIsEditingTitle(false);
        }
      },
      [form, moduleIndex, tempTitle]
    );

    return (
      <div className="border border-gray-200 rounded-lg">
        <Collapsible open={isExpanded} onOpenChange={onToggle}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center space-x-2 flex-1">
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
                <span className="text-gray-600">Module {moduleIndex + 1}:</span>

                {isEditingTitle ? (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center space-x-2 flex-1"
                  >
                    <Input
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onKeyDown={handleInputKeyDown}
                      placeholder="Module title"
                      className="flex-1 h-8 text-sm font-medium"
                      autoFocus
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSaveTitle}
                      className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <FormField
                    control={form.control}
                    name={`modules.${moduleIndex}.title`}
                    render={({ field }) => (
                      <span className="font-medium text-gray-900 flex-1">
                        {field.value || "Untitled Module"}
                      </span>
                    )}
                  />
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="text-red-600 border-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>

                {!isEditingTitle && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditClick}
                    className="text-sky-600 border-sky-600"
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const ok = await onSave();
                    if (ok && onNext) await onNext();
                  }}
                  disabled={isUpdating || isCreating}
                  className="bg-sky-500 hover:bg-sky-600 text-white"
                >
                  {isUpdating || isCreating ? (
                    <DashedSpinner invert />
                  ) : (
                    "Save & Continue"
                  )}
                </Button>
              </div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="p-6 space-y-8">
              {sectionFields.map((sec, si) => (
                <SectionForm
                  key={sec.id}
                  moduleIndex={moduleIndex}
                  sectionIndex={si}
                  form={form}
                  isLast={si === sectionFields.length - 1}
                  onDelete={() => handleDeleteSection(si)}
                />
              ))}

              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={addSection}
                  className="border-sky-500 text-sky-500"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Lesson
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }
);

ModuleSection.displayName = "ModuleSection";
export default ModuleSection;
