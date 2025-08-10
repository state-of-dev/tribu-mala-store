"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { DashboardPreloader } from "@/components/dashboard-preloader"
import { ReduxProvider } from "@/components/providers/redux-provider"
import { AdminDataLoader } from "@/components/admin/admin-data-loader"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin?callbackUrl=/admin")
      return
    }

    if (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN') {
      router.push("/")
      return
    }
  }, [session, status, router])

  if (status === "loading") {
    return null
  }

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'SUPER_ADMIN')) {
    return null
  }

  return (
    <>
      <DashboardPreloader />
      <ReduxProvider>
        <AdminDataLoader>
          {children}
        </AdminDataLoader>
      </ReduxProvider>
    </>
  )
}