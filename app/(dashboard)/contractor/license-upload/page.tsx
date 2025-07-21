"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/firebase-auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LicenseForm } from "@/components/license-form"
import { Loader2 } from "lucide-react"

export default function LicenseUploadPage() {
  const router = useRouter()
  const { userProfile, loading: authLoading } = useAuth()

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Contractor Verification</CardTitle>
          <CardDescription>Please provide your license information to complete your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <LicenseForm
            userProfile={userProfile}
            onSuccess={() => router.push("/dashboard")}
          />
        </CardContent>
      </Card>
    </div>
  )
}
