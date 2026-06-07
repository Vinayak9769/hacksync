"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import OnboardingStep1 from "@/components/onboarding/step-1-welcome"
import OnboardingStep2 from "@/components/onboarding/step-2-brand"
import OnboardingStep3 from "@/components/onboarding/step-3-audience"
import OnboardingStep4 from "@/components/onboarding/step-4-platforms"
import OnboardingStep5 from "@/components/onboarding/step-5-summary"
import { API_URL, API_FETCH_OPTIONS } from "@/lib/api-config"

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    selectedGoals: [],
    brandName: "",
    brandDescription: "",
    industry: "",
    country: "",
    audienceType: "",
    ageRange: [],
    geography: [],
    tone: "",
    connectedPlatforms: [],
  })

  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    // Check if we have saved onboarding state (returning from OAuth)
    const savedData = localStorage.getItem("onboarding_formData")
    const savedStep = localStorage.getItem("onboarding_currentStep")
    
    if (savedData && savedStep) {
      try {
        setFormData(JSON.parse(savedData))
        setCurrentStep(parseInt(savedStep))
        
        // Clear them so we don't restore again on future visits
        localStorage.removeItem("onboarding_formData")
        localStorage.removeItem("onboarding_currentStep")
      } catch (e) {
        console.error("Failed to restore onboarding state", e)
      }
    }
    setIsVerifying(false)
  }, [router])

  const handleContinue = async (stepData: any) => {
    const updatedFormData = { ...formData, ...stepData }
    setFormData(updatedFormData)
    
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      try {
        const onboardingData = {
          brandName: updatedFormData.brandName || "",
          brandDescription: updatedFormData.brandDescription || "",
          industry: updatedFormData.industry || "",
          campaignGoal: updatedFormData.selectedGoals?.[0] || "",
          targetAudience: updatedFormData.audienceType || "",
          budget: "medium", // default
          channels: updatedFormData.connectedPlatforms || [],
          tone: updatedFormData.tone || ""
        };

        const response = await fetch(`${API_URL}/auth/onboarding`, {
          method: "POST",
          ...API_FETCH_OPTIONS,
          body: JSON.stringify(onboardingData)
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to save onboarding details");
        }

        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data.user));
        
        router.push("/dashboard")
      } catch (err: any) {
        console.error("Onboarding submission failed", err);
        alert(err.message || "Failed to save onboarding details. Please try again.");
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const steps = [OnboardingStep1, OnboardingStep2, OnboardingStep3, OnboardingStep4, OnboardingStep5]

  const CurrentStep = steps[currentStep - 1]

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse font-medium">Verifying authorization...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 mx-1 rounded-full transition-colors ${
                  step <= currentStep ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Step {currentStep} of 5</p>
        </div>

        {/* Current Step Content */}
        {CurrentStep && (
          <CurrentStep
            formData={formData}
            onContinue={handleContinue}
            onBack={currentStep > 1 ? handleBack : undefined}
          />
        )}
      </div>
    </div>
  )
}
