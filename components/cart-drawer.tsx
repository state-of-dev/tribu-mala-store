"use client"

import { useCart } from "@/context/cart-context"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalPrice } = useCart()
  const router = useRouter()

  if (!isCartOpen) return null

  const handleCheckout = () => {
    router.push("/checkout")
    setIsCartOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Tu Carrito</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-accent">
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-grow">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center py-4 border-b border-border">
                  <div className="relative w-20 h-20 mr-4">
                    <Image
                      src={item.image1 || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium text-foreground">{item.name}</h3>
                    <p className="text-muted-foreground">{new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(item.price)}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-full bg-muted hover:bg-accent"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="mx-2 text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full bg-muted hover:bg-accent"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-2 text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between mb-4 text-foreground">
                <span>Total</span>
                <span className="font-bold">{new Intl.NumberFormat('es-ES', {
                  style: 'currency',
                  currency: 'EUR'
                }).format(totalPrice)}</span>
              </div>
              <Button onClick={handleCheckout} className="w-full">
                Proceder al Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
