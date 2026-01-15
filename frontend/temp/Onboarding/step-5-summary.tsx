"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export default function OnboardingStep5({ formData, onContinue, onBack }: any) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCreateDashboard = async () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      onContinue({})
    }, 1500)
  }

  const platformNames: Record<string, string> = {
    instagram: "Instagram",
    linkedin: "LinkedIn",
    twitter: "X (Twitter)",
    youtube: "YouTube",
  }

  const goalNames: Record<string, string> = {
    launch: "Launch a new campaign",
    grow: "Grow social media presence",
    ads: "Run ads",
    competitors: "Analyze competitors",
    unified: "Manage social media in one place",
    explore: "Just exploring",
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-balance">Here's what we understood</h1>
        <p className="text-lg text-muted-foreground">Review your settings and make sure everything looks good</p>
      </div>

      <Card className="p-8 border border-border space-y-6">
        {/* Brand Name */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">Brand Name</p>
          <p className="text-lg font-semibold">{formData.brandName}</p>
        </div>

        {/* Goals */}
        <div>
          <p className="text-sm text-muted-foreground mb-3">Your Goals</p>
          <div className="flex flex-wrap gap-2">
            {formData.selectedGoals?.map((goal: string) => (
              <Badge key={goal} variant="secondary" className="text-sm">
                {goalNames[goal] || goal}
              </Badge>
            ))}
          </div>
        </div>

        {/* Audience */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">Target Audience</p>
          <p className="font-semibold">
            {formData.audienceType} • Ages {formData.ageRange?.join(", ")}
          </p>
          <p className="text-muted-foreground">{formData.geography?.join(", ")}</p>
        </div>

        {/* Tone */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">Brand Tone</p>
          <p className="text-lg font-semibold">{formData.tone}</p>
        </div>

        {/* Platforms */}
        {formData.connectedPlatforms?.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-3">Connected Platforms</p>
            <div className="flex flex-wrap gap-2">
              {formData.connectedPlatforms?.map((platform: string) => (
                <Badge key={platform} className="text-sm">
                  {platformNames[platform] || platform}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="flex justify-between gap-4">
        <Button onClick={onBack} variant="outline" size="lg">
          Back
        </Button>
        <Button onClick={handleCreateDashboard} disabled={isLoading} size="lg" className="gap-2">
          {isLoading ? "Creating dashboard..." : "Create My Dashboard"}
        </Button>
      </div>
    </div>
  )
}
