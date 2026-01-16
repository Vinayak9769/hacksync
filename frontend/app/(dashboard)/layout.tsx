"use client";
import type React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Bell, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { CommandMenuProvider, useCommandMenu } from "@/components/command-menu-provider"
import { CommandMenu } from "@/components/command-menu"

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { open, setOpen } = useCommandMenu()

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb className="flex-1">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative" onClick={() => router.push('/inbox')}>
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
              </Button>

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
    <CommandMenuProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </CommandMenuProvider>
  )
}
