"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { AppStateProvider } from "@/contexts/app-state-context"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"
import { UserNav } from "@/components/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, LogIn } from "lucide-react"
import Link from "next/link"

function LoadingSpinner({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

function AuthRequired() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <LogIn className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>You need to be signed in to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, userProfile, loading, profileLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted (prevents hydration issues)
  if (!mounted) {
    return <LoadingSpinner message="Initializing..." />
  }

  // Show loading while auth is initializing
  if (loading) {
    return <LoadingSpinner message="Authenticating..." />
  }

  // Show loading while profile is loading
  if (profileLoading) {
    return <LoadingSpinner message="Loading profile..." />
  }

  // Show auth required if user is not authenticated or profile is missing
  if (!user || !userProfile) {
    if (process.env.NODE_ENV === "development") {
      console.log("Dashboard Layout: Auth check failed", { user: !!user, userProfile: !!userProfile })
    }
    return <AuthRequired />
  }

  if (process.env.NODE_ENV === "development") {
    console.log("Dashboard Layout: User authenticated", {
      email: user.email,
      role: userProfile.role,
      uid: userProfile.uid,
    })
  }

  // User is authenticated and profile is loaded - render dashboard
  return (
    <AppStateProvider>
      <div className="min-h-screen bg-background">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav />
            <MobileNav />
            <div className="ml-auto flex items-center space-x-4">
              <ThemeToggle />
              <UserNav />
            </div>
          </div>
        </div>
        <main className="flex-1 space-y-4 p-8 pt-6">{children}</main>
      </div>
    </AppStateProvider>
  )
}
