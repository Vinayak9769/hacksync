"use client"

import { useState, useMemo } from "react"
import { addMonths, subMonths } from "date-fns"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { MonthView } from "@/components/calendar/month-view"
import { WeekView } from "@/components/calendar/week-view"
import { DayView } from "@/components/calendar/day-view"
import { samplePosts } from "@/lib/calendar-data"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 15))
  const [view, setView] = useState<"day" | "week" | "month">("month")
  const [platformFilter, setPlatformFilter] = useState<string[]>([
    "instagram",
    "twitter",
    "linkedin",
    "facebook",
    "bluesky",
  ])
  const [statusFilter, setStatusFilter] = useState<string[]>(["scheduled", "draft", "published"])

  const filteredPosts = useMemo(() => {
    return samplePosts.filter((post) => {
      const platformMatch = post.platforms.some((p) => platformFilter.includes(p))
      const statusMatch = statusFilter.includes(post.status)
      return platformMatch && statusMatch
    })
  }, [platformFilter, statusFilter])

  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date(2026, 0, 15))
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Content Calendar</h1>
        <p className="text-muted-foreground">Plan and schedule your content across all platforms</p>
      </div>

      <CalendarHeader
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        view={view}
        onViewChange={setView}
        platformFilter={platformFilter}
        onPlatformFilterChange={setPlatformFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {view === "month" && <MonthView currentDate={currentDate} posts={filteredPosts} />}
      {view === "week" && <WeekView currentDate={currentDate} posts={filteredPosts} />}
      {view === "day" && <DayView currentDate={currentDate} posts={filteredPosts} />}
    </div>
  )
}
