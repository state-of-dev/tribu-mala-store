const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkAdmin() {
  try {
    console.log('🔍 Verificando usuarios admin...')
    
    // Buscar todos los usuarios con sus roles
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    })
    
    console.log('📋 Usuarios en la base de datos:')
    console.table(users)
    
    // Buscar específicamente el admin
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@tribumala.com' }
    })
    
    if (admin) {
      console.log('✅ Usuario admin encontrado:')
      console.log('📧 Email:', admin.email)
      console.log('👤 Nombre:', admin.name)
      console.log('👑 Role:', admin.role)
      console.log('🔑 Tiene contraseña:', admin.password ? 'Sí' : 'No')
    } else {
      console.log('❌ Usuario admin NO encontrado')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdmin()