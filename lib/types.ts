export interface Product {
  id: number
  name: string
  price: number
  image1: string
  image2: string
}

export interface CartItem extends Product {
  quantity: number
}
