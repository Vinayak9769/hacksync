"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, TrendingUp, MessageSquare, Zap } from "lucide-react"
import { useState } from "react"

export default function OnboardingStep1({ formData, onContinue }: any) {
  const [selectedGoals, setSelectedGoals] = useState<string[]>(formData.selectedGoals || [])

  const goals = [
    { id: "launch", icon: Sparkles, label: "Launch a new campaign", emoji: "🚀" },
    { id: "grow", icon: TrendingUp, label: "Grow social media presence", emoji: "📈" },
    { id: "ads", icon: Zap, label: "Run ads", emoji: "📣" },
    { id: "competitors", icon: MessageSquare, label: "Analyze competitors", emoji: "🧠" },
    { id: "unified", icon: MessageSquare, label: "Manage social media in one place", emoji: "🤝" },
    { id: "explore", icon: Sparkles, label: "Just exploring", emoji: "🧪" },
  ]

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]))
  }

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      onContinue({ selectedGoals })
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-balance">Welcome to SocialNest</h1>
        <p className="text-xl text-muted-foreground">What brings you here today?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {goals.map((goal) => (
          <Card
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`p-6 cursor-pointer transition-all border-2 ${
              selectedGoals.includes(goal.id) ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl">{goal.emoji}</div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{goal.label}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 transition-colors flex items-center justify-center ${
                  selectedGoals.includes(goal.id) ? "bg-primary border-primary" : "border-border"
                }`}
              >
                {selectedGoals.includes(goal.id) && <div className="w-2 h-2 bg-primary-foreground rounded-full" />}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        <Button onClick={handleContinue} disabled={selectedGoals.length === 0} size="lg">
          Continue
        </Button>
      </div>
    </div>
  )
}
