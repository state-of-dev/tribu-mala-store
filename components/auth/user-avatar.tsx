"use client"

import { useState } from "react"
import { useAuthStatus } from "@/hooks/use-auth-status"
import { UserAvatarProps } from "@/types/navigation"
import { LogoutButton } from "./logout-button"
import { Button } from "@/components/ui/button"
import { User, Settings, ShoppingBag, ChevronDown } from "lucide-react"
import Link from "next/link"

export function UserAvatar({ 
  className = "", 
  showDropdown = true, 
  size = "md" 
}: UserAvatarProps) {
  const { user } = useAuthStatus()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm", 
    lg: "h-12 w-12 text-base"
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

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        className={`${sizeClasses[size]} rounded-full p-0 hover:bg-dark-700 ${showDropdown ? 'group' : ''}`}
        onClick={() => showDropdown && setIsDropdownOpen(!isDropdownOpen)}
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || "Usuario"}
            className={`${sizeClasses[size]} rounded-full object-cover`}
          />
        ) : (
          <div className={`${sizeClasses[size]} rounded-full bg-blue-600 flex items-center justify-center text-white font-medium`}>
            {initials}
          </div>
        )}
        {showDropdown && (
          <ChevronDown className="ml-2 h-3 w-3 text-gray-400 group-hover:text-gray-300" />
        )}
      </Button>

      {showDropdown && isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-20">
            {/* User Info */}
            <div className="p-4 border-b border-dark-600">
              <p className="font-medium text-gray-200">{user.name || "Usuario"}</p>
              <p className="text-sm text-gray-400 truncate">{user.email}</p>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link 
                href="/profile" 
                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-dark-700"
                onClick={() => setIsDropdownOpen(false)}
              >
                <User className="mr-3 h-4 w-4" />
                Mi Perfil
              </Link>
              
              <Link 
                href="/orders" 
                className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-dark-700"
                onClick={() => setIsDropdownOpen(false)}
              >
                <ShoppingBag className="mr-3 h-4 w-4" />
                Mis Pedidos
              </Link>
            </div>

            {/* Logout */}
            <div className="py-2 border-t border-dark-600">
              <div className="px-4">
                <LogoutButton 
                  variant="ghost" 
                  size="sm"
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}