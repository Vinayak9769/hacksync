"use client"

import { Card } from "@/components/ui/card"
import { Lightbulb, AlertCircle } from "lucide-react"

interface AIInsightsProps {
  competitors: string[]
}

const aiInsights = [
  {
    id: 1,
    competitor: "Brand A",
    insight: "Focuses heavily on sustainability narratives and eco-friendly messaging",
    category: "Messaging",
    icon: "🌱",
  },
  {
    id: 2,
    competitor: "Brand B",
    insight: "Uses influencer-led storytelling with user-generated content integration",
    category: "Strategy",
    icon: "👥",
  },
  {
    id: 3,
    competitor: "Brand C",
    insight: "Emphasizes educational content with high-quality production values",
    category: "Content",
    icon: "📚",
  },
]

const opportunities = [
  "Untapped niche: wellness + sustainability hybrid messaging not yet covered",
  "Video shorts format significantly underutilized across all competitors",
  "Interactive content (polls, quizzes) average 60% higher engagement",
]

const risks = [
  'Avoid overusing "exclusive deal" language - saturated across all platforms',
  "Hashtag #SustainableStyle declining 23% month-over-month",
  "Seasonal content gap observed: minimal posts Nov-Dec",
]

export default function AIInsights({ competitors }: AIInsightsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Messaging & Positioning Insights</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiInsights.map((insight) => (
          <Card key={insight.id} className="p-4">
            <div className="flex gap-3 mb-3">
              <span className="text-3xl">{insight.icon}</span>
              <div>
                <h3 className="font-semibold text-foreground text-sm">AI Insight</h3>
                <p className="text-xs text-muted-foreground">{insight.category}</p>
              </div>
            </div>
            <p className="text-sm text-foreground">{insight.insight}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-2 border-[hsl(var(--success))]/30">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-[hsl(var(--success))]" />
            <h3 className="font-semibold text-foreground">Differentiation Opportunities</h3>
          </div>
          <ul className="space-y-2">
            {opportunities.map((opp, i) => (
              <li key={i} className="text-sm text-foreground flex gap-2">
                <span className="text-[hsl(var(--success))] font-bold">→</span>
                {opp}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 border-2 border-destructive/30">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <h3 className="font-semibold text-foreground">Risks & Trends to Avoid</h3>
          </div>
          <ul className="space-y-2">
            {risks.map((risk, i) => (
              <li key={i} className="text-sm text-foreground flex gap-2">
                <span className="text-destructive font-bold">✕</span>
                {risk}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
