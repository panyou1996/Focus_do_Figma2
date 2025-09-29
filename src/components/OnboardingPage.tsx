import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle, Calendar, List, Clock, Star, Users } from "lucide-react";
import { Button } from "./ui/button";

interface OnboardingPageProps {
  onComplete: () => void;
}

const onboardingSteps = [
  {
    id: 1,
    icon: CheckCircle,
    title: "Welcome to TaskMaster",
    description: "Your personal task management companion designed to help you stay organized and productive.",
    color: "from-blue-500 to-indigo-600",
    illustration: (
      <div className="relative">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mx-auto mb-4 flex items-center justify-center">
          <CheckCircle className="w-16 h-16 text-white" />
        </div>
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
          <Star className="w-4 h-4 text-white" />
        </div>
      </div>
    )
  },
  {
    id: 2,
    icon: Calendar,
    title: "Organize Your Day",
    description: "Use the Today view to see your timeline, Lists to categorize tasks, and Calendar to plan ahead.",
    color: "from-green-500 to-emerald-600",
    illustration: (
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 flex flex-col items-center">
          <Calendar className="w-8 h-8 text-white mb-2" />
          <span className="text-xs text-white font-medium">Calendar</span>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-4 flex flex-col items-center">
          <List className="w-8 h-8 text-white mb-2" />
          <span className="text-xs text-white font-medium">Lists</span>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl p-4 flex flex-col items-center">
          <Clock className="w-8 h-8 text-white mb-2" />
          <span className="text-xs text-white font-medium">Today</span>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-4 flex flex-col items-center">
          <Star className="w-8 h-8 text-white mb-2" />
          <span className="text-xs text-white font-medium">Review</span>
        </div>
      </div>
    )
  },
  {
    id: 3,
    icon: Clock,
    title: "Smart Time Management",
    description: "Fixed tasks have set times, while flexible tasks can be scheduled around your availability.",
    color: "from-purple-500 to-violet-600",
    illustration: (
      <div className="space-y-3">
        <div className="bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl p-3 text-white">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span className="text-sm font-medium">Team Meeting</span>
          </div>
          <div className="text-xs opacity-80">09:00 AM • Fixed</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-3 text-white">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <span className="text-sm font-medium">Review Code</span>
          </div>
          <div className="text-xs opacity-80">Flexible • 60 min</div>
        </div>
      </div>
    )
  },
  {
    id: 4,
    icon: Star,
    title: "Stay on Track",
    description: "Mark important tasks, complete them with satisfying animations, and track your progress over time.",
    color: "from-orange-500 to-red-600",
    illustration: (
      <div className="relative">
        <div className="bg-white rounded-2xl p-4 shadow-lg border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-medium">Complete project</span>
            <Star className="w-4 h-4 text-yellow-500 fill-current ml-auto" />
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
              initial={{ width: 0 }}
              animate={{ width: "75%" }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </div>
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">!</span>
        </div>
      </div>
    )
  }
];

export default function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    onComplete();
  };

  const current = onboardingSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-[393px] h-[852px] bg-white relative overflow-hidden rounded-[40px] shadow-2xl border-8 border-black">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <div className="flex space-x-2">
              {onboardingSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "w-8 bg-blue-500"
                      : index < currentStep
                      ? "w-2 bg-blue-500"
                      : "w-2 bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={skipOnboarding}
              className="text-gray-500 hover:text-gray-700"
            >
              Skip
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="mb-8">
                  {current.illustration}
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {current.title}
                </h1>
                <p className="text-gray-600 text-lg leading-relaxed mb-8 px-4">
                  {current.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>

              <span className="text-sm text-gray-500">
                {currentStep + 1} of {onboardingSteps.length}
              </span>

              <Button
                onClick={nextStep}
                className={`flex items-center gap-2 ${
                  currentStep === onboardingSteps.length - 1
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
              >
                {currentStep === onboardingSteps.length - 1 ? "Get Started" : "Next"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}