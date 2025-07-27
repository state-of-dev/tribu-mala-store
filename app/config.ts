// Store configuration - Clean version with only necessary config
export const storeConfig = {
  // Store information
  storeName: "Tribu Mala",
  storeDescription: "Premium streetwear and comfortable hoodies",

  // Note: Products are now loaded dynamically from database via /api/products
  // No hardcoded products needed here anymore
  
  // Stripe configuration (consider moving to environment variables)
  stripePublishableKey:
    "pk_test_51QkCPcLuMl0Rhhttt0diC60MxwyXTbbYkctIHI9DAgXvnt7FHVdhJXgkFsEQNJBLhxn5h6V5a1Y6yQfk8y5TBQDP00iOr4AlIs",
}
