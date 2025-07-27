const fs = require('fs')
const path = require('path')

// Files to update with currency changes
const filesToUpdate = [
  'app/admin/products/[id]/page.tsx',
  'app/admin/orders/[id]/page.tsx',
  'app/admin/orders/page.tsx',
  'app/admin/analytics/page.tsx',
  'app/admin/page.tsx',
  'app/admin/users/page.tsx',
  'app/admin/payments/page.tsx',
  'components/cart-drawer.tsx',
  'components/hoodie-card.tsx',
  'app/admin/products/page.tsx',
  'app/products/[id]/page.tsx'
]

function updateCurrencyConfig() {
  filesToUpdate.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath)
    
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8')
      
      // Replace currency: 'EUR' with currency: 'MXN'
      content = content.replace(/currency:\s*['"']EUR['"']/g, "currency: 'MXN'")
      
      // Also check for any 'eur' lowercase
      content = content.replace(/currency:\s*['"']eur['"']/g, "currency: 'MXN'")
      
      fs.writeFileSync(fullPath, content, 'utf8')
      console.log(`✅ Updated currency config in ${filePath}`)
    } else {
      console.log(`⚠️  File not found: ${filePath}`)
    }
  })
  
  console.log('\n🎉 Currency configuration updated! All EUR changed to MXN')
}

updateCurrencyConfig()