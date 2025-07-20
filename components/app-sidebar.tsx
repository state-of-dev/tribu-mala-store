"use client"

import * as React from "react"
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  Store,
} from "lucide-react"
import { useSession } from "next-auth/react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Admin navigation data
const getAdminData = (user: any) => ({
  user: {
    name: user?.name || "Admin User",
    email: user?.email || "admin@example.com",
    avatar: user?.image || "/placeholder-user.jpg",
  },
  teams: [
    {
      name: "Tribu Mala Store",
      logo: Store,
      plan: "Admin Panel",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Ordenes",
      url: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Productos",
      url: "/admin/products",
      icon: Package,
    },
    {
      title: "Usuarios",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Pagos",
      url: "/admin/payments",
      icon: CreditCard,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Configuración",
      url: "/admin/settings",
      icon: Settings,
    },
  ],
  projects: [],
})

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const adminData = getAdminData(session?.user)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={adminData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminData.navMain} />
        <NavProjects projects={adminData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={adminData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
