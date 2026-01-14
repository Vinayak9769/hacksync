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
    sender: { name: "Sarah Johnson", username: "sarah.j" },
    content: "Hi! I love your product. Can you tell me more about the pricing plans?",
    timestamp: new Date(2026, 0, 15, 10, 30),
    status: "unread",
  },
  {
    id: "2",
    type: "mention",
    platform: "twitter",
    sender: { name: "Tech Daily", username: "techdaily" },
    content: "@SocialNest just revolutionized how we manage our social media. Highly recommend!",
    timestamp: new Date(2026, 0, 15, 9, 45),
    status: "unread",
  },
  {
    id: "3",
    type: "comment",
    platform: "linkedin",
    sender: { name: "Michael Chen", username: "mchen" },
    content: "Great insights! Would love to learn more about your AI features.",
    timestamp: new Date(2026, 0, 15, 8, 20),
    status: "read",
    postContent: "5 Ways AI is Changing Social Media Marketing...",
  },
  {
    id: "4",
    type: "dm",
    platform: "twitter",
    sender: { name: "Emily Davis", username: "emilyd" },
    content: "Hey, quick question - do you offer enterprise plans?",
    timestamp: new Date(2026, 0, 14, 16, 0),
    status: "replied",
  },
  {
    id: "5",
    type: "mention",
    platform: "instagram",
    sender: { name: "Marketing Pro", username: "marketingpro" },
    content: "Check out @SocialNest for the best social media scheduling tool!",
    timestamp: new Date(2026, 0, 14, 14, 30),
    status: "read",
  },
  {
    id: "6",
    type: "comment",
    platform: "facebook",
    sender: { name: "David Wilson", username: "dwilson" },
    content: "This is exactly what our team needed. When can we schedule a demo?",
    timestamp: new Date(2026, 0, 14, 12, 15),
    status: "resolved",
    postContent: "Announcing our new AI-powered analytics dashboard...",
  },
  {
    id: "7",
    type: "dm",
    platform: "linkedin",
    sender: { name: "Jennifer Lee", username: "jlee" },
    content: "Hi, I'm interested in a partnership opportunity. Can we connect?",
    timestamp: new Date(2026, 0, 14, 10, 0),
    status: "unread",
  },
  {
    id: "8",
    type: "mention",
    platform: "twitter",
    sender: { name: "Startup Weekly", username: "startupweekly" },
    content: ".@SocialNest is one of the top 10 tools to watch in 2026!",
    timestamp: new Date(2026, 0, 13, 15, 30),
    status: "read",
  },
]

export const teamMembers = [
  { id: "1", name: "John Doe", role: "Admin" },
  { id: "2", name: "Jane Smith", role: "Marketing" },
  { id: "3", name: "Mike Johnson", role: "Support" },
]

export const platformIcons: Record<string, string> = {
  instagram: "📷",
  twitter: "𝕏",
  linkedin: "in",
  facebook: "f",
}
