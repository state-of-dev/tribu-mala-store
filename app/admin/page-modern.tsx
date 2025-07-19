"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp,
  Calendar,
  MoreHorizontal,
  Plus,
  Send,
  Github,
  MessageCircle,
  Settings,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts'

// Datos de ejemplo para los gráficos
const revenueData = [
  { month: 'Jan', revenue: 12500 },
  { month: 'Feb', revenue: 15600 },
  { month: 'Mar', revenue: 13200 },
  { month: 'Apr', revenue: 18900 },
  { month: 'May', revenue: 22100 },
  { month: 'Jun', revenue: 25800 },
]

const subscriptionData = [
  { month: 'Jan', subs: 1200 },
  { month: 'Feb', subs: 1650 },
  { month: 'Mar', subs: 2100 },
  { month: 'Apr', subs: 2350 },
  { month: 'May', subs: 2800 },
  { month: 'Jun', subs: 3200 },
]

const exerciseData = [
  { day: 'Mon', minutes: 45 },
  { day: 'Tue', minutes: 32 },
  { day: 'Wed', minutes: 58 },
  { day: 'Thu', minutes: 41 },
  { day: 'Fri', minutes: 55 },
  { day: 'Sat', minutes: 67 },
  { day: 'Sun', minutes: 38 },
]

const goalData = [
  { day: 'Mon', calories: 320 },
  { day: 'Tue', calories: 285 },
  { day: 'Wed', calories: 410 },
  { day: 'Thu', calories: 380 },
  { day: 'Fri', calories: 445 },
  { day: 'Sat', calories: 520 },
  { day: 'Sun', calories: 290 },
]

const teamMembers = [
  { name: "Sofia Davis", role: "Owner", avatar: "SD", status: "online" },
  { name: "Jackson Lee", role: "Developer", avatar: "JL", status: "away" },
  { name: "Isabella Nguyen", role: "Designer", avatar: "IN", status: "billing" },
]

const payments = [
  { email: "ken99@example.com", status: "Success", amount: "$316.00" },
  { email: "abe45@example.com", status: "Success", amount: "$242.00" },
  { email: "monserrat44@example.com", status: "Processing", amount: "$837.00" },
  { email: "carmela@example.com", status: "Failed", amount: "$721.00" },
  { email: "jason70@example.com", status: "Pending", amount: "$405.00" },
  { email: "sarah23@example.com", status: "Success", amount: "$1,280.00" },
]

interface DashboardData {
  metrics: {
    orders: { total: number; today: number; pending: number; thisMonth: number }
    revenue: { total: number; today: number; thisMonth: number }
    products: { total: number; lowStock: number; inactive: number }
    users: { total: number; newThisMonth: number }
  }
  recentOrders: Array<{
    id: string; orderNumber: string; customerName: string | null
    customerEmail: string; total: number; status: string; paymentStatus: string
    itemCount: number; createdAt: string
  }>
  topProducts: Array<{
    name: string; image1: string; price: number; totalSold: number; orderCount: number
  }>
}

