"use client"

import { Card } from "@/components/ui/card"
import { Lightbulb, AlertCircle, Leaf, Users as UsersIcon, BookOpen } from "lucide-react"

interface AIInsightsProps {
  competitors: string[]
}

const aiInsights = [
  {
    id: 1,
    competitor: "Starbucks",
    insight: "Heavy focus on seasonal drinks, customer lifestyle storytelling, and community-driven campaigns",
    category: "Strategy",
    icon: Leaf,
  },
  {
    id: 2,
    competitor: "Lavazza",
    insight: "Emphasizes Italian heritage, coffee craftsmanship, and sustainability in sourcing practices",
    category: "Positioning",
    icon: UsersIcon,
  },
  {
    id: 3,
    competitor: "Nespresso",
    insight: "Premium positioning with focus on sustainability, luxury lifestyle, and environmental responsibility",
    category: "Brand Value",
    icon: BookOpen,
  },
]

const opportunities = [
  "Untapped niche: specialty coffee education content with origin stories",
  "Short-form video showing brewing techniques significantly underutilized",
  "Interactive polls about coffee preferences, brewing methods average 75% higher engagement",
]

const risks = [
  'Oversaturation of \"coffee at home\" messaging - market becoming commoditized',
  "Seasonal trends peak in winter/cold months; minimal engagement in summer",
  "Direct competition with mega-brands (Starbucks has 15x follower advantage)",
]

export default function AIInsights({ competitors }: AIInsightsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Messaging & Positioning Insights</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" /> Key Insights
          </h3>
          <div className="space-y-3">
            {aiInsights.map((insight) => {
              const IconComponent = insight.icon
              return (
              <Card key={insight.id} className="p-4 bg-secondary/50 border-border">
                <div className="flex gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 h-fit">
                    <IconComponent className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-primary mb-1">{insight.category}</p>
                    <p className="text-sm text-foreground">{insight.insight}</p>
                    <p className="text-xs text-muted-foreground mt-2">Source: {insight.competitor}</p>
                  </div>
                </div>
              </Card>
            )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-green-500" /> Opportunities
            </h3>
            <Card className="p-4 space-y-2 bg-green-500/10 border-green-500/20">
              {opportunities.map((opp, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <p className="text-sm text-foreground">{opp}</p>
                </div>
              ))}
            </Card>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-destructive" /> Risks to Avoid
            </h3>
            <Card className="p-4 space-y-2 bg-destructive/10 border-destructive/20">
              {risks.map((risk, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-destructive font-bold">!</span>
                  <p className="text-sm text-foreground">{risk}</p>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
