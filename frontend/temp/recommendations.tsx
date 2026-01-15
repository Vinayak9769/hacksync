"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle, Clock, Zap } from "lucide-react"

interface RecommendationsProps {
  competitors: string[]
}

const recommendations = [
  {
    id: 1,
    title: "Post Shorts Content More Frequently",
    description: "Competitors underutilize this format by 34%. Opportunity for high engagement.",
    priority: "high",
    impact: "Could increase engagement by 25-40%",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: 2,
    title: "Optimize Posting Times: 6-9 PM Weekdays",
    description: "When competitors dominate, but gaps exist in 2-4 PM slots for differentiation.",
    priority: "medium",
    impact: "Could reach 15% more audience",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    id: 3,
    title: 'Position as "Wellness + Sustainability" Leader',
    description: "No competitor fully covers this intersection. Could own this positioning.",
    priority: "high",
    impact: "Build unique brand identity",
    icon: <CheckCircle className="w-5 h-5" />,
  },
  {
    id: 4,
    title: "Launch Interactive Content Series",
    description: "Polls, quizzes, and Q&As average 60% higher engagement than static posts.",
    priority: "medium",
    impact: "Boost audience retention by 35%",
    icon: <CheckCircle className="w-5 h-5" />,
  },
]

export default function Recommendations({ competitors }: RecommendationsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-4">Actionable Recommendations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => (
          <Card
            key={rec.id}
            className={`p-6 border-2 ${rec.priority === "high" ? "border-primary/30" : "border-border"}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className={`p-2 rounded-lg ${
                  rec.priority === "high" ? "bg-primary/10 text-primary" : "bg-secondary text-foreground"
                }`}
              >
                {rec.icon}
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{rec.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {rec.priority === "high" ? "🔴 High Priority" : "🟡 Medium Priority"}
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground mb-3">{rec.description}</p>
            <div className="bg-secondary/50 p-3 rounded border border-border/50">
              <p className="text-xs font-semibold text-accent mb-1">Potential Impact:</p>
              <p className="text-sm text-foreground">{rec.impact}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
