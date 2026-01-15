"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChatMessage } from "@/components/ai/chat-message"
import { SuggestionChips } from "@/components/ai/suggestion-chips"
import { PlatformOutput, type PlatformContent } from "@/components/ai/platform-output"
import { AICapabilities } from "@/components/ai/ai-capabilities"
import { Send, Sparkles, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  platformOutputs?: PlatformContent[]
}

const sampleResponses: Record<string, { content: string; platforms?: PlatformContent[] }> = {
  ideas: {
    content: `Here are 5 creative post ideas for your tech startup's new AI product launch:

1. **Behind-the-Scenes Story**
Share the journey of building your AI product - the challenges, breakthroughs, and team moments. People love authentic stories.

2. **Problem-Solution Carousel**
Create a carousel showing the problems your target audience faces and how your AI solves each one.

3. **User Testimonial Video**
Feature an early beta user sharing their experience with the product.

4. **AI Demo Thread**
Show your AI in action with a step-by-step thread demonstrating its capabilities.

5. **Future Vision Post**
Share your vision for how AI will transform your industry and invite discussion.`,
    platforms: [
      {
        platform: "Instagram",
        icon: "📷",
        content:
          "The future of [industry] is here. After months of development, we're thrilled to introduce [Product Name] - AI that actually understands your needs.\n\nSwipe to see what makes us different.",
        hashtags: ["#AI", "#Innovation", "#TechStartup", "#ProductLaunch", "#FutureOfWork"],
      },
      {
        platform: "Twitter",
        icon: "𝕏",
        content:
          "Big news! After 6 months of building in stealth mode, we're launching [Product Name].\n\nIt's AI that actually gets what you need.\n\nHere's what makes it special: (thread)",
        hashtags: ["#AI", "#Startup", "#Launch"],
      },
      {
        platform: "LinkedIn",
        icon: "in",
        content:
          "Excited to announce the launch of [Product Name]!\n\nFor the past 6 months, our team has been working tirelessly to build AI that truly understands the needs of [target audience].\n\nHere's what we learned along the way...",
        hashtags: ["#AI", "#StartupLife", "#Innovation", "#ProductLaunch"],
      },
    ],
  },
  campaign: {
    content: `Here's a 2-week social media campaign plan for your product launch:

**Week 1: Build Anticipation**
- Day 1-2: Teaser posts with cryptic hints
- Day 3: Behind-the-scenes team photo
- Day 4: Problem highlight post (what you're solving)
- Day 5: Countdown begins (3 days to launch)
- Day 6: Feature sneak peek
- Day 7: Launch day!

**Week 2: Drive Adoption**
- Day 8: User testimonial
- Day 9: How-to tutorial thread
- Day 10: Q&A session announcement
- Day 11: Live demo/webinar
- Day 12: Case study post
- Day 13: Community highlights
- Day 14: Week 1 results + thank you post

**Best posting times:**
- LinkedIn: Tue-Thu, 9am-12pm
- Twitter: Mon-Fri, 8am-10am
- Instagram: Mon-Fri, 11am-1pm`,
  },
  trending: {
    content: `Here are the current trending topics in social media marketing:

1. **AI-Generated Content**
How brands are using AI responsibly and transparently

2. **Short-Form Video Dominance**
TikTok-style content is taking over all platforms

3. **Authenticity Over Polish**
Raw, behind-the-scenes content outperforms perfect posts

4. **Community Building**
Private communities and direct engagement over broadcasting

5. **Social Commerce**
In-app purchasing and shoppable posts

6. **Employee Advocacy**
Companies leveraging employee personal brands

**Recommendation:** Create content around AI transparency and authenticity - these topics have high engagement potential in your niche.`,
  },
}

export default function AIPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (prompt?: string) => {
    const messageText = prompt || input
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsGenerating(true)
    try {
      // Determine backend API base. Prefer NEXT_PUBLIC_API_BASE, otherwise assume backend on localhost:3001 in dev.
      const apiBase = (typeof window !== 'undefined' && (process.env.NEXT_PUBLIC_API_BASE || (window.location.hostname === 'localhost' ? 'http://localhost:3001' : '')) ) || '';
      const url = apiBase ? `${apiBase}/api/nestgpt/chat` : '/api/nestgpt/chat';

      // Send message field for conversational chat (NestGPT will handle intake collection via progressive Q&A)
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText })
      })

      const data = await resp.json()
      if (!resp.ok) {
        const assistantMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          role: 'assistant',
          content: data.error || data.details || 'Sorry, something went wrong while generating a reply.',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        const assistantMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          role: 'assistant',
          content: data.reply || 'No reply from AI',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (err: any) {
      const assistantMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: err?.message || 'Network error',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSuggestionSelect = (suggestion: string) => {
    handleSend(suggestion)
  }

  const handleSendToCreate = (content?: string) => {
    toast({
      title: "Sent to Create",
      description: "Content has been sent to the post creator.",
    })
    router.push("/create")
  }

  return (
    <div className="p-6 h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">NestGPT</h1>
        </div>
        <p className="text-muted-foreground">Your AI-powered social media assistant</p>
      </div>

      <div className="flex-1 grid gap-6 lg:grid-cols-3 min-h-0">
        {/* Chat Area */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <Card className="flex-1 flex flex-col bg-card border-border min-h-0">
            <CardHeader className="pb-3 shrink-0">
              <CardTitle className="text-base">Chat with NestGPT</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
              <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
                {messages.length === 0 ? (
                  <div className="space-y-6 py-8">
                    <div className="text-center">
                      <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h3 className="text-lg font-medium">How can I help you today?</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ask me to generate content, plan campaigns, or find trending topics
                      </p>
                    </div>
                    <SuggestionChips onSelect={handleSuggestionSelect} />
                  </div>
                ) : (
                  <div className="space-y-4 pb-4">
                    {messages.map((message) => (
                      <div key={message.id}>
                        <ChatMessage
                          role={message.role}
                          content={message.content}
                          timestamp={message.timestamp}
                          onSendToCreate={message.role === "assistant" ? () => handleSendToCreate() : undefined}
                        />
                        {message.platformOutputs && (
                          <div className="mt-4 ml-11">
                            <PlatformOutput
                              outputs={message.platformOutputs}
                              onSendToCreate={(content) => handleSendToCreate(content.content)}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    {isGenerating && <ChatMessage role="assistant" content="" isGenerating />}
                  </div>
                )}
              </ScrollArea>

              {/* Input Area */}
              <div className="pt-4 border-t border-border shrink-0 mt-auto">
                <div className="flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask NestGPT to generate content, plan campaigns, or find trends..."
                    className="min-h-[60px] max-h-[120px] resize-none bg-secondary/50"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSend()
                      }
                    }}
                  />
                  <Button onClick={() => handleSend()} disabled={isGenerating || !input.trim()} className="shrink-0">
                    {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AICapabilities />

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Recent Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {["Generate post ideas", "Create campaign plan", "Find trending topics"].map((prompt, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    className="w-full justify-start text-sm text-muted-foreground hover:text-foreground"
                    onClick={() => handleSend(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
