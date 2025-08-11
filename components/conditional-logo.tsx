"use client"

import { usePathname } from 'next/navigation'
import { Logo } from '@/components/logo'

export function ConditionalLogo() {
  const pathname = usePathname()
  
  // Ocultar logo en rutas de admin
  if (pathname?.startsWith('/admin')) {
    return null
  }
  
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
      <Logo />
    </div>
  )
}