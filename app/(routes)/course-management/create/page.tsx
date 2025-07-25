"use client";

import type React from "react";
import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/breadcrumb";
import type { CreateCourseFormData } from "@/types/course";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DashedSpinner } from "@/components/dashed-spinner";
import { useCourseData } from "@/hooks/useCourseData";
import CourseDetailsForm from "./_components/course-details-form";

const INITIAL_FORM_DATA: CreateCourseFormData = {
  title: "",
  description: "",
  categoryId: "",
  price: "",
  instructorId: "",
  thumbnailUrl: "",
};

const AddCoursePage: React.FC = () => {
  const router = useRouter();
  const { handleCreateCourse, loading: isSubmitting } = useCourseData();
  const [formData, setFormData] = useState<CreateCourseFormData>(INITIAL_FORM_DATA);
  const [canProceed, setCanProceed] = useState(false);
  const [currentStep] = useState(1); // Always start at step 1

  const updateFormData = useCallback((data: Partial<CreateCourseFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const validateFormData = useCallback(() => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.categoryId ||
      !formData.price ||
      !formData.instructorId
    ) {
      toast.error("Please fill in all required fields");
      return false;
    }
    return true;
  }, [formData]);

  const handleCancel = useCallback(() => {
    router.push("/course-management");
  }, [router]);

  const handleSave = useCallback(async () => {
    if (!validateFormData()) {
      return;
    }

    try {
      const newCourse = await handleCreateCourse(formData);
      toast.success("Course saved successfully!");
      router.push(`/course-management/edit/${newCourse.id}?step=2`);
    } catch (err) {
      console.error("Error creating course:", err);
      toast.error("Something went wrong while saving the course.");
    }
  }, [formData, router, validateFormData, handleCreateCourse]);

  const breadcrumbItems = [
    { label: "Course Management", href: "/course-management" },
    { label: "Add Course", active: true },
  ];

  const steps = useMemo(
    () => [
      {
        number: 1,
        title: "Course Details",
        active: currentStep === 1,
        completed: false, // Step 1 is never completed here
      },
      {
        number: 2,
        title: "Course Lessons",
        active: false,
        completed: false,
      },
      {
        number: 3,
        title: "Resources File",
        active: false,
        completed: false,
      },
    ],
    [currentStep]
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Breadcrumb items={breadcrumbItems} />
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Create New Course
        </h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-6 bg-transparent"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!canProceed || isSubmitting}
            className="bg-sky-500 hover:bg-sky-600 px-6 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting && <DashedSpinner />}
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </div>
      {/* Progress Steps */}
      <div className="flex items-center mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  step.active
                    ? "bg-sky-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.number}
              </div>
              <span
                className={`ml-3 text-sm font-medium transition-colors duration-300 ${
                  step.active ? "text-sky-600" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-px mx-8 min-w-[100px] transition-colors duration-300 bg-gray-300`}
              ></div>
            )}
          </div>
        ))}
      </div>
      {/* Step Content */}
      <div className="transition-all duration-500 ease-in-out">
        <CourseDetailsForm
          formData={formData}
          updateFormData={updateFormData}
          setCanProceed={setCanProceed}
        />
      </div>
      {/* Navigation Footer */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          disabled={true} // No previous step
          className="px-6 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
        >
          Previous
        </Button>
        <div className="text-sm text-gray-500">
          Step 1 of 3 - Course Details
        </div>
        <Button
          onClick={handleSave}
          disabled={!canProceed || isSubmitting}
          className="bg-sky-500 hover:bg-sky-600 px-6 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSubmitting && <DashedSpinner />}
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AddCoursePage;