export default function ModernDashboard() {
  const { data: session } = useSession()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Bienvenido de vuelta, {session?.user?.name}</p>
          </div>
          <ThemeToggle />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Revenue Card */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <div className="text-2xl font-bold">$15,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </div>
              <Button variant="outline" size="sm">View More</Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={revenueData}>
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#8884d8" 
                    fill="#8884d8"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Subscriptions Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
                <div className="text-2xl font-bold">+2,350</div>
                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
              </div>
              <Button variant="outline" size="sm">View More</Button>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={subscriptionData}>
                  <Area 
                    type="monotone" 
                    dataKey="subs" 
                    stroke="#82ca9d" 
                    fill="#82ca9d"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Calendar Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center space-x-2">
                <ChevronLeft className="h-4 w-4" />
                <span className="font-medium">June 2025</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="p-2 text-muted-foreground">{day}</div>
                ))}
                {Array.from({ length: 35 }, (_, i) => {
                  const day = i - 2
                  const isCurrentMonth = day > 0 && day <= 30
                  const isToday = day === 13
                  return (
                    <div 
                      key={i} 
                      className={`p-2 text-sm ${
                        isCurrentMonth 
                          ? isToday 
                            ? 'bg-primary text-primary-foreground rounded-md font-medium' 
                            : 'hover:bg-muted rounded-md cursor-pointer'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {isCurrentMonth ? day : ''}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Move Goal Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Move Goal</CardTitle>
              <div className="text-muted-foreground text-sm">Set your daily activity goal.</div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">350</div>
                <div className="text-sm text-muted-foreground">CALORIES/DAY</div>
              </div>
              <ResponsiveContainer width="100%" height={60}>
                <BarChart data={goalData}>
                  <Bar dataKey="calories" fill="#8884d8" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <Button size="sm" className="w-full">Set Goal</Button>
            </CardContent>
          </Card>

          {/* Upgrade Subscription Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Upgrade your subscription</CardTitle>
              <div className="text-sm text-muted-foreground">
                You are currently on the free plan. Upgrade to the pro plan to get access to all features.
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Evil Rabbit" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="example@acme.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card">Card Number</Label>
                <Input id="card" placeholder="1234 1234 1234 1234" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="expiry">MM/YY</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="CVC" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plan">Plan</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2 p-3 border rounded-md">
                    <input type="radio" name="plan" className="w-4 h-4" />
                    <div>
                      <div className="font-medium">Starter Plan</div>
                      <div className="text-sm text-muted-foreground">Perfect for small businesses.</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-md bg-muted">
                    <input type="radio" name="plan" className="w-4 h-4" defaultChecked />
                    <div>
                      <div className="font-medium">Pro Plan</div>
                      <div className="text-sm text-muted-foreground">More features and storage.</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Enter notes" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="terms" />
                <Label htmlFor="terms" className="text-sm">I agree to the terms and conditions</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="emails" defaultChecked />
                <Label htmlFor="emails" className="text-sm">Allow us to send you emails</Label>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1">Cancel</Button>
                <Button className="flex-1">Upgrade Plan</Button>
              </div>
            </CardContent>
          </Card>

          {/* Create Account Card */}
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>Enter your email below to create your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button variant="outline">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input id="email-signup" placeholder="m@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
              <Button className="w-full">Create account</Button>
            </CardContent>
          </Card>

          {/* Exercise Minutes Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Exercise Minutes</CardTitle>
              <CardDescription>Your exercise minutes are ahead of where you normally are.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={exerciseData}>
                  <Area 
                    type="monotone" 
                    dataKey="minutes" 
                    stroke="#8884d8" 
                    fill="#8884d8"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Payments Table */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Payments</CardTitle>
                <CardDescription>Manage your payments.</CardDescription>
              </div>
              <Button size="sm">Add Payment</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-sm font-medium">
                  <div>Status</div>
                  <div>Email</div>
                  <div>Amount</div>
                </div>
                {payments.map((payment, index) => (
                  <div key={index} className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <Badge 
                        variant={
                          payment.status === 'Success' ? 'default' :
                          payment.status === 'Processing' ? 'secondary' :
                          payment.status === 'Failed' ? 'destructive' : 'outline'
                        }
                      >
                        {payment.status}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground">{payment.email}</div>
                    <div className="font-medium">{payment.amount}</div>
                  </div>
                ))}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>0 of 6 row(s) selected.</span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">Previous</Button>
                    <Button variant="outline" size="sm">Next</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members and Settings */}
          <div className="space-y-6">
            {/* Team Members */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <CardDescription>Invite your team members to collaborate.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm font-medium">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.role}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {member.status === 'billing' ? 'Billing' : 
                       member.status === 'online' ? 'Owner' : 'Developer'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Cookie Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Cookie Settings</CardTitle>
                <CardDescription>Manage your cookie settings here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="strictly-necessary" className="font-medium">Strictly Necessary</Label>
                    <Switch id="strictly-necessary" checked disabled />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    These cookies are essential in order to use the website and use its features.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="functional" className="font-medium">Functional Cookies</Label>
                    <Switch id="functional" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    These cookies allow the website to provide personalized functionality.
                  </p>
                </div>
                <Button size="sm" className="w-full">Save preferences</Button>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}