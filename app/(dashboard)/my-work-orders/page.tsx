"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Clock, Plus, Eye, Star, DollarSign, Search, Filter } from "lucide-react"
import Link from "next/link"

// Mock work orders data
const mockWorkOrders = [
  {
    id: "wo-1",
    title: "Kitchen Cabinet Installation",
    description: "Install new kitchen cabinets and countertops in a 200 sq ft kitchen",
    location: "123 Main St, Anytown, USA",
    budget: "$5,000 - $8,000",
    postedDate: "2024-01-15",
    status: "open",
    quotesReceived: 3,
    urgency: "normal",
  },
  {
    id: "wo-2",
    title: "Bathroom Tile Repair",
    description: "Replace damaged tiles in master bathroom shower area",
    location: "456 Oak Ave, Somewhere, USA",
    budget: "$800 - $1,200",
    postedDate: "2024-01-12",
    status: "quoted",
    quotesReceived: 5,
    urgency: "high",
  },
  {
    id: "wo-3",
    title: "Deck Staining",
    description: "Clean and stain 300 sq ft wooden deck",
    location: "789 Pine St, Elsewhere, USA",
    budget: "$600 - $900",
    postedDate: "2024-01-10",
    status: "in-progress",
    quotesReceived: 2,
    urgency: "low",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "default"
    case "quoted":
      return "secondary"
    case "in-progress":
      return "outline"
    case "completed":
      return "outline"
    default:
      return "outline"
  }
}

const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case "high":
      return "destructive"
    case "normal":
      return "secondary"
    case "low":
      return "outline"
    default:
      return "outline"
  }
}

export default function MyWorkOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredWorkOrders = mockWorkOrders.filter((wo) => {
    const matchesSearch =
      wo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.location.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && wo.status === activeTab
  })

  const workOrdersByStatus = {
    all: mockWorkOrders.length,
    open: mockWorkOrders.filter((wo) => wo.status === "open").length,
    quoted: mockWorkOrders.filter((wo) => wo.status === "quoted").length,
    "in-progress": mockWorkOrders.filter((wo) => wo.status === "in-progress").length,
    completed: mockWorkOrders.filter((wo) => wo.status === "completed").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Work Orders</h1>
          <p className="text-muted-foreground">Manage your work orders and review quotes from contractors</p>
        </div>
        <Button asChild>
          <Link href="/post-work-order">
            <Plus className="mr-2 h-4 w-4" />
            Post New Work Order
          </Link>
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search work orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Work Orders Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({workOrdersByStatus.all})</TabsTrigger>
          <TabsTrigger value="open">Open ({workOrdersByStatus.open})</TabsTrigger>
          <TabsTrigger value="quoted">Quoted ({workOrdersByStatus.quoted})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({workOrdersByStatus["in-progress"]})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({workOrdersByStatus.completed})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredWorkOrders.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredWorkOrders.map((workOrder) => (
                <Card key={workOrder.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{workOrder.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getStatusColor(workOrder.status)} className="capitalize">
                            {workOrder.status.replace("-", " ")}
                          </Badge>
                          <Badge variant={getUrgencyColor(workOrder.urgency)} className="capitalize">
                            {workOrder.urgency}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="line-clamp-2">{workOrder.description}</CardDescription>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span className="truncate">{workOrder.location}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <DollarSign className="mr-2 h-4 w-4" />
                        <span>{workOrder.budget}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Posted {workOrder.postedDate}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Star className="mr-2 h-4 w-4" />
                        <span>{workOrder.quotesReceived} quotes received</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button asChild className="flex-1">
                        <Link href={`/my-work-orders/${workOrder.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <div className="space-y-4">
                  <div className="text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {searchQuery
                        ? "No work orders found"
                        : activeTab === "all"
                          ? "No work orders yet"
                          : `No ${activeTab.replace("-", " ")} work orders`}
                    </h3>
                    <p>
                      {searchQuery
                        ? `No work orders match "${searchQuery}"`
                        : "Get started by posting your first work order"}
                    </p>
                  </div>
                  {!searchQuery && (
                    <Button asChild>
                      <Link href="/post-work-order">
                        <Plus className="mr-2 h-4 w-4" />
                        Post Your First Work Order
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
