"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlatformSelector, platforms } from "@/components/create/platform-selector"
import { CaptionEditor } from "@/components/create/caption-editor"
import { MediaUploader, type MediaFile } from "@/components/create/media-uploader"
import { RedditInput, type RedditPostData } from "@/components/create/reddit-input"
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
  const [redditData, setRedditData] = useState<RedditPostData>({
    title: "",
    text: "",
    url: "",
    type: "text"
  })

  const handlePlatformToggle = useCallback((platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((p) => p !== platformId) : [...prev, platformId],
    )
  }, [])

  const handleCaptionChange = useCallback((platformId: string, value: string) => {
    setCaptions((prev) => ({ ...prev, [platformId]: value }))
  }, [])

  const handleAICaptionUpdate = useCallback(
    (newCaption: string) => {
      // Apply to all selected platforms
      setCaptions((prev) => {
        const updated = { ...prev }
        selectedPlatforms.forEach((p) => {
          updated[p] = newCaption
        })
        return updated
      })
    },
    [selectedPlatforms],
  )

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
    setIsPublishing(true)
    
    try {
      // Validate Reddit post if Reddit is selected
      if (selectedPlatforms.includes('reddit')) {
        if (!redditData.title.trim()) {
          toast({
            title: "Validation Error",
            description: "Reddit post requires a title",
            variant: "destructive"
          })
          setIsPublishing(false)
          return
        }
        if (redditData.type === 'link' && !redditData.url?.trim()) {
          toast({
            title: "Validation Error",
            description: "Link posts require a URL",
            variant: "destructive"
          })
          setIsPublishing(false)
          return
        }
      }

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

            let result
            if (platform === 'reddit') {
              // Handle Reddit post separately
              result = await socialMediaAPI.postToReddit(redditData)
            } else {
              result = await socialMediaAPI.createPost({
                platform,
                content: {
                  caption: captions[platform] || '',
                  mediaUrl: mediaUrls[platform]
                }
              })
            }
            
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

  // Get primary caption for AI tools (first selected platform)
  const primaryCaption = captions[selectedPlatforms[0]] || ""

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

              {selectedPlatforms.includes("reddit") && (
                <RedditInput value={redditData} onChange={setRedditData} />
              )}

               <div className="space-y-4">
                {selectedPlatforms.filter(p => p !== "reddit").map((platformId) => {
                  const platform = platforms.find((p) => p.id === platformId)
                  if (!platform) return null
                  return (
                    <CaptionEditor
                      key={platformId}
                      platformId={platformId}
                      platformName={platform.name}
                      platformIcon={platform.icon}
                      charLimit={platform.charLimit}
                      value={captions[platformId] || ""}
                      onChange={(value) => handleCaptionChange(platformId, value)}
                    />
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Tools & Preview */}
        <div className="space-y-6">
          <SchedulePicker
            publishType={publishType}
            onPublishTypeChange={setPublishType}
            scheduledDate={scheduledDate}
            onDateChange={setScheduledDate}
            scheduledTime={scheduledTime}
            onTimeChange={setScheduledTime}
          />

          <AIToolsPanel caption={primaryCaption} onCaptionUpdate={handleAICaptionUpdate} />

          <PostPreview 
            selectedPlatforms={selectedPlatforms} 
            captions={captions} 
            media={mediaFiles}
            redditData={redditData}
          />
        </div>
      </div>
    </div>
  )
}
