"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { QuoteRevisionHistory } from "@/components/quote-revision-history"
import { QuoteMessaging } from "@/components/quote-messaging"
import { QuoteCostBreakdown } from "@/components/quote-cost-breakdown"
import type { EnhancedLineItem } from "@/types/enhanced-quotes"
import { useAppState } from "@/contexts/app-state-context"

interface QuoteLineItem extends EnhancedLineItem {
  // Keep existing fields for compatibility
}

interface WorkOrder {
  id: string
  title: string
  property_address: string
  client_name: string
}

interface QuoteData {
  quote_id: string
  work_order: WorkOrder
  line_items: QuoteLineItem[]
  total: number
  status: string
  expiresAt: string // Add this line
}

export default function ContractorQuoteApprovalPage({ params }: { params: { quote_id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const { state } = useAppState()
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null)
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (state.userRole !== "contractor") {
      router.push("/dashboard")
      return
    }

    const fetchQuoteData = async () => {
      try {
        // Simulate API call to GET /api/quotes/{quote_id}/
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Determine if this is a new quote or an existing one with client edits
        const isNewQuote = params.quote_id.startsWith("new_")
        const status = isNewQuote ? "draft" : "client_edited"

        const mockData: QuoteData = {
          quote_id: params.quote_id,
          status: status,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          work_order: {
            id: "wo_123",
            title: "Bathroom and Plumbing Work",
            property_address: "123 Main St, Anytown, ST 12345",
            client_name: "John Smith",
          },
          line_items: [
            {
              id: "1",
              description: "Bathroom remodel - labor only",
              quantity: 1,
              unit: "each",
              unitPrice: 2000,
              total: 2000,
              laborCost: 0,
              materialTotal: 0,
              markupAmount: 0,
              subtotal: 0,
              deleted: false,
              note: isNewQuote ? "" : "Can we use higher quality materials?",
            },
            {
              id: "2",
              description: "Plumbing inspection and repair",
              quantity: 1,
              unit: "each",
              unitPrice: 350,
              total: 350,
              laborCost: 0,
              materialTotal: 0,
              markupAmount: 0,
              subtotal: 0,
              deleted: false,
              note: "",
            },
          ],
          total: 2350,
        }

        setQuoteData(mockData)
        setLineItems(mockData.line_items)
      } catch (error) {
        console.error("Failed to fetch quote data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuoteData()
  }, [params.quote_id, state.userRole])

  useEffect(() => {
    if (quoteData?.status === "approved") {
      toast({
        title: "Quote Accepted!",
        description: "Your quote has been accepted and a new project has been created.",
      })
    }
  }, [quoteData?.status, toast])

  const updateLineItem = (
    id: string,
    field: keyof QuoteLineItem,
    value: string | number,
  ) => {
    setLineItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const updated: any = { ...item, [field]: value }
          if (field === "quantity" || field === "unitPrice") {
            updated.total = updated.quantity * updated.unitPrice
          }
          return updated
        }
        return item
      }),
    )
  }

  const removeLineItem = (id: string) => {
    setLineItems((items) => items.map((item) => (item.id === id ? { ...item, deleted: true } : item)))
  }

  const calculateTotal = () => {
    return lineItems
      .filter((item) => !item.deleted)
      .reduce((sum, item) => sum + item.total, 0)
  }

  const approveQuote = async () => {
    setIsSubmitting(true)
    try {
      const payload = {
        quote_id: params.quote_id,
        line_items: lineItems.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          deleted: item.deleted || false,
        })),
        total: calculateTotal(),
        status: "pending_client_review",
      }

      // Simulate API call to POST /api/quotes/approve/
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Quote Sent",
        description: "Quote has been approved and sent to the client",
      })

      router.push("/contractor/my-quotes")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve quote",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const discardQuote = async () => {
    setIsSubmitting(true)
    try {
      // Simulate API call to DELETE /api/quotes/{quote_id}/
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Quote Discarded",
        description: "Quote has been deleted",
      })

      router.push("/contractor/my-quotes")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to discard quote",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Quote Draft</Badge>
      case "pending_client_review":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending Client Review
          </Badge>
        )
      case "client_edited":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Client Edited
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
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

  // Helper function to check if a field was edited by client
  const isFieldEdited = (item: QuoteLineItem, field: string) => {
    // Only show edits when status is client_edited
    if (quoteData?.status !== "client_edited") return false

    // Mock logic - in real app, this would compare against original values
    // For demo purposes, we'll highlight certain fields based on item properties
    if (field === "description" && item.description.includes("higher quality")) return true
    if (field === "quantity" && item.quantity > 1) return true
    if (field === "unitPrice" && item.unitPrice % 50 !== 0) return true

    return false
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Loading quote data...</div>
      </div>
    )
  }

  if (!quoteData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Quote not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quote Review</CardTitle>
            {getStatusBadge(quoteData.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Work Order</label>
              <p className="font-semibold">{quoteData.work_order.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Property Address</label>
              <p className="font-semibold">{quoteData.work_order.property_address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Client</label>
              <p className="font-semibold">{quoteData.work_order.client_name}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Quote Expiration:</span>
              <span
                className={`text-sm font-semibold ${isQuoteExpired(quoteData.expiresAt) ? "text-red-600" : "text-gray-900"}`}
              >
                {formatExpirationDate(quoteData.expiresAt)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {isQuoteExpired(quoteData.expiresAt) && (
        <Card className="rounded-2xl shadow-md border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 text-red-600">⚠️</div>
              <p className="text-red-800 font-medium">
                This quote has expired and can no longer be accepted by the client.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quote Line Items */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Quote Line Items</CardTitle>
              {quoteData?.status === "client_edited" && (
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-yellow-400 bg-yellow-50 rounded"></div>
                    <span>Client edited field</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-blue-200 bg-blue-50 rounded"></div>
                    <span>Client commented</span>
                  </div>
                </div>
              )}
            </div>
            <QuoteRevisionHistory quoteId={quoteData.quote_id} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {lineItems.map((item) => (
              <div
                key={item.id}
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-xl ${
                  item.deleted ? "bg-gray-50 opacity-50" : ""
                } ${
                  quoteData?.status === "client_edited" &&
                  (
                    item.note ||
                      isFieldEdited(item, "description") ||
                      isFieldEdited(item, "quantity") ||
                      isFieldEdited(item, "unitPrice")
                  )
                    ? "border-blue-200 bg-blue-50/30"
                    : ""
                }`}
              >
                <div className="md:col-span-5">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                    disabled={item.deleted || quoteData.status === "approved"}
                    className={`${item.deleted ? "line-through" : ""} ${
                      isFieldEdited(item, "description") ? "border-yellow-400 bg-yellow-50" : ""
                    }`}
                  />
                  {item.note && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                      <span className="font-medium text-blue-700">Client note:</span> {item.note}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                    disabled={item.deleted || quoteData.status === "approved"}
                    className={`${isFieldEdited(item, "quantity") ? "border-yellow-400 bg-yellow-50" : ""}`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Unit Price</label>
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateLineItem(
                        item.id,
                        "unitPrice",
                        Number.parseFloat(e.target.value) || 0,
                      )
                    }
                    disabled={item.deleted || quoteData.status === "approved"}
                    className={`${isFieldEdited(item, "unitPrice") ? "border-yellow-400 bg-yellow-50" : ""}`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Line Total</label>
                  <div className={`p-2 bg-gray-50 rounded border font-semibold ${item.deleted ? "line-through" : ""}`}>
                    ${item.total.toFixed(2)}
                  </div>
                </div>

                <div className="md:col-span-1 flex items-end">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeLineItem(item.id)}
                    disabled={item.deleted || quoteData.status === "approved"}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-end pt-4 border-t">
            <div className="text-right">
              <p className="text-lg font-semibold">Total: ${calculateTotal().toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Cost Breakdown */}
      <QuoteCostBreakdown lineItems={lineItems} showLineItemDetails={true} className="rounded-2xl shadow-md" />

      {/* Project Creation Confirmation */}
      {quoteData.status === "approved" && (
        <Card className="rounded-2xl shadow-md border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800">Quote Accepted!</h3>
                <p className="text-green-700">This quote has been accepted. A new project has been created.</p>
                <Button
                  variant="outline"
                  className="mt-3 border-green-300 text-green-700 hover:bg-green-100 bg-transparent"
                  onClick={() =>
                    router.push(`/contractor/projects/${quoteData.quote_id.replace("quote_", "project_")}`)
                  }
                >
                  View Project
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quote Messaging */}
      <QuoteMessaging quoteId={quoteData.quote_id} userType="contractor" />

      {/* Action Buttons */}
      {quoteData.status !== "approved" && (
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={discardQuote} disabled={isSubmitting}>
            {quoteData.status === "draft" ? "Discard Quote" : "Reject Changes"}
          </Button>
          <Button onClick={approveQuote} disabled={isSubmitting || quoteData.status === "approved"}>
            {isSubmitting
              ? "Processing..."
              : quoteData.status === "client_edited"
                ? "Accept Changes & Send"
                : "Approve and Send to Client"}
          </Button>
        </div>
      )}

      {quoteData.status === "approved" && (
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => router.push("/contractor/my-quotes")}>
            Back to My Quotes
          </Button>
        </div>
      )}
    </div>
  )
}
