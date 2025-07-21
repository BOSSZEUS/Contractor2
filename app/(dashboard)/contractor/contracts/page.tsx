"use client"

import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useAppState } from "@/contexts/app-state-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ContractorContractsPage() {
  const { state } = useAppState()
  const router = useRouter()

  useEffect(() => {
    if (state.userRole !== "contractor") {
      router.push("/dashboard")
    }
  }, [state.userRole, router])

  if (state.userRole !== "contractor") {
    return null // Render nothing while redirecting
  }

  const { contracts } = state

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
      case "terminated":
        return <Badge variant="destructive">Terminated</Badge>
      case "signed":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Signed</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>
    }
  }

  const formatCurrency = (value: any) => {
    if (value === null || value === undefined || isNaN(Number(value))) {
      return "$0"
    }
    return `$${Number(value).toLocaleString()}`
  }

  const formatDate = (date: any) => {
    if (!date) return "N/A"
    try {
      if (typeof date === "string") {
        return new Date(date).toLocaleDateString()
      }
      if (date.toDate && typeof date.toDate === "function") {
        return date.toDate().toLocaleDateString()
      }
      if (date instanceof Date) {
        return date.toLocaleDateString()
      }
      return "N/A"
    } catch (error) {
      return "N/A"
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Contracts</h1>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/contractor/contracts/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Contract
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contractor/contracts/templates">Manage Templates</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Contracts</CardTitle>
          <CardDescription>A list of all contracts you are managing.</CardDescription>
        </CardHeader>
        <CardContent>
          {!contracts || contracts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No contracts found.</p>
              <Button asChild>
                <Link href="/contractor/contracts/new">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Contract
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">{contract.title || "Untitled Contract"}</TableCell>
                    <TableCell>{contract.client || contract.clientName || "Unknown Client"}</TableCell>
                    <TableCell>{contract.project || contract.projectName || "N/A"}</TableCell>
                    <TableCell>{formatDate(contract.createdAt || contract.signedAt || contract.startDate)}</TableCell>
                    <TableCell>{formatCurrency(contract.value || contract.amount)}</TableCell>
                    <TableCell>{getStatusBadge(contract.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/contractor/contracts/${contract.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
