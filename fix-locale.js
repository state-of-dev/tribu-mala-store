const fs = require('fs')
const path = require('path')

// Files to update with locale changes
const filesToUpdate = [
  'components/hoodie-card.tsx',
  'components/cart-drawer.tsx',
  'lib/email.ts',
  'app/products/[id]/page.tsx',
  'app/admin/users/page.tsx',
  'app/admin/products/[id]/page.tsx',
  'app/admin/page.tsx',
  'app/admin/analytics/page.tsx',
  'app/admin/orders/page.tsx',
  'app/admin/products/page.tsx',
  'app/admin/orders/[id]/page.tsx',
  'app/admin/payments/page.tsx'
]

function updateLocale() {
  filesToUpdate.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath)
    
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8')
      
      // Replace es-ES with es-MX (Mexico locale)
      content = content.replace(/es-ES/g, 'es-MX')
      
      fs.writeFileSync(fullPath, content, 'utf8')
      console.log(`✅ Updated locale in ${filePath}`)
    } else {
      console.log(`⚠️  File not found: ${filePath}`)
    }
  })
  
  console.log('\n🎉 Locale conversion complete! All es-ES changed to es-MX (Mexico)')
}

updateLocale()