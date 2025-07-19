import { ReactNode } from "react"

export interface NavItem {
  label: string
  href: string
  requiresAuth?: boolean
  icon?: React.ComponentType<{ className?: string }>
}

export interface AuthNavProps {
  className?: string
  variant?: 'header' | 'sidebar' | 'mobile'
}

export interface UserAvatarProps {
  className?: string
  showDropdown?: boolean
  size?: 'sm' | 'md' | 'lg'
}