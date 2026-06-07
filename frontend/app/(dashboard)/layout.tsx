"use client";
import React, { useState, useEffect } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Bell, ChevronDown, Plus, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { CommandMenuProvider, useCommandMenu } from "@/components/command-menu-provider"
import { CommandMenu } from "@/components/command-menu"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScheduledPostsProvider } from "@/lib/scheduled-posts-context";

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { open, setOpen } = useCommandMenu()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")

    if (!token || !userStr) {
      router.push("/login")
      return
    }

    try {
      const user = JSON.parse(userStr)
      if (!user.onboarded) {
        router.push("/onboarding/setup")
        return
      }
      setIsAuthenticated(true)
    } catch (e) {
      router.push("/login")
    } finally {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse font-medium">Verifying authorization...</p>
      </div>
    )
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="ghost" size="icon" className="relative" onClick={() => router.push('/inbox')}>
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
              </Button>
              <SidebarMenu>
                <SidebarMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuButton className="w-full">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="/diverse-user-avatars.png" />
                          <AvatarFallback>YY</AvatarFallback>
                        </Avatar>
                        <ChevronDown className="h-4 w-4" />
                      </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="top" align="start" className="w-56">
                      <DropdownMenuItem onClick={() => router.push('/settings')}>Profile</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push('/settings')}>Billing</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        localStorage.removeItem("token")
                        localStorage.removeItem("user")
                        router.push("/login")
                      }}>Sign out</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
      <CommandMenu open={open} onOpenChange={setOpen} />
    </>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ScheduledPostsProvider>
      <CommandMenuProvider>
        <DashboardLayoutContent>{children}</DashboardLayoutContent>
      </CommandMenuProvider>
    </ScheduledPostsProvider>
  )
}
