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
import { usePathname } from "next/navigation"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar"

// Admin navigation data
const getAdminData = (user: any, pathname: string) => ({
  user: {
    name: user?.name || "Admin User",
    email: user?.email || "admin@example.com",
    avatar: user?.image || "/placeholder-user.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: BarChart3,
      isActive: pathname === "/admin",
    },
    {
      title: "Pedidos",
      url: "/admin/orders",
      icon: ShoppingCart,
      isActive: pathname.startsWith("/admin/orders"),
    },
    {
      title: "Inventario",
      url: "/admin/products",
      icon: Package,
      isActive: pathname.startsWith("/admin/products"),
    },
    {
      title: "Clientes",
      url: "/admin/users",
      icon: Users,
      isActive: pathname.startsWith("/admin/users"),
    },
    // Pagos se unifica en pedidos
    // {
    //   title: "Pagos",
    //   url: "/admin/payments",
    //   icon: CreditCard,
    //   isActive: pathname.startsWith("/admin/payments"),
    // },
    // Configuración se comenta por ahora
    // {
    //   title: "Configuración",
    //   url: "/admin/settings",
    //   icon: Settings,
    //   isActive: pathname.startsWith("/admin/settings"),
    // },
  ],
})

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const adminData = getAdminData(session?.user, pathname)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={adminData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={adminData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
