"use client"

import { Card } from "@/components/ui/card"
import { Zap, Heart, MessageCircle } from "lucide-react"

interface CampaignAnalysisProps {
  competitors: string[]
}

const campaigns = [
  {
    id: 1,
    competitor: "BrandA",
    title: "Summer Collection 2024",
    contentType: "Carousel",
    style: "Minimal",
    engagement: 45000,
    likes: 38000,
    comments: 2100,
  },
  {
    id: 2,
    competitor: "BrandB",
    title: "Behind the Scenes",
    contentType: "Reel",
    style: "Story-led",
    engagement: 62000,
    likes: 51000,
    comments: 3200,
  },
  {
    id: 3,
    competitor: "BrandA",
    title: "Customer Testimonials",
    contentType: "Short",
    style: "Educational",
    engagement: 28000,
    likes: 22000,
    comments: 1800,
  },
]

export default function CampaignAnalysis({ competitors }: CampaignAnalysisProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-4">Campaign & Content Analysis</h2>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Campaign</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Content Type</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Style</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Engagement</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Likes</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-secondary/50 transition-colors">
                  <td className="px-4 py-3 text-foreground font-medium">{campaign.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{campaign.contentType}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{campaign.style}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-foreground">
                    <div className="flex items-center justify-end gap-1">
                      <Zap className="w-4 h-4 text-accent" />
                      {(campaign.engagement / 1000).toFixed(1)}K
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                    <div className="flex items-center justify-end gap-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      {(campaign.likes / 1000).toFixed(1)}K
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                    <div className="flex items-center justify-end gap-1">
                      <MessageCircle className="w-4 h-4 text-blue-500" />
                      {(campaign.comments / 1000).toFixed(1)}K
                    </div>
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
