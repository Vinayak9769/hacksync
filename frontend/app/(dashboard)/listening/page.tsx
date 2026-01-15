"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, AlertTriangle, Plus, X, Bell, ThumbsUp, ThumbsDown, Minus, RefreshCw, ExternalLink } from "lucide-react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { API_ENDPOINTS, API_FETCH_OPTIONS } from "@/lib/api-config"

interface KeywordData {
  keyword: string
  mentions: number
  change: number
  sentiment: "positive" | "negative" | "neutral"
  platforms?: {
    reddit: number
    twitter: number
    instagram: number
  }
}

interface Mention {
  id: string
  platform: string
  author: string
  content: string
  sentiment: "positive" | "negative" | "neutral"
  timestamp: string
  url?: string
  engagement?: {
    score: number
    comments: number
  }
}

interface Alert {
  id: string
  type: "spike" | "negative" | "positive" | "trending"
  message: string
  severity: "info" | "warning" | "alert" | "critical"
  timestamp: string
  keyword?: string
}

interface TrendPoint {
  name: string
  mentions: number
  positive: number
  negative: number
  neutral: number
}

const platformIcons: Record<string, string> = {
  instagram: "📷",
  twitter: "𝕏",
  linkedin: "in",
  facebook: "f",
  reddit: "🔴",
}

