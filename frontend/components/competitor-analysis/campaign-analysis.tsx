"use client"

import { Card } from "@/components/ui/card"
import { Zap, Heart, MessageCircle } from "lucide-react"

interface CampaignAnalysisProps {
  competitors: string[]
}

const campaigns = [
  {
    id: 1,
    competitor: "Starbucks",
    title: "Cold Brew Summer Campaign 2024",
    contentType: "Carousel",
    style: "Lifestyle",
    engagement: 125000,
    likes: 98000,
    comments: 8500,
  },
  {
    id: 2,
    competitor: "Lavazza",
    title: "Coffee Shop Tour Vlog",
    contentType: "Reel",
    style: "Behind-the-Scenes",
    engagement: 78000,
    likes: 62000,
    comments: 4200,
  },
  {
    id: 3,
    competitor: "Nespresso",
    title: "Sustainability & Recycling",
    contentType: "Short",
    style: "Educational",
    engagement: 45000,
    likes: 35000,
    comments: 3100,
  },
  {
    id: 4,
    competitor: "Starbucks",
    title: "New Seasonal Latte Flavors",
    contentType: "Carousel",
    style: "Product Launch",
    engagement: 156000,
    likes: 124000,
    comments: 9800,
  },
]

export default function CampaignAnalysis({ competitors }: CampaignAnalysisProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-4">Campaign & Content Analysis</h2>
      <Card className="overflow-hidden border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left font-semibold text-foreground">Campaign</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Competitor</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Type</th>
                <th className="px-6 py-3 text-left font-semibold text-foreground">Style</th>
                <th className="px-6 py-3 text-right font-semibold text-foreground">Engagement</th>
                <th className="px-6 py-3 text-right font-semibold text-foreground">Likes</th>
                <th className="px-6 py-3 text-right font-semibold text-foreground">Comments</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-border hover:bg-secondary/50 transition">
                  <td className="px-6 py-4 text-foreground font-medium">{campaign.title}</td>
                  <td className="px-6 py-4 text-muted-foreground">{campaign.competitor}</td>
                  <td className="px-6 py-4">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">{campaign.contentType}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{campaign.style}</td>
                  <td className="px-6 py-4 text-right font-semibold text-primary">{campaign.engagement.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-muted-foreground flex items-center justify-end gap-1">
                    <Heart className="w-4 h-4" /> {campaign.likes.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground flex items-center justify-end gap-1">
                    <MessageCircle className="w-4 h-4" /> {campaign.comments.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
