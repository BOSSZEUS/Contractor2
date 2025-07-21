"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle, Mail } from "lucide-react"

export default function VerifyEmailPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [code, setCode] = useState(["", "", "", "", "", ""])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.charAt(0)
    }

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate verification
    setTimeout(() => {
      setIsLoading(false)
      setIsVerified(true)
    }, 1000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
          <CardDescription>We've sent a verification code to your email address</CardDescription>
        </CardHeader>
        {isVerified ? (
          <CardContent className="space-y-4 text-center">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <p className="font-medium">Email verified successfully!</p>
            <p className="text-muted-foreground">Your email has been verified. You can now continue to your account.</p>
            <Button asChild className="w-full mt-4">
              <Link href="/dashboard">Continue to Dashboard</Link>
            </Button>
          </CardContent>
        ) : (
          <>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <Mail className="h-12 w-12 text-primary" />
              </div>
              <p className="text-center text-muted-foreground">Enter the 6-digit code sent to your email address</p>
              <form onSubmit={handleSubmit}>
                <div className="flex justify-center gap-2">
                  {code.map((digit, index) => (
                    <Input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      className="h-12 w-12 text-center text-lg"
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      required
                    />
                  ))}
                </div>
                <Button className="w-full mt-4" type="submit" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify Email"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col">
              <p className="text-center text-sm text-muted-foreground">
                Didn't receive a code?{" "}
                <Button variant="link" className="p-0 h-auto">
                  Resend code
                </Button>
              </p>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}
