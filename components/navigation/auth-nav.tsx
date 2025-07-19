"use client"

import { useAuthStatus } from "@/hooks/use-auth-status"
import { AuthNavProps } from "@/types/navigation"
import { LoginButton } from "@/components/auth/login-button"
import { UserAvatar } from "@/components/auth/user-avatar"
import { AuthStatus } from "@/components/auth/auth-status"
import { cn } from "@/lib/utils"

export function AuthNav({ className, variant = "header" }: AuthNavProps) {
  const { isAuthenticated, isLoading } = useAuthStatus()

  const baseClasses = cn(
    "flex items-center space-x-4",
    {
      "justify-end": variant === "header",
      "flex-col space-x-0 space-y-4": variant === "sidebar",
      "flex-col space-x-0 space-y-2": variant === "mobile"
    },
    className
  )

  if (isLoading) {
    return (
      <div className={baseClasses}>
        <AuthStatus showLoading={true} />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className={baseClasses}>
        <LoginButton 
          variant={variant === "header" ? "default" : "outline"}
          size={variant === "mobile" ? "sm" : "default"}
          className={variant === "mobile" ? "w-full" : ""}
        />
      </div>
    )
  }

  return (
    <div className={baseClasses}>
      {variant !== "header" && (
        <AuthStatus 
          showLoading={false} 
          className={variant === "mobile" ? "w-full justify-center" : ""}
        />
      )}
      <UserAvatar 
        showDropdown={variant === "header"}
        size={variant === "mobile" ? "sm" : "md"}
      />
    </div>
  )
}