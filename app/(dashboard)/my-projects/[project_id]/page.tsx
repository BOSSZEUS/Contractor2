"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ClientFeedback } from "@/components/client-feedback"
import { MapPin, Calendar, DollarSign, User, MessageSquare, ChevronLeft } from "lucide-react"
import { useAppState } from "@/contexts/app-state-context"

// This is the CLIENT's project details page.

interface ProjectLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface Project {
  id: string
  title: string
  client: string
  address: string
  startDate: string
  endDate: string
  status: string
  progress: number
  totalCost: number
  paidAmount: number
  description?: string
  contractorId: string
  contractorName: string
  lineItems?: ProjectLineItem[]
  feedbackSubmitted?: boolean
  feedback?: { rating: number; comments: string; submittedAt: string }
}

export default function ClientProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.project_id as string
  const { state } = useAppState()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (state.userRole !== "client") {
      router.push("/dashboard")
      return
    }

    // In a real app, you'd fetch this data. We'll use mock data.
    const mockProject: Project = {
      id: projectId,
      title: "Kitchen Cabinet Installation",
      client: "John Smith",
      address: "123 Main St, Anytown, ST 12345",
      startDate: "2025-01-07",
      endDate: "2025-02-07",
      status: "in-progress",
      progress: 65,
      totalCost: 4500,
      paidAmount: 2500,
      description: "Complete kitchen cabinet installation with modern fixtures and under-cabinet lighting.",
      contractorId: "contractor_123",
      contractorName: "ABC Contractors",
      feedbackSubmitted: false,
      lineItems: [
        { id: "item-1", description: "Upper cabinet installation", quantity: 1, unitPrice: 1500, total: 1500 },
        { id: "item-2", description: "Lower cabinet installation", quantity: 1, unitPrice: 2000, total: 2000 },
        { id: "item-3", description: "Hardware and finishing", quantity: 1, unitPrice: 1000, total: 1000 },
      ],
    }
    setProject(mockProject)
    setLoading(false)
  }, [projectId, state.userRole, router])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleFeedbackSubmitted = (feedbackData: { rating: number; comments: string }) => {
    if (!project) return
    setProject({
      ...project,
      feedbackSubmitted: true,
      feedback: { ...feedbackData, submittedAt: new Date().toISOString() },
    })
  }

  if (loading) return <div className="text-center py-10">Loading project...</div>
  if (!project) return <div className="text-center py-10">Project not found.</div>

  const balance = project.totalCost - project.paidAmount
  const showFeedback =
    (project.status === "completed" || project.status === "pending_approval") && !project.feedbackSubmitted

  return (
    <div className="container mx-auto py-6 max-w-5xl space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
          <p className="text-muted-foreground">Project #{projectId}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle>Project Overview</CardTitle>
            {getStatusBadge(project.status)}
          </div>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>Contractor: {project.contractorName}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Location: {project.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>Total Cost: ${project.totalCost.toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="financials" className="space-y-4">
        <TabsList>
          <TabsTrigger value="financials">Financials</TabsTrigger>
          <TabsTrigger value="line-items">Line Items</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          {showFeedback && <TabsTrigger value="feedback">Feedback</TabsTrigger>}
        </TabsList>

        <TabsContent value="financials">
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span>${project.totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span>${project.paidAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium text-base">
                  <span>Balance:</span>
                  <span>${balance.toLocaleString()}</span>
                </div>
              </div>
              {balance > 0 && (
                <Button className="w-full" onClick={() => router.push("/payments/new")}>
                  Make a Payment
                </Button>
              )}
              {balance <= 0 && (
                <div className="text-center text-sm text-green-600 bg-green-50 p-3 rounded-md">
                  This project is paid in full.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="line-items">
          <Card>
            <CardHeader>
              <CardTitle>Project Line Items</CardTitle>
              <CardDescription>Detailed breakdown of work performed</CardDescription>
            </CardHeader>
            <CardContent>
              {project.lineItems && project.lineItems.length > 0 ? (
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="p-3 text-left">Description</th>
                        <th className="p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.lineItems.map((item) => (
                        <tr key={item.id} className="border-b last:border-none">
                          <td className="p-3">{item.description}</td>
                          <td className="p-3 text-right">${item.total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-muted/50">
                      <tr>
                        <td className="p-3 font-bold text-right">Total:</td>
                        <td className="p-3 font-bold text-right">
                          ${project.lineItems.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">No line items available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Project Messages
              </CardTitle>
              <CardDescription>Communication with your contractor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {showFeedback && (
          <TabsContent value="feedback">
            <ClientFeedback
              projectId={project.id}
              contractorId={project.contractorId}
              contractorName={project.contractorName}
              onFeedbackSubmitted={handleFeedbackSubmitted}
            />
          </TabsContent>
        )}
      </Tabs>

      {project.feedbackSubmitted && project.feedback && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="text-green-600">✅</div>
              <div>
                <p className="text-green-800 font-medium">Thank you for your feedback!</p>
                <p className="text-green-700 text-sm">
                  You rated this project {project.feedback.rating}/5 stars on{" "}
                  {new Date(project.feedback.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
