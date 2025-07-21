"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Save } from "lucide-react"

export interface LaborRates {
  global: number
  categories: {
    general: number
    plumbing: number
    electrical: number
    flooring: number
    roofing: number
    hvac: number
  }
}

const defaultLaborRates: LaborRates = {
  global: 75,
  categories: {
    general: 0, // 0 means use global rate
    plumbing: 0,
    electrical: 0,
    flooring: 0,
    roofing: 0,
    hvac: 0,
  },
}

const categoryLabels = {
  general: "General",
  plumbing: "Plumbing",
  electrical: "Electrical",
  flooring: "Flooring",
  roofing: "Roofing",
  hvac: "HVAC",
}

interface LaborRateManagerProps {
  contractorId?: string
}

export function LaborRateManager({ contractorId }: LaborRateManagerProps) {
  const { toast } = useToast()
  const [laborRates, setLaborRates] = useState<LaborRates>(defaultLaborRates)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchLaborRates()
  }, [contractorId])

  const fetchLaborRates = async () => {
    try {
      // Simulate API call to GET /api/contractors/labor-rates
      await new Promise((resolve) => setTimeout(resolve, 500))

      // In real app: const response = await fetch(`/api/contractors/${contractorId}/labor-rates`)
      // For now, use default rates
      setLaborRates(defaultLaborRates)
    } catch (error) {
      console.error("Failed to fetch labor rates:", error)
      toast({
        title: "Error",
        description: "Failed to load labor rates",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGlobalRateChange = (value: string) => {
    const rate = Number.parseFloat(value) || 0
    setLaborRates((prev) => ({
      ...prev,
      global: rate,
    }))
  }

  const handleCategoryRateChange = (category: keyof LaborRates["categories"], value: string) => {
    const rate = Number.parseFloat(value) || 0
    setLaborRates((prev) => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: rate,
      },
    }))
  }

  const getEffectiveRate = (category: keyof LaborRates["categories"]) => {
    return laborRates.categories[category] || laborRates.global
  }

  const saveLaborRates = async () => {
    setSaving(true)
    try {
      // Simulate API call to PUT /api/contractors/labor-rates
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In real app:
      // await fetch(`/api/contractors/${contractorId}/labor-rates`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(laborRates)
      // })

      toast({
        title: "Success",
        description: "Labor rates saved successfully",
      })
    } catch (error) {
      console.error("Failed to save labor rates:", error)
      toast({
        title: "Error",
        description: "Failed to save labor rates",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading labor rates...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Labor Rates</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Configure your hourly labor rates by category. Leave category rates at $0 to use the global rate.
            </p>
          </div>
          <Button onClick={saveLaborRates} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Rates"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Global Rate */}
        <div className="grid gap-2">
          <Label htmlFor="global-rate" className="text-base font-medium">
            Global Default Rate
          </Label>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">$</span>
            <Input
              id="global-rate"
              type="number"
              step="0.01"
              min="0"
              value={laborRates.global}
              onChange={(e) => handleGlobalRateChange(e.target.value)}
              className="w-32"
            />
            <span className="text-sm text-muted-foreground">per hour</span>
          </div>
          <p className="text-xs text-muted-foreground">
            This rate will be used for any category that doesn't have a specific rate set.
          </p>
        </div>

        {/* Category Rates */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Category-Specific Rates</Label>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(categoryLabels).map(([category, label]) => (
              <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor={`${category}-rate`} className="font-medium">
                    {label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Effective rate: ${getEffectiveRate(category as keyof LaborRates["categories"]).toFixed(2)}/hr
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">$</span>
                  <Input
                    id={`${category}-rate`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={laborRates.categories[category as keyof LaborRates["categories"]]}
                    onChange={(e) =>
                      handleCategoryRateChange(category as keyof LaborRates["categories"], e.target.value)
                    }
                    className="w-24"
                    placeholder="0"
                  />
                  <span className="text-sm text-muted-foreground">/hr</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Set to $0 to use the global rate. Non-zero values will override the global rate for that category.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Utility function to get effective labor rate
export function getEffectiveLaborRate(category: keyof LaborRates["categories"], laborRates: LaborRates): number {
  return laborRates.categories[category] || laborRates.global
}
