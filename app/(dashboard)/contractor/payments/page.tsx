"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Download, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ContractorPaymentsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock payment data
  const payments = [
    {
      id: "1",
      invoiceNumber: "INV-2023-001",
      client: "Sarah Johnson",
      project: "Kitchen Renovation",
      date: "2023-06-15",
      amount: 5000,
      status: "paid",
      description: "Initial deposit for Kitchen Renovation project",
    },
    {
      id: "2",
      invoiceNumber: "INV-2023-002",
      client: "Sarah Johnson",
      project: "Kitchen Renovation",
      date: "2023-07-01",
      amount: 3000,
      status: "paid",
      description: "Payment for completed framing work",
    },
    {
      id: "3",
      invoiceNumber: "INV-2023-003",
      client: "Michael Smith",
      project: "Bathroom Remodel",
      date: "2023-07-15",
      amount: 4000,
      status: "paid",
      description: "Initial deposit for Bathroom Remodel project",
    },
    {
      id: "4",
      invoiceNumber: "INV-2023-004",
      client: "Michael Smith",
      project: "Bathroom Remodel",
      date: "2023-08-01",
      amount: 3000,
      status: "pending",
      description: "Payment for plumbing and electrical work",
    },
    {
      id: "5",
      invoiceNumber: "INV-2023-005",
      client: "Emily Davis",
      project: "Deck Construction",
      date: "2023-08-20",
      amount: 5500,
      status: "paid",
      description: "Full payment for Deck Construction project",
    },
    {
      id: "6",
      invoiceNumber: "INV-2023-006",
      client: "Robert Wilson",
      project: "Basement Finishing",
      date: "2023-09-10",
      amount: 7500,
      status: "overdue",
      description: "Initial deposit for Basement Finishing project",
    },
  ]

  const searchedPayments = payments.filter(
    (payment) =>
      payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <Button onClick={() => router.push("/contractor/payments/new")} className="flex items-center gap-2">
          <DollarSign className="h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">$20,500</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">$3,000</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">$7,500</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Track all your invoices and payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search invoices..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline">Filter</Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchedPayments.length > 0 ? (
                    searchedPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <div className="font-medium">{payment.invoiceNumber}</div>
                          <div className="text-sm text-muted-foreground">{payment.project}</div>
                        </TableCell>
                        <TableCell>{payment.client}</TableCell>
                        <TableCell>{formatDate(payment.date)}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-right">${payment.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" title="Download Invoice">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <p className="text-muted-foreground">No invoices found</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
