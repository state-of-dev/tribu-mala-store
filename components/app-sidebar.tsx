"use client"

import * as React from "react"
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Settings2,
  Home,
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
    avatar: user?.image || "/avatars/admin.jpg",
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
      icon: Home,
      isActive: true,
    },
    {
      title: "Órdenes",
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
      title: "Gestión",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Inventario",
          url: "/admin/inventory",
        },
        {
          title: "Reportes",
          url: "/admin/reports",
        },
        {
          title: "Analytics",
          url: "/admin/analytics",
        },
      ],
    },
    {
      title: "Configuración",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/admin/settings",
        },
        {
          title: "Emails",
          url: "/admin/settings/emails",
        },
        {
          title: "Pagos",
          url: "/admin/settings/payments",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Métricas Ventas",
      url: "/admin/sales",
      icon: BarChart3,
    },
    {
      name: "Gestión Stock",
      url: "/admin/inventory",
      icon: Package,
    },
    {
      name: "Base Clientes",
      url: "/admin/customers",
      icon: Users,
    },
  ],
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
