"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { seedTestData } from "@/scripts/seed-test-data"
import { Database, Loader2 } from "lucide-react"

export default function DevTools() {
  const [isSeeding, setIsSeeding] = useState(false)
  const { toast } = useToast()

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null
  }

  const handleSeedData = async () => {
    setIsSeeding(true)
    try {
      const result = await seedTestData("test-user-123")

      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to seed test data",
        variant: "destructive",
      })
    } finally {
      setIsSeeding(false)
    }
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 border-2 border-dashed border-blue-300 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm text-blue-800 flex items-center gap-2">
          <Database className="h-4 w-4" />
          Dev Tools
        </CardTitle>
        <CardDescription className="text-xs text-blue-600">
          Development utilities (only visible in dev mode)
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button
          onClick={handleSeedData}
          disabled={isSeeding}
          size="sm"
          className="w-full bg-transparent"
          variant="outline"
        >
          {isSeeding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Seeding...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Seed Test Data
            </>
          )}
        </Button>
        <p className="text-xs text-blue-600 mt-2">Adds sample projects, quotes, clients, and work orders to Firebase</p>
      </CardContent>
    </Card>
  )
}
