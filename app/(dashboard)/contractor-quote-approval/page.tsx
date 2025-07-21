"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QuoteLineItem {
  id: string
  description: string
  quantity: number
  unit_price: number
  line_total: number
}

interface WorkOrder {
  id: string
  title: string
  property_address: string
  client_name: string
}

export default function ContractorQuoteApprovalPage() {
  const { toast } = useToast()
  const [workOrder] = useState<WorkOrder>({
    id: "wo_123",
    title: "Bathroom and Plumbing Work",
    property_address: "123 Main St, Anytown, ST 12345",
    client_name: "John Smith",
  })

  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([
    {
      id: "1",
      description: "Bathroom remodel - labor only",
      quantity: 1,
      unit_price: 2000,
      line_total: 2000,
    },
    {
      id: "2",
      description: "Plumbing inspection and repair",
      quantity: 1,
      unit_price: 350,
      line_total: 350,
    },
  ])

  const [isLoading, setIsLoading] = useState(false)

  const updateLineItem = (id: string, field: keyof QuoteLineItem, value: string | number) => {
    setLineItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === "quantity" || field === "unit_price") {
            updated.line_total = updated.quantity * updated.unit_price
          }
          return updated
        }
        return item
      }),
    )
  }

  const removeLineItem = (id: string) => {
    setLineItems((items) => items.filter((item) => item.id !== id))
  }

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.line_total, 0)
  }

  const approveQuote = async () => {
    setIsLoading(true)
    try {
      const payload = {
        quote_id: "quote_123",
        work_order_id: workOrder.id,
        line_items: lineItems,
        total: calculateTotal(),
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Quote Approved",
        description: "Quote has been sent to the client for review",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve quote",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const discardQuote = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      toast({
        title: "Quote Discarded",
        description: "Quote has been deleted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to discard quote",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header Section */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Quote Review</CardTitle>
            <Badge variant="secondary">Quote Draft</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Work Order</label>
              <p className="font-semibold">{workOrder.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Property Address</label>
              <p className="font-semibold">{workOrder.property_address}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Client</label>
              <p className="font-semibold">{workOrder.client_name}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quote Line Items */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Quote Line Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {lineItems.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border rounded-xl">
                <div className="md:col-span-5">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Unit Price</label>
                  <Input
                    type="number"
                    value={item.unit_price}
                    onChange={(e) => updateLineItem(item.id, "unit_price", Number.parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Line Total</label>
                  <div className="p-2 bg-gray-50 rounded border font-semibold">${item.line_total.toFixed(2)}</div>
                </div>

                <div className="md:col-span-1 flex items-end">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeLineItem(item.id)}
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

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={discardQuote} disabled={isLoading}>
          Discard Quote
        </Button>
        <Button onClick={approveQuote} disabled={isLoading}>
          {isLoading ? "Processing..." : "Approve and Send to Client"}
        </Button>
      </div>
    </div>
  )
}
