"use client"

import React from "react"
import { useEffect, useState, useCallback } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CourseFormData, CourseLessonsFormValues, courseLessonsSchema } from "@/types/course"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import ModuleSection from "./_components/section-form"
import { Plus } from "lucide-react"

interface CourseLessonsStepProps {
  formData: CourseFormData
  updateFormData: (data: Partial<CourseFormData>) => void
  setCanProceed: (canProceed: boolean) => void
}

const CourseLessonsStep: React.FC<CourseLessonsStepProps> = ({ formData, updateFormData, setCanProceed }) => {
  const [expandedModules, setExpandedModules] = useState<{ [key: number]: boolean }>({ 0: true })

  const form = useForm<CourseLessonsFormValues>({
    resolver: zodResolver(courseLessonsSchema),
    defaultValues: {
      sections: formData.sections,
    },
    mode: "onChange",
  })

  const {
    fields: moduleFields,
    append: appendModule,
    remove: removeModule,
  } = useFieldArray({
    control: form.control,
    name: "sections",
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
        title: `New Module`,
        lessons: [
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
  }, [appendModule])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const subscription = form.watch((values) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        try {
          if (values?.sections && Array.isArray(values.sections)) {
            const safeModules = values.sections.map((section) => ({
              title: section?.title || "",
              lessons: (section?.lessons || []).map((lesson) => ({
                name: lesson?.name || "",
                reading: lesson?.reading || "",
                videoUrl: lesson?.videoUrl || "",
              })),
            }))

            updateFormData({ sections: safeModules })

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

export default CourseLessonsStep
