"use client"

import { useMemo, useState } from "react"
import { Sparkles, PhoneCall, MessageSquare, Filter, TrendingUp, Target, Users, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

const customers = [
  {
    id: "crm-2001",
    name: "Vinayak Mohanty",
    stage: "active" as const,
    email: "vinayak97696@gamil.com",
    phone: "93248 89443",
  },
]

type Customer = (typeof customers)[number]

type StageToken = Customer["stage"]

const outreachTemplates: Record<StageToken, string> = {
  active:
    "Hi ${name}, thanks for collaborating with SocialNest. Here's a quick idea on how we can deepen your growth loops this week...",
  warm:
    "Hi ${name}, loved our last chat. I drafted a short plan on how SocialNest can deliver revenue lift for ${company}...",
  risk:
    "Hi ${name}, I noticed a few friction points in your workspace. Can I share a quick fix and align on next steps?",
}

export default function CRMPage() {
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [draftMessage, setDraftMessage] = useState("")

  const summary = useMemo(
    () => ({
      active: customers.filter((c) => c.stage === "active").length,
      warm: customers.filter((c) => c.stage === "warm").length,
      risk: customers.filter((c) => c.stage === "risk").length,
      responseTime: "2min",
    }),
    [],
  )

  const handleGlobalAiDial = () => {
    toast({
      title: "AI call reach-out queued",
      description: "NestGPT is prioritizing top warm leads for voice outreach.",
    })
  }

  const handleRowAiDial = (customer: Customer) => {
    toast({
      title: `AI calling ${customer.name}`,
      description: `${customer.company} will hear a personalized pitch in the next call sprint.`,
    })
  }

  const openMessageDialog = (customer: Customer) => {
    const template = outreachTemplates[customer.stage]
    const personalized = template
      .replace("${name}", customer.name)
      .replace("${company}", customer.company)

    setSelectedCustomer(customer)
    setDraftMessage(personalized)
    setIsDialogOpen(true)
  }

  const handleSaveMessage = () => {
    if (!selectedCustomer) return

    toast({
      title: "Message saved",
      description: `${selectedCustomer.name} has been added to the outreach queue`,
    })
    setIsDialogOpen(false)
    setSelectedCustomer(null)
    setDraftMessage("")
  }

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customer Relationship Hub</h1>
          <p className="text-muted-foreground">
            Monitor every account, push AI-led reach-outs, and protect revenue relationships.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="secondary" className="gap-2" onClick={() => toast({ title: "Filters coming soon" })}>
            <Filter className="h-4 w-4" />
            Smart Filters
          </Button>
         
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Accounts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.active}</p>
            <p className="text-xs text-muted-foreground">Customer pods live on SocialNest</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Warm Leads</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.warm}</p>
            <p className="text-xs text-muted-foreground">Ready for AI guided pilots</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Churn Watch</CardTitle>
            <TrendingUp className="h-4 w-4 rotate-45 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.risk}</p>
            <p className="text-xs text-muted-foreground">Accounts needing proactive care</p>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary.responseTime}</p>
            <p className="text-xs text-muted-foreground">Across all human + AI touchpoints</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 ">
        <Card className="border-border bg-card">
          <CardHeader className="border-b border-border">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-base">Customer Table</CardTitle>
                <CardDescription>Prioritize contacts with the best momentum this week.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="rounded-full">1 account</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Phone Number</th>
                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-t border-border/80">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-border">
                            <AvatarFallback>
                              {customer.name
                                .split(" ")
                                .map((part) => part[0])
                                .slice(0, 2)
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold leading-tight">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">{customer.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{customer.email}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{customer.phone}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="gap-2"
                            onClick={() => handleRowAiDial(customer)}
                          >
                            <PhoneCall className="h-3.5 w-3.5" />
                            AI Call
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-2"
                            onClick={() => openMessageDialog(customer)}
                          >
                            <MessageSquare className="h-3.5 w-3.5" />
                            Reach Out Msg
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

         
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setSelectedCustomer(null)
            setDraftMessage("")
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reach Out Message</DialogTitle>
            <DialogDescription>
              {selectedCustomer
                ? `Send a personalized note to ${selectedCustomer.name} at ${selectedCustomer.company}`
                : "Draft a quick note before saving."}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            rows={6}
            value={draftMessage}
            onChange={(event) => setDraftMessage(event.target.value)}
            placeholder="Type your message..."
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveMessage}>Save Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
