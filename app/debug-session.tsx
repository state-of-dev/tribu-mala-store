"use client"

import { useSession } from "next-auth/react"

export default function DebugSession() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading session...</div>
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg max-w-sm text-xs">
      <h3 className="font-bold mb-2">🐛 Debug Session</h3>
      <div>Status: {status}</div>
      {session && (
        <div>
          <div>Email: {session.user?.email}</div>
          <div>Name: {session.user?.name}</div>
          <div>Role: {session.user?.role || 'NO ROLE'}</div>
          <div>ID: {session.user?.id}</div>
        </div>
      )}
      {!session && <div>No session</div>}
    </div>
  )
}