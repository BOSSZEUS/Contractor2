"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react"

interface AnalyticsData {
  totalQuotes: number
  averageApprovalTime: number
  approvalRate: number
  quotesEditedByClients: number
  trend: {
    totalQuotes: "up" | "down" | "stable"
    approvalRate: "up" | "down" | "stable"
  }
}

export default function ContractorAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)

        // In a real app, this would be an actual API call
        // const response = await fetch('/api/contractor/analytics')
        // const data = await response.json()

        // For now, simulate API response with mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockAnalytics: AnalyticsData = {
          totalQuotes: 47,
          averageApprovalTime: 3.2, // days
          approvalRate: 68, // percentage
          quotesEditedByClients: 12,
          trend: {
            totalQuotes: "up",
            approvalRate: "up",
          },
        }

        setAnalytics(mockAnalytics)
        setError(null)
      } catch (err) {
        console.error("Failed to fetch analytics:", err)
        setError("Failed to load analytics. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const getApprovalRateStatus = (rate: number) => {
    if (rate >= 70) return { text: "Excellent", color: "text-green-600" }
    if (rate >= 50) return { text: "Good", color: "text-blue-600" }
    return { text: "Needs Improvement", color: "text-amber-600" }
  }

  const getTrendIcon = (trend: "up" | "down" | "stable", positive = true) => {
    if (trend === "up") {
      return <TrendingUp className={`h-5 w-5 ${positive ? "text-green-500" : "text-red-500"}`} />
    } else if (trend === "down") {
      return <TrendingDown className={`h-5 w-5 ${positive ? "text-red-500" : "text-green-500"}`} />
    }
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col gap-6">
          <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-12 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium">Error</h3>
              <p className="text-muted-foreground mt-2">{error}</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const approvalStatus = analytics ? getApprovalRateStatus(analytics.approvalRate) : { text: "", color: "" }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Track your quote performance and client engagement</p>
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger
              value="quotes"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              asChild
            >
              <Link href="/contractor/quotes" className="w-full">
                Quotes
              </Link>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              asChild
            >
              <Link href="/contractor/analytics" className="w-full">
                Analytics
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <Card className="bg-blue-50 border-blue-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Total Quotes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{analytics.totalQuotes}</div>
                <div className="flex items-center">{getTrendIcon(analytics.trend.totalQuotes)}</div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Quotes submitted</p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Approval Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{analytics.approvalRate}%</div>
                <div className="flex items-center">{getTrendIcon(analytics.trend.approvalRate)}</div>
              </div>
              <p className={`text-sm font-medium mt-2 ${approvalStatus.color}`}>{approvalStatus.text}</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-600">Average Approval Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.averageApprovalTime} days</div>
              <p className="text-sm text-muted-foreground mt-2">From submission to approval</p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Client Edits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{analytics.quotesEditedByClients}</div>
              <p className="text-sm text-muted-foreground mt-2">Quotes edited by clients</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
