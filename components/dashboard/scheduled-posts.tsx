"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MoreHorizontal } from "lucide-react"
import Link from "next/link"

const scheduledPosts = [
  {
    id: 1,
    content: "Excited to announce our new product launch! 🚀 Stay tuned for more details...",
    platforms: ["instagram", "twitter"],
    scheduledFor: "Today, 2:00 PM",
    status: "scheduled",
  },
  {
    id: 2,
    content: "Check out our latest blog post on social media trends for 2026...",
    platforms: ["linkedin", "twitter"],
    scheduledFor: "Tomorrow, 9:00 AM",
    status: "scheduled",
  },
  {
    id: 3,
    content: "Behind the scenes look at our team working on something special! 👀",
    platforms: ["instagram"],
    scheduledFor: "Jan 18, 12:00 PM",
    status: "draft",
  },
]

const platformIcons: Record<string, string> = {
  instagram: "📷",
  twitter: "𝕏",
  linkedin: "in",
  facebook: "f",
  bluesky: "🦋",
}

export function ScheduledPosts() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Scheduled Posts</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/calendar">View All</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {scheduledPosts.map((post) => (
            <div key={post.id} className="p-3 rounded-lg bg-secondary/50 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm line-clamp-2 flex-1">{post.content}</p>
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {post.platforms.map((platform) => (
                    <span
                      key={platform}
                      className="flex h-5 w-5 items-center justify-center rounded bg-background text-xs"
                    >
                      {platformIcons[platform]}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={post.status === "scheduled" ? "default" : "secondary"}
                    className={post.status === "scheduled" ? "bg-primary/20 text-primary border-0" : ""}
                  >
                    {post.status}
                  </Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {post.scheduledFor}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
