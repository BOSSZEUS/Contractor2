"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppState } from "@/contexts/app-state-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { ArrowLeft, Edit, FileDown, Trash2 } from "lucide-react"

export default function ContractorContractDetailPage({ params }: { params: { id: string } }) {
  const { state } = useAppState()
  const router = useRouter()

  useEffect(() => {
    if (state.userRole !== "contractor") {
      router.push("/dashboard")
    }
  }, [state.userRole, router])

  const contract = state.contracts.find((c) => c.id === params.id)

  if (state.userRole !== "contractor") {
    return null
  }

  if (!contract) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>Contract not found.</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{contract.title}</h1>
        <Badge>Active</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contract Document</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none dark:prose-invert">
              <h2>Service Agreement</h2>
              <p>
                This agreement is made between <strong>{contract.client}</strong> and <strong>Your Company</strong> for
                the project: <strong>{contract.project}</strong>.
              </p>
              <h3>1. Scope of Work</h3>
              <p>
                The contractor will perform all services as outlined in the project proposal, including but not limited
                to kitchen demolition, cabinet installation, countertop fitting, and final inspections.
              </p>
              <h3>2. Payment Terms</h3>
              <p>
                The total contract value is <strong>${
                  (contract.value ?? contract.amount).toLocaleString()
                }</strong>. Payment will be made in
                three installments...
              </p>
              {/* More contract text */}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Manage Contract</CardTitle>
              <CardDescription>Actions for this contract.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button>
                <Edit className="mr-2 h-4 w-4" /> Edit Contract
              </Button>
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" /> Download PDF
              </Button>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Terminate Contract
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
