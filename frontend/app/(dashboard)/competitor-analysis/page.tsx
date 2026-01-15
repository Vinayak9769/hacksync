"use client"

import { useState } from "react"
import CompetitorOverview from "@/components/competitor-analysis/competitor-overview"
import CampaignAnalysis from "@/components/competitor-analysis/campaign-analysis"
import EngagementMetrics from "@/components/competitor-analysis/engagement-metrics"
import AIInsights from "@/components/competitor-analysis/ai-insights"
import TrendIntelligence from "@/components/competitor-analysis/trend-intelligence"
import Recommendations from "@/components/competitor-analysis/recommendations"

export default function CompetitorAnalysisPage() {
  const [selectedCompetitors, setSelectedCompetitors] = useState<string[]>(["starbucks", "lavazza"])

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Coffee Competitor Analysis</h1>
        <p className="text-muted-foreground">Track competitor strategies, campaigns, and engagement patterns in the coffee industry.</p>
      </div>

      <CompetitorOverview selectedCompetitors={selectedCompetitors} onSelectCompetitors={setSelectedCompetitors} />
      <CampaignAnalysis competitors={selectedCompetitors} />
      <EngagementMetrics competitors={selectedCompetitors} />
      <AIInsights competitors={selectedCompetitors} />
      <TrendIntelligence competitors={selectedCompetitors} />
      <Recommendations competitors={selectedCompetitors} />
    </div>
  )
}
