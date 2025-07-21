"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Clock, CheckCircle, XCircle, FileText, DollarSign, AlertTriangle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useAppState } from "@/contexts/app-state-context"

export default function ApprovalsPage() {
  const { state } = useAppState()
  const { userRole } = state
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("pending")
  const [selectedItem, setSelectedItem] = useState<any | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  useEffect(() => {
    if (userRole && userRole !== "client") {
      router.push("/dashboard")
    }
  }, [userRole, router])

  if (!userRole || userRole !== "client") {
    return null // or a loading spinner
  }

  // Mock approval data
  const approvalItems = [
    {
      id: "1",
      type: "Change Order",
      title: "Additional Cabinet Hardware",
      description: "Upgrade to premium cabinet handles and hinges as discussed during the site visit.",
      date: "2023-06-12",
      amount: 450,
      status: "pending",
      project: "Kitchen Renovation",
    },
    {
      id: "2",
      type: "Invoice",
      title: "Payment for Completed Framing",
      description:
        "Invoice for framing work completed on June 8, 2023. Includes materials and labor as outlined in the contract.",
      date: "2023-06-15",
      amount: 3000,
      status: "pending",
      project: "Kitchen Renovation",
    },
    {
      id: "3",
      type: "Document",
      title: "Updated Project Timeline",
      description: "Revised project timeline reflecting the two-day delay due to material delivery issues.",
      date: "2023-06-18",
      amount: null,
      status: "pending",
      project: "Kitchen Renovation",
    },
    {
      id: "4",
      type: "Change Order",
      title: "Backsplash Upgrade",
      description: "Upgrade from ceramic to glass tile backsplash as requested.",
      date: "2023-06-20",
      amount: 850,
      status: "approved",
      project: "Kitchen Renovation",
    },
    {
      id: "5",
      type: "Invoice",
      title: "Initial Deposit",
      description: "Initial project deposit as outlined in the contract.",
      date: "2023-06-01",
      amount: 5000,
      status: "approved",
      project: "Kitchen Renovation",
    },
    {
      id: "6",
      type: "Change Order",
      title: "Change Countertop Material",
      description: "Change from granite to quartz countertops.",
      date: "2023-06-21",
      amount: 1200,
      status: "rejected",
      project: "Kitchen Renovation",
      rejectionReason: "Budget constraints",
    },
  ]

  const filteredItems = approvalItems.filter((item) => {
    if (activeTab === "all") return true
    return item.status === activeTab
  })

  const handleApprove = () => {
    toast({
      title: "Item approved",
      description: `You have approved the ${selectedItem.type.toLowerCase()}: ${selectedItem.title}`,
    })
    setDialogOpen(false)
    setSelectedItem(null)
  }

  const handleReject = () => {
    toast({
      title: "Item rejected",
      description: `You have rejected the ${selectedItem.type.toLowerCase()}: ${selectedItem.title}`,
    })
    setRejectDialogOpen(false)
    setSelectedItem(null)
  }

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
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertTriangle className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Change Order":
        return <FileText className="h-5 w-5" />
      case "Invoice":
        return <DollarSign className="h-5 w-5" />
      case "Document":
        return <FileText className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
        <Badge variant="outline" className="text-base font-normal">
          {approvalItems.filter((item) => item.status === "pending").length} Pending
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Review and Approve</CardTitle>
          <CardDescription>Manage items requiring your approval</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(item.type)}
                            <span>{item.type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.project}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>{item.amount ? `$${item.amount.toLocaleString()}` : "N/A"}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item)
                              setDialogOpen(true)
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                          <p className="text-muted-foreground">No items found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* View/Approve Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedItem?.title}</DialogTitle>
            <DialogDescription>
              {selectedItem?.type} for {selectedItem?.project}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center">{selectedItem && getStatusIcon(selectedItem.status)}</div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Description</h3>
              <p className="text-sm">{selectedItem?.description}</p>
            </div>

            {selectedItem?.amount && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Amount</h3>
                <p className="text-xl font-bold">${selectedItem?.amount.toLocaleString()}</p>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Date Requested</h3>
              <p className="text-sm">{selectedItem?.date}</p>
            </div>

            {selectedItem?.status === "rejected" && selectedItem?.rejectionReason && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Rejection Reason</h3>
                <p className="text-sm">{selectedItem?.rejectionReason}</p>
              </div>
            )}
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            {selectedItem?.status === "pending" ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false)
                    setRejectDialogOpen(true)
                  }}
                >
                  Reject
                </Button>
                <Button onClick={handleApprove}>Approve</Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="ml-auto">
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject {selectedItem?.type}</DialogTitle>
            <DialogDescription>Please provide a reason for rejecting this item</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Enter reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
