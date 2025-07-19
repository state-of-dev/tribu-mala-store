const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdminUser() {
  try {
    console.log('🚀 Creando usuario administrador...')

    // Verificar si ya existe un admin
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [
          { role: 'ADMIN' },
          { role: 'SUPER_ADMIN' }
        ]
      }
    })

    if (existingAdmin) {
      console.log('✅ Ya existe un usuario administrador:', existingAdmin.email)
      return
    }

    // Crear usuario admin
    const hashedPassword = await hash('admin123', 12)
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@tribumala.com',
        name: 'Admin Tribumala',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        address: 'Calle Admin 123',
        city: 'Madrid',
        zip: '28001',
        country: 'España'
      }
    })

    console.log('✅ Usuario administrador creado exitosamente:')
    console.log('📧 Email:', adminUser.email)
    console.log('🔑 Password: admin123')
    console.log('👑 Role:', adminUser.role)
    console.log('')
    console.log('🔗 Accede al dashboard admin en: http://localhost:3000/admin')
    console.log('')
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login')

  } catch (error) {
    console.error('❌ Error creando usuario admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()