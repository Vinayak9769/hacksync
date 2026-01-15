"use client"

import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface EngagementMetricsProps {
  competitors: string[]
}

const engagementData = [
  { date: "Mon", Starbucks: 6.8, Lavazza: 5.2, Nespresso: 3.4 },
  { date: "Tue", Starbucks: 7.2, Lavazza: 5.8, Nespresso: 3.9 },
  { date: "Wed", Starbucks: 7.5, Lavazza: 6.1, Nespresso: 4.2 },
  { date: "Thu", Starbucks: 6.9, Lavazza: 6.4, Nespresso: 3.8 },
  { date: "Fri", Starbucks: 8.2, Lavazza: 7.1, Nespresso: 4.6 },
  { date: "Sat", Starbucks: 8.8, Lavazza: 7.5, Nespresso: 5.1 },
  { date: "Sun", Starbucks: 7.9, Lavazza: 6.8, Nespresso: 4.7 },
]

const performanceData = [
  { metric: "Avg Likes", Starbucks: 98, Lavazza: 62, Nespresso: 35 },
  { metric: "Avg Comments", Starbucks: 8.5, Lavazza: 4.2, Nespresso: 3.1 },
  { metric: "Avg Shares", Starbucks: 12, Lavazza: 7, Nespresso: 4 },
]

export default function EngagementMetrics({ competitors }: EngagementMetricsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Engagement & Performance</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Engagement Rate Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: `1px solid var(--border)`,
                  borderRadius: "0.625rem",
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="Starbucks" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Lavazza" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Nespresso" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Performance Metrics</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="metric" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: `1px solid var(--border)`,
                  borderRadius: "0.625rem",
                }}
              />
              <Legend />
              <Bar dataKey="Starbucks" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Lavazza" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Nespresso" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6 border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Posting Frequency vs Engagement</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Starbucks", frequency: "5.1 posts/day", engagement: "7.6% avg" },
            { label: "Lavazza", frequency: "4.2 posts/day", engagement: "6.5% avg" },
            { label: "Nespresso", frequency: "2.3 posts/day", engagement: "4.3% avg" },
          ].map((item, i) => (
            <div key={i} className="bg-secondary p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">{item.label}</p>
              <p className="text-lg font-semibold text-foreground">{item.frequency}</p>
              <p className="text-sm text-primary mt-2">{item.engagement}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
