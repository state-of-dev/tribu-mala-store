"use client"

import { useAuthStatus } from "@/hooks/use-auth-status"
import { UserAvatarProps } from "@/types/navigation"
import { LogoutButton } from "./logout-button"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { User, Settings, ShoppingBag, ChevronDown, CreditCard, Bell, LogOut, BarChart3 } from "lucide-react"
import Link from "next/link"

export function UserAvatar({ 
  className = "", 
  showDropdown = true, 
  size = "md" 
}: UserAvatarProps) {
  const { user } = useAuthStatus()

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-12 w-12"
  }

  const getInitials = (name?: string | null, email?: string | null): string => {
    if (name) {
      return name
        .split(" ")
        .map(word => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    if (email) {
      return email.charAt(0).toUpperCase()
    }
    return "U"
  }

  if (!user) {
    return null
  }

  const initials = getInitials(user.name, user.email)

  if (!showDropdown) {
    return (
      <Avatar className={`${sizeClasses[size]} ${className}`}>
        <AvatarImage src={user.image || ""} alt={user.name || "Usuario"} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`${sizeClasses[size]} rounded-full p-0 ${className}`}>
          <Avatar className={sizeClasses[size]}>
            <AvatarImage src={user.image || ""} alt={user.name || "Usuario"} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 bg-background border"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image || ""} alt={user.name || "Usuario"} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name || "Usuario"}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              Mi Perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Mis Pedidos
            </Link>
          </DropdownMenuItem>
          {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            {/* <Link href="/payment-methods">
              <CreditCard className="mr-2 h-4 w-4" />
              Métodos de Pago
            </Link> */}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            {/* <Link href="/notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notificaciones
            </Link> */}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive">
          <LogoutButton 
            variant="ghost" 
            size="sm"
            className="p-0 h-auto font-normal text-inherit hover:bg-transparent"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}