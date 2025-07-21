"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Eye } from "lucide-react"
import type { LineItemTemplate, TemplateCategory } from "@/types/templates"
import { calculateLineItemCost, createEnhancedLineItem } from "@/lib/quote-calculations"
import type { LaborRates } from "@/components/labor-rate-manager"
import type { EnhancedLineItem } from "@/types/enhanced-quotes"

interface TemplateSelectorProps {
  onTemplateSelect: (lineItem: EnhancedLineItem) => void
  laborRates?: LaborRates
}

// Mock templates data - in real app this would come from API
const mockTemplates: LineItemTemplate[] = [
  {
    id: "tpl1",
    name: "Standard Bathroom Demolition",
    description: "Complete bathroom demolition including fixtures, tile, and drywall removal",
    category: "general",
    unit: "each",
    basePrice: 850,
    laborHours: 8,
    materialCost: 50,
    markup: 0.25,
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-06-01",
  },
  {
    id: "tpl2",
    name: "Toilet Installation",
    description: "Remove old toilet and install new standard toilet with wax ring and bolts",
    category: "plumbing",
    unit: "each",
    basePrice: 275,
    laborHours: 2,
    materialCost: 25,
    markup: 0.3,
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-06-01",
  },
  {
    id: "tpl3",
    name: "Electrical Outlet Installation",
    description: "Install new GFCI outlet with proper wiring and code compliance",
    category: "electrical",
    unit: "each",
    basePrice: 125,
    laborHours: 1,
    materialCost: 35,
    markup: 0.4,
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-06-01",
  },
  {
    id: "tpl4",
    name: "Hardwood Floor Installation",
    description: "Install 3/4 inch solid hardwood flooring including underlayment",
    category: "flooring",
    unit: "sq ft",
    basePrice: 8.5,
    laborHours: 0.15,
    materialCost: 4.25,
    markup: 0.35,
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-06-01",
  },
  {
    id: "tpl5",
    name: "HVAC Duct Cleaning",
    description: "Professional duct cleaning service for residential HVAC system",
    category: "hvac",
    unit: "system",
    basePrice: 450,
    laborHours: 4,
    materialCost: 75,
    markup: 0.25,
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-06-01",
  },
]

const categoryLabels: Record<TemplateCategory, string> = {
  general: "General",
  plumbing: "Plumbing",
  electrical: "Electrical",
  flooring: "Flooring",
  roofing: "Roofing",
  hvac: "HVAC",
}

const defaultLaborRates: LaborRates = {
  global: 75,
  categories: {
    general: 65,
    plumbing: 85,
    electrical: 90,
    flooring: 70,
    roofing: 80,
    hvac: 95,
  },
}

