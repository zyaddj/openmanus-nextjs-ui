'use client'

import { Sidebar } from "@/components/ui/sidebar"
import { useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const { signOut, user } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          links={[
            {
              title: "New Task",
              href: "/dashboard/new-task",
              icon: "plus",
            },
            {
              title: "API Keys",
              href: "/dashboard/api-keys",
              icon: "key",
            },
            {
              title: "History",
              href: "/dashboard/history",
              icon: "history",
            },
            {
              title: "Settings",
              href: "/dashboard/settings",
              icon: "settings",
            },
          ]}
          footer={
            <div className="px-3 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    {user?.user_metadata?.name ? user.user_metadata.name.charAt(0) : user?.email?.charAt(0)}
                  </div>
                  {!collapsed && (
                    <div className="text-sm font-medium">
                      {user?.user_metadata?.name || user?.email}
                    </div>
                  )}
                </div>
                {!collapsed && (
                  <Button variant="ghost" size="icon" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          }
        />
        <div className="flex-1 overflow-auto">
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
