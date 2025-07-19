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
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-dark-800 shadow-xl p-4 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-dark-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-grow">
            <ShoppingBag className="w-16 h-16 text-gray-500 mb-4" />
            <p className="text-gray-400">Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center py-4 border-b border-dark-600">
                  <div className="relative w-20 h-20 mr-4">
                    <Image
                      src={item.image1 || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-400">${item.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-full bg-dark-600 hover:bg-dark-500"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full bg-dark-600 hover:bg-dark-500"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-2 text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-dark-600">
              <div className="flex justify-between mb-4">
                <span>Total</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <Button onClick={handleCheckout} className="w-full">
                Proceed to Checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
