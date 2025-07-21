"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { seedTestData } from "@/scripts/seed-test-data"
import { Loader2, Database, CheckCircle, AlertCircle, Info } from "lucide-react"

export default function SeedDataPage() {
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedResult, setSeedResult] = useState<{ success: boolean; message?: string } | null>(null)
  const { toast } = useToast()

  const handleSeedData = async () => {
    setIsSeeding(true)
    setSeedResult(null)

    try {
      const result = await seedTestData("test-user-123")
      setSeedResult(result)

      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setSeedResult({ success: false, message: errorMessage })
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
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Seed Test Data</h1>
        <p className="text-muted-foreground">Add sample data to your Firebase database for testing purposes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Seeding
          </CardTitle>
          <CardDescription>
            This will add sample projects, work orders, quotes, and clients to your Firebase database. Only use this in
            development environments.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Firebase Connection:</strong> This will connect directly to your Firebase project (not local
              emulators). Make sure your Firebase configuration is correct.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <h3 className="font-medium">What will be created:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• 2 sample projects (Kitchen Renovation, Bathroom Remodel)</li>
              <li>• 2 sample work orders (Deck Repair, Fence Installation)</li>
              <li>• 1 sample quote (Garage Door Installation)</li>
              <li>• 2 sample clients (Alice Johnson, Bob Wilson)</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Target User ID</h3>
            <p className="text-sm text-muted-foreground">
              Data will be seeded for user ID: <code className="bg-background px-1 rounded">test-user-123</code>
            </p>
          </div>

          <Button onClick={handleSeedData} disabled={isSeeding} className="w-full">
            {isSeeding ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding Data...
              </>
            ) : (
              <>
                <Database className="mr-2 h-4 w-4" />
                Seed Test Data
              </>
            )}
          </Button>

          {seedResult && (
            <Alert className={seedResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              {seedResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={seedResult.success ? "text-green-800" : "text-red-800"}>
                {seedResult.message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
