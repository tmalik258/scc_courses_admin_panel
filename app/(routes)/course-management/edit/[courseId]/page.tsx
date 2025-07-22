"use client";

import type React from "react";
import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/breadcrumb";
import CourseDetailsStep from "../../_steps/course-details";
import CourseLessonsStep from "../../_steps/course-lessons";
import ResourcesStep from "../../_steps/resources";
import type { CourseFormData } from "@/types/course";
import { toast } from "sonner";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { LumaSpin } from "@/components/luma-spin";
import { useCourseData } from "@/hooks/useCourseData";

const LOCAL_STORAGE_KEY = "editCourseFormData";

const INITIAL_FORM_DATA: CourseFormData = {
  title: "",
  description: "",
  category: "",
  price: "",
  instructor: "",
  thumbnailUrl: "",
  modules: [
    {
      title: "",
      lessons: [{ name: "", reading: "", videoUrl: "" }],
    },
  ],
  resources: [
    {
      title: "",
      url: "",
    },
  ],
};

const EditCoursePage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { courseId } = useParams<{ courseId: string }>();
  const { selectCourse, selectedCourse, handleUpdateCourse, loading, error } = useCourseData();
  const [currentStep, setCurrentStep] = useState(() => {
    const step = searchParams.get("step");
    return step && !isNaN(parseInt(step, 10)) ? parseInt(step, 10) : 1;
  });
  const [canProceed, setCanProceed] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch course data only when courseId exists and changes
  useEffect(() => {
    if (courseId) {
      selectCourse(courseId);
    } else {
      setFormData(INITIAL_FORM_DATA);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [courseId, selectCourse]);

  // Update formData when selectedCourse changes
  useEffect(() => {
    if (selectedCourse && courseId) {
      setFormData({
        title: selectedCourse.title || "",
        description: selectedCourse.description || "",
        category: selectedCourse.category?.id || "",
        price: selectedCourse.price?.toString() || "",
        instructor: selectedCourse.instructor?.id || "",
        thumbnailUrl: selectedCourse.thumbnailUrl || "",
        modules: selectedCourse.modules?.length
          ? selectedCourse.modules.map((module) => ({
              title: module.title || "",
              lessons: module.lessons?.length
                ? module.lessons.map((lesson) => ({
                    name: lesson.name || "",
                    reading: lesson.reading || "",
                    videoUrl: lesson.videoUrl || "",
                  }))
                : [{ name: "", reading: "", videoUrl: "" }],
            }))
          : [{ title: "", lessons: [{ name: "", reading: "", videoUrl: "" }] }],
        resources: selectedCourse.resources?.length
          ? selectedCourse.resources.map((resource) => ({
              title: resource.title || "",
              url: resource.url || "",
            }))
          : [{ title: "", url: "" }],
      });
    }
  }, [selectedCourse, courseId]);

  // Load formData from localStorage on mount (only for new courses)
  useEffect(() => {
    if (typeof window === "undefined" || courseId) return;
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(() => ({ ...INITIAL_FORM_DATA, ...parsed }));
      } catch (err) {
        console.error("Error parsing localStorage data:", err);
        toast.error("Failed to load saved form data.");
      }
    }
  }, [courseId]);

  // Save formData to localStorage when it changes (only for new courses)
  useEffect(() => {
    if (typeof window === "undefined" || courseId) return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
  }, [formData, courseId]);

  // Sync currentStep with URL query parameter
  useEffect(() => {
    const step = searchParams.get("step");
    const validStep = step && !isNaN(parseInt(step, 10)) ? parseInt(step, 10) : 1;
    if (validStep >= 1 && validStep <= 3 && validStep !== currentStep) {
      setCurrentStep(validStep);
      setCanProceed(true);
    }
  }, [searchParams, currentStep]);

  // Handle error from useCourseData
  useEffect(() => {
    if (error) {
      toast.error(`Error: ${error.message}`);
    }
  }, [error]);

  const updateFormData = useCallback((data: Partial<CourseFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < 3 && canProceed) {
      const nextStepNumber = currentStep + 1;
      setCurrentStep(nextStepNumber);
      setCanProceed(false);
      router.replace(`${pathname}?step=${nextStepNumber}`);
    }
  }, [currentStep, canProceed, router, pathname]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      const prevStepNumber = currentStep - 1;
      setCurrentStep(prevStepNumber);
      setCanProceed(true);
      router.replace(`${pathname}?step=${prevStepNumber}`);
    }
  }, [currentStep, pathname, router]);

  const handleCancel = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      router.push("/course-management");
    }
  }, [router]);

  const validateFormData = useCallback(() => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.price ||
      !formData.instructor
    ) {
      toast.error("Please fill in all required fields");
      return false;
    }
    return true;
  }, [formData]);

  const handleSaveAndContinue = useCallback(async () => {
    if (currentStep === 3) {
      if (!validateFormData()) {
        return;
      }

      setIsSubmitting(true);

      try {
        if (courseId) {
          await handleUpdateCourse(courseId, formData);
          toast.success("Course updated successfully!");
          localStorage.removeItem(LOCAL_STORAGE_KEY);
          router.push("/course-management");
        } else {
          const response = await fetch("/api/courses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });

          const result = await response.json();

          if (response.ok) {
            toast.success("Course created successfully!");
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            router.push("/course-management");
          } else {
            toast.error(`Failed to create course: ${result.error}`);
          }
        }
      } catch (err) {
        if (err instanceof Error) {
          console.error("Error saving course:", err.message);
          toast.error("Something went wrong while saving the course.");
        } else {
          console.error("Unknown error:", err);
          toast.error("Something went wrong while saving the course.");
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      nextStep();
    }
  }, [currentStep, formData, nextStep, validateFormData, courseId, handleUpdateCourse, router]);

  const steps = useMemo(
    () => [
      {
        number: 1,
        title: "Course Details",
        active: currentStep === 1,
        completed: currentStep > 1,
      },
      {
        number: 2,
        title: "Course Lessons",
        active: currentStep === 2,
        completed: currentStep > 2,
      },
      {
        number: 3,
        title: "Resources File",
        active: currentStep === 3,
        completed: false,
      },
    ],
    [currentStep]
  );

  const breadcrumbItems = useMemo(
    () => [
      { label: "Course Management", href: "/course-management" },
      { label: courseId ? "Edit Course" : "Add Course", active: true },
    ],
    [courseId]
  );

  const getStepTitle = useCallback(() => {
    const titles = {
      1: "Course Details",
      2: "Course Lessons",
      3: "Resources File",
    };
    return titles[currentStep as keyof typeof titles] || (courseId ? "Edit Course" : "Create New Course");
  }, [currentStep, courseId]);

  const getButtonText = useCallback(() => {
    if (currentStep === 3) {
      return isSubmitting ? (courseId ? "Updating Course..." : "Creating Course...") : (courseId ? "Update Course" : "Create Course");
    }
    return "Save & Continue";
  }, [currentStep, isSubmitting, courseId]);

  const renderCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 1:
        return (
          <CourseDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            setCanProceed={setCanProceed}
          />
        );
      case 2:
        return (
          <CourseLessonsStep
            formData={formData}
            updateFormData={updateFormData}
            setCanProceed={setCanProceed}
          />
        );
      case 3:
        return (
          <ResourcesStep
            formData={formData}
            updateFormData={updateFormData}
            setCanProceed={setCanProceed}
          />
        );
      default:
        return (
          <CourseDetailsStep
            formData={formData}
            updateFormData={updateFormData}
            setCanProceed={setCanProceed}
          />
        );
    }
  }, [currentStep, formData, updateFormData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LumaSpin />
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-6xl mx-auto">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {courseId ? "Edit Course" : "Create New Course"}
          </h1>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="px-6 bg-transparent"
              disabled={isSubmitting || loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveAndContinue}
              disabled={!canProceed || isSubmitting || loading}
              className="bg-sky-500 hover:bg-sky-600 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {getButtonText()}
            </Button>
          </div>
        </div>
        <div className="flex items-center mb-8">
          {steps.map((step, index) => (
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
              {index < steps.length - 1 && (
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
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isSubmitting || loading}
            className="px-6 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
          >
            Previous
          </Button>
          <div className="text-sm text-gray-500">
            Step {currentStep} of 3 - {getStepTitle()}
          </div>
          <Button
            onClick={handleSaveAndContinue}
            disabled={!canProceed || isSubmitting || loading}
            className="bg-sky-500 hover:bg-sky-600 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {getButtonText()}
          </Button>
        </div>
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </>
  );
};

export default EditCoursePage;