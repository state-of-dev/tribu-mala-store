const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updatePrices() {
  try {
    console.log('Updating all product prices to 1.00 MXN...')
    
    const result = await prisma.product.updateMany({
      data: {
        price: 1.00
      }
    })
    
    console.log(`Updated ${result.count} products to 1.00 MXN`)
    
    // Verify the update
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true
      }
    })
    
    console.log('\nCurrent products and prices:')
    products.forEach(product => {
      console.log(`- ${product.name}: $${product.price.toFixed(2)} MXN`)
    })
    
  } catch (error) {
    console.error('Error updating prices:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updatePrices()