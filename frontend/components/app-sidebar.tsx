"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  PenSquare,
  Calendar,
  ImageIcon,
  Sparkles,
  BarChart3,
  Inbox,
  Users,
  Megaphone,
  Radio,
  Layout,
  Settings,
  ChevronDown,
  Search,
  Palette,
  MessageSquare,
  Video,
  Eye,
  EyeIcon,
  FileText,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const mainNavItems = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Create", href: "/create", icon: PenSquare },
  { title: "Calendar", href: "/calendar", icon: Calendar },
  { title: "Media Library", href: "/media", icon: ImageIcon },
]

const aiStudioItems = [
  { title: "NestGPT Agent", href: "/ai", icon: Sparkles },
  { title: "Canvas Studio", href: "/canvas", icon: Palette },
  { title: "Veo Video", href: "/veo", icon: Video },
]

const engageNavItems = [
  { title: "Inbox", href: "/inbox", icon: Inbox },
  { title: "Listening", href: "/listening", icon: Radio },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Ads Manager", href: "/ads", icon: Megaphone },
  { title: "Anti-Campaign", href: "/anti-campaign", icon: AlertTriangle },
]

const manageNavItems = [
  { title: "CRM", href: "/crm", icon: MessageSquare },
  { title: "Competitor Analysis", href: "/competitor-analysis", icon: EyeIcon },
  { title: "Team", href: "/team", icon: Users },
  { title: "Whiteboard", href: "/whiteboard", icon: Layout },
  { title: "Saved Plans", href: "/plans", icon: FileText },
  { title: "Settings", href: "/settings", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold">SocialNest</span>
        </div>
        <div className="px-2 pb-2">
          <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
            <Search className="h-4 w-4" />
            <span className="text-muted-foreground">Search...</span>
            <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground sm:flex">
              ⌘K
            </kbd>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>AI Studio</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {aiStudioItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Engage & Analyze</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {engageNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {manageNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/diverse-user-avatars.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span className="flex-1 text-left">John Doe</span>
                  <ChevronDown className="h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
