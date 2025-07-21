"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAppState } from "@/contexts/app-state-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function MyContractsPage() {
  const { state } = useAppState()
  const router = useRouter()

  useEffect(() => {
    if (state.userRole !== "client") {
      router.push("/dashboard")
    }
  }, [state.userRole, router])

  if (state.userRole !== "client") {
    return null // Render nothing while redirecting
  }

  // In a real app, you'd filter contracts for the current client
  const myContracts = state.contracts.slice(0, 2) // Mocking client-specific contracts

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "signed":
        return <Badge variant="default">Active</Badge>
      case "pending":
      case "draft":
        return <Badge variant="secondary">Pending</Badge>
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
      case "terminated":
        return <Badge variant="destructive">Terminated</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (state.loading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading contracts...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Contracts</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Contracts</CardTitle>
          <CardDescription>A list of all contracts related to your projects.</CardDescription>
        </CardHeader>
        <CardContent>
          {myContracts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No contracts found.</p>
              <Button asChild>
                <Link href="/my-projects">View My Projects</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract ID</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {myContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-medium">{contract.id}</TableCell>
                    <TableCell>{contract.projectId}</TableCell>
                    <TableCell>
                      {contract.signedAt ? new Date(contract.signedAt).toLocaleDateString() : "Not signed"}
                    </TableCell>
                    <TableCell>${(contract.amount || 0).toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(contract.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/my-contracts/${contract.id}`}>View Details</Link>
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
