"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, AlertTriangle, Plus, X, Bell, ThumbsUp, ThumbsDown, Minus } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const trackedKeywords = [
  { keyword: "#SocialNest", mentions: 1234, change: 23, sentiment: "positive" },
  { keyword: "@SocialNest", mentions: 856, change: 12, sentiment: "positive" },
  { keyword: "social media tool", mentions: 543, change: -5, sentiment: "neutral" },
  { keyword: "competitor brand", mentions: 321, change: 8, sentiment: "negative" },
]

const mentionsTrend = [
  { name: "Mon", mentions: 120, positive: 80, negative: 20, neutral: 20 },
  { name: "Tue", mentions: 180, positive: 120, negative: 30, neutral: 30 },
  { name: "Wed", mentions: 250, positive: 150, negative: 50, neutral: 50 },
  { name: "Thu", mentions: 320, positive: 200, negative: 60, neutral: 60 },
  { name: "Fri", mentions: 280, positive: 180, negative: 50, neutral: 50 },
  { name: "Sat", mentions: 150, positive: 100, negative: 25, neutral: 25 },
  { name: "Sun", mentions: 100, positive: 70, negative: 15, neutral: 15 },
]

const recentMentions = [
  {
    id: 1,
    platform: "twitter",
    author: "@techblogger",
    content: "Just discovered @SocialNest - this is exactly what I needed for managing my social presence!",
    sentiment: "positive",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    platform: "linkedin",
    author: "Marketing Pro",
    content: "Been comparing social media tools and SocialNest stands out for its AI features.",
    sentiment: "positive",
    timestamp: "4 hours ago",
  },
  {
    id: 3,
    platform: "twitter",
    author: "@skeptic_user",
    content: "Not sure about the pricing of @SocialNest. Seems expensive compared to alternatives.",
    sentiment: "negative",
    timestamp: "6 hours ago",
  },
  {
    id: 4,
    platform: "instagram",
    author: "@smm_expert",
    content: "Trying out various social media schedulers this week. SocialNest is one of them.",
    sentiment: "neutral",
    timestamp: "8 hours ago",
  },
]

const alerts = [
  {
    id: 1,
    type: "spike",
    message: "Unusual spike in mentions detected - 150% increase in the last hour",
    severity: "warning",
    timestamp: "30 min ago",
  },
  {
    id: 2,
    type: "negative",
    message: "Negative sentiment trending for keyword 'competitor brand'",
    severity: "alert",
    timestamp: "2 hours ago",
  },
]

const platformIcons: Record<string, string> = {
  instagram: "📷",
  twitter: "𝕏",
  linkedin: "in",
  facebook: "f",
}

