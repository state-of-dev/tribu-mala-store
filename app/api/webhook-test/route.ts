import { NextResponse } from "next/server"

// Simple endpoint to test if webhooks are working
export async function POST(request: Request) {
  console.log("🔔 TEST WEBHOOK RECEIVED at:", new Date().toISOString())
  
  try {
    const body = await request.text()
    const headers = Object.fromEntries(request.headers.entries())
    
    console.log("📝 Headers:", headers)
    console.log("📝 Body preview:", body.substring(0, 200))
    
    return NextResponse.json({ 
      received: true, 
      timestamp: new Date().toISOString(),
      bodyLength: body.length,
      hasStripeSignature: !!headers['stripe-signature']
    })
  } catch (error) {
    console.error("❌ Test webhook error:", error)
    return NextResponse.json({ error: "Test webhook failed" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: "Webhook test endpoint is working",
    timestamp: new Date().toISOString()
  })
}