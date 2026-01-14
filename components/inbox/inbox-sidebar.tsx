"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Inbox, MessageSquare, AtSign, MessageCircle, CheckCircle } from "lucide-react"

interface InboxSidebarProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  counts: {
    all: number
    unread: number
    dms: number
    mentions: number
    comments: number
  }
}

export function InboxSidebar({ activeFilter, onFilterChange, counts }: InboxSidebarProps) {
  const filters = [
    { id: "all", label: "All Messages", icon: Inbox, count: counts.all },
    { id: "unread", label: "Unread", icon: MessageSquare, count: counts.unread },
    { id: "dm", label: "Direct Messages", icon: MessageCircle, count: counts.dms },
    { id: "mention", label: "Mentions", icon: AtSign, count: counts.mentions },
    { id: "comment", label: "Comments", icon: MessageCircle, count: counts.comments },
    { id: "resolved", label: "Resolved", icon: CheckCircle, count: 0 },
  ]

  return (
    <div className="space-y-1">
      {filters.map((filter) => (
        <Button
          key={filter.id}
          variant={activeFilter === filter.id ? "secondary" : "ghost"}
          className={cn("w-full justify-start", activeFilter === filter.id && "bg-secondary")}
          onClick={() => onFilterChange(filter.id)}
        >
          <filter.icon className="h-4 w-4 mr-2" />
          <span className="flex-1 text-left">{filter.label}</span>
          {filter.count > 0 && (
            <Badge variant="secondary" className="ml-auto bg-primary/20 text-primary">
              {filter.count}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  )
}
