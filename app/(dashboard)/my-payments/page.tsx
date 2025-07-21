"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Download, Eye, DollarSign, Calendar, CreditCard } from "lucide-react"
import Link from "next/link"

// Mock payments data
const mockPayments = [
  {
    id: "pay-1",
    invoiceNumber: "INV-2024-001",
    project: "Kitchen Renovation",
    contractor: "ABC Construction",
    amount: 5000,
    dueDate: "2024-01-30",
    paidDate: "2024-01-28",
    status: "paid",
    method: "Credit Card",
  },
  {
    id: "pay-2",
    invoiceNumber: "INV-2024-002",
    project: "Kitchen Renovation",
    contractor: "ABC Construction",
    amount: 8000,
    dueDate: "2024-02-15",
    paidDate: null,
    status: "pending",
    method: null,
  },
  {
    id: "pay-3",
    invoiceNumber: "INV-2024-003",
    project: "Bathroom Remodel",
    contractor: "XYZ Contractors",
    amount: 3500,
    dueDate: "2024-01-15",
    paidDate: "2024-01-14",
    status: "paid",
    method: "Bank Transfer",
  },
  {
    id: "pay-4",
    invoiceNumber: "INV-2024-004",
    project: "Deck Construction",
    contractor: "Deck Masters",
    amount: 2000,
    dueDate: "2024-02-01",
    paidDate: null,
    status: "overdue",
    method: null,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "default"
    case "pending":
      return "secondary"
    case "overdue":
      return "destructive"
    default:
      return "outline"
  }
}

export default function MyPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredPayments = mockPayments.filter((payment) => {
    const matchesSearch =
      payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.contractor.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && payment.status === activeTab
  })

  const paymentsByStatus = {
    all: mockPayments.length,
    paid: mockPayments.filter((p) => p.status === "paid").length,
    pending: mockPayments.filter((p) => p.status === "pending").length,
    overdue: mockPayments.filter((p) => p.status === "overdue").length,
  }

  const totalPaid = mockPayments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
  const totalPending = mockPayments.filter((p) => p.status === "pending").reduce((sum, p) => sum + p.amount, 0)
  const totalOverdue = mockPayments.filter((p) => p.status === "overdue").reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices & Payments</h1>
          <p className="text-muted-foreground">Track your project payments and invoices</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{paymentsByStatus.paid} payments completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{paymentsByStatus.pending} payments due</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <CreditCard className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalOverdue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{paymentsByStatus.overdue} payments overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search payments..."
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

      {/* Payments Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({paymentsByStatus.all})</TabsTrigger>
          <TabsTrigger value="paid">Paid ({paymentsByStatus.paid})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({paymentsByStatus.pending})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({paymentsByStatus.overdue})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                {filteredPayments.length} payment{filteredPayments.length !== 1 ? "s" : ""} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredPayments.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Contractor</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.invoiceNumber}</TableCell>
                          <TableCell>{payment.project}</TableCell>
                          <TableCell>{payment.contractor}</TableCell>
                          <TableCell>${payment.amount.toLocaleString()}</TableCell>
                          <TableCell>{payment.dueDate}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusColor(payment.status)} className="capitalize">
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/my-payments/${payment.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {searchQuery
                      ? "No payments found"
                      : activeTab === "all"
                        ? "No payments yet"
                        : `No ${activeTab} payments`}
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? `No payments match "${searchQuery}"`
                      : "Payments will appear here when invoices are generated"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