export default function ListeningPage() {
  const [keywords, setKeywords] = useState<KeywordData[]>([])
  const [mentions, setMentions] = useState<Mention[]>([])
  const [trends, setTrends] = useState<TrendPoint[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [newKeyword, setNewKeyword] = useState("")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dataSource, setDataSource] = useState<"mock" | "reddit">("mock")

  // Fetch all listening data
  const fetchListeningData = async () => {
    try {
      setRefreshing(true)

      // Fetch keywords
      const keywordsRes = await fetch(API_ENDPOINTS.socialListening.keywords, API_FETCH_OPTIONS)
      const keywordsData = await keywordsRes.json()
      if (keywordsData.success && keywordsData.keywords) {
        setKeywords(keywordsData.keywords)
        setDataSource(keywordsData.source || "mock")
      }

      // Fetch mentions
      const mentionsRes = await fetch(API_ENDPOINTS.socialListening.mentions, API_FETCH_OPTIONS)
      const mentionsData = await mentionsRes.json()
      if (mentionsData.success && mentionsData.mentions) {
        setMentions(mentionsData.mentions)
      }

      // Fetch trends
      const trendsRes = await fetch(API_ENDPOINTS.socialListening.trends, API_FETCH_OPTIONS)
      const trendsData = await trendsRes.json()
      if (trendsData.success && trendsData.trends) {
        setTrends(trendsData.trends)
      }

      // Fetch alerts
      const alertsRes = await fetch(API_ENDPOINTS.socialListening.alerts, API_FETCH_OPTIONS)
      const alertsData = await alertsRes.json()
      if (alertsData.success && alertsData.alerts) {
        setAlerts(alertsData.alerts)
      }
    } catch (error) {
      console.error("Error fetching listening data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchListeningData()
  }, [])

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setKeywords([...keywords, { keyword: newKeyword, mentions: 0, change: 0, sentiment: "neutral" }])
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k.keyword !== keyword))
  }

  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter((a) => a.id !== alertId))
  }

  const overallSentiment = {
    positive: keywords.reduce((sum, k) => sum + (k.sentiment === "positive" ? k.mentions : 0), 0),
    neutral: keywords.reduce((sum, k) => sum + (k.sentiment === "neutral" ? k.mentions : 0), 0),
    negative: keywords.reduce((sum, k) => sum + (k.sentiment === "negative" ? k.mentions : 0), 0),
  }

  const totalMentions = overallSentiment.positive + overallSentiment.neutral + overallSentiment.negative
  const sentimentPercentages = {
    positive: totalMentions > 0 ? Math.round((overallSentiment.positive / totalMentions) * 100) : 0,
    neutral: totalMentions > 0 ? Math.round((overallSentiment.neutral / totalMentions) * 100) : 0,
    negative: totalMentions > 0 ? Math.round((overallSentiment.negative / totalMentions) * 100) : 0,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Social Listening</h1>
          <p className="text-muted-foreground">Monitor keywords, hashtags, and brand mentions across social media</p>
          {dataSource === "reddit" && (
            <Badge variant="outline" className="mt-2">
              <span className="mr-1">🔴</span> Live Reddit Data
            </Badge>
          )}
          {dataSource === "mock" && (
            <Badge variant="secondary" className="mt-2">
              Mock Data (Reddit not configured)
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchListeningData} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Alert Settings
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className={
                alert.severity === "alert" || alert.severity === "critical"
                  ? "bg-destructive/10 border-destructive/50"
                  : alert.severity === "warning"
                  ? "bg-warning/10 border-warning/50"
                  : "bg-primary/10 border-primary/50"
              }
            >
              <CardContent className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle
                    className={`h-5 w-5 ${
                      alert.severity === "alert" || alert.severity === "critical"
                        ? "text-destructive"
                        : alert.severity === "warning"
                        ? "text-warning"
                        : "text-primary"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => dismissAlert(alert.id)}>
                  Dismiss
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Mentions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMentions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all keywords</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Positive Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{sentimentPercentages.positive}%</div>
            <Progress value={sentimentPercentages.positive} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Neutral Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{sentimentPercentages.neutral}%</div>
            <Progress value={sentimentPercentages.neutral} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Negative Sentiment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{sentimentPercentages.negative}%</div>
            <Progress value={sentimentPercentages.negative} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="keywords" className="space-y-6">
        <TabsList>
          <TabsTrigger value="keywords">Tracked Keywords</TabsTrigger>
          <TabsTrigger value="mentions">Recent Mentions</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Tracked Keywords */}
        <TabsContent value="keywords" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tracked Keywords</CardTitle>
              <CardDescription>Monitor specific keywords, hashtags, and brand mentions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Keyword */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add keyword (e.g., #coffee, specialty coffee, Ettara)"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                />
                <Button onClick={addKeyword}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              {/* Keywords List */}
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading keywords...</div>
              ) : (
                <div className="space-y-3">
                  {keywords.map((item) => (
                    <div
                      key={item.keyword}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-1">
                          <p className="font-semibold">{item.keyword}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-muted-foreground">
                              {item.mentions.toLocaleString()} mentions
                            </span>
                            {item.platforms && (
                              <span className="text-xs text-muted-foreground">
                                Reddit: {item.platforms.reddit}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.change > 0 ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-500/20">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {item.change}%
                            </Badge>
                          ) : item.change < 0 ? (
                            <Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-500/20">
                              <TrendingDown className="h-3 w-3 mr-1" />
                              {Math.abs(item.change)}%
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/20">
                              <Minus className="h-3 w-3 mr-1" />
                              0%
                            </Badge>
                          )}
                        </div>

                        <Badge
                          variant={
                            item.sentiment === "positive"
                              ? "default"
                              : item.sentiment === "negative"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {item.sentiment === "positive" && <ThumbsUp className="h-3 w-3 mr-1" />}
                          {item.sentiment === "negative" && <ThumbsDown className="h-3 w-3 mr-1" />}
                          {item.sentiment}
                        </Badge>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeKeyword(item.keyword)}
                        className="ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {keywords.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No keywords tracked yet. Add your first keyword above.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Recent Mentions */}
        <TabsContent value="mentions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Mentions</CardTitle>
              <CardDescription>Latest social media posts mentioning your keywords</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading mentions...</div>
              ) : (
                <div className="space-y-4">
                  {mentions.map((mention) => (
                    <div
                      key={mention.id}
                      className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{platformIcons[mention.platform]}</span>
                            <span className="font-semibold text-sm">{mention.author}</span>
                            <span className="text-xs text-muted-foreground capitalize">{mention.platform}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">{mention.timestamp}</span>
                          </div>
                          <p className="text-sm leading-relaxed">{mention.content}</p>
                          {mention.engagement && (
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>👍 {mention.engagement.score}</span>
                              <span>💬 {mention.engagement.comments}</span>
                            </div>
                          )}
                          {mention.url && (
                            <a
                              href={mention.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                            >
                              View on Reddit
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                        <Badge
                          variant={
                            mention.sentiment === "positive"
                              ? "default"
                              : mention.sentiment === "negative"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {mention.sentiment}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {mentions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No recent mentions found.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mention Trends</CardTitle>
              <CardDescription>Track mentions and sentiment over time</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading trends...</div>
              ) : trends.length > 0 ? (
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trends}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                      <YAxis stroke="#888888" fontSize={12} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-3 shadow-md">
                                <p className="font-semibold mb-2">{payload[0].payload.name}</p>
                                <div className="space-y-1">
                                  <p className="text-sm text-green-600">
                                    Positive: {payload.find((p) => p.dataKey === "positive")?.value}
                                  </p>
                                  <p className="text-sm text-blue-600">
                                    Neutral: {payload.find((p) => p.dataKey === "neutral")?.value}
                                  </p>
                                  <p className="text-sm text-red-600">
                                    Negative: {payload.find((p) => p.dataKey === "negative")?.value}
                                  </p>
                                  <p className="text-sm font-semibold mt-1">
                                    Total: {payload.find((p) => p.dataKey === "mentions")?.value}
                                  </p>
                                </div>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="positive"
                        stackId="1"
                        stroke="rgb(34, 197, 94)"
                        fill="rgb(34, 197, 94)"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="neutral"
                        stackId="1"
                        stroke="rgb(59, 130, 246)"
                        fill="rgb(59, 130, 246)"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="negative"
                        stackId="1"
                        stroke="rgb(239, 68, 68)"
                        fill="rgb(239, 68, 68)"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No trend data available yet.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
