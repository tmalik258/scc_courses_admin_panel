"use client"

import { useFieldArray, type UseFormReturn } from "react-hook-form"
import { ChevronDown, ChevronUp, Trash2, Edit, Plus, Check, X } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import React, { useCallback, useState } from "react"
import type { CourseLessonsFormValues } from "@/types/course"
import { FormField } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import SectionForm from "./lesson-form"

interface ModuleSectionProps {
  moduleIndex: number
  form: UseFormReturn<CourseLessonsFormValues>
  isExpanded: boolean
  onToggle: () => void
  onDelete: () => void
}

const ModuleSection: React.FC<ModuleSectionProps> = React.memo(
  ({ moduleIndex, form, isExpanded, onToggle, onDelete }) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [tempTitle, setTempTitle] = useState("")

    const { fields: sectionFields, append: appendSection } = useFieldArray({
      control: form.control,
      name: `sections.${moduleIndex}.lessons`,
    })

    const addSection = useCallback(() => {
      try {
        appendSection({
          name: "",
          reading: "",
          videoUrl: "",
        })
      } catch (error) {
        console.error("Error adding section:", error)
      }
    }, [appendSection])

    const handleEditClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        const currentTitle = form.getValues(`sections.${moduleIndex}.title`)
        setTempTitle(currentTitle || "")
        setIsEditingTitle(true)
      },
      [form, moduleIndex],
    )

    const handleSaveTitle = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        form.setValue(`sections.${moduleIndex}.title`, tempTitle)
        setIsEditingTitle(false)
      },
      [form, moduleIndex, tempTitle],
    )

    const handleCancelEdit = useCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      setIsEditingTitle(false)
      setTempTitle("")
    }, [])

    const handleInputKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
          e.preventDefault()
          form.setValue(`sections.${moduleIndex}.title`, tempTitle)
          setIsEditingTitle(false)
        } else if (e.key === "Escape") {
          e.preventDefault()
          setIsEditingTitle(false)
          setTempTitle("")
        }
      },
      [form, moduleIndex, tempTitle],
    )

    return (
      <div className="border border-gray-200 rounded-lg">
        <Collapsible open={isExpanded} onOpenChange={onToggle}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center space-x-2 flex-1">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span className="text-gray-600">Module {moduleIndex + 1}:</span>

                {isEditingTitle ? (
                  <div className="flex items-center space-x-2 flex-1" onClick={(e) => e.stopPropagation()}>
                    <Input
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      onKeyDown={handleInputKeyDown}
                      className="flex-1 h-8 text-sm font-medium"
                      placeholder="Enter module title"
                      autoFocus
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleSaveTitle}
                      className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <FormField
                    control={form.control}
                    name={`sections.${moduleIndex}.title`}
                    render={({ field }) => (
                      <span className="font-medium text-gray-900 flex-1">{field.value || "Untitled Module"}</span>
                    )}
                  />
                )}
              </div>

              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete()
                  }}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>

                {!isEditingTitle && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleEditClick}
                    className="text-sky-600 border-sky-600 hover:bg-sky-50 bg-transparent"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                )}

                <Button type="button" size="sm" className="bg-sky-500 hover:bg-sky-600 text-white">
                  Save
                </Button>
              </div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="p-6 space-y-8">
              {sectionFields.map((sectionField, sectionIndex) => (
                <SectionForm
                  key={sectionField.id}
                  moduleIndex={moduleIndex}
                  sectionIndex={sectionIndex}
                  form={form}
                  isLast={sectionIndex === sectionFields.length - 1}
                />
              ))}

              {/* Add Section Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSection}
                  className="text-sky-500 border-sky-500 hover:bg-sky-50 bg-transparent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  },
)

ModuleSection.displayName = "ModuleSection"

export default ModuleSection
