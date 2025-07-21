"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ArrowLeft } from "lucide-react"
import { useAppState } from "@/contexts/app-state-context"

interface Quote {
  id: string
  contractor_name: string
  contractor_rating: number
  total_amount: number
  status: string
  line_items: Array<{
    id: string
    description: string
    quantity: number
    unit_price: number
    total: number
  }>
  created_at: string
}

interface WorkOrder {
  id: string
  title: string
  description: string
}

export default function QuoteComparePage() {
  const params = useParams()
  const router = useRouter()
  const workOrderId = params.work_order_id as string

  const [quotes, setQuotes] = useState<Quote[]>([])
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null)
  const [loading, setLoading] = useState(true)

  const { state } = useAppState()
  const { userRole } = state

  const fetchData = async () => {
    try {
      // Fetch work order details
      const workOrderResponse = await fetch(`/api/work-orders/${workOrderId}`)
      const workOrderData = await workOrderResponse.json()
      setWorkOrder(workOrderData)

      // Fetch all quotes for this work order
      const quotesResponse = await fetch(`/api/quotes/work-order/${workOrderId}`)
      const quotesData = await quotesResponse.json()
      setQuotes(quotesData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!userRole || userRole !== "client") {
      router.push("/dashboard")
    }
  }, [userRole, router])

  useEffect(() => {
    if (userRole === "client") {
      fetchData()
    }
  }, [workOrderId, userRole])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (quotes.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">No Quotes Yet</h2>
            <p className="text-gray-600">No quotes have been received for this work order yet.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Compare Quotes</h1>
        {workOrder && <p className="text-gray-600 mt-1">For: {workOrder.title}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quotes.map((quote) => (
          <Card key={quote.id} className="h-fit">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{quote.contractor_name}</CardTitle>
                <Badge variant="outline" className="ml-2">
                  {quote.status}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                {renderStars(quote.contractor_rating)}
                <span className="text-sm text-gray-600 ml-1">({quote.contractor_rating}/5)</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(quote.total_amount)}</div>
                <div className="text-sm text-gray-500">Total Quote Amount</div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2">Line Items:</h4>
                <div className="space-y-2">
                  {quote.line_items.map((item) => (
                    <div key={item.id} className="text-sm border-l-2 border-gray-200 pl-3">
                      <div className="font-medium">{item.description}</div>
                      <div className="text-gray-600">
                        {item.quantity} × {formatCurrency(item.unit_price)} = {formatCurrency(item.total)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-4">
                Submitted: {new Date(quote.created_at).toLocaleDateString()}
              </div>

              <Button onClick={() => router.push(`/quote-review/${quote.id}`)} className="w-full">
                Review This Quote
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {quotes.length > 1 && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Quick Comparison</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Lowest Price:</span>
              <div className="text-green-600 font-bold">
                {formatCurrency(Math.min(...quotes.map((q) => q.total_amount)))}
              </div>
            </div>
            <div>
              <span className="font-medium">Highest Rating:</span>
              <div className="text-blue-600 font-bold">{Math.max(...quotes.map((q) => q.contractor_rating))}/5 ⭐</div>
            </div>
            <div>
              <span className="font-medium">Total Quotes:</span>
              <div className="font-bold">{quotes.length} received</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
