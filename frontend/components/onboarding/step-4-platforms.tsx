"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"
import { Facebook, Instagram, Linkedin, X } from "lucide-react"
import { BlueSky, Reddit } from "../brand-icons"

const platforms = [
  { id: "twitter", name: "Twitter/X", icon: X },
  { id: "facebook", name: "Facebook", icon: Facebook }, 
  { id: "linkedin", name: "LinkedIn", icon: Linkedin },
  { id: "instagram", name: "Instagram", icon: Instagram },
]

export default function OnboardingStep4({ formData, onContinue, onBack }: any) {
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>(
    formData.connectedPlatforms && formData.connectedPlatforms.length > 0 
      ? formData.connectedPlatforms 
      : []
  )

  const handleContinue = () => {
    onContinue({ connectedPlatforms })
  }

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold text-balance">Connect your social accounts</h1>
        <p className="text-lg text-muted-foreground">
          Link your accounts to get real-time data and insights. You can skip this for now.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {platforms.map((platform) => {
          const Icon = platform.icon
          const isConnected = connectedPlatforms.includes(platform.id)

          return (
            <Card
              key={platform.id}
              className={`p-6 border-2 transition-all ${
                isConnected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 text-primary" />
                {isConnected && (
                  <div className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-semibold">
                    Connected
                  </div>
                )}
              </div>
              <h3 className="font-semibold mb-4">{platform.name}</h3>
              <Button
                onClick={() =>
                  setConnectedPlatforms((prev) =>
                    prev.includes(platform.id) ? prev.filter((p) => p !== platform.id) : [...prev, platform.id],
                  )
                }
                variant={isConnected ? "default" : "outline"}
                className="w-full"
              >
                {isConnected ? "Disconnect" : "Connect"}
              </Button>
            </Card>
          )
        })}
      </div>

      <div className="flex justify-between gap-4">
        <Button onClick={onBack} variant="outline" size="lg">
          Back
        </Button>
        <Button onClick={handleContinue} size="lg">
          Continue
        </Button>
      </div>
    </div>
  )
}
