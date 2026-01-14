export interface ScheduledPost {
  id: string
  content: string
  platforms: string[]
  scheduledFor: Date
  status: "scheduled" | "draft" | "published" | "failed"
  campaign?: string
  media?: string[]
}

// Sample data for the calendar
export const samplePosts: ScheduledPost[] = [
  {
    id: "1",
    content: "Excited to announce our new product launch! Stay tuned for more details...",
    platforms: ["instagram", "twitter"],
    scheduledFor: new Date(2026, 0, 15, 14, 0),
    status: "scheduled",
    campaign: "Product Launch",
  },
  {
    id: "2",
    content: "Check out our latest blog post on social media trends for 2026...",
    platforms: ["linkedin", "twitter"],
    scheduledFor: new Date(2026, 0, 16, 9, 0),
    status: "scheduled",
    campaign: "Content Marketing",
  },
  {
    id: "3",
    content: "Behind the scenes look at our team working on something special!",
    platforms: ["instagram"],
    scheduledFor: new Date(2026, 0, 18, 12, 0),
    status: "draft",
  },
  {
    id: "4",
    content: "Happy Monday! What are your goals for this week?",
    platforms: ["twitter", "linkedin"],
    scheduledFor: new Date(2026, 0, 20, 8, 0),
    status: "scheduled",
    campaign: "Engagement",
  },
  {
    id: "5",
    content: "New feature alert! We've just released dark mode for our app.",
    platforms: ["instagram", "twitter", "linkedin"],
    scheduledFor: new Date(2026, 0, 15, 10, 0),
    status: "published",
    campaign: "Product Launch",
  },
  {
    id: "6",
    content: "Tips for growing your audience on social media - thread coming soon!",
    platforms: ["twitter"],
    scheduledFor: new Date(2026, 0, 17, 15, 0),
    status: "scheduled",
    campaign: "Content Marketing",
  },
  {
    id: "7",
    content: "Customer spotlight: See how @company uses SocialNest to manage their social presence",
    platforms: ["linkedin"],
    scheduledFor: new Date(2026, 0, 19, 11, 0),
    status: "draft",
    campaign: "Case Studies",
  },
  {
    id: "8",
    content: "Weekend vibes! What's everyone up to?",
    platforms: ["instagram"],
    scheduledFor: new Date(2026, 0, 18, 16, 0),
    status: "scheduled",
    campaign: "Engagement",
  },
]

export const campaigns = [
  { id: "product-launch", name: "Product Launch", color: "bg-chart-1" },
  { id: "content-marketing", name: "Content Marketing", color: "bg-chart-2" },
  { id: "engagement", name: "Engagement", color: "bg-chart-3" },
  { id: "case-studies", name: "Case Studies", color: "bg-chart-4" },
]

export const platformIcons: Record<string, string> = {
  instagram: "📷",
  twitter: "𝕏",
  linkedin: "in",
  facebook: "f",
  bluesky: "🦋",
}
