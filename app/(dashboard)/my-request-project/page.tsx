"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle } from "lucide-react"
import { useAppState } from "@/contexts/app-state-context"

export default function RequestProjectPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("details")
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    projectType: "",
    title: "",
    description: "",
    address: "",
    budget: "",
    timeframe: "",
    startDate: "",
    additionalInfo: "",
  })

  const { state } = useAppState()
  const { userRole } = state

  useEffect(() => {
    if (userRole && userRole !== "client") {
      router.push("/dashboard")
    }
  }, [userRole, router])

  if (!userRole || userRole !== "client") {
    return null // or a loading spinner
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

    // Validate form
    if (!formData.projectType || !formData.title || !formData.description || !formData.address) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Submit form
    setSubmitted(true)

    // Show success toast
    toast({
      title: "Project request submitted",
      description: "Your contractor will review your request and get back to you soon.",
    })
  }

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Project Request Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Your project request has been sent to your contractor. They will review the details and get back to you
              soon.
            </p>
            <div className="space-y-4 w-full max-w-md">
              <Button className="w-full" onClick={() => router.push("/dashboard")}>
                Return to Dashboard
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => router.push("/messages")}>
                Message Contractor
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Request a New Project</h1>
      </div>

      <Card className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Project Request</CardTitle>
            <CardDescription>Provide details about the project you'd like to request</CardDescription>
          </CardHeader>

          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mx-6">
              <TabsTrigger value="details">Project Details</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>

            <CardContent className="pt-6">
              <TabsContent value="details" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectType">Project Type</Label>
                  <Select onValueChange={(value) => handleSelectChange("projectType", value)}>
                    <SelectTrigger id="projectType">
                      <SelectValue placeholder="Select project type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="renovation">Renovation</SelectItem>
                      <SelectItem value="remodel">Remodel</SelectItem>
                      <SelectItem value="new-construction">New Construction</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Kitchen Renovation"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project in detail..."
                    className="min-h-[120px]"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Project Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter the address where the work will be done"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <Button type="button" onClick={() => setActiveTab("preferences")} className="w-full">
                  Next: Preferences
                </Button>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range (Optional)</Label>
                  <Select onValueChange={(value) => handleSelectChange("budget", value)}>
                    <SelectTrigger id="budget">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-5000">Under $5,000</SelectItem>
                      <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
                      <SelectItem value="over-50000">Over $50,000</SelectItem>
                      <SelectItem value="not-sure">Not sure yet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeframe">Desired Timeframe (Optional)</Label>
                  <Select onValueChange={(value) => handleSelectChange("timeframe", value)}>
                    <SelectTrigger id="timeframe">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">As soon as possible</SelectItem>
                      <SelectItem value="1-month">Within 1 month</SelectItem>
                      <SelectItem value="1-3-months">1-3 months</SelectItem>
                      <SelectItem value="3-6-months">3-6 months</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Preferred Start Date (Optional)</Label>
                  <Input id="startDate" type="date" value={formData.startDate} onChange={handleChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Any other details you'd like to share..."
                    className="min-h-[100px]"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                    Back
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("review")}>
                    Next: Review
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="review" className="space-y-4">
                <div className="space-y-4">
                  <div className="rounded-md border p-4 space-y-2">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-sm font-medium">Project Type</h3>
                        <p className="text-sm capitalize">{formData.projectType || "Not specified"}</p>
                      </div>
                      <div className="col-span-2">
                        <h3 className="text-sm font-medium">Project Title</h3>
                        <p className="text-sm">{formData.title || "Not specified"}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium">Description</h3>
                      <p className="text-sm">{formData.description || "Not specified"}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium">Address</h3>
                      <p className="text-sm">{formData.address || "Not specified"}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <h3 className="text-sm font-medium">Budget</h3>
                        <p className="text-sm">{formData.budget || "Not specified"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Timeframe</h3>
                        <p className="text-sm">{formData.timeframe || "Not specified"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Start Date</h3>
                        <p className="text-sm">{formData.startDate || "Not specified"}</p>
                      </div>
                    </div>

                    {formData.additionalInfo && (
                      <div>
                        <h3 className="text-sm font-medium">Additional Information</h3>
                        <p className="text-sm">{formData.additionalInfo}</p>
                      </div>
                    )}
                  </div>

                  <div className="rounded-md bg-muted p-4">
                    <p className="text-sm">
                      By submitting this request, you're asking your contractor to review your project details. This is
                      not a binding agreement. Your contractor will contact you to discuss the project further.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("preferences")}>
                    Back
                  </Button>
                  <Button type="submit">Submit Request</Button>
                </div>
              </TabsContent>
            </CardContent>
          </Tabs>
        </form>
      </Card>
    </div>
  )
}
