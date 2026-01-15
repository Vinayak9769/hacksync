"use client"

import { Card } from "@/components/ui/card"

interface TrendIntelligenceProps {
  competitors: string[]
}

const hashtags = [
  { tag: "#SustainableFashion", shared: 12, unique: 3, competitors: "A, B, C" },
  { tag: "#BehindTheScenes", shared: 8, unique: 2, competitors: "A, B" },
  { tag: "#CustomerStories", shared: 5, unique: 4, competitors: "A, C" },
  { tag: "#InnovationHub", shared: 6, unique: 1, competitors: "B" },
]

const trendingFormats = [
  { format: "Reels", adoption: 92, topCompetitor: "Brand A" },
  { format: "Carousels", adoption: 78, topCompetitor: "Brand B" },
  { format: "Stories", adoption: 65, topCompetitor: "Brand A" },
  { format: "Shorts", adoption: 58, topCompetitor: "Brand C" },
]

const audio = [
  { track: "Trending Audio #1", competitors: "A, B", uses: 24 },
  { track: "Trending Audio #2", competitors: "A, C", uses: 19 },
  { track: "Trending Audio #3", competitors: "B", uses: 15 },
]

export default function TrendIntelligence({ competitors }: TrendIntelligenceProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Trend & Hashtag Intelligence</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
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

        <Card className="p-6">
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

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Trending Audio & Music</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {audio.map((aud, i) => (
            <div key={i} className="bg-secondary p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">♪</span>
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
