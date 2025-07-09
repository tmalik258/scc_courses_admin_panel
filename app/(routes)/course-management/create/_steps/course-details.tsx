"use client"

import type React from "react"
import { useEffect, useCallback, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { CourseFormData } from "@/types/course"

interface CourseDetailsStepProps {
  formData: CourseFormData
  updateFormData: (data: Partial<CourseFormData>) => void
  setCanProceed: (canProceed: boolean) => void
}

const courseDetailsSchema = z.object({
  title: z.string().min(1, "Course title is required").max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(100, "Description must be at least 100 characters")
    .max(1000, "Description must be less than 1000 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^₹?\d+(\.\d{1,2})?$/, "Please enter a valid price"),
  instructor: z.string().min(1, "Please select an instructor"),
})

type CourseDetailsFormValues = z.infer<typeof courseDetailsSchema>

const CourseDetailsStep: React.FC<CourseDetailsStepProps> = ({ formData, updateFormData, setCanProceed }) => {
  const form = useForm<CourseDetailsFormValues>({
    resolver: zodResolver(courseDetailsSchema),
    defaultValues: {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      price: formData.price,
      instructor: formData.instructor,
    },
    mode: "onChange",
  })

  const categories = useMemo(
    () => [
      "Web Development",
      "App Development",
      "Data Science",
      "AI Calling",
      "Make Automations",
      "Design",
      "Marketing",
    ],
    [],
  )

  const instructors = useMemo(
    () => ["Andrew Johnson", "Sarah Wilson", "Mike Davis", "Lisa Chen", "David Brown", "Emma Taylor"],
    [],
  )

  const handleThumbnailUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const file = event.target.files?.[0]
        if (file && file.size <= 2 * 1024 * 1024) {
          updateFormData({ thumbnail: file })
        } else if (file) {
          alert("File size must be less than 2MB")
        }
      } catch (error) {
        console.error("Error uploading thumbnail:", error)
      }
    },
    [updateFormData],
  )

  // Validate form on mount and when values change
  useEffect(() => {
    // Validate form on mount
    form.trigger().then((isValid) => {
      console.log("Initial form validation:", isValid, form.formState.errors)
      setCanProceed(isValid)
    })

    const subscription = form.watch((values) => {
      // Update formData with current values
      const safeValues = {
        title: values.title || "",
        description: values.description || "",
        category: values.category || "",
        price: values.price || "",
        instructor: values.instructor || "",
      }

      updateFormData(safeValues)

      // Trigger validation and update canProceed
      form.trigger().then((isValid) => {
        console.log("Form validation:", isValid, form.formState.errors)
        setCanProceed(isValid)
      })
    })

    return () => subscription.unsubscribe()
  }, [form, updateFormData, setCanProceed])

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Title</FormLabel>
                <FormControl>
                  <Input placeholder="Course Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Course Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Description</FormLabel>
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
                      className="min-h-[200px] rounded-t-none border-t-0 resize-none"
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

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="Example ₹1,350" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Instructor */}
          <FormField
            control={form.control}
            name="instructor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instructor</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose Instructor Name" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {instructors.map((instructor) => (
                      <SelectItem key={instructor} value={instructor}>
                        {instructor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Right Column - Thumbnail Upload */}
        <div className="lg:col-span-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
            <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="text-gray-600 mb-2">Upload Photo</div>
                  <div className="text-xs text-red-500">Max file size is 2 Mb</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    className="hidden"
                    id="thumbnail-upload"
                  />
                  <label
                    htmlFor="thumbnail-upload"
                    className="mt-4 inline-block cursor-pointer text-sky-500 hover:text-sky-600"
                  >
                    Browse Files
                  </label>
                </div>
              </CardContent>
            </Card>
            {formData.thumbnail && (
              <div className="mt-2 text-sm text-green-600">File selected: {formData.thumbnail.name}</div>
            )}
          </div>
        </div>
      </div>
    </Form>
  )
}

export default CourseDetailsStep