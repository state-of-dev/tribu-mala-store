import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()
  await prisma.user.deleteMany()

  // Create products with Unsplash images
  const products = await prisma.product.createMany({
    data: [
      {
        name: "SDFM Classic Black Hoodie",
        description: "Premium black hoodie with SDFM branding. Made from high-quality cotton blend for maximum comfort.",
        price: 149.99,
        stock: 25,
        image1: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=60",
        image2: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=60",
        category: "Hoodies",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black"],
        slug: "sdfm-classic-black",
        metaTitle: "SDFM Classic Black Hoodie - Premium Streetwear",
        metaDescription: "Shop the iconic SDFM Classic Black hoodie. Premium quality, comfortable fit, street style.",
        isActive: true,
        isFeatured: true,
      },
      {
        name: "SDFM Premium Gray Hoodie",
        description: "Sophisticated gray hoodie with premium finishing. Perfect for casual and street style.",
        price: 154.99,
        stock: 20,
        image1: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=60",
        image2: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=60",
        category: "Hoodies",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Gray"],
        slug: "sdfm-premium-gray",
        metaTitle: "SDFM Premium Gray Hoodie - Luxury Streetwear",
        metaDescription: "Elevate your style with the SDFM Premium Gray hoodie. Superior comfort meets urban fashion.",
        isActive: true,
        isFeatured: true,
      },
      {
        name: "SDFM Signature Navy Hoodie",
        description: "Deep navy hoodie with signature SDFM detailing. Crafted for those who appreciate quality.",
        price: 159.99,
        stock: 18,
        image1: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=60",
        image2: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=60",
        category: "Hoodies",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Navy"],
        slug: "sdfm-signature-navy",
        metaTitle: "SDFM Signature Navy Hoodie - Designer Streetwear",
        metaDescription: "Make a statement with the SDFM Signature Navy hoodie. Premium design meets street culture.",
        isActive: true,
        isFeatured: false,
      },
      {
        name: "SDFM Limited Edition White",
        description: "Exclusive limited edition white hoodie. Only a few pieces available. Collector's item for true SDFM fans.",
        price: 199.99,
        stock: 10,
        image1: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=60",
        image2: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=60",
        category: "Hoodies",
        sizes: ["M", "L", "XL"],
        colors: ["White"],
        slug: "sdfm-limited-edition-white",
        metaTitle: "SDFM Limited Edition White Hoodie - Exclusive Collection",
        metaDescription: "Own a piece of SDFM history with this limited edition white hoodie. Exclusive design, limited stock.",
        isActive: true,
        isFeatured: true,
      },
      {
        name: "SDFM Oversized Cream Hoodie",
        description: "Trendy oversized cream hoodie with relaxed fit. Perfect for streetwear enthusiasts who love comfort.",
        price: 169.99,
        stock: 15,
        image1: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=800&auto=format&fit=crop&q=60",
        image2: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=60",
        category: "Hoodies",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Cream"],
        slug: "sdfm-oversized-cream",
        metaTitle: "SDFM Oversized Cream Hoodie - Trendy Streetwear",
        metaDescription: "Get the perfect oversized fit with SDFM Cream hoodie. Trendy, comfortable, and stylish.",
        isActive: true,
        isFeatured: true,
      },
      {
        name: "SDFM Classic White T-Shirt",
        description: "Essential white t-shirt with subtle SDFM logo. Premium cotton for everyday wear.",
        price: 49.99,
        stock: 50,
        image1: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60",
        image2: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=60",
        category: "T-Shirts",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        colors: ["White"],
        slug: "sdfm-classic-white-tshirt",
        metaTitle: "SDFM Classic White T-Shirt - Essential Streetwear",
        metaDescription: "Essential white t-shirt from SDFM. Premium cotton, perfect fit, timeless style.",
        isActive: true,
        isFeatured: false,
      },
      {
        name: "SDFM Black Logo T-Shirt",
        description: "Bold black t-shirt featuring prominent SDFM logo. Statement piece for streetwear lovers.",
        price: 54.99,
        stock: 40,
        image1: "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?w=800&auto=format&fit=crop&q=60",
        image2: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60",
        category: "T-Shirts",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        colors: ["Black"],
        slug: "sdfm-black-logo-tshirt",
        metaTitle: "SDFM Black Logo T-Shirt - Bold Streetwear",
        metaDescription: "Make a statement with SDFM Black Logo t-shirt. Bold design, premium quality.",
        isActive: true,
        isFeatured: true,
      },
      {
        name: "SDFM Vintage Wash Hoodie",
        description: "Unique vintage wash hoodie with distressed SDFM branding. Each piece has a unique wash pattern.",
        price: 179.99,
        stock: 12,
        image1: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=60",
        image2: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=60",
        category: "Hoodies",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Vintage Wash"],
        slug: "sdfm-vintage-wash-hoodie",
        metaTitle: "SDFM Vintage Wash Hoodie - Unique Streetwear",
        metaDescription: "One-of-a-kind vintage wash hoodie from SDFM. Distressed styling, unique patterns.",
        isActive: true,
        isFeatured: false,
      },
      {
        name: "SDFM Essential Sweatshirt",
        description: "Classic crewneck sweatshirt with minimal SDFM branding. Perfect for layering or solo wear.",
        price: 119.99,
        stock: 30,
        image1: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop&q=60",
        image2: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=800&auto=format&fit=crop&q=60",
        category: "Sweatshirts",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Gray", "Black"],
        slug: "sdfm-essential-sweatshirt",
        metaTitle: "SDFM Essential Sweatshirt - Versatile Streetwear",
        metaDescription: "Versatile crewneck sweatshirt from SDFM. Perfect for any occasion, premium comfort.",
        isActive: true,
        isFeatured: true,
      },
      {
        name: "SDFM Premium Joggers",
        description: "High-quality joggers with SDFM detailing. Perfect companion to our hoodies and sweatshirts.",
        price: 89.99,
        stock: 35,
        image1: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=60",
        image2: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop&q=60",
        category: "Pants",
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        colors: ["Black", "Gray", "Navy"],
        slug: "sdfm-premium-joggers",
        metaTitle: "SDFM Premium Joggers - Comfortable Streetwear",
        metaDescription: "Premium joggers from SDFM. Ultimate comfort meets street style.",
        isActive: true,
        isFeatured: false,
      },
    ],
  })

  console.log('✅ Products created:', products.count)

  // Create a test user
  const testUser = await prisma.user.create({
    data: {
      email: "test@sdfm2520.com",
      name: "Test User",
      address: "123 Test Street",
      city: "Test City",
      zip: "12345",
      country: "US",
    },
  })

  console.log('✅ Test user created:', testUser.email)

  // Create super admin user with properly hashed password
  const hashedPassword = await hash("admin123", 12)
  const superAdmin = await prisma.user.create({
    data: {
      email: "admin@sdfm2520.com",
      name: "Super Admin",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      address: "Admin HQ",
      city: "Admin City",
      zip: "00000",
      country: "US",
    },
  })

  console.log('✅ Super admin created:', superAdmin.email)
  console.log('📧 Email: admin@sdfm2520.com')
  console.log('🔑 Password: admin123')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })