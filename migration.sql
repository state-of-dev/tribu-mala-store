-- Add new user profile fields
ALTER TABLE "users" 
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
ADD COLUMN IF NOT EXISTS "savePaymentMethods" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "defaultShipping" BOOLEAN NOT NULL DEFAULT true;

-- Create unique index for stripeCustomerId if it doesn't exist
CREATE UNIQUE INDEX IF NOT EXISTS "users_stripeCustomerId_key" ON "users"("stripeCustomerId");

-- Create payment_methods table if it doesn't exist
CREATE TABLE IF NOT EXISTS "payment_methods" (
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
);

-- Create indexes and foreign keys for payment_methods if they don't exist
CREATE UNIQUE INDEX IF NOT EXISTS "payment_methods_stripeMethodId_key" ON "payment_methods"("stripeMethodId");

-- Add foreign key constraint if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'payment_methods_userId_fkey'
    ) THEN
        ALTER TABLE "payment_methods" 
        ADD CONSTRAINT "payment_methods_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;