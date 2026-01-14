"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Eye, MousePointer, TrendingUp, Plus, Play, Pause, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const adCampaigns = [
  {
    id: "1",
    name: "Product Launch Campaign",
    platform: "instagram",
    status: "active",
    budget: 500,
    spent: 324,
    reach: 45000,
    clicks: 1250,
    conversions: 89,
  },
  {
    id: "2",
    name: "Brand Awareness",
    platform: "facebook",
    status: "active",
    budget: 300,
    spent: 187,
    reach: 32000,
    clicks: 890,
    conversions: 45,
  },
  {
    id: "3",
    name: "Holiday Sale",
    platform: "twitter",
    status: "paused",
    budget: 200,
    spent: 200,
    reach: 18000,
    clicks: 560,
    conversions: 32,
  },
]

const adPerformanceData = [
  { name: "Mon", spend: 45, conversions: 12 },
  { name: "Tue", spend: 52, conversions: 15 },
  { name: "Wed", spend: 48, conversions: 11 },
  { name: "Thu", spend: 61, conversions: 18 },
  { name: "Fri", spend: 55, conversions: 14 },
  { name: "Sat", spend: 32, conversions: 8 },
  { name: "Sun", spend: 28, conversions: 6 },
]

const platformIcons: Record<string, string> = {
  instagram: "📷",
  twitter: "𝕏",
  linkedin: "in",
  facebook: "f",
}

export default function AdsPage() {
  const totalSpent = adCampaigns.reduce((acc, c) => acc + c.spent, 0)
  const totalReach = adCampaigns.reduce((acc, c) => acc + c.reach, 0)
  const totalClicks = adCampaigns.reduce((acc, c) => acc + c.clicks, 0)
  const totalConversions = adCampaigns.reduce((acc, c) => acc + c.conversions, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Ads Manager</h1>
          <p className="text-muted-foreground">Create and manage your advertising campaigns</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Ad
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reach</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalReach / 1000).toFixed(1)}K</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">CTR: 2.8%</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions}</div>
            <p className="text-xs text-muted-foreground">Cost per conversion: $4.28</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          {adCampaigns.map((campaign) => (
            <Card key={campaign.id} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-lg">
                      {platformIcons[campaign.platform]}
                    </span>
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">{campaign.platform}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={campaign.status === "active" ? "default" : "secondary"}
                      className={campaign.status === "active" ? "bg-success/20 text-success border-0" : ""}
                    >
                      {campaign.status === "active" ? (
                        <Play className="h-3 w-3 mr-1" />
                      ) : (
                        <Pause className="h-3 w-3 mr-1" />
                      )}
                      {campaign.status}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Campaign</DropdownMenuItem>
                        <DropdownMenuItem>{campaign.status === "active" ? "Pause" : "Resume"}</DropdownMenuItem>
                        <DropdownMenuItem>View Analytics</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="font-medium">
                      ${campaign.spent} / ${campaign.budget}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Reach</p>
                    <p className="font-medium">{(campaign.reach / 1000).toFixed(1)}K</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Clicks</p>
                    <p className="font-medium">{campaign.clicks.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Conversions</p>
                    <p className="font-medium">{campaign.conversions}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Budget spent</span>
                    <span>{Math.round((campaign.spent / campaign.budget) * 100)}%</span>
                  </div>
                  <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2 bg-secondary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="performance">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Daily Performance</CardTitle>
              <CardDescription>Ad spend vs conversions over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={adPerformanceData}>
                    <XAxis dataKey="name" stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="oklch(0.65 0 0)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="oklch(0.65 0 0)"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(0.16 0.005 285)",
                        border: "1px solid oklch(0.25 0.01 285)",
                        borderRadius: "8px",
                        color: "oklch(0.95 0 0)",
                      }}
                    />
                    <Bar
                      yAxisId="left"
                      dataKey="spend"
                      fill="oklch(0.65 0.15 250)"
                      radius={[4, 4, 0, 0]}
                      name="Spend ($)"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="conversions"
                      fill="oklch(0.7 0.18 165)"
                      radius={[4, 4, 0, 0]}
                      name="Conversions"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "oklch(0.65 0.15 250)" }} />
                  <span className="text-sm text-muted-foreground">Spend ($)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "oklch(0.7 0.18 165)" }} />
                  <span className="text-sm text-muted-foreground">Conversions</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
