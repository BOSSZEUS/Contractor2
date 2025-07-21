"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Plus } from "lucide-react"
import type { EnhancedLineItem } from "@/types/enhanced-quotes"
import type { TemplateCategory } from "@/types/templates"
import type { LaborRates } from "@/components/labor-rate-manager"

interface UnmatchedItem {
  description: string
  quantity: number
  confidence: number
}

interface UnmatchedItemsHandlerProps {
  unmatchedItems: UnmatchedItem[]
  laborRates: LaborRates
  onItemsConverted: (convertedItems: EnhancedLineItem[]) => void
}

export function UnmatchedItemsHandler({ unmatchedItems, laborRates, onItemsConverted }: UnmatchedItemsHandlerProps) {
  const [convertedItems, setConvertedItems] = useState<EnhancedLineItem[]>([])
  const [currentItem, setCurrentItem] = useState<UnmatchedItem | null>(null)
  const [manualPricing, setManualPricing] = useState({
    description: "",
    category: "general" as TemplateCategory,
    unit: "each",
    basePrice: 0,
    laborHours: 0,
    materialCost: 0,
    markup: 15,
  })

  const handleStartConversion = (item: UnmatchedItem) => {
    setCurrentItem(item)
    setManualPricing({
      description: item.description,
      category: "general",
      unit: "each",
      basePrice: 0,
      laborHours: 0,
      materialCost: 0,
      markup: 15,
    })
  }

  const handleConvertItem = () => {
    if (!currentItem) return

    const laborRate = laborRates.categories[manualPricing.category] || laborRates.global
    const laborCost = manualPricing.laborHours * laborRate * currentItem.quantity
    const materialTotal = manualPricing.materialCost * currentItem.quantity
    const baseTotal = manualPricing.basePrice * currentItem.quantity
    const subtotal = laborCost + materialTotal + baseTotal
    const markupAmount = subtotal * (manualPricing.markup / 100)
    const total = subtotal + markupAmount

    const enhancedItem: EnhancedLineItem = {
      id: `manual-${Date.now()}-${Math.random()}`,
      templateId: `manual-${Date.now()}`,
      description: manualPricing.description,
      quantity: currentItem.quantity,
      unit: manualPricing.unit,
      unitPrice: manualPricing.basePrice,
      laborHours: manualPricing.laborHours,
      laborRate,
      laborCost,
      materialCost: manualPricing.materialCost,
      materialTotal,
      markup: manualPricing.markup,
      markupAmount,
      subtotal,
      total,
      category: manualPricing.category,
      extractionConfidence: currentItem.confidence,
      originalDescription: currentItem.description,
      isManuallyPriced: true,
      deleted: false,
      note: "",
    }

    setConvertedItems((prev) => [...prev, enhancedItem])
    setCurrentItem(null)
  }

  const handleFinishConversion = () => {
    onItemsConverted(convertedItems)
  }

  const remainingItems = unmatchedItems.filter(
    (item) => !convertedItems.some((converted) => converted.originalDescription === item.description),
  )

  if (unmatchedItems.length === 0) return null

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="h-5 w-5" />
          Unmatched Items Require Manual Pricing
        </CardTitle>
        <CardDescription className="text-orange-700">
          These items couldn't be matched to existing templates. Please provide pricing information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Remaining Items to Convert */}
        {remainingItems.length > 0 && (
          <div>
            <h4 className="font-medium text-orange-800 mb-2">Items Needing Pricing:</h4>
            <div className="space-y-2">
              {remainingItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-orange-200 rounded-lg bg-white"
                >
                  <div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity} | Confidence: {(item.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                  <Button size="sm" onClick={() => handleStartConversion(item)}>
                    Price Item
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Manual Pricing Form */}
        {currentItem && (
          <div className="p-4 border border-orange-200 rounded-lg bg-white">
            <h4 className="font-medium mb-4">Price: {currentItem.description}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={manualPricing.description}
                  onChange={(e) => setManualPricing((prev) => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={manualPricing.category}
                  onValueChange={(value) =>
                    setManualPricing((prev) => ({ ...prev, category: value as TemplateCategory }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="flooring">Flooring</SelectItem>
                    <SelectItem value="roofing">Roofing</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={manualPricing.unit}
                  onValueChange={(value) => setManualPricing((prev) => ({ ...prev, unit: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="each">Each</SelectItem>
                    <SelectItem value="sq ft">Sq Ft</SelectItem>
                    <SelectItem value="linear ft">Linear Ft</SelectItem>
                    <SelectItem value="hour">Hour</SelectItem>
                    <SelectItem value="day">Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="base-price">Base Price per {manualPricing.unit}</Label>
                <Input
                  id="base-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={manualPricing.basePrice}
                  onChange={(e) => setManualPricing((prev) => ({ ...prev, basePrice: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="labor-hours">Labor Hours per {manualPricing.unit}</Label>
                <Input
                  id="labor-hours"
                  type="number"
                  min="0"
                  step="0.25"
                  value={manualPricing.laborHours}
                  onChange={(e) => setManualPricing((prev) => ({ ...prev, laborHours: Number(e.target.value) }))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Rate: ${(laborRates.categories[manualPricing.category] || laborRates.global).toFixed(2)}/hr
                </p>
              </div>
              <div>
                <Label htmlFor="material-cost">Material Cost per {manualPricing.unit}</Label>
                <Input
                  id="material-cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={manualPricing.materialCost}
                  onChange={(e) => setManualPricing((prev) => ({ ...prev, materialCost: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="markup">Markup %</Label>
                <Input
                  id="markup"
                  type="number"
                  min="0"
                  max="100"
                  value={manualPricing.markup}
                  onChange={(e) => setManualPricing((prev) => ({ ...prev, markup: Number(e.target.value) }))}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleConvertItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add to Quote
              </Button>
              <Button variant="outline" onClick={() => setCurrentItem(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Converted Items */}
        {convertedItems.length > 0 && (
          <div>
            <h4 className="font-medium text-green-800 mb-2">Converted Items:</h4>
            <div className="space-y-2">
              {convertedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50"
                >
                  <div>
                    <p className="font-medium">{item.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} {item.unit} × ${item.unitPrice.toFixed(2)} = ${item.total.toFixed(2)}
                    </p>
                  </div>
                  <Badge className="bg-green-500">Priced</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Finish Button */}
        {convertedItems.length > 0 && remainingItems.length === 0 && (
          <Button onClick={handleFinishConversion} className="w-full">
            Add All Items to Quote
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
