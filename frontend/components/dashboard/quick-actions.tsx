"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PenSquare, Calendar, Inbox, Sparkles } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "Create Post",
    description: "Write and schedule new content",
    icon: PenSquare,
    href: "/create",
    variant: "default" as const,
  },
  {
    title: "View Calendar",
    description: "See your content schedule",
    icon: Calendar,
    href: "/calendar",
    variant: "secondary" as const,
  },
  {
    title: "Open Inbox",
    description: "3 new messages",
    icon: Inbox,
    href: "/inbox",
    variant: "secondary" as const,
  },
  {
    title: "Generate with AI",
    description: "Let NestGPT create content",
    icon: Sparkles,
    href: "/ai",
    variant: "secondary" as const,
  },
]

export function QuickActions() {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant={action.variant}
              className="h-auto flex-col items-start gap-1 p-4"
              asChild
            >
              <Link href={action.href}>
                <action.icon className="h-5 w-5" />
                <span className="font-medium">{action.title}</span>
                <span className="text-xs opacity-70 font-normal">{action.description}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
