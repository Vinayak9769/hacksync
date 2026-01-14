"use client"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CaptionEditorProps {
  platformId: string
  platformName: string
  platformIcon: string
  charLimit: number
  value: string
  onChange: (value: string) => void
}

export function CaptionEditor({
  platformId,
  platformName,
  platformIcon,
  charLimit,
  value,
  onChange,
}: CaptionEditorProps) {
  const charCount = value.length
  const isOverLimit = charCount > charLimit
  const percentUsed = (charCount / charLimit) * 100

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium">
          <span className="flex h-6 w-6 items-center justify-center rounded bg-secondary text-xs">{platformIcon}</span>
          {platformName}
        </Label>
        <Badge variant={isOverLimit ? "destructive" : "secondary"} className="text-xs">
          {charCount} / {charLimit}
        </Badge>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Write your ${platformName} caption...`}
        className={cn(
          "min-h-[100px] resize-none bg-secondary/50",
          isOverLimit && "border-destructive focus-visible:ring-destructive",
        )}
      />
      <div className="h-1 bg-secondary rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all", isOverLimit ? "bg-destructive" : "bg-primary")}
          style={{ width: `${Math.min(percentUsed, 100)}%` }}
        />
      </div>
    </div>
  )
}
