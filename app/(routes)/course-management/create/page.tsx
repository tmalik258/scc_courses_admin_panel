"use client";

import type React from "react";
import { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/breadcrumb";
import CourseDetailsStep from "./_steps/course-details";
import CourseLessonsStep from "./_steps/course-lessons";
import ResourcesStep from "./_steps/resources";
import { CourseFormData } from "@/types/course";

const INITIAL_FORM_DATA: CourseFormData = {
  title: "",
  description: "",
  category: "",
  price: "",
  instructor: "",
  thumbnail: null,
  modules: [
    {
      title: "Module 1: Introduction to Automation",
      sections: [
        { name: "", reading: "", videoUrl: "" },
        { name: "", reading: "", videoUrl: "" },
      ],
    },
  ],
  resources: [],
};

const AddCoursePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [canProceed, setCanProceed] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>(INITIAL_FORM_DATA);

  const updateFormData = useCallback((data: Partial<CourseFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < 3 && canProceed) {
      setCurrentStep((prev) => prev + 1);
      setCanProceed(false);
    }
  }, [currentStep, canProceed]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setCanProceed(true);
    }
  }, [currentStep]);

  const handleCancel = useCallback(() => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  }, []);

  const handleSaveAndContinue = useCallback(async () => {
    if (currentStep === 3) {
      try {
        console.log("📝 Course submission payload:", formData);

        const response = await fetch("/api/courses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Course created successfully!");

          window.location.href = "/course-management";
        } else {
          console.error("Server error:", result.error);
          alert(`Failed to create course: ${result.error}`);
        }
      } catch (err) {
        console.error("Network or unexpected error:", err);
        alert("Something went wrong while creating the course.");
      }
    } else {
      nextStep();
    }
  }, [currentStep, formData, nextStep]);

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
      { label: "Add Course", active: true },
    ],
    []
  );

  const getStepTitle = useCallback(() => {
    const titles = {
      1: "Course Details",
      2: "Course Lessons",
      3: "Resources File",
    };
    return titles[currentStep as keyof typeof titles] || "Create New Course";
  }, [currentStep]);

  const getButtonText = useCallback(() => {
    return currentStep === 3 ? "Create Course" : "Save & Continue";
  }, [currentStep]);

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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Create New Course
        </h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="px-6 bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveAndContinue}
            disabled={!canProceed}
            className="bg-sky-500 hover:bg-sky-600 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {getButtonText()}
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

      {/* Step Content */}
      <div className="transition-all duration-500 ease-in-out">
        {renderCurrentStep()}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="px-6 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
        >
          Previous
        </Button>
        <div className="text-sm text-gray-500">
          Step {currentStep} of 3 - {getStepTitle()}
        </div>
        <Button
          onClick={handleSaveAndContinue}
          disabled={!canProceed}
          className="bg-sky-500 hover:bg-sky-600 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {getButtonText()}
        </Button>
      </div>
    </div>
  );
};

export default AddCoursePage;
