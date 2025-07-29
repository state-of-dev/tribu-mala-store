import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("🔄 Starting database migration via GET...")
    
    // Execute the migration SQL commands one by one
    const migrations = [
      // Add new columns to users table
      `ALTER TABLE "users" 
       ADD COLUMN IF NOT EXISTS "firstName" TEXT,
       ADD COLUMN IF NOT EXISTS "lastName" TEXT,
       ADD COLUMN IF NOT EXISTS "phone" TEXT,
       ADD COLUMN IF NOT EXISTS "birthDate" TIMESTAMP(3),
       ADD COLUMN IF NOT EXISTS "state" TEXT,
       ADD COLUMN IF NOT EXISTS "billingAddress" TEXT,
       ADD COLUMN IF NOT EXISTS "billingCity" TEXT,
       ADD COLUMN IF NOT EXISTS "billingState" TEXT,
       ADD COLUMN IF NOT EXISTS "billingZip" TEXT,
       ADD COLUMN IF NOT EXISTS "billingCountry" TEXT,
       ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT,
       ADD COLUMN IF NOT EXISTS "savePaymentMethods" BOOLEAN DEFAULT false,
       ADD COLUMN IF NOT EXISTS "defaultShipping" BOOLEAN DEFAULT true;`,
      
      // Create unique index for stripeCustomerId
      `CREATE UNIQUE INDEX IF NOT EXISTS "users_stripeCustomerId_key" ON "users"("stripeCustomerId");`,
      
      // Create payment_methods table
      `CREATE TABLE IF NOT EXISTS "payment_methods" (
         "id" TEXT NOT NULL,
         "userId" TEXT NOT NULL,
         "stripeMethodId" TEXT NOT NULL,
         "last4" TEXT NOT NULL,
         "brand" TEXT NOT NULL,
         "expiryMonth" INTEGER NOT NULL,
         "expiryYear" INTEGER NOT NULL,
         "isDefault" BOOLEAN NOT NULL DEFAULT false,
         "nickname" TEXT,
         "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
         "updatedAt" TIMESTAMP(3) NOT NULL,
         CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id")
       );`,
      
      // Create unique index for payment methods
      `CREATE UNIQUE INDEX IF NOT EXISTS "payment_methods_stripeMethodId_key" ON "payment_methods"("stripeMethodId");`,
      
      // Add foreign key constraint
      `DO $$ 
       BEGIN
           IF NOT EXISTS (
               SELECT 1 FROM information_schema.table_constraints 
               WHERE constraint_name = 'payment_methods_userId_fkey'
           ) THEN
               ALTER TABLE "payment_methods" 
               ADD CONSTRAINT "payment_methods_userId_fkey" 
               FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
           END IF;
       END $$;`
    ]
    
    // Execute each migration step
    const results = []
    for (let i = 0; i < migrations.length; i++) {
      const migration = migrations[i]
      console.log(`🔄 Executing migration step ${i + 1}/${migrations.length}`)
      
      try {
        await prisma.$executeRawUnsafe(migration)
        console.log(`✅ Migration step ${i + 1} completed`)
        results.push(`Step ${i + 1}: SUCCESS`)
      } catch (error) {
        console.error(`❌ Migration step ${i + 1} failed:`, error)
        results.push(`Step ${i + 1}: FAILED - ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }
    
    // Test the new schema
    console.log("🧪 Testing new schema...")
    const userCount = await prisma.user.count()
    console.log(`📊 Users table accessible, count: ${userCount}`)
    
    // Test payment methods table
    let paymentMethodCount = 0
    try {
      paymentMethodCount = await prisma.paymentMethod.count()
      console.log(`📊 Payment methods table accessible, count: ${paymentMethodCount}`)
    } catch (error) {
      console.error("❌ Payment methods table test failed:", error)
    }
    
    console.log("✅ Migration completed!")
    
    return NextResponse.json({
      success: true,
      message: "Database migration completed successfully",
      results: {
        userCount,
        paymentMethodCount,
        migrationsRun: migrations.length,
        stepResults: results
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error("❌ Migration failed:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : 'No stack trace'
    }, { status: 500 })
  }
}