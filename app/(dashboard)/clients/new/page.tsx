"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAppState } from "@/contexts/app-state-context"
import { useToast } from "@/components/ui/use-toast"

export default function NewClientPage() {
  const router = useRouter()
  const { addClient } = useAppState()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Create new client
    const newClient = {
      id: `${Date.now()}`,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      company: formData.company,
      projects: 0,
      totalSpent: 0,
    }

    // Add client to state
    addClient(newClient)

    // Show success toast
    toast({
      title: "Success",
      description: "Client added successfully",
    })

    // Redirect to clients page
    setTimeout(() => {
      router.push("/clients")
    }, 500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/clients")}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back to Clients</span>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add New Client</h1>
      </div>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Enter the details for your new client</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company Name (Optional)</Label>
              <Input id="company" placeholder="Enter company name" value={formData.company} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" placeholder="Enter address" value={formData.address} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Enter any additional notes about this client"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/clients")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Client"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
