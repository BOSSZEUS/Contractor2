"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, User, FileText } from "lucide-react"

interface RevisionChange {
  field: string
  old_value: string | number
  new_value: string | number
  item_description?: string
}

interface RevisionHistoryItem {
  version: number
  submitted_by: "client" | "contractor"
  submitted_by_name: string
  timestamp: string
  changes: RevisionChange[]
}

interface QuoteRevisionHistoryProps {
  quoteId: string
}

export function QuoteRevisionHistory({ quoteId }: QuoteRevisionHistoryProps) {
  const [revisions, setRevisions] = useState<RevisionHistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRevisionHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      // In a real app, this would be a fetch call to the API
      // const response = await fetch(`/api/quotes/history/${quoteId}`);
      // const data = await response.json();

      // For demo purposes, we'll simulate the API response
      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockData: RevisionHistoryItem[] = [
        {
          version: 1,
          submitted_by: "contractor",
          submitted_by_name: "ABC Contractors",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          changes: [
            {
              field: "created",
              old_value: "",
              new_value: "Quote created",
              item_description: "Initial quote submission",
            },
          ],
        },
        {
          version: 2,
          submitted_by: "client",
          submitted_by_name: "John Smith",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          changes: [
            {
              field: "quantity",
              old_value: 1,
              new_value: 2,
              item_description: "Bathroom remodel - labor only",
            },
            {
              field: "note",
              old_value: "",
              new_value: "Can we use higher quality materials?",
              item_description: "Bathroom remodel - labor only",
            },
          ],
        },
        {
          version: 3,
          submitted_by: "contractor",
          submitted_by_name: "ABC Contractors",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          changes: [
            {
              field: "unit_price",
              old_value: 2000,
              new_value: 2200,
              item_description: "Bathroom remodel - labor only",
            },
            {
              field: "description",
              old_value: "Bathroom remodel - labor only",
              new_value: "Bathroom remodel - labor only (premium materials)",
              item_description: "Bathroom remodel - labor only",
            },
          ],
        },
      ]

      setRevisions(mockData)
    } catch (err) {
      console.error("Failed to fetch revision history:", err)
      setError("Failed to load revision history. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  }

  const formatChange = (change: RevisionChange) => {
    switch (change.field) {
      case "created":
        return "Quote created"
      case "quantity":
        return `Changed quantity from ${change.old_value} to ${change.new_value}`
      case "unit_price":
        return `Changed price from $${change.old_value} to $${change.new_value}`
      case "description":
        return "Updated item description"
      case "note":
        return "Added note to item"
      case "deleted":
        return change.new_value ? "Removed item" : "Restored item"
      default:
        return `Changed ${change.field} from ${change.old_value} to ${change.new_value}`
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1 text-sm" onClick={fetchRevisionHistory}>
          <Clock className="h-4 w-4" />
          View Revision History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quote Revision History</DialogTitle>
          <DialogDescription>View all changes made to this quote over time</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading revision history...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : revisions.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">No revision history available</div>
        ) : (
          <div className="space-y-6">
            {revisions.map((revision) => (
              <div key={revision.version} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={revision.submitted_by === "contractor" ? "outline" : "secondary"}>
                      Version {revision.version}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{formatDate(revision.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {revision.submitted_by === "contractor" ? "Contractor" : "Client"}: {revision.submitted_by_name}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {revision.changes.map((change, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="font-medium">{formatChange(change)}</span>
                        {change.item_description && (
                          <span className="text-muted-foreground"> - {change.item_description}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
