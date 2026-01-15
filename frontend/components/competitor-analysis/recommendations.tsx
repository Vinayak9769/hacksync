"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle, Clock, Zap } from "lucide-react"

interface RecommendationsProps {
  competitors: string[]
}

const recommendations = [
  {
    id: 1,
    title: "Create Coffee Origin Story Series",
    description: "Competitors rarely show bean origin & farming stories. Opportunity to build trust and differentiate with transparency.",
    priority: "high",
    impact: "Could increase engagement by 40-50% and build brand loyalty",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    id: 2,
    title: "Launch Interactive Brewing Polls & Challenges",
    description: "Ask followers about brew methods, flavor preferences. User-generated content with brewing results averages 70%+ engagement.",
    priority: "high",
    impact: "Boost community engagement by 45% and follower retention",
    icon: <CheckCircle className="w-5 h-5" />,
  },
  {
    id: 3,
    title: "Post 3-4x Daily (Morning, Lunch, Afternoon, Evening)",
    description: "Starbucks posts 5.1x/day. Coffee consumption peaks at specific times. Match audience coffee routines.",
    priority: "medium",
    impact: "Reach 20-30% more engaged users in peak hours",
    icon: <Clock className="w-5 h-5" />,
  },
  {
    id: 4,
    title: "Position as Sustainability Leader",
    description: "While Nespresso owns this, show your eco-friendly practices, biodegradable packaging, ethical sourcing.",
    priority: "high",
    impact: "Build ESG-conscious audience segment and premium positioning",
    icon: <CheckCircle className="w-5 h-5" />,
  },
  {
    id: 5,
    title: "Partner with Micro-Influencers (Coffee Enthusiasts)",
    description: "Macro influencers focus on lifestyle. Micro-influencers in coffee niche have higher conversion and authenticity.",
    priority: "medium",
    impact: "Increase conversion rate by 25% with niche audiences",
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
            className={`p-6 border-2 transition-all ${rec.priority === "high" ? "border-primary/30 bg-primary/5" : "border-border"}`}
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
