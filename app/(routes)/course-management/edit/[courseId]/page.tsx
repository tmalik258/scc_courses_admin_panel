"use client";

import type React from "react";
import { useState, useCallback, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/breadcrumb";
import CourseDetailsStep from "./_components/course-details-step";
import CourseLessonsStep from "./_components/course-lessons-step";
import ResourcesStep from "./_components/resources-step";
import { toast } from "sonner";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { LumaSpin } from "@/components/luma-spin";
import { useCourseData } from "@/hooks/useCourseData";

const EditCoursePage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { courseId } = useParams<{ courseId: string }>();
  const { selectCourse, loading, isUpdating, error } = useCourseData();
  const [currentStep, setCurrentStep] = useState(() => {
    const step = searchParams.get("step");
    return step && !isNaN(parseInt(step, 10)) ? parseInt(step, 10) : 1;
  });

  // Fetch course data when courseId exists and changes
  useEffect(() => {
    if (courseId) {
      selectCourse(courseId);
    }
  }, [courseId, selectCourse]);

  // Sync currentStep with URL query parameter
  useEffect(() => {
    const step = searchParams.get("step");
    const validStep =
      step && !isNaN(parseInt(step, 10)) ? parseInt(step, 10) : 1;
    if (validStep >= 1 && validStep <= 3 && validStep !== currentStep) {
      setCurrentStep(validStep);
    }
  }, [searchParams, currentStep]);

  // Handle error from useCourseData
  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error.message}`);
    }
  }, [error]);

  const nextStep = useCallback(() => {
    if (currentStep < 3) {
      const nextStepNumber = currentStep + 1;
      setCurrentStep(nextStepNumber);
      router.replace(`${pathname}?step=${nextStepNumber}`);
    }
  }, [currentStep, router, pathname]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      const prevStepNumber = currentStep - 1;
      setCurrentStep(prevStepNumber);
      router.replace(`${pathname}?step=${prevStepNumber}`);
    }
  }, [currentStep, pathname, router]);

  const handleCancel = useCallback(() => {
    router.push("/course-management");
  }, [router]);

  // const getButtonText = useCallback(() => {
  //   if (currentStep === 3) {
  //     return isUpdating ? "Publishing..." : "Save & Publish";
  //   }
  //   return isUpdating ? "Saving..." : "Continue";
  // }, [currentStep, isUpdating]);

  const renderCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 1:
        return (
          <CourseDetailsStep
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <CourseLessonsStep
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <ResourcesStep
            onPrev={prevStep}
          />
        );
      default:
        return (
          <CourseDetailsStep
            onNext={nextStep}
          />
        );
    }
  }, [currentStep, nextStep, prevStep]);

  if (loading && !isUpdating) {
    return (
      <div className="flex items-center justify-center h-full">
        <LumaSpin />
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full"><LumaSpin /></div>}>
      <div className="p-6 max-w-6xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Course Management", href: "/course-management" },
            { label: courseId ? "Edit Course" : "Add Course", active: true },
          ]}
        />
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {courseId ? "Edit Course" : "Create New Course"}
          </h1>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-6 bg-transparent"
            disabled={isUpdating || loading}
          >
            Cancel
          </Button>
        </div>
        <div className="flex items-center mb-8">
          {[
            { number: 1, title: "Course Details", active: currentStep === 1, completed: currentStep > 1 },
            { number: 2, title: "Course Lessons", active: currentStep === 2, completed: currentStep > 2 },
            { number: 3, title: "Resources File", active: currentStep === 3, completed: false },
          ].map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    step.completed
                      ? "bg-green-500 text-white"
                      : step.active
                      ? "bg-sky-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.completed ? "✓" : step.number}
                </div>
                <span
                  className={`ml-3 text-sm font-medium transition-colors duration-300 ${
                    step.active
                      ? "text-sky-600"
                      : step.completed
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < 2 && (
                <div
                  className={`flex-1 h-px mx-8 min-w-[100px] transition-colors duration-300 ${
                    step.completed ? "bg-green-300" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="transition-all duration-500 ease-in-out">
          {renderCurrentStep()}
        </div>
        {/* <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isUpdating || loading}
            className="px-6 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
          >
            Previous
          </Button>
          <div className="text-sm text-gray-500">
            Step {currentStep} of 3 - {
              {
                1: "Course Details",
                2: "Course Lessons",
                3: "Resources File",
              }[currentStep] || (courseId ? "Edit Course" : "Create New Course")
            }
          </div>
          <Button
            onClick={renderCurrentStep().props.onNext}
            disabled={isUpdating || loading}
            className="bg-sky-500 hover:bg-sky-600 px-6 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isUpdating || loading ? <DashedSpinner /> : null}
            {getButtonText()}
          </Button>
        </div> */}
      </div>
    </Suspense>
  );
};

export default EditCoursePage;