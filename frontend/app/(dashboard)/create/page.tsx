"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlatformSelector, platforms } from "@/components/create/platform-selector"
import { CaptionEditor } from "@/components/create/caption-editor"
import { MediaUploader, type MediaFile } from "@/components/create/media-uploader"
import { AIToolsPanel } from "@/components/create/ai-tools-panel"
import { SchedulePicker } from "@/components/create/schedule-picker"
import { PostPreview } from "@/components/create/post-preview"
import { Send, Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

  const handlePublish = async () => {
    setIsPublishing(true)
    await new Promise((r) => setTimeout(r, 2000))
    setIsPublishing(false)
    toast({
      title: publishType === "now" ? "Post published!" : "Post scheduled!",
      description:
        publishType === "now"
          ? "Your post has been published to all selected platforms."
          : `Your post will be published on ${scheduledDate?.toLocaleDateString()} at ${scheduledTime}.`,
    })
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

              <div className="space-y-4">
                {selectedPlatforms.map((platformId) => {
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

          <PostPreview selectedPlatforms={selectedPlatforms} captions={captions} media={mediaFiles} />
        </div>
      </div>
    </div>
  )
}
