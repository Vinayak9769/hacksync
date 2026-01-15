"use client"
import { API_ENDPOINTS, API_FETCH_OPTIONS } from '@/lib/api-config'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Check, Linkedin, Loader2 } from "lucide-react"
import { BlueSky, Facebook, Instagram, X } from "../brand-icons"
<<<<<<< HEAD

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
    connected: true,
    followers: "3.8K",
    status: "active",
  },
  {
    name: "Bluesky",
    icon: BlueSky(),
    connected: false,
    followers: null,
    status: "disconnected",
  },
]
=======
import { useToast } from "@/hooks/use-toast"
>>>>>>> 0dece71 (hg)

export function ConnectedAccounts() {
  const { toast } = useToast()
  const [twitterStatus, setTwitterStatus] = useState<{ connected: boolean; username?: string }>({ connected: false })
  const [isCheckingTwitter, setIsCheckingTwitter] = useState(true)
  const [isConnectingTwitter, setIsConnectingTwitter] = useState(false)
  const [isDisconnectingTwitter, setIsDisconnectingTwitter] = useState(false)

  useEffect(() => {
    checkTwitterConnection()
  }, [])

  const checkTwitterConnection = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.twitter.status, {
        ...API_FETCH_OPTIONS
      })
      const data = await response.json()
      setTwitterStatus(data)
    } catch (error) {
      console.error('Error checking Twitter connection:', error)
    } finally {
      setIsCheckingTwitter(false)
    }
  }

  const handleTwitterConnect = async () => {
    setIsConnectingTwitter(true)
    try {
      const response = await fetch(API_ENDPOINTS.twitter.auth, {
        ...API_FETCH_OPTIONS
      })
      const data = await response.json()

      if (data.success && data.authUrl) {
        // Redirect to Twitter OAuth
        window.location.href = data.authUrl
      } else {
        toast({
          title: "Error",
          description: "Failed to initiate Twitter connection",
          variant: "destructive"
        })
        setIsConnectingTwitter(false)
      }
    } catch (error) {
      console.error('Error connecting to Twitter:', error)
      toast({
        title: "Error",
        description: "Failed to connect to Twitter",
        variant: "destructive"
      })
      setIsConnectingTwitter(false)
    }
  }

  const handleTwitterDisconnect = async () => {
    setIsDisconnectingTwitter(true)
    try {
      const response = await fetch(API_ENDPOINTS.twitter.disconnect, {
        method: 'POST',
        ...API_FETCH_OPTIONS
      })
      const data = await response.json()

      if (data.success) {
        setTwitterStatus({ connected: false })
        toast({
          title: "Disconnected",
          description: "Twitter account has been disconnected"
        })
      }
    } catch (error) {
      console.error('Error disconnecting Twitter:', error)
      toast({
        title: "Error",
        description: "Failed to disconnect Twitter",
        variant: "destructive"
      })
    } finally {
      setIsDisconnectingTwitter(false)
    }
  }

  const socialPlatforms = [
    {
      name: "Instagram",
      icon: Instagram(),
      connected: false,
      followers: null,
      status: "disconnected",
      comingSoon: true,
    },
    {
      name: "Twitter/X",
      icon: X(),
      connected: twitterStatus.connected,
      followers: twitterStatus.username ? `@${twitterStatus.username}` : null,
      status: twitterStatus.connected ? "active" : "disconnected",
      isLoading: isCheckingTwitter,
      isConnecting: isConnectingTwitter,
      isDisconnecting: isDisconnectingTwitter,
      onConnect: handleTwitterConnect,
      onDisconnect: handleTwitterDisconnect,
      comingSoon: false,
    },
    {
      name: "LinkedIn",
      icon: <Linkedin/>,
      connected: false,
      followers: null,
      status: "disconnected",
      comingSoon: true,
    },
    {
      name: "Facebook",
      icon: Facebook(),
      connected: false,
      followers: null,
      status: "disconnected",
      comingSoon: true,
    },
    {
      name: "Bluesky",
      icon: BlueSky(),
      connected: false,
      followers: null,
      status: "disconnected",
      comingSoon: true,
    },
  ]

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
                  {platform.connected && platform.followers && (
                    <p className="text-xs text-muted-foreground">{platform.followers}</p>
                  )}
                  {platform.comingSoon && (
                    <p className="text-xs text-muted-foreground">Coming Soon</p>
                  )}
                </div>
              </div>

              {platform.isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : platform.connected ? (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-success/20 text-success border-0">
                    <Check className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                  {platform.onDisconnect && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={platform.onDisconnect}
                      disabled={platform.isDisconnecting}
                      className="h-7 px-2 text-xs"
                    >
                      {platform.isDisconnecting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        "Disconnect"
                      )}
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={platform.onConnect}
                  disabled={platform.comingSoon || platform.isConnecting}
                >
                  {platform.isConnecting ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-6 bg-white border-border rounded-sm w-full">
          <Plus className="h-4 w-4 mr-2" />
          Connect more account
        </Button>
      </CardContent>
    </Card>
  )
}
