"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAppState } from "@/contexts/app-state-context"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"
import type { Project } from "@/lib/firebase-services"

export default function NewProjectPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { addProject, state } = useAppState()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    address: "",
    startDate: "",
    endDate: "",
    description: "",
    budget: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (state.userRole !== "contractor") {
    router.push("/dashboard")
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate form
    if (!formData.title || !formData.client || !formData.startDate || !formData.endDate || !formData.budget) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Create new project data including required Project fields
    const selectedClient = state.clients.find(
      (c) => c.name === formData.client,
    )

    const newProject: Project & {
      client?: string
      address?: string
      startDate?: string
      endDate?: string
      progress: number
      totalCost: number
      paidAmount: number
    } = {
      id: `${Date.now()}`,
      title: formData.title,
      description: formData.description,
      status: "pending",
      budget: Number.parseFloat(formData.budget),
      clientId: selectedClient?.id || "",
      contractorId: user?.uid || "",
      createdAt: new Date(),
      updatedAt: new Date(),
      client: formData.client,
      address: formData.address,
      startDate: formData.startDate,
      endDate: formData.endDate,
      progress: 0,
      totalCost: Number.parseFloat(formData.budget),
      paidAmount: 0,
    }

    // Add project to state
    addProject(newProject)

    // Show success toast
    toast({
      title: "Success",
      description: "Project created successfully",
    })

    // Redirect to dashboard
    setTimeout(() => {
      router.push("/dashboard")
    }, 500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back to Dashboard</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
      </div>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Enter the details for your new project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input id="title" placeholder="Enter project title" value={formData.title} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select onValueChange={(value) => handleSelectChange("client", value)}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {state.clients.map((client) => (
                    <SelectItem key={client.id} value={client.name}>
                      {client.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="new">+ Add New Client</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Project Address</Label>
              <Input
                id="address"
                placeholder="Enter project address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input type="date" id="startDate" value={formData.startDate} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input type="date" id="endDate" value={formData.endDate} onChange={handleChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                placeholder="Enter project details..."
                className="min-h-[120px]"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="Enter project budget"
                value={formData.budget}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
