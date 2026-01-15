"use client"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface Platform {
  id: string
  name: string
  icon: string
  connected: boolean
  charLimit: number
}

const platforms: Platform[] = [
  { id: "instagram", name: "Instagram", icon: "📷", connected: true, charLimit: 2200 },
  { id: "twitter", name: "Twitter/X", icon: "𝕏", connected: true, charLimit: 280 },
  { id: "linkedin", name: "LinkedIn", icon: "in", connected: true, charLimit: 3000 },
  { id: "facebook", name: "Facebook", icon: "f", connected: true, charLimit: 63206 },
  { id: "bluesky", name: "Bluesky", icon: "🦋", connected: false, charLimit: 300 },
]

interface PlatformSelectorProps {
  selectedPlatforms: string[]
  onPlatformToggle: (platformId: string) => void
}

export function PlatformSelector({ selectedPlatforms, onPlatformToggle }: PlatformSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Publish to</Label>
      <div className="flex flex-wrap gap-2">
        {platforms.map((platform) => {
          const isSelected = selectedPlatforms.includes(platform.id)
          const isDisabled = !platform.connected

          return (
            <div
              key={platform.id}
              onClick={() => !isDisabled && onPlatformToggle(platform.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer",
                isSelected
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-secondary/50 text-muted-foreground",
                isDisabled && "opacity-50 cursor-not-allowed",
                !isDisabled && "hover:border-primary/50"
              )}
            >
              <Checkbox checked={isSelected} disabled={isDisabled} className="pointer-events-none" />
              <span className="text-sm">{platform.icon}</span>
              <span className="text-sm font-medium">{platform.name}</span>
              {!platform.connected && <span className="text-xs text-muted-foreground">(Not connected)</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export { platforms }
export type { Platform }
