"use client"

import { NavMenu } from "./nav-menu"
import { AuthNav } from "./auth-nav"
import { MobileNav } from "./mobile-nav"
import { Logo } from "@/components/logo"

interface MainNavProps {
  className?: string
}

export function MainNav({ className }: MainNavProps) {
  return (
    <header className={`w-full bg-dark-900/95 backdrop-blur-sm border-b border-dark-700 sticky top-0 z-50 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile Navigation */}
          <MobileNav />

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Logo />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-white">SDFM 2520</h1>
              <p className="text-xs text-gray-400">Premium Streetwear</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center">
            <NavMenu variant="horizontal" />
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            <AuthNav variant="header" />
          </div>
        </div>
      </div>
    </header>
  )
}