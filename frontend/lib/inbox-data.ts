export interface InboxMessage {
  id: string
  type: "dm" | "mention" | "comment"
  platform: "instagram" | "twitter" | "linkedin" | "facebook"
  sender: {
    name: string
    username: string
    avatar?: string
  }
  content: string
  timestamp: Date
  status: "unread" | "read" | "replied" | "resolved"
  assignedTo?: string
  postContent?: string
}

export const inboxMessages: InboxMessage[] = [
  {
    id: "1",
    type: "dm",
    platform: "instagram",
    sender: { name: "Priya Rao", username: "priya.ettara" },
    content: "Hi! The spice latte I tried at Ettara Coffee House was incredible. Can I set up a weekly curbside pick-up plan?",
    timestamp: new Date(2026, 0, 15, 10, 30),
    status: "unread",
    assignedTo: "Vaibhav",
  },
  {
    id: "2",
    type: "dm",
    platform: "twitter",
    sender: { name: "Gourmet Guide", username: "gourmetguide" },
    content: "Reviewing Ettara Coffee House for our spring issue—could someone share the new single-origin lineup today?",
    timestamp: new Date(2026, 0, 15, 9, 45),
    status: "replied",
    assignedTo: "Devansh",
  },
  {
    id: "3",
    type: "comment",
    platform: "linkedin",
    sender: { name: "Local Foodies Collective", username: "localfoodies" },
    content: "Stopped by Ettara Coffee House for the cardamom tasting—Yanshuman and Vinayak made the whole ritual unforgettable!",
    timestamp: new Date(2026, 0, 15, 8, 20),
    status: "read",
    postContent: "Ettara Coffee House just unveiled its heritage brewing ritual...",
    assignedTo: "Vinayak",
  },
]

export const teamMembers = [
  { id: "1", name: "Vaibhav", role: "Store Lead" },
  { id: "2", name: "Devansh", role: "Community Manager" },
  { id: "3", name: "Yanshuman", role: "Guest Experience" },
  { id: "4", name: "Vinayak", role: "Roastery Ops" },
]

export const platformIcons: Record<string, string> = {
  instagram: "📷",
  twitter: "𝕏",
  linkedin: "in",
  facebook: "f",
}
