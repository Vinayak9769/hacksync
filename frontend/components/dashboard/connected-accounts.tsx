"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Check } from "lucide-react"

const socialPlatforms = [
  {
    name: "Instagram",
    icon: "📷",
    connected: true,
    followers: "12.5K",
    status: "active",
  },
  {
    name: "Twitter/X",
    icon: "𝕏",
    connected: true,
    followers: "8.2K",
    status: "active",
  },
  {
    name: "LinkedIn",
    icon: "in",
    connected: true,
    followers: "5.1K",
    status: "active",
  },
  {
    name: "Facebook",
    icon: "f",
    connected: false,
    followers: null,
    status: "disconnected",
  },
  {
    name: "Bluesky",
    icon: "🦋",
    connected: false,
    followers: null,
    status: "disconnected",
  },
]

export function ConnectedAccounts() {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Connected Accounts</CardTitle>
        <Button variant="ghost" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {socialPlatforms.map((platform) => (
            <div key={platform.name} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-background text-sm font-medium">
                  {platform.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{platform.name}</p>
                  {platform.connected && (
                    <p className="text-xs text-muted-foreground">{platform.followers} followers</p>
                  )}
                </div>
              </div>
              {platform.connected ? (
                <Badge variant="secondary" className="bg-success/20 text-success border-0">
                  <Check className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