export default function ListeningPage() {
  const [keywords, setKeywords] = useState(trackedKeywords)
  const [newKeyword, setNewKeyword] = useState("")

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setKeywords([...keywords, { keyword: newKeyword, mentions: 0, change: 0, sentiment: "neutral" as const }])
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k.keyword !== keyword))
  }

  const overallSentiment = {
    positive: 65,
    neutral: 25,
    negative: 10,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Social Listening</h1>
          <p className="text-muted-foreground">Monitor keywords, hashtags, and brand mentions across social media</p>
        </div>
        <Button variant="outline">
          <Bell className="h-4 w-4 mr-2" />
          Alert Settings
        </Button>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className={
                alert.severity === "alert"
                  ? "bg-destructive/10 border-destructive/50"
                  : "bg-warning/10 border-warning/50"
              }
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle
                    className={`h-5 w-5 ${alert.severity === "alert" ? "text-destructive" : "text-warning"}`}
                  />
                  <div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Dismiss
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tracked Keywords */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Tracked Keywords</CardTitle>
          <CardDescription>Add keywords, hashtags, or competitors to monitor</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              placeholder="Add keyword or hashtag..."
              className="bg-secondary/50"
              onKeyDown={(e) => e.key === "Enter" && addKeyword()}
            />
            <Button onClick={addKeyword}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {keywords.map((item) => (
              <div key={item.keyword} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium text-sm">{item.keyword}</p>
                    <p className="text-xs text-muted-foreground">{item.mentions.toLocaleString()} mentions</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={
                      item.sentiment === "positive"
                        ? "bg-success/20 text-success"
                        : item.sentiment === "negative"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-muted text-muted-foreground"
                    }
                  >
                    {item.change > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : item.change < 0 ? (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    ) : (
                      <Minus className="h-3 w-3 mr-1" />
                    )}
                    {item.change > 0 ? "+" : ""}
                    {item.change}%
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeKeyword(item.keyword)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Mentions Trend */}
        <div className="lg:col-span-2">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Mentions Over Time</CardTitle>
              <CardDescription>Total mentions and sentiment breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mentionsTrend}>
                    <defs>
                      <linearGradient id="mentionsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="oklch(0.7 0.18 165)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="oklch(0.7 0.18 165)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.16 0.005 285)",
                        border: "1px solid oklch(0.25 0.01 285)",
                        borderRadius: "8px",
                        color: "oklch(0.95 0 0)",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="mentions"
                      stroke="oklch(0.7 0.18 165)"
                      strokeWidth={2}
                      fill="url(#mentionsGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sentiment Analysis */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Sentiment Analysis</CardTitle>
            <CardDescription>Overall sentiment breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-success" />
                  <span>Positive</span>
                </div>
                <span className="font-medium">{overallSentiment.positive}%</span>
              </div>
              <Progress value={overallSentiment.positive} className="h-2 bg-secondary [&>div]:bg-success" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Minus className="h-4 w-4 text-muted-foreground" />
                  <span>Neutral</span>
                </div>
                <span className="font-medium">{overallSentiment.neutral}%</span>
              </div>
              <Progress value={overallSentiment.neutral} className="h-2 bg-secondary [&>div]:bg-muted-foreground" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ThumbsDown className="h-4 w-4 text-destructive" />
                  <span>Negative</span>
                </div>
                <span className="font-medium">{overallSentiment.negative}%</span>
              </div>
              <Progress value={overallSentiment.negative} className="h-2 bg-secondary [&>div]:bg-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Mentions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-base">Recent Mentions</CardTitle>
          <CardDescription>Latest mentions across all platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="bg-secondary mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="positive">Positive</TabsTrigger>
              <TabsTrigger value="neutral">Neutral</TabsTrigger>
              <TabsTrigger value="negative">Negative</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3">
              {recentMentions.map((mention) => (
                <div key={mention.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                  <span className="flex h-8 w-8 items-center justify-center rounded bg-background text-sm">
                    {platformIcons[mention.platform]}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{mention.author}</span>
                      <Badge
                        variant="secondary"
                        className={
                          mention.sentiment === "positive"
                            ? "bg-success/20 text-success"
                            : mention.sentiment === "negative"
                              ? "bg-destructive/20 text-destructive"
                              : "bg-muted text-muted-foreground"
                        }
                      >
                        {mention.sentiment}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-auto">{mention.timestamp}</span>
                    </div>
                    <p className="text-sm">{mention.content}</p>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="positive" className="space-y-3">
              {recentMentions
                .filter((m) => m.sentiment === "positive")
                .map((mention) => (
                  <div key={mention.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                    <span className="flex h-8 w-8 items-center justify-center rounded bg-background text-sm">
                      {platformIcons[mention.platform]}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{mention.author}</span>
                        <Badge variant="secondary" className="bg-success/20 text-success">
                          positive
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-auto">{mention.timestamp}</span>
                      </div>
                      <p className="text-sm">{mention.content}</p>
                    </div>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="neutral" className="space-y-3">
              {recentMentions
                .filter((m) => m.sentiment === "neutral")
                .map((mention) => (
                  <div key={mention.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                    <span className="flex h-8 w-8 items-center justify-center rounded bg-background text-sm">
                      {platformIcons[mention.platform]}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{mention.author}</span>
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                          neutral
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-auto">{mention.timestamp}</span>
                      </div>
                      <p className="text-sm">{mention.content}</p>
                    </div>
                  </div>
                ))}
            </TabsContent>

            <TabsContent value="negative" className="space-y-3">
              {recentMentions
                .filter((m) => m.sentiment === "negative")
                .map((mention) => (
                  <div key={mention.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                    <span className="flex h-8 w-8 items-center justify-center rounded bg-background text-sm">
                      {platformIcons[mention.platform]}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{mention.author}</span>
                        <Badge variant="secondary" className="bg-destructive/20 text-destructive">
                          negative
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-auto">{mention.timestamp}</span>
                      </div>
                      <p className="text-sm">{mention.content}</p>
                    </div>
                  </div>
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
