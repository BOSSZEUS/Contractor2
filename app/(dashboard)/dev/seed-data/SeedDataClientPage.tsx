"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/firebase-auth-context"
import { useToast } from "@/hooks/use-toast"
import { seedTestData } from "@/scripts/seed-test-data"
import { AlertCircle } from "lucide-react"
import DevTools from "@/components/dev-tools"

export default function SeedDataClientPage() {
  const { user, userProfile } = useAuth()
  const { toast } = useToast()
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null)

  const handleSeedData = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in before seeding test data",
        variant: "destructive",
      })
      return
    }

    setIsSeeding(true)
    setSeedResult(null)

    try {
      const result = await seedTestData(user.uid)
      setSeedResult(result)

      if (result.success) {
        toast({
          title: "Success",
          description: "Test data has been seeded successfully!",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to seed test data",
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setSeedResult({ success: false, error: errorMessage })
      toast({
        title: "Error",
        description: "Failed to seed test data",
        variant: "destructive",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  if (process.env.NODE_ENV !== "development") {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>This page is only available in development mode.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <main className="flex flex-col items-center justify-center gap-6 py-16">
      <h1 className="text-3xl font-bold">Developer Seed Utilities</h1>
      <p className="max-w-md text-center text-muted-foreground">
        Click the button below to add example projects, clients, work orders and quotes to your Firestore database.
      </p>
      {/* The button lives inside DevTools */}
      <DevTools />
    </main>
  )
}
