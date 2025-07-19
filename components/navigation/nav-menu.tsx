"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuthStatus } from "@/hooks/use-auth-status"
import { NavItem } from "@/types/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Home, 
  ShoppingBag, 
  User, 
  Package,
  Settings,
  Info
} from "lucide-react"

const navigationItems: NavItem[] = [
  {
    label: "Inicio",
    href: "/",
    icon: Home
  },
  {
    label: "Productos",
    href: "/products",
    icon: ShoppingBag
  },
  {
    label: "Mi Perfil",
    href: "/profile",
    requiresAuth: true,
    icon: User
  },
  {
    label: "Mis Pedidos",
    href: "/orders",
    requiresAuth: true,
    icon: Package
  },
  {
    label: "Configuración",
    href: "/settings",
    requiresAuth: true,
    icon: Settings
  },
  {
    label: "Acerca de",
    href: "/about",
    icon: Info
  }
]

interface NavMenuProps {
  className?: string
  variant?: "horizontal" | "vertical"
  onItemClick?: () => void
}

export function NavMenu({ 
  className, 
  variant = "horizontal", 
  onItemClick 
}: NavMenuProps) {
  const pathname = usePathname()
  const { isAuthenticated } = useAuthStatus()

  const filteredItems = navigationItems.filter(item => {
    if (item.requiresAuth && !isAuthenticated) {
      return false
    }
    return true
  })

  const baseClasses = cn(
    "flex",
    {
      "flex-row items-center space-x-1": variant === "horizontal",
      "flex-col items-start space-y-1 w-full": variant === "vertical"
    },
    className
  )

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className={baseClasses}>
      {filteredItems.map((item) => {
        const Icon = item.icon
        const active = isActive(item.href)
        
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "group relative",
              variant === "vertical" && "w-full"
            )}
          >
            <Button
              variant={active ? "secondary" : "ghost"}
              size={variant === "vertical" ? "sm" : "default"}
              className={cn(
                "transition-all duration-200",
                {
                  "bg-dark-700 text-white": active,
                  "text-gray-300 hover:text-white hover:bg-dark-700": !active,
                  "w-full justify-start": variant === "vertical",
                  "justify-center": variant === "horizontal"
                }
              )}
            >
              {Icon && (
                <Icon className={cn(
                  "h-4 w-4",
                  variant === "vertical" ? "mr-2" : "mr-1"
                )} />
              )}
              {variant === "vertical" ? item.label : (
                <span className="hidden sm:inline ml-1">{item.label}</span>
              )}
            </Button>
            
            {/* Active indicator for horizontal nav */}
            {variant === "horizontal" && active && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-blue-500 rounded-full" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}