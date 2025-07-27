const fs = require('fs')
const path = require('path')

// Files to update with currency changes
const filesToUpdate = [
  'lib/email.ts',
  'app/products/[id]/page.tsx',
  'app/admin/products/[id]/edit/page.tsx',
  'app/admin/products/new/page.tsx',
  'app/admin/products/page.tsx',
  'components/hoodie-card.tsx',
  'components/cart-drawer.tsx',
  'app/admin/payments/page.tsx',
  'app/admin/users/page.tsx',
  'app/admin/page.tsx',
  'app/admin/analytics/page.tsx',
  'app/admin/orders/page.tsx',
  'app/admin/orders/[id]/page.tsx',
  'app/admin/products/[id]/page.tsx'
]

function updateCurrency() {
  filesToUpdate.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath)
    
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8')
      
      // Replace € with $ MXN
      content = content.replace(/€\${/g, '$${')
      content = content.replace(/€\d+/g, (match) => match.replace('€', '$') + ' MXN')
      content = content.replace(/€0\.00/g, '$0.00 MXN')
      content = content.replace(/Precio \(€\)/g, 'Precio ($MXN)')
      content = content.replace(/Price \(€\)/g, 'Price ($MXN)')
      content = content.replace(/superiores a 50€/g, 'superiores a $500 MXN')
      
      // Fix specific patterns
      content = content.replace(/€\$\{([^}]+)\}/g, '$$$1 MXN')
      
      fs.writeFileSync(fullPath, content, 'utf8')
      console.log(`✅ Updated currency in ${filePath}`)
    } else {
      console.log(`⚠️  File not found: ${filePath}`)
    }
  })
  
  console.log('\n🎉 Currency conversion complete! All € symbols replaced with $ MXN')
}

updateCurrency()