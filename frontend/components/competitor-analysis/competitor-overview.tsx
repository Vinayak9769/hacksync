"use client"

import { TrendingUp, TrendingDown, Building2, Rocket, Star } from "lucide-react"
import { Card } from "@/components/ui/card"

interface CompetitorOverviewProps {
  selectedCompetitors: string[]
  onSelectCompetitors: (competitors: string[]) => void
}

const competitors = [
  {
    id: "lavazza",
    name: "Lavazza",
    icon: Building2,
    platforms: ["Instagram", "Facebook", "TikTok"],
    postingFrequency: "4.2 posts/day",
    followerGrowth: 15.3,
    followers: "2.8M",
  },
  {
    id: "starbucks",
    name: "Starbucks",
    icon: Rocket,
    platforms: ["Instagram", "TikTok", "YouTube"],
    postingFrequency: "5.1 posts/day",
    followerGrowth: 18.7,
    followers: "8.5M",
  },
  {
    id: "nespresso",
    name: "Nespresso",
    icon: Star,
    platforms: ["Instagram", "Pinterest", "LinkedIn"],
    postingFrequency: "2.3 posts/day",
    followerGrowth: 9.4,
    followers: "1.2M",
  },
]

export default function CompetitorOverview({ selectedCompetitors, onSelectCompetitors }: CompetitorOverviewProps) {
  const toggleCompetitor = (id: string) => {
    if (selectedCompetitors.includes(id)) {
      onSelectCompetitors(selectedCompetitors.filter((c) => c !== id))
    } else {
      onSelectCompetitors([...selectedCompetitors, id])
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-4">Competitor Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {competitors.map((competitor) => {
          const IconComponent = competitor.icon
          return (
          <Card
            key={competitor.id}
            className={`p-6 cursor-pointer transition-all hover:border-primary/50 ${selectedCompetitors.includes(competitor.id) ? "ring-2 ring-primary border-primary/50" : "border-border"}`}
            onClick={() => toggleCompetitor(competitor.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{competitor.name}</h3>
                  <p className="text-xs text-muted-foreground">{competitor.followers}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={selectedCompetitors.includes(competitor.id)}
                onChange={() => toggleCompetitor(competitor.id)}
                className="w-4 h-4"
              />
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-xs">Platforms:</span>
                <div className="flex gap-1">
                  {competitor.platforms.map((p) => (
                    <span key={p} className="text-xs bg-secondary px-2 py-1 rounded">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Posting Frequency</span>
                <span className="font-mono text-foreground">{competitor.postingFrequency}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Follower Growth</span>
                <div className="flex items-center gap-1">
                  {competitor.followerGrowth > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  )}
                  <span className={`font-mono font-semibold ${competitor.followerGrowth > 0 ? "text-green-500" : "text-destructive"}`}>
                    {Math.abs(competitor.followerGrowth)}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        )
        })}
      </div>
    </div>
  )
}
