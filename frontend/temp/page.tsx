"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, BarChart3, Sparkles, MessageSquare, Zap, Users, TrendingUp } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold">SocialNest</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </a>
            <a href="#capabilities" className="text-sm text-muted-foreground hover:text-foreground">
              Capabilities
            </a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">
              Pricing
            </a>
          </div>
          <Button>Get Started</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
              The AI-Powered Social Media Command Center
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Manage all your social platforms from one intelligent dashboard. Create, schedule, analyze, and
              optimize—powered by cutting-edge AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-8">
              No credit card required • 14-day free access to all features
            </p>
          </div>
          <div className="relative h-96">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/20 to-transparent blur-2xl" />
            <img
              src="/social-media-dashboard-interface.jpg"
              alt="SocialNest Dashboard"
              className="relative rounded-lg border border-border shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">10K+</div>
              <p className="text-muted-foreground">Teams worldwide trust SocialNest</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">5M+</div>
              <p className="text-muted-foreground">Posts scheduled and analyzed</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">4.9★</div>
              <p className="text-muted-foreground">Rating from verified users</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
          <p className="text-xl text-muted-foreground">The complete toolkit for social media excellence</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Sparkles,
              title: "AI Post Generator",
              description: "Let our AI write perfect captions, change tone, and generate hashtags automatically",
            },
            {
              icon: BarChart3,
              title: "Advanced Analytics",
              description: "Track performance metrics, identify trends, and understand your audience deeply",
            },
            {
              icon: MessageSquare,
              title: "Unified Inbox",
              description: "Manage all messages, mentions, and comments from every platform in one place",
            },
            {
              icon: Zap,
              title: "Smart Scheduling",
              description: "Schedule posts at optimal times with AI-powered recommendations for maximum reach",
            },
            {
              icon: TrendingUp,
              title: "Trend Intelligence",
              description: "Stay ahead with real-time trend detection and competitor insights",
            },
            {
              icon: Users,
              title: "Team Collaboration",
              description: "Work seamlessly with your team with approval workflows and role management",
            },
          ].map((feature, i) => (
            <Card key={i} className="p-6 border border-border hover:border-primary/50 transition-colors">
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="border-y border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <h2 className="text-4xl font-bold mb-16 text-center">Comprehensive Capabilities</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Multi-Platform Management",
                items: ["Instagram", "LinkedIn", "Twitter/X", "Facebook", "Bluesky"],
              },
              {
                title: "Content Intelligence",
                items: [
                  "Post optimization",
                  "Caption generation",
                  "Media library with Canva integration",
                  "Trend analysis",
                ],
              },
              {
                title: "Team Tools",
                items: ["Brainstorming whiteboard", "Approval workflows", "Role-based access", "Team collaboration"],
              },
              {
                title: "Advanced Features",
                items: ["Sentiment analysis", "Crisis detection", "Ad manager", "Exportable reports"],
              },
            ].map((section, i) => (
              <Card key={i} className="p-8 border border-border">
                <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-3">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative rounded-lg bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Social Strategy?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of brands and agencies using SocialNest to manage their social presence with AI intelligence.
          </p>
          <Button size="lg" className="gap-2">
            Start Your Free Trial <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-semibold">SocialNest</span>
              </div>
              <p className="text-sm text-muted-foreground">
                The AI-powered social media command center for modern teams
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Enterprise
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2026 SocialNest. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
