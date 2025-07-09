"use client"

import React from "react"
import { useEffect, useState, useCallback } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ChevronDown, ChevronUp, Trash2, Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"


interface CourseLessonsStepProps {
  formData: CourseFormData
  updateFormData: (data: Partial<CourseFormData>) => void
  setCanProceed: (canProceed: boolean) => void
}

const sectionSchema = z.object({
  name: z.string().min(1, "Section name is required"),
  reading: z
    .string()
    .min(100, "Reading content must be at least 100 characters")
    .max(1000, "Reading content must be less than 1000 characters"),
  videoUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
})

const moduleSchema = z.object({
  title: z.string().min(1, "Module title is required"),
  sections: z.array(sectionSchema).min(1, "At least one section is required"),
})

const courseLessonsSchema = z.object({
  modules: z.array(moduleSchema).min(1, "At least one module is required"),
})

type CourseLessonsFormValues = z.infer<typeof courseLessonsSchema>

const CourseLessonsStep: React.FC<CourseLessonsStepProps> = ({ formData, updateFormData, setCanProceed }) => {
  const [expandedModules, setExpandedModules] = useState<{ [key: number]: boolean }>({ 0: true })

  const form = useForm<CourseLessonsFormValues>({
    resolver: zodResolver(courseLessonsSchema),
    defaultValues: {
      modules: formData.modules,
    },
    mode: "onChange",
  })

  const {
    fields: moduleFields,
    append: appendModule,
    remove: removeModule,
  } = useFieldArray({
    control: form.control,
    name: "modules",
  })

  const toggleModule = useCallback((index: number) => {
    setExpandedModules((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }, [])

  const addNewModule = useCallback(() => {
    try {
      appendModule({
        title: `Module ${moduleFields.length + 1}: New Module`,
        sections: [
          {
            name: "",
            reading: "",
            videoUrl: "",
          },
        ],
      })
    } catch (error) {
      console.error("Error adding module:", error)
    }
  }, [appendModule, moduleFields.length])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const subscription = form.watch((values) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        try {
          if (values?.modules && Array.isArray(values.modules)) {
            const safeModules = values.modules.map((module) => ({
              title: module?.title || "",
              sections: (module?.sections || []).map((section) => ({
                name: section?.name || "",
                reading: section?.reading || "",
                videoUrl: section?.videoUrl || "",
              })),
            }))

            updateFormData({ modules: safeModules })

            form
              .trigger()
              .then((isValid) => {
                setCanProceed(isValid)
              })
              .catch((error) => {
                console.error("Form validation error:", error)
                setCanProceed(false)
              })
          }
        } catch (error) {
          console.error("Form watch error:", error)
          setCanProceed(false)
        }
      }, 500)
    })

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      subscription.unsubscribe()
    }
  }, [form, updateFormData, setCanProceed])

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

        {/* Add Module Button */}
        <div className="flex justify-center pt-6">
          <Button type="button" onClick={addNewModule} className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3">
            <Plus className="w-4 h-4 mr-2" />
            Add Module
          </Button>
        </div>
      </div>
    </Form>
  )
}

import type { UseFormReturn } from "react-hook-form"
import { CourseFormData } from "@/types/course"

interface ModuleSectionProps {
  moduleIndex: number
  form: UseFormReturn<CourseLessonsFormValues>
  isExpanded: boolean
  onToggle: () => void
  onDelete: () => void
}

const ModuleSection: React.FC<ModuleSectionProps> = React.memo(
  ({ moduleIndex, form, isExpanded, onToggle, onDelete }) => {
    const { fields: sectionFields, append: appendSection } = useFieldArray({
      control: form.control,
      name: `modules.${moduleIndex}.sections`,
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

    return (
      <div className="border border-gray-200 rounded-lg">
        <Collapsible open={isExpanded} onOpenChange={onToggle}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center space-x-2">
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <FormField
                  control={form.control}
                  name={`modules.${moduleIndex}.title`}
                  render={({ field }) => (
                    <span className="font-medium text-gray-900">{field.value || "Untitled Module"}</span>
                  )}
                />
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
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-sky-600 border-sky-600 hover:bg-sky-50 bg-transparent"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
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

interface SectionFormProps {
  moduleIndex: number
  sectionIndex: number
  form: UseFormReturn<CourseLessonsFormValues>
  isLast: boolean
}

const SectionForm: React.FC<SectionFormProps> = React.memo(({ moduleIndex, sectionIndex, form, isLast }) => {
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">
        Section {moduleIndex + 1}-{sectionIndex + 1}
      </h4>

      {/* Section Name */}
      <FormField
        control={form.control}
        name={`modules.${moduleIndex}.sections.${sectionIndex}.name`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input placeholder="Section Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Reading Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Reading</label>
        <FormField
          control={form.control}
          name={`modules.${moduleIndex}.sections.${sectionIndex}.reading`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div>
                  {/* Rich Text Editor Toolbar */}
                  <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex items-center gap-2 flex-wrap">
                    <Select defaultValue="normal">
                      <SelectTrigger className="w-20 h-8 text-xs">
                        <SelectValue placeholder="Normal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="h1">H1</SelectItem>
                        <SelectItem value="h2">H2</SelectItem>
                        <SelectItem value="h3">H3</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" type="button">
                        <span className="font-bold">B</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" type="button">
                        <span className="italic">I</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" type="button">
                        <span className="underline">U</span>
                      </Button>
                    </div>

                    <div className="w-px h-6 bg-gray-300"></div>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" type="button">
                        ≡
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" type="button">
                        ≡
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" type="button">
                        ≡
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" type="button">
                        ≡
                      </Button>
                    </div>

                    <div className="w-px h-6 bg-gray-300"></div>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" type="button">
                        {"<>"}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" type="button">
                        {'"'}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" type="button">
                        •
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" type="button">
                        1.
                      </Button>
                    </div>
                  </div>

                  <Textarea
                    placeholder="Course Description....."
                    className="min-h-[150px] rounded-t-none border-t-0 resize-none"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormDescription className="text-red-500">
                Min 100 characters and max 1000 characters required ({(field.value || "").length}/1000)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Video Learning URL */}
      <FormField
        control={form.control}
        name={`modules.${moduleIndex}.sections.${sectionIndex}.videoUrl`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Video Learning URL</FormLabel>
            <FormControl>
              <Input placeholder="Video Learning URL" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {!isLast && <hr className="my-6 border-gray-200" />}
    </div>
  )
})

SectionForm.displayName = "SectionForm"

export default CourseLessonsStep
