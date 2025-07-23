"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, Star, DollarSign } from "lucide-react"
import { useAppState } from "@/contexts/app-state-context"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface WorkOrder {
  id: string
  title: string
  description: string
  urgency: string
  property_address: string
  distance: string
  client_rating: number
  posted_date: string
  budget_range?: string
}

export default function JobBoardContractor() {
  const { state } = useAppState()
  const { userRole } = state
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        // Get contractor's ZIP code from app state/profile
        // In a real app, this would come from the contractor's profile
        const contractorZip = "12345" // Fallback or get from contractor profile
        const defaultRadius = 50 // Default 50 mile radius

        let apiUrl = "/api/workorders/available"

        // Add ZIP and radius parameters if contractor ZIP is available
        if (contractorZip) {
          apiUrl += `?zip=${contractorZip}&radius=${defaultRadius}`
        }

        // Simulate API call to GET /api/workorders/available with filtering
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data representing filtered work orders from the API
        const mockData: WorkOrder[] = [
          {
            id: "wo_001",
            title: "Kitchen Cabinet Installation",
            description:
              "Need new kitchen cabinets installed. Modern style preferred with soft-close hinges and under-cabinet lighting. Client has cabinets ready for installation.",
            urgency: "Normal",
            property_address: "456 Oak Ave, Anytown, ST",
            distance: "2.3 miles",
            client_rating: 4.8,
            posted_date: "2025-01-02",
            budget_range: "$2,000 - $3,500",
          },
          {
            id: "wo_002",
            title: "Bathroom Tile Repair",
            description:
              "Several loose tiles in master bathroom need replacement. Matching tiles available. Small job but needs to be done properly to prevent water damage.",
            urgency: "High",
            property_address: "789 Pine St, Anytown, ST",
            distance: "1.8 miles",
            client_rating: 4.5,
            posted_date: "2025-01-01",
            budget_range: "$500 - $800",
          },
          {
            id: "wo_003",
            title: "Deck Staining and Repair",
            description:
              "Large deck needs staining and minor board replacement. Approximately 400 sq ft. Some boards are loose and need securing. Client prefers natural wood stain.",
            urgency: "Low",
            property_address: "321 Elm Dr, Anytown, ST",
            distance: "4.1 miles",
            client_rating: 4.9,
            posted_date: "2024-12-30",
            budget_range: "$800 - $1,200",
          },
        ]

        setWorkOrders(mockData)
      } catch (error) {
        console.error("Failed to fetch work orders:", error)
        // Fallback: show all available work orders if filtering fails
        const fallbackData: WorkOrder[] = [
          {
            id: "wo_fallback_001",
            title: "Emergency Plumbing Repair",
            description: "Urgent plumbing issue needs immediate attention.",
            urgency: "High",
            property_address: "123 Main St, Anytown, ST",
            distance: "Unknown",
            client_rating: 4.2,
            posted_date: "2025-01-03",
            budget_range: "$300 - $600",
          },
        ]
        setWorkOrders(fallbackData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkOrders()
  }, [])

  // Internal filtering logic:
  // - Uses contractor's ZIP code from profile/account
  // - Default radius of 50 miles
  // - Only shows work orders the contractor hasn't quoted on
  // - Falls back to all open work orders if ZIP not available

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Normal":
        return "bg-blue-100 text-blue-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleGenerateQuote = async (workOrderId: string) => {
    // Navigate to the review pricing page instead of directly generating the quote
    router.push(`/contractor/review-pricing/${workOrderId}`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Loading available jobs...</div>
      </div>
    )
  }

  // Show different content based on user role
  if (userRole === "client") {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Job Board Access</h1>
          <p className="text-muted-foreground mb-6">
            The job board is for contractors to view available work. As a client, you can:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/post-work-order">Post a New Work Order</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/my-work-orders">View My Work Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Available Jobs</h1>
          <p className="text-muted-foreground">Browse work orders from clients in your area</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workOrders.map((workOrder) => (
          <Card key={workOrder.id} className="rounded-2xl shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{workOrder.title}</CardTitle>
                <Badge className={getUrgencyColor(workOrder.urgency)}>{workOrder.urgency}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{workOrder.description.substring(0, 120)}...</p>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{workOrder.property_address}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Posted {new Date(workOrder.posted_date).toLocaleDateString()}</span>
              </div>

              {workOrder.budget_range && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  <span>Budget: {workOrder.budget_range}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Distance: </span>
                  <span className="font-medium">{workOrder.distance}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{workOrder.client_rating}</span>
                </div>
              </div>

              <Button className="w-full" onClick={() => handleGenerateQuote(workOrder.id)} disabled={isLoading}>
                {isLoading ? "Generating Quote..." : "Generate Quote"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {workOrders.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No jobs available</h3>
          <p className="text-muted-foreground">Check back later for new work orders in your area</p>
        </div>
      )}
    </div>
  )
}
