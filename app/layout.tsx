import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import { SplashScreen } from "@/components/splash-screen"
import { Logo } from "@/components/logo"
import { CustomCursor } from "@/components/custom-cursor"
import { CartProvider } from "@/context/cart-context"
import { CartIcon } from "@/components/cart-icon"
import { CartDrawer } from "@/components/cart-drawer"
import { Providers } from "@/components/providers/session-provider"
import { AuthNav } from "@/components/navigation/auth-nav"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SDFM 2520 - Premium Hoodies",
  description: "Premium streetwear and comfortable hoodies",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <CartProvider>
            <SplashScreen />
            
            {/* Logo flotante centrado */}
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none">
              <Logo />
            </div>
            
            {/* Auth flotante esquina superior derecha */}
            <div className="fixed top-4 right-20 z-50">
              <AuthNav variant="header" />
            </div>
            
            {/* Cart Icon */}
            <div className="fixed top-4 right-4 z-50">
              <CartIcon />
            </div>
            <CartDrawer />
            
            {/* Main Content */}
            <main className="min-h-screen">
              {children}
            </main>
            
            <footer className="w-full py-6 px-4 bg-dark-600 text-gray-400">
              <div className="container mx-auto text-center">
                <p>&copy; 2025 SDFM 2520. All rights reserved.</p>
              </div>
            </footer>
            <CustomCursor />
            </CartProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}