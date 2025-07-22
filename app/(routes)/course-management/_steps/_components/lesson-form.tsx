import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CourseLessonsFormValues } from "@/types/course"
import { UseFormReturn } from "react-hook-form"
import React from "react"
import { Button } from "@/components/ui/button"

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

      {/* Reading Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Reading</label>
        <FormField
          control={form.control}
          name={`modules.${moduleIndex}.lessons.${sectionIndex}.content`}
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
              <FormDescription className={field.value.length >= 100 && field.value.length <= 1000 ? "" : "text-red-500"}>
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
        name={`modules.${moduleIndex}.lessons.${sectionIndex}.videoUrl`}
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

export default SectionForm