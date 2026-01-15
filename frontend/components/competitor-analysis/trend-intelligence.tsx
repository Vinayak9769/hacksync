"use client"

import { Card } from "@/components/ui/card"
import { Music } from "lucide-react"

interface TrendIntelligenceProps {
  competitors: string[]
}

const hashtags = [
  { tag: "#CoffeeArt", shared: 18, unique: 4, competitors: "Starbucks, Lavazza" },
  { tag: "#SustainableCoffee", shared: 12, unique: 3, competitors: "Nespresso, Lavazza" },
  { tag: "#CoffeeLovers", shared: 24, unique: 2, competitors: "Starbucks, Lavazza, Nespresso" },
  { tag: "#SpecialtyCoffee", shared: 8, unique: 5, competitors: "Lavazza, Nespresso" },
]

const trendingFormats = [
  { format: "Coffee Reels", adoption: 94, topCompetitor: "Starbucks" },
  { format: "Before/After (Brewing)", adoption: 76, topCompetitor: "Lavazza" },
  { format: "Stories", adoption: 68, topCompetitor: "Starbucks" },
  { format: "Educational Carousel", adoption: 52, topCompetitor: "Nespresso" },
]

const audio = [
  { track: "Cozy Coffee Shop Ambience", competitors: "Starbucks, Lavazza", uses: 32 },
  { track: "Upbeat Morning Vibes", competitors: "Starbucks", uses: 28 },
  { track: "Calm Meditation Background", competitors: "Nespresso", uses: 18 },
]

export default function TrendIntelligence({ competitors }: TrendIntelligenceProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Trend & Hashtag Intelligence</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Hashtag Strategy</h3>
          <div className="space-y-3">
            {hashtags.map((h, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div>
                  <p className="font-mono text-sm text-primary font-semibold">{h.tag}</p>
                  <p className="text-xs text-muted-foreground">{h.competitors}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-foreground">{h.shared} shared</div>
                  <div className="text-xs text-muted-foreground">{h.unique} unique</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Content Format Trends</h3>
          <div className="space-y-3">
            {trendingFormats.map((fmt, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-foreground">{fmt.format}</span>
                  <span className="text-xs text-muted-foreground">{fmt.adoption}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${fmt.adoption}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">{fmt.topCompetitor}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Trending Audio & Music</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {audio.map((aud, i) => (
            <div key={i} className="bg-secondary p-4 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Music className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">{aud.track}</p>
              </div>
              <p className="text-xs text-muted-foreground mb-2">Used by: {aud.competitors}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Uses</span>
                <span className="font-mono text-sm text-primary font-semibold">{aud.uses}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