export function TemplateSelector({ onTemplateSelect, laborRates = defaultLaborRates }: TemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | "all">("all")
  const [templates, setTemplates] = useState<LineItemTemplate[]>(mockTemplates)
  const [previewTemplate, setPreviewTemplate] = useState<LineItemTemplate | null>(null)
  const [quantity, setQuantity] = useState(1)

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory && template.isActive
  })

  const templatesByCategory = Object.entries(categoryLabels).reduce(
    (acc, [key, label]) => {
      acc[key as TemplateCategory] = filteredTemplates.filter((t) => t.category === key)
      return acc
    },
    {} as Record<TemplateCategory, LineItemTemplate[]>,
  )

  const calculateEnhancedPrice = (template: LineItemTemplate, qty: number) => {
    return calculateLineItemCost(template, qty, laborRates)
  }

  const handleTemplateAdd = (template: LineItemTemplate) => {
    const enhancedLineItem = createEnhancedLineItem(template, quantity, laborRates)
    onTemplateSelect(enhancedLineItem)
    setQuantity(1)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add from Templates
        </CardTitle>
        <CardDescription>Quickly add line items from your saved templates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="template-search">Search Templates</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="template-search"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="category-filter">Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as TemplateCategory | "all")}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Templates by Category */}
        <Tabs value={selectedCategory === "all" ? "general" : selectedCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <TabsTrigger key={key} value={key} onClick={() => setSelectedCategory(key as TemplateCategory)}>
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(templatesByCategory).map(([category, categoryTemplates]) => (
            <TabsContent key={category} value={category} className="mt-4">
              {categoryTemplates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No templates found in this category</div>
              ) : (
                <div className="grid gap-3 max-h-[400px] overflow-y-auto">
                  {categoryTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{template.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {categoryLabels[template.category]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>
                            ${template.basePrice.toFixed(2)} / {template.unit}
                          </span>
                          {template.laborHours && (
                            <span>
                              {template.laborHours}h @ $
                              {(laborRates.categories[template.category] || laborRates.global).toFixed(0)}/hr
                            </span>
                          )}
                          {template.materialCost && <span>${template.materialCost.toFixed(2)} materials</span>}
                          {template.markup && <span>{template.markup}% markup</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setPreviewTemplate(template)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{template.name}</DialogTitle>
                              <DialogDescription>{template.description}</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Base Price</Label>
                                  <p className="font-medium">
                                    ${template.basePrice.toFixed(2)} / {template.unit}
                                  </p>
                                </div>
                                <div>
                                  <Label>Category</Label>
                                  <p className="font-medium">{categoryLabels[template.category]}</p>
                                </div>
                                {template.laborHours && (
                                  <div>
                                    <Label>Labor Hours</Label>
                                    <p className="font-medium">{template.laborHours} hours</p>
                                  </div>
                                )}
                                {template.laborHours && (
                                  <div>
                                    <Label>Labor Rate</Label>
                                    <p className="font-medium">
                                      ${(laborRates.categories[template.category] || laborRates.global).toFixed(2)}/hr
                                    </p>
                                  </div>
                                )}
                                {template.materialCost && (
                                  <div>
                                    <Label>Material Cost</Label>
                                    <p className="font-medium">${template.materialCost.toFixed(2)}</p>
                                  </div>
                                )}
                                {template.markup && (
                                  <div>
                                    <Label>Markup</Label>
                                    <p className="font-medium">{template.markup}%</p>
                                  </div>
                                )}
                              </div>
                              <div>
                                <Label htmlFor="preview-quantity">Quantity</Label>
                                <Input
                                  id="preview-quantity"
                                  type="number"
                                  min="1"
                                  value={quantity}
                                  onChange={(e) => setQuantity(Number(e.target.value))}
                                  className="w-24"
                                />
                              </div>

                              {/* Enhanced Cost Breakdown */}
                              <div className="space-y-2 p-4 bg-muted rounded-lg">
                                <h4 className="font-medium mb-2">Cost Breakdown</h4>
                                {(() => {
                                  const calc = calculateEnhancedPrice(template, quantity)
                                  const laborRate = laborRates.categories[template.category] || laborRates.global

                                  return (
                                    <div className="space-y-1 text-sm">
                                      {template.laborHours && (
                                        <div className="flex justify-between">
                                          <span>
                                            Labor ({template.laborHours}h × ${laborRate}/hr × {quantity}):
                                          </span>
                                          <span>${calc.laborCost.toFixed(2)}</span>
                                        </div>
                                      )}
                                      {template.materialCost && (
                                        <div className="flex justify-between">
                                          <span>
                                            Materials (${template.materialCost} × {quantity}):
                                          </span>
                                          <span>${calc.materialCost.toFixed(2)}</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between">
                                        <span>
                                          Base Cost (${template.basePrice} × {quantity}):
                                        </span>
                                        <span>${(template.basePrice * quantity).toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between border-t pt-1">
                                        <span>Subtotal:</span>
                                        <span>${calc.subtotal.toFixed(2)}</span>
                                      </div>
                                      {template.markup && (
                                        <div className="flex justify-between">
                                          <span>Markup ({template.markup}%):</span>
                                          <span>${calc.markupAmount.toFixed(2)}</span>
                                        </div>
                                      )}
                                      <div className="flex justify-between border-t pt-1 font-bold">
                                        <span>Total:</span>
                                        <span>${calc.total.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  )
                                })()}
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={() => handleTemplateAdd(template)}>Add to Quote</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button size="sm" onClick={() => handleTemplateAdd(template)}>
                          Add
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
