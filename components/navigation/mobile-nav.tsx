"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { NavMenu } from "./nav-menu"
import { AuthNav } from "./auth-nav"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/logo"

interface MobileNavProps {
  className?: string
}

export function MobileNav({ className }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleItemClick = () => {
    setIsOpen(false)
  }

  return (
    <div className={`md:hidden ${className}`}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="p-2 text-gray-300 hover:text-white hover:bg-dark-700"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        
        <SheetContent 
          side="left" 
          className="w-[300px] bg-dark-900 border-dark-700 p-0"
        >
          <SheetHeader className="p-6 border-b border-dark-700">
            <SheetTitle className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <Logo />
                <span className="font-bold text-lg">SDFM 2520</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </SheetTitle>
          </SheetHeader>

          <div className="flex flex-col h-full">
            {/* Navigation Menu */}
            <div className="flex-1 py-6 px-6">
              <NavMenu
                variant="vertical"
                onItemClick={handleItemClick}
                className="space-y-2"
              />
            </div>

            {/* Auth Section */}
            <div className="border-t border-dark-700 p-6">
              <div className="text-xs text-gray-400 uppercase tracking-wide font-medium mb-4">
                Cuenta
              </div>
              <AuthNav variant="mobile" />
            </div>

            {/* Footer */}
            <div className="border-t border-dark-700 p-6">
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  &copy; 2025 SDFM 2520
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Premium Streetwear
                </p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}