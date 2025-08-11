import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import type React from "react"
import dynamic from "next/dynamic"
import { SplashScreen } from "@/components/splash-screen"
import { Logo } from "@/components/logo"
import { CartProvider } from "@/context/cart-context"
import { CartIcon } from "@/components/cart-icon"
import { Providers } from "@/components/providers/session-provider"
import { ReduxProvider } from "@/components/providers/redux-provider"
import { AuthNav } from "@/components/navigation/auth-nav"
import { ThemeProvider } from "@/components/theme-provider"
import { PageLoader } from "@/components/page-loader"
import { ConditionalNavElements } from "@/components/conditional-nav-elements"
import { ConditionalLogo } from "@/components/conditional-logo"

// Dynamic imports for better performance
const CartDrawer = dynamic(() => import("@/components/cart-drawer").then(mod => ({ default: mod.CartDrawer })), {
  ssr: false,
  loading: () => null
})

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tribu Mala - Streetwear Premium | Ropa Underground de Calidad",
  description: "Streetwear premium para la nueva generación rebelde. Calidad superior, estilo underground, actitud sin límites.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth" suppressHydrationWarning>
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
            <PageLoader />
            
            {/* Logo flotante centrado (oculto en admin) */}
            <ConditionalLogo />
            
            {/* Conditional nav elements (hidden in admin) */}
            <ConditionalNavElements />
            <CartDrawer />
            
            {/* Main Content */}
            <main className="min-h-screen transition-opacity duration-200 ease-in-out">
              {children}
            </main>
            
            <footer className="w-full py-6 px-4 bg-dark-600 text-gray-400">
              <div className="container mx-auto text-center">
                <p>&copy; 2025 Tribu Mala. Streetwear Premium. Todos los derechos reservados.</p>
              </div>
            </footer>
            </CartProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}