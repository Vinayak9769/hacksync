"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Check, Linkedin } from "lucide-react"
import { BlueSky, Facebook, Instagram, X } from "../brand-icons"

const socialPlatforms = [
  {
    name: "Instagram",
    icon: Instagram(),
    connected: true,
    followers: "12.5K",
    status: "active",
  },
  {
    name: "Twitter/X",
    icon: X(),
    connected: true,
    followers: "8.2K",
    status: "active",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin/>,
    connected: true,
    followers: "5.1K",
    status: "active",
  },
  {
    name: "Facebook",
    icon: Facebook(),
    connected: false,
    followers: null,
    status: "disconnected",
  },
  {
    name: "Bluesky",
    icon: BlueSky(),
    connected: false,
    followers: null,
    status: "disconnected",
  },
]

export function ConnectedAccounts() {
  return (
    <Card className="bg-card ">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Social Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 -mt-2">
          {socialPlatforms.map((platform) => (
            <div key={platform.name} className="flex items-center justify-between p-2 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 p-1.5 items-center justify-center rounded-md bg-background text-sm font-medium">
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
        <Button variant="outline" size="sm" className="mt-6 bg-white border-border rounded-sm">
          Connect more account
        </Button>
      </CardContent>
    </Card>
  )
}
