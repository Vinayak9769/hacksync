"use client"
import { API_ENDPOINTS, API_FETCH_OPTIONS } from '@/lib/api-config'

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlatformSelector, platforms } from "@/components/create/platform-selector"
import { CaptionEditor } from "@/components/create/caption-editor"
import { MediaUploader, type MediaFile } from "@/components/create/media-uploader"
import { MediaUrlInput } from "@/components/create/media-url-input"
import { AIToolsPanel } from "@/components/create/ai-tools-panel"

import { SchedulePicker } from "@/components/create/schedule-picker"
import { PostPreview } from "@/components/create/post-preview"
import { Send, Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import socialMediaAPI from "@/lib/social-media-api"

export default function CreatePage() {
  const { toast } = useToast()
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram", "twitter"])
  const [captions, setCaptions] = useState<Record<string, string>>({})
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [publishType, setPublishType] = useState<"now" | "schedule">("schedule")
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined)
  const [scheduledTime, setScheduledTime] = useState<string>("12:00 PM")
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("")

  const handlePlatformToggle = useCallback((platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((p) => p !== platformId) : [...prev, platformId],
    )
  }, [])

  const handleCaptionChange = useCallback((platformId: string, value: string) => {
    setCaptions((prev) => ({ ...prev, [platformId]: value }))
  }, [])



  const handleUrlAdd = useCallback(
    (url: string) => {
      const newFile: MediaFile = {
        id: Math.random().toString(36).substr(2, 9),
        type: "image",
        url: url,
        name: url.split('/').pop() || 'image',
      }
      setMediaFiles((prev) => [...prev, newFile])
    },
    [],
  )

  const handlePublish = async () => {
    if (!selectedPlatforms.includes('twitter')) {
      toast({
        title: "Twitter not selected",
        description: "Please select Twitter to publish",
        variant: "destructive"
      })
      return
    }

    setIsPublishing(true)

    try {
      if (publishType === "now") {
        // Get media URLs
        const mediaUrls: Record<string, string> = {}
        if (mediaFiles.length > 0 && mediaFiles[0].url) {
          selectedPlatforms.forEach(platform => {
            mediaUrls[platform] = mediaFiles[0].url!
          })
        }

        // Post to each platform
        const results = []
        for (const platform of selectedPlatforms) {
          try {
            console.log(`📤 Posting to ${platform}...`, {
              caption: captions[platform] || '',
              mediaUrl: mediaUrls[platform] || 'none'
            })

            const result = await socialMediaAPI.createPost({
              platform,
              content: {
                caption: captions[platform] || '',
                mediaUrl: mediaUrls[platform]
              }
            })

            console.log(`✅ Successfully posted to ${platform}:`, result)
            results.push({ platform, success: true, result })
          } catch (error: any) {
            console.error(`❌ Failed to post to ${platform}:`, error)
            results.push({ platform, success: false, error: error.message })
          }
        }

        // Show results
        const successCount = results.filter(r => r.success).length
        const failCount = results.length - successCount
        const successPlatforms = results.filter(r => r.success).map(r => r.platform).join(', ')
        const failedPlatforms = results.filter(r => !r.success).map(r => r.platform).join(', ')

        if (successCount > 0 && failCount === 0) {
          toast({
            title: "Posts published! 🎉",
            description: `Successfully posted to ${successPlatforms}`,
          })
        } else if (successCount > 0) {
          toast({
            title: "Partial success",
            description: `Posted to ${successPlatforms}. Failed: ${failedPlatforms}`,
            variant: "default"
          })
        } else {
          toast({
            title: "Publishing failed",
            description: `Failed to post to ${failedPlatforms}. ${results[0]?.error || 'Check console for details.'}`,
            variant: "destructive"
          })
        }
      } else {
        // Schedule for later (mock for now)
        await new Promise((r) => setTimeout(r, 1000))
        toast({
          title: "Post scheduled! 📅",
          description: `Your post will be published on ${scheduledDate?.toLocaleDateString()} at ${scheduledTime}.`,
        })
      }
    } catch (error: any) {
      console.error('Error publishing post:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to publish post. Please try again.",
      })
    }

    try {
      // Check if user is connected to Twitter
      const statusResponse = await fetch(API_ENDPOINTS.twitter.status, {
        ...API_FETCH_OPTIONS
      })
      const statusData = await statusResponse.json()

      if (!statusData.connected) {
        toast({
          title: "Not connected to Twitter",
          description: "Please connect your Twitter account first from Settings",
          variant: "destructive"
        })
        setIsPublishing(false)
        return
      }

      const formData = new FormData()

      // Add caption text
      const twitterCaption = captions['twitter'] || ''
      formData.append('text', twitterCaption)

      // Add media files if any
      if (mediaFiles.length > 0) {
        for (const mediaFile of mediaFiles) {
          if (mediaFile.file) {
            formData.append('media', mediaFile.file)
          }
        }
      }

      // Call backend API
      const response = await fetch(API_ENDPOINTS.twitter.post, {
        method: 'POST',
        body: formData,
        ...API_FETCH_OPTIONS
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Posted to Twitter!",
          description: "Your tweet has been published successfully.",
        })
        // Clear the form
        setCaptions((prev) => ({ ...prev, twitter: '' }))
      } else {
        toast({
          title: "Failed to post",
          description: result.error || "Something went wrong",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      console.error('Error publishing:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to connect to server",
        variant: "destructive"
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const handleSaveDraft = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsSaving(false)
    toast({
      title: "Draft saved",
      description: "Your post has been saved as a draft.",
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Create Post</h1>
          <p className="text-muted-foreground">Compose and schedule posts across multiple platforms</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Draft
          </Button>
          <Button onClick={handlePublish} disabled={isPublishing || selectedPlatforms.length === 0}>
            {isPublishing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            {publishType === "now" ? "Publish Now" : "Schedule Post"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-base">Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <PlatformSelector selectedPlatforms={selectedPlatforms} onPlatformToggle={handlePlatformToggle} />

              <MediaUploader files={mediaFiles} onFilesChange={setMediaFiles} />

              <MediaUrlInput onUrlAdd={handleUrlAdd} />

              {selectedPlatforms.length > 0 ? (
                <Tabs
                  value={activeTab || selectedPlatforms[0]}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${selectedPlatforms.length}, minmax(0, 1fr))` }}>
                    {selectedPlatforms.map((platformId) => {
                      const platform = platforms.find((p) => p.id === platformId)
                      if (!platform) return null
                      return (
                        <TabsTrigger key={platformId} value={platformId} className="flex items-center gap-2">
                          <span className="text-lg">{platform.icon}</span>
                          <span>{platform.name}</span>
                        </TabsTrigger>
                      )
                    })}
                  </TabsList>
                  {selectedPlatforms.map((platformId) => {
                    const platform = platforms.find((p) => p.id === platformId)
                    if (!platform) return null
                    return (
                      <TabsContent key={platformId} value={platformId} className="mt-4">
                        <CaptionEditor
                          platformId={platformId}
                          platformName={platform.name}
                          platformIcon={platform.icon}
                          charLimit={platform.charLimit}
                          value={captions[platformId] || ""}
                          onChange={(value) => handleCaptionChange(platformId, value)}
                        />
                      </TabsContent>
                    )
                  })}
                </Tabs>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Select at least one platform to start creating your post
                </div>
              )}
            </CardContent>
          </Card>
        </div>

          <PostPreview selectedPlatforms={selectedPlatforms} captions={captions} media={mediaFiles} />
        {/* Right Column - Preview & Schedule */}
      </div>

          <SchedulePicker
            publishType={publishType}
            onPublishTypeChange={setPublishType}
            scheduledDate={scheduledDate}
            onDateChange={setScheduledDate}
            scheduledTime={scheduledTime}
            onTimeChange={setScheduledTime}
          />

    </div>
  )
}
