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
  { date: "Mon", "Brand A": 4.2, "Brand B": 3.8, "Brand C": 2.1 },
  { date: "Tue", "Brand A": 4.8, "Brand B": 4.1, "Brand C": 2.4 },
  { date: "Wed", "Brand A": 5.2, "Brand B": 4.6, "Brand C": 2.8 },
  { date: "Thu", "Brand A": 4.9, "Brand B": 5.1, "Brand C": 2.2 },
  { date: "Fri", "Brand A": 5.8, "Brand B": 5.4, "Brand C": 3.1 },
  { date: "Sat", "Brand A": 6.2, "Brand B": 5.8, "Brand C": 3.5 },
  { date: "Sun", "Brand A": 5.5, "Brand B": 5.2, "Brand C": 3.0 },
]

const performanceData = [
  { metric: "Avg Likes", "Brand A": 38, "Brand B": 42, "Brand C": 28 },
  { metric: "Avg Comments", "Brand A": 12, "Brand B": 15, "Brand C": 8 },
  { metric: "Avg Shares", "Brand A": 5, "Brand B": 7, "Brand C": 3 },
]

export default function EngagementMetrics({ competitors }: EngagementMetricsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Engagement & Performance</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
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
              <Line type="monotone" dataKey="Brand A" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Brand B" stroke="var(--chart-2)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Brand C" stroke="var(--chart-3)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
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
              <Bar dataKey="Brand A" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Brand B" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Brand C" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Posting Frequency vs Engagement</h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Brand A", frequency: "3.2 posts/day", engagement: "5.2% avg" },
            { label: "Brand B", frequency: "2.1 posts/day", engagement: "4.9% avg" },
            { label: "Brand C", frequency: "1.8 posts/day", engagement: "2.8% avg" },
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
