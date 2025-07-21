"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Trash2, MessageSquare } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSearchParams } from "next/navigation"

interface QuoteLineItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  total: number
  notes?: string
}

// Mock data - in real app this would come from API
const initialQuoteData = {
  quote_id: "Q-2025-001",
  contractor_name: "ABC Construction",
  property_address: "123 Main St, Anytown, ST 12345",
  work_order_title: "Bathroom Renovation",
  line_items: [
    {
      id: "1",
      description: "Demolition of existing bathroom fixtures",
      quantity: 1,
      unit_price: 800,
      total: 800,
      notes: "",
    },
    {
      id: "2",
      description: "Install new vanity and sink",
      quantity: 1,
      unit_price: 1200,
      total: 1200,
      notes: "",
    },
    {
      id: "3",
      description: "Tile installation (per sq ft)",
      quantity: 50,
      unit_price: 12,
      total: 600,
      notes: "",
    },
    {
      id: "4",
      description: "Plumbing rough-in work",
      quantity: 1,
      unit_price: 950,
      total: 950,
      notes: "",
    },
  ],
}

export default function QuoteReviewClient() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const quoteId = searchParams.get("quote_id")

  const [quoteData, setQuoteData] = useState(initialQuoteData)
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>(initialQuoteData.line_items)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchQuoteData = async () => {
      if (!quoteId) return

      try {
        // Simulate API call to GET /api/quotes/{quote_id}/
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Use the existing mock data for now
        setQuoteData(initialQuoteData)
        setLineItems(initialQuoteData.line_items)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load quote data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuoteData()
  }, [quoteId, toast])

  // Add loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-8">Loading quote data...</div>
      </div>
    )
  }

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id))
  }

  const updateLineItemNotes = (id: string, notes: string) => {
    setLineItems(lineItems.map((item) => (item.id === id ? { ...item, notes } : item)))
  }

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.08 // 8% tax
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const payload = {
        quote_id: quoteData.quote_id,
        approved_line_items: lineItems.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.total,
          client_notes: item.notes || "",
        })),
        subtotal: calculateSubtotal(),
        tax: calculateTax(),
        total: calculateTotal(),
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Quote Response Submitted",
        description: "Your quote review has been sent back to the contractor for approval.",
      })
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your quote review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Review Quote</h1>
        <p className="text-muted-foreground">Review and modify the contractor's quote before approval</p>
      </div>

      {/* Quote Header */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Quote #{quoteData.quote_id}
            <Badge variant="outline">Pending Review</Badge>
          </CardTitle>
          <CardDescription>From: {quoteData.contractor_name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Property Address</Label>
              <p className="text-sm text-muted-foreground">{quoteData.property_address}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Work Order</Label>
              <p className="text-sm text-muted-foreground">{quoteData.work_order_title}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Quote Line Items</CardTitle>
          <CardDescription>Review each item, add notes, or remove items you don't want</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          {lineItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <h4 className="font-medium">{item.description}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Qty: {item.quantity}</span>
                    <span>Unit Price: ${item.unit_price.toFixed(2)}</span>
                    <span className="font-medium text-foreground">Total: ${item.total.toFixed(2)}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeLineItem(item.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`notes-${item.id}`} className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Add Notes for Contractor
                </Label>
                <Textarea
                  id={`notes-${item.id}`}
                  placeholder="Add any questions, modifications, or special requests for this item..."
                  value={item.notes || ""}
                  onChange={(e) => updateLineItemNotes(item.id, e.target.value)}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          ))}

          {lineItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              All line items have been removed. You may want to contact the contractor directly.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quote Summary */}
      {lineItems.length > 0 && (
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Quote Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%):</span>
                <span>${calculateTax().toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              className="w-full"
              size="lg"
              disabled={isSubmitting || lineItems.length === 0}
            >
              {isSubmitting ? "Submitting..." : "Submit Quote Review"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
