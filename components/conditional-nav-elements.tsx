"use client"

import { usePathname } from "next/navigation"
import { AuthNav } from "@/components/navigation/auth-nav"
import { CartIcon } from "@/components/cart-icon"

export function ConditionalNavElements() {
  const pathname = usePathname()
  
  // Don't show nav elements on admin routes
  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <>
      {/* Auth - desktop en esquina, mobile al lado del logo */}
      <div className="fixed top-4 right-16 sm:right-20 z-50 sm:block hidden">
        <AuthNav variant="header" />
      </div>
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 -translate-x-32 z-50 sm:hidden">
        <AuthNav variant="header" />
      </div>
      
      {/* Cart Icon - desktop en esquina, mobile al lado del logo */}
      <div className="fixed top-4 right-4 z-50 sm:block hidden">
        <CartIcon />
      </div>
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 translate-x-20 z-50 sm:hidden">
        <CartIcon />
      </div>
    </>
  )
}