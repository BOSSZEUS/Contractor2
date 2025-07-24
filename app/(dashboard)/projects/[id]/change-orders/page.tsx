"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FeatureLimit } from "@/components/feature-limit"
import { PlanBadge } from "@/components/plan-badge"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronLeft, Plus, FileText, Clock, DollarSign, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock user data - in a real app, this would come from auth context
const currentUser = {
  plan: "regular" as "free" | "regular" | "pro",
}

// Mock project data
const project = {
  id: "1",
  title: "Kitchen Renovation",
  client: "Sarah Johnson",
  address: "123 Main St, Anytown, USA",
  startDate: "2023-06-01",
  endDate: "2023-07-15",
  status: "in-progress",
  progress: 65,
  totalCost: 12500,
  paidAmount: 8000,
}

// Mock change order data
const changeOrders = [
  {
    id: "co-1",
    title: "Additional Cabinet Hardware",
    description: "Client requested upgraded cabinet handles and hinges.",
    requestDate: "2023-06-10T09:30:00",
    status: "approved",
    amount: 450,
    approvedDate: "2023-06-12T14:15:00",
    approvedBy: "Sarah Johnson",
  },
  {
    id: "co-2",
    title: "Backsplash Upgrade",
    description: "Upgrade from ceramic to glass tile backsplash.",
    requestDate: "2023-06-15T11:20:00",
    status: "pending",
    amount: 850,
    approvedDate: null,
    approvedBy: null,
  },
  {
    id: "co-3",
    title: "Additional Electrical Outlet",
    description: "Add one additional electrical outlet on the kitchen island.",
    requestDate: "2023-06-18T15:45:00",
    status: "approved",
    amount: 275,
    approvedDate: "2023-06-19T10:30:00",
    approvedBy: "Sarah Johnson",
  },
  {
    id: "co-4",
    title: "Change Countertop Material",
    description: "Change from granite to quartz countertops.",
    requestDate: "2023-06-20T13:15:00",
    status: "rejected",
    amount: 1200,
    approvedDate: "2023-06-21T09:45:00",
    approvedBy: "Sarah Johnson",
    rejectionReason: "Budget constraints",
  },
]

export default function ChangeOrdersPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const projectId = params.id
  const [activeTab, setActiveTab] = useState("all")
  const [newOrderOpen, setNewOrderOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case "pending":
        return <Clock className="h-8 w-8 text-amber-500" />
      case "rejected":
        return <XCircle className="h-8 w-8 text-red-500" />
      default:
        return <AlertCircle className="h-8 w-8 text-muted-foreground" />
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const filteredOrders = activeTab === "all" ? changeOrders : changeOrders.filter((order) => order.status === activeTab)

  const selectedOrderData = selectedOrder ? changeOrders.find((order) => order.id === selectedOrder) : null

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Change Orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push(`/projects/${projectId}`)}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back to Project</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Change Orders</h1>
            <p className="text-muted-foreground">Manage change requests for {project.title}</p>
          </div>
        </div>
        <PlanBadge plan={currentUser.plan} />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-2/3">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Change Order Requests</CardTitle>
                  <CardDescription>Track and manage all project change orders</CardDescription>
                </div>
                <FeatureLimit
                  feature="Create Change Orders"
                  description="Create and manage change orders to track scope changes and additional costs."
                  currentPlan={currentUser.plan}
                  requiredPlan="regular"
                >
                  <Button onClick={() => setNewOrderOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Change Order
                  </Button>
                </FeatureLimit>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All Orders</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Change Order</TableHead>
                        <TableHead>Date Requested</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.length > 0 ? (
                        filteredOrders.map((order) => (
                          <TableRow
                            key={order.id}
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedOrder(order.id)}
                          >
                            <TableCell>
                              <div className="font-medium">{order.title}</div>
                              <div className="text-sm text-muted-foreground truncate max-w-[300px]">
                                {order.description}
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(order.requestDate)}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(order.amount)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6">
                            <p className="text-muted-foreground">No change orders found</p>
                            <Button variant="outline" className="mt-2" onClick={() => setNewOrderOpen(true)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Create Change Order
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-1/3">
          {selectedOrderData ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedOrderData.title}</CardTitle>
                <CardDescription>Change Order #{selectedOrderData.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center">{getStatusIcon(selectedOrderData.status)}</div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                    <p>{selectedOrderData.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
                      <p className="text-xl font-bold">{formatCurrency(selectedOrderData.amount)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                      <div className="mt-1">{getStatusBadge(selectedOrderData.status)}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Requested On</h3>
                      <p>{formatDate(selectedOrderData.requestDate)}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {selectedOrderData.status === "rejected" ? "Rejected On" : "Approved On"}
                      </h3>
                      <p>{formatDate(selectedOrderData.approvedDate)}</p>
                    </div>
                  </div>

                  {selectedOrderData.approvedBy && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        {selectedOrderData.status === "rejected" ? "Rejected By" : "Approved By"}
                      </h3>
                      <p>{selectedOrderData.approvedBy}</p>
                    </div>
                  )}

                  {selectedOrderData.rejectionReason && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Rejection Reason</h3>
                      <p>{selectedOrderData.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
                <FeatureLimit
                  feature="Generate Change Order Document"
                  description="Generate professional change order documents for client approval."
                  currentPlan={currentUser.plan}
                  requiredPlan="pro"
                >
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Document
                  </Button>
                </FeatureLimit>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Change Order Details</CardTitle>
                <CardDescription>Select a change order to view details</CardDescription>
              </CardHeader>
              <CardContent className="py-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-12 w-12 text-muted-foreground/50" />
                  <p className="text-muted-foreground">Select a change order from the list to view its details</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Change Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Change Orders</span>
                  <span className="font-medium">{changeOrders.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Approved</span>
                  <span className="font-medium">{changeOrders.filter((o) => o.status === "approved").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending</span>
                  <span className="font-medium">{changeOrders.filter((o) => o.status === "pending").length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Rejected</span>
                  <span className="font-medium">{changeOrders.filter((o) => o.status === "rejected").length}</span>
                </div>
                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Approved Amount</span>
                    <span className="font-bold">
                      {formatCurrency(
                        changeOrders
                          .filter((o) => o.status === "approved")
                          .reduce((sum, order) => sum + order.amount, 0),
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* New Change Order Dialog */}
      <Dialog open={newOrderOpen} onOpenChange={setNewOrderOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Change Order</DialogTitle>
            <DialogDescription>Add a new change order request for client approval</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Change Order Title</Label>
              <Input id="title" placeholder="e.g., Additional Cabinet Hardware" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the changes requested and why they're needed..."
                className="min-h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="amount" type="number" className="pl-8" placeholder="0.00" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Request Date</Label>
                <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewOrderOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setNewOrderOpen(false)}>Create Change Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
