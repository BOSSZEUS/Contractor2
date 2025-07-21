"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { QuoteRevisionHistory } from "@/components/quote-revision-history"
import { QuoteMessaging } from "@/components/quote-messaging"
import { QuoteCostBreakdown } from "@/components/quote-cost-breakdown"
import { calculateLineItemTotal } from "@/lib/quote-calculations"
import type { EnhancedLineItem } from "@/types/enhanced-quotes"
import { useAppState } from "@/contexts/app-state-context"

interface LineItem extends EnhancedLineItem {
  // Keep existing fields for compatibility
}

interface Quote {
  id: string
  workOrderId: string
  contractorId: string
  contractorName: string
  status: string
  createdAt: string
  expiresAt: string
  total: number
  lineItems: LineItem[]
}

export default function QuoteReviewPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { state } = useAppState()

  const quoteId = params.quote_id as string

  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAccepting, setIsAccepting] = useState(false)

  // Calculate enhanced totals using unified calculation
  const quoteTotals = quote
    ? {
        labor: quote.lineItems.filter((item) => !item.deleted).reduce((sum, item) => sum + (item.laborCost || 0), 0),
        materials: quote.lineItems
          .filter((item) => !item.deleted)
          .reduce((sum, item) => sum + (item.materialTotal || 0), 0),
        subtotal: quote.lineItems
          .filter((item) => !item.deleted)
          .reduce((sum, item) => sum + (item.subtotal || item.total), 0),
        total: quote.lineItems.filter((item) => !item.deleted).reduce((sum, item) => sum + item.total, 0),
      }
    : null

  useEffect(() => {
    // Simulate API call to fetch quote details
    const fetchQuote = async () => {
      try {
        setLoading(true)
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock quote data with enhanced calculations
        const mockQuote: Quote = {
          id: quoteId,
          workOrderId: "wo-" + Math.floor(Math.random() * 1000),
          contractorId: "cont-" + Math.floor(Math.random() * 100),
          contractorName: "ABC Contractors",
          status: "pending_client_review",
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          total: 0,
          lineItems: [
            {
              id: "item-1",
              description: "Bathroom remodel - labor",
              quantity: 1,
              unit: "each",
              unitPrice: 2000,
              total: 2000,
              deleted: false,
              note: "",
              laborHours: 20,
              laborRate: 75,
              materialCost: 500,
              markup: 25,
              laborCost: 1500,
              materialTotal: 500,
              subtotal: 2000,
              markupAmount: 500,
            },
            {
              id: "item-2",
              description: "Bathroom fixtures installation",
              quantity: 1,
              unit: "each",
              unitPrice: 500,
              total: 500,
              deleted: false,
              note: "",
              laborHours: 4,
              laborRate: 75,
              materialCost: 200,
              markup: 25,
              laborCost: 300,
              materialTotal: 200,
              subtotal: 500,
              markupAmount: 100,
            },
            {
              id: "item-3",
              description: "Plumbing work",
              quantity: 1,
              unit: "each",
              unitPrice: 800,
              total: 800,
              deleted: false,
              note: "",
              laborHours: 8,
              laborRate: 75,
              materialCost: 200,
              markup: 25,
              laborCost: 600,
              materialTotal: 200,
              subtotal: 800,
              markupAmount: 160,
            },
            {
              id: "item-4",
              description: "Tile installation",
              quantity: 120,
              unit: "sq ft",
              unitPrice: 10,
              total: 1200,
              deleted: false,
              note: "",
              laborHours: 0.25,
              laborRate: 75,
              materialCost: 7.5,
              markup: 25,
              laborCost: 300,
              materialTotal: 900,
              subtotal: 1200,
              markupAmount: 240,
            },
          ],
        }

        // Recalculate totals using unified calculation
        mockQuote.lineItems = mockQuote.lineItems.map((item) => {
          const calc = calculateLineItemTotal({
            quantity: item.quantity,
            laborHours: item.laborHours,
            laborRate: item.laborRate,
            materialCost: item.materialCost,
            markup: item.markup,
          })

          return {
            ...item,
            laborCost: calc.laborCost,
            materialTotal: calc.materialCost,
            subtotal: calc.subtotal,
            markupAmount: calc.markupAmount,
            total: calc.total,
            unitPrice: calc.total / item.quantity,
          }
        })

        // Calculate total
        mockQuote.total = mockQuote.lineItems.reduce((sum, item) => sum + item.total, 0)

        setQuote(mockQuote)
        setLoading(false)
      } catch (err) {
        setError("Failed to load quote details")
        setLoading(false)
      }
    }

    fetchQuote()
  }, [quoteId])

  const handleToggleDelete = (itemId: string) => {
    if (!quote) return

    setQuote((prev) => {
      if (!prev) return prev

      const updatedItems = prev.lineItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, deleted: !item.deleted }
        }
        return item
      })

      const newTotal = updatedItems.filter((item) => !item.deleted).reduce((sum, item) => sum + item.total, 0)

      return {
        ...prev,
        lineItems: updatedItems,
        total: newTotal,
      }
    })
  }

  const handleNoteChange = (itemId: string, note: string) => {
    if (!quote) return

    setQuote((prev) => {
      if (!prev) return prev

      const updatedItems = prev.lineItems.map((item) => {
        if (item.id === itemId) {
          return { ...item, note }
        }
        return item
      })

      return {
        ...prev,
        lineItems: updatedItems,
      }
    })
  }

  const handleSubmitChanges = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update status to client_edited
      if (quote) {
        setQuote({
          ...quote,
          status: "client_edited",
        })
      }

      toast({
        title: "Changes submitted",
        description: "Your changes have been sent to the contractor for review.",
      })

      // In a real app, you would navigate back to the inbox
      // router.push('/quote-inbox')
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to submit changes. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAcceptQuote = async () => {
    if (!quote) return

    setIsAccepting(true)

    try {
      // Call the quote acceptance API
      const response = await fetch(`/api/quotes/${quoteId}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to accept quote")
      }

      const result = await response.json()

      // Update quote status locally
      setQuote({
        ...quote,
        status: "accepted",
      })

      toast({
        title: "Quote accepted",
        description: "You have accepted this quote. The contractor will be notified and a project has been created.",
      })

      // Redirect to the new project page
      setTimeout(() => {
        router.push(`/my-projects/${result.project.id}`)
      }, 1500)
    } catch (err) {
      console.error("Error accepting quote:", err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to accept quote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAccepting(false)
    }
  }

  // Helper function to display status badge with consistent styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_client_review":
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending Review</Badge>
      case "client_edited":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Changes Requested</Badge>
      case "approved":
      case "accepted":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Accepted</Badge>
      case "rejected":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const isQuoteExpired = (expiresAt: string) => {
    return new Date() > new Date(expiresAt)
  }

  const formatExpirationDate = (expiresAt: string) => {
    const expDate = new Date(expiresAt)
    const now = new Date()
    const diffTime = expDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `Expired ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? "s" : ""} ago`
    } else if (diffDays === 0) {
      return "Expires today"
    } else {
      return `Expires in ${diffDays} day${diffDays !== 1 ? "s" : ""}`
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-4">
        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded-md mb-4"></div>
        <div className="h-40 bg-gray-200 animate-pulse rounded-lg mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">Failed to load quote</h3>
              <p className="text-muted-foreground mt-2">{error || "Quote not found. Please try again later."}</p>
              <Button className="mt-4 bg-transparent" variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isExpired = isQuoteExpired(quote.expiresAt)
  const isAccepted = quote.status === "accepted" || quote.status === "approved"

  if (state.userRole !== "client") {
    router.push("/dashboard")
    return null
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Review Quote #{quoteId}</h1>
          <p className="text-muted-foreground">
            From {quote.contractorName} • Work Order #{quote.workOrderId.split("-")[1]}
          </p>
          <p className={`text-sm ${isExpired ? "text-red-600" : "text-muted-foreground"}`}>
            {formatExpirationDate(quote.expiresAt)}
          </p>
        </div>
        {getStatusBadge(quote.status)}
      </div>

      {isExpired && !isAccepted && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 text-red-600">⚠️</div>
              <p className="text-red-800 font-medium">This quote has expired.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {isAccepted && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 text-green-600">✅</div>
              <p className="text-green-800 font-medium">This quote has been accepted and a project has been created.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Quote Details</CardTitle>
              <CardDescription>
                Review the quote line items below. You can remove items you don't want or add notes for the contractor.
              </CardDescription>
            </div>
            <QuoteRevisionHistory quoteId={quoteId} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4">Description</th>
                  <th className="text-center p-4">Quantity</th>
                  <th className="text-right p-4">Unit Price</th>
                  <th className="text-right p-4">Total</th>
                  <th className="text-center p-4">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {quote.lineItems.map((item) => (
                  <tr key={item.id} className={item.deleted ? "bg-muted/30 text-muted-foreground" : ""}>
                    <td className="p-4">
                      <div className={item.deleted ? "line-through" : ""}>{item.description}</div>
                      {/* Show enhanced pricing breakdown */}
                      {item.laborHours && item.laborRate && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Labor: {item.laborHours}h × ${item.laborRate}/hr = ${item.laborCost?.toFixed(2)}
                          {item.materialCost && ` | Materials: $${item.materialTotal?.toFixed(2)}`}
                          {item.markup && ` | Markup: ${item.markup}%`}
                        </div>
                      )}
                      <div className="mt-2">
                        <Textarea
                          placeholder="Add note for contractor..."
                          value={item.note}
                          onChange={(e) => handleNoteChange(item.id, e.target.value)}
                          className="text-xs h-20"
                          disabled={item.deleted || isAccepted}
                        />
                      </div>
                    </td>
                    <td className="text-center p-4">
                      <span className={item.deleted ? "line-through" : ""}>{item.quantity}</span>
                    </td>
                    <td className="text-right p-4">
                      <span className={item.deleted ? "line-through" : ""}>${item.unitPrice.toFixed(2)}</span>
                    </td>
                    <td className="text-right p-4">
                      <span className={item.deleted ? "line-through" : ""}>${item.total.toFixed(2)}</span>
                    </td>
                    <td className="text-center p-4">
                      <Checkbox
                        checked={item.deleted}
                        onCheckedChange={() => handleToggleDelete(item.id)}
                        disabled={isAccepted}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Cost Breakdown */}
      <QuoteCostBreakdown lineItems={quote.lineItems} showLineItemDetails={true} className="mb-6" />

      {/* Quote Messaging */}
      <QuoteMessaging quoteId={quoteId} userType="client" />

      {!isAccepted && (
        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <Button variant="outline" onClick={handleSubmitChanges} disabled={isExpired}>
            Submit Changes to Contractor
          </Button>
          <Button onClick={handleAcceptQuote} disabled={isExpired || isAccepting}>
            {isAccepting ? "Accepting..." : "Accept Quote As-Is"}
          </Button>
        </div>
      )}
    </div>
  )
}
