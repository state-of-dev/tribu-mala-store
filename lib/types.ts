export interface Product {
  id: number
  name: string
  price: number
  image1: string
  image2: string
  size?: string | null
  color?: string | null
}

export interface CartItem extends Product {
  quantity: number
}
