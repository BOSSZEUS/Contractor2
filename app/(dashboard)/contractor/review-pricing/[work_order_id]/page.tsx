"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Clock, DollarSign, AlertCircle } from "lucide-react"
import { QuoteService } from "@/utils/quotes"
import type { EnhancedLineItem } from "@/types/enhanced-quotes"
import type { LaborRates } from "@/components/labor-rate-manager"

interface WorkOrder {
  id: string
  title: string
  description: string
  urgency: string
  property_address: string
  client_name: string
  posted_date: string
  budget_range?: string
  line_items: LineItem[]
}

interface LineItem {
  id: string
  description: string
  suggested_task?: string
}

interface PricingItem {
  id: string
  task_name: string
  unit_price: number
  description: string
}

export default function ReviewPricingPage({ params }: { params: { work_order_id: string } }) {
  const { work_order_id } = params
  const router = useRouter()
  const { toast } = useToast()

  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null)
  const [pricingItems, setPricingItems] = useState<PricingItem[]>([])
  const [enhancedLineItems, setEnhancedLineItems] = useState<EnhancedLineItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [laborRates] = useState<LaborRates>({
    global: 75,
    categories: {
      general: 65,
      plumbing: 85,
      electrical: 90,
      flooring: 70,
      roofing: 80,
      hvac: 95,
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch work order details
        // In a real app, this would be an API call to /api/workorders/{work_order_id}
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Mock work order data
        const mockWorkOrder: WorkOrder = {
          id: work_order_id,
          title: "Kitchen Cabinet Installation",
          description:
            "Need new kitchen cabinets installed. Modern style preferred with soft-close hinges and under-cabinet lighting.",
          urgency: "Normal",
          property_address: "456 Oak Ave, Anytown, ST",
          client_name: "Alex Johnson",
          posted_date: "2025-01-02",
          budget_range: "$2,000 - $3,500",
          line_items: [
            {
              id: "li_001",
              description: "Install upper kitchen cabinets",
              suggested_task: "Cabinet Installation",
            },
            {
              id: "li_002",
              description: "Install lower kitchen cabinets with soft-close hinges",
              suggested_task: "Cabinet Installation",
            },
            {
              id: "li_003",
              description: "Install under-cabinet lighting",
              suggested_task: "Electrical Work",
            },
          ],
        }

        setWorkOrder(mockWorkOrder)

        // Fetch contractor's pricing data
        // In a real app, this would be an API call to /api/contractor/pricing/
        const mockPricingItems: PricingItem[] = [
          {
            id: "1",
            task_name: "Cabinet Installation",
            unit_price: 125,
            description: "Per linear foot",
          },
          {
            id: "2",
            task_name: "Electrical Work",
            unit_price: 85,
            description: "Per hour",
          },
          {
            id: "3",
            task_name: "Plumbing",
            unit_price: 95,
            description: "Per hour",
          },
        ]

        setPricingItems(mockPricingItems)

        // Initialize enhanced line items based on work order line items
        const initialEnhancedItems: EnhancedLineItem[] = mockWorkOrder.line_items.map((item, index) => {
          // Find matching pricing item if available
          const matchingPrice = mockPricingItems.find((price) => price.task_name === item.suggested_task)

          return {
            id: `item-${Date.now()}-${index}`,
            description: item.description,
            quantity: 1,
            unit: "each",
            unitPrice: matchingPrice ? matchingPrice.unit_price : 0,
            total: matchingPrice ? matchingPrice.unit_price : 0,
            laborHours: 0,
            laborRate: laborRates.global,
            laborCost: 0,
            materialCost: 0,
            materialTotal: 0,
            markup: 0,
            markupAmount: 0,
            subtotal: matchingPrice ? matchingPrice.unit_price : 0,
            deleted: false,
            note: "",
          }
        })

        setEnhancedLineItems(initialEnhancedItems)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load work order details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [work_order_id, toast, laborRates.global])

  const updateLineItem = (id: string, field: keyof EnhancedLineItem, value: string | number) => {
    setEnhancedLineItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Recalculate total when price or quantity changes
          if (field === "unitPrice" || field === "quantity") {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
            updatedItem.subtotal = updatedItem.total
          }

          return updatedItem
        }
        return item
      }),
    )
  }

  const calculateTotal = () => {
    return enhancedLineItems.reduce((sum, item) => sum + item.total, 0)
  }

  const handleGenerateQuote = async () => {
    setIsGenerating(true)

    try {
      // Use shared quote service
      const quoteResult = await QuoteService.createQuote({
        contractorId: "contractor-123", // In real app, get from auth context
        workOrderId: work_order_id,
        lineItems: enhancedLineItems,
      })

      if (!quoteResult.success) {
        throw new Error(quoteResult.error || "Failed to generate quote")
      }

      toast({
        title: "Quote Generated",
        description: "Your quote has been created successfully",
      })

      // Redirect to quote approval page
      router.push(`/contractor/quote-approval/${quoteResult.quoteId}`)
    } catch (error) {
      console.error("Error generating quote:", error)
      toast({
        title: "Error",
        description: "Failed to generate quote",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Normal":
        return "bg-blue-100 text-blue-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Loading work order details...</div>
      </div>
    )
  }

  if (!workOrder) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Work Order Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested work order could not be found.</p>
          <Button onClick={() => router.push("/job-board")}>Return to Job Board</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Review Pricing</h1>
          <p className="text-muted-foreground">Adjust pricing before generating quote</p>
        </div>
      </div>

      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{workOrder.title}</CardTitle>
              <CardDescription>Client: {workOrder.client_name}</CardDescription>
            </div>
            <Badge className={getUrgencyColor(workOrder.urgency)}>{workOrder.urgency}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{workOrder.description}</p>

          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{workOrder.property_address}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Posted {new Date(workOrder.posted_date).toLocaleDateString()}</span>
            </div>

            {workOrder.budget_range && (
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span>Budget: {workOrder.budget_range}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
          <CardDescription>Review and adjust pricing for each item</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {enhancedLineItems.map((item, index) => {
            const matchingPrice = pricingItems.find(
              (price) =>
                workOrder.line_items.find((li) => li.id === `li_${String(index + 1).padStart(3, "0")}`)
                  ?.suggested_task === price.task_name,
            )

            return (
              <div key={item.id} className="p-4 border rounded-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.description}</h3>
                    {matchingPrice && (
                      <p className="text-sm text-muted-foreground">
                        Suggested: {matchingPrice.task_name} (${matchingPrice.unit_price} - {matchingPrice.description})
                      </p>
                    )}
                  </div>

                  <div className="w-full md:w-32">
                    <label className="block text-sm font-medium mb-1">Price ($)</label>
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateLineItem(item.id, "unitPrice", Number(e.target.value) || 0)}
                      className="text-right"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                  <Textarea
                    value={item.note}
                    onChange={(e) => updateLineItem(item.id, "note", e.target.value)}
                    placeholder="Add any details about this line item..."
                    className="min-h-[60px]"
                  />
                </div>
              </div>
            )
          })}

          <div className="flex justify-between items-center pt-4 border-t">
            <span className="font-medium">Total Quote Amount:</span>
            <span className="text-xl font-bold">${calculateTotal().toFixed(2)}</span>
          </div>

          <Button className="w-full" size="lg" onClick={handleGenerateQuote} disabled={isGenerating}>
            {isGenerating ? "Generating Quote..." : "Generate Quote"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
