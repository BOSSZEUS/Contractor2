"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Plus, Edit, Trash2, Copy, ChevronDown, Filter, SlidersHorizontal, Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { LineItemTemplate, TemplateCategory } from "@/types/templates"
import { LaborRateManager } from "@/components/labor-rate-manager"
import { useAppState } from "@/contexts/app-state-context"
import { useRouter } from "next/navigation"

interface PricingFormData {
  name: string
  description: string
  category: TemplateCategory
  unit: string
  basePrice: number
  laborHours: number
  materialCost: number
  markup: number
  isAdvanced: boolean
}

// Categories for templates
const categories: { value: TemplateCategory; label: string }[] = [
  { value: "general", label: "General" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "flooring", label: "Flooring" },
  { value: "roofing", label: "Roofing" },
  { value: "hvac", label: "HVAC" },
]

export default function ContractorPricingPage() {
  const router = useRouter()
  const { state } = useAppState()
  const { toast } = useToast()

  const [templates, setTemplates] = useState<LineItemTemplate[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<LineItemTemplate[]>([])
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<LineItemTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Form state for create/edit modal

  interface PricingFormData {
    name: string
    description: string
    category: TemplateCategory
    unit: string
    basePrice: number
    laborHours: number
    materialCost: number
    markup: number
    isAdvanced: boolean
  }

  const [formData, setFormData] = useState<PricingFormData>({
    name: "",
    description: "",
    category: "general",
    unit: "",
    basePrice: 0,
    laborHours: 0,
    materialCost: 0,
    markup: 0,
    isAdvanced: false,
  })

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates()
  }, [])

  // Filter templates when search or category changes
  useEffect(() => {
    let filtered = templates.filter((template) => template.isActive)

    if (activeCategory !== "all") {
      filtered = filtered.filter((template) => template.category === activeCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          template.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredTemplates(filtered)
  }, [templates, activeCategory, searchQuery])

  const fetchTemplates = async () => {
    try {
      // Simulate API call to GET /api/templates
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data combining both simple pricing and advanced templates
      const mockData: LineItemTemplate[] = [
        {
          id: "1",
          name: "Ceiling Fan Install",
          description: "Standard swap out",
          category: "electrical",
          unit: "each",
          basePrice: 150,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Bathroom Remodel",
          description: "Labor only",
          category: "general",
          unit: "project",
          basePrice: 2000,
          laborHours: 40,
          materialCost: 0,
          markup: 0,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "Cabinet Installation",
          description: "Per linear foot",
          category: "general",
          unit: "linear ft",
          basePrice: 125,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "4",
          name: "Premium Bathroom Fixtures",
          description: "High-end fixtures installation package",
          category: "plumbing",
          unit: "package",
          basePrice: 850,
          laborHours: 12,
          materialCost: 350,
          markup: 15,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      setTemplates(mockData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch pricing data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateTemplate = async () => {
    console.log("Creating template with data:", formData)
    setIsSubmitting(true)
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        toast({
          title: "Validation Error",
          description: "Item name is required",
          variant: "destructive",
        })
        return
      }

      if (!formData.unit.trim()) {
        toast({
          title: "Validation Error",
          description: "Unit is required",
          variant: "destructive",
        })
        return
      }

      if (formData.basePrice <= 0) {
        toast({
          title: "Validation Error",
          description: "Base price must be greater than 0",
          variant: "destructive",
        })
        return
      }

      // Simulate API call to POST /api/templates
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newTemplate: LineItemTemplate = {
        id: Date.now().toString(),
        name: formData.name,
        description: formData.description,
        category: formData.category,
        unit: formData.unit,
        basePrice: formData.basePrice,
        // Only include advanced fields if isAdvanced is true and values are provided
        ...(formData.isAdvanced && formData.laborHours > 0 ? { laborHours: formData.laborHours } : {}),
        ...(formData.isAdvanced && formData.materialCost > 0 ? { materialCost: formData.materialCost } : {}),
        ...(formData.isAdvanced && formData.markup > 0 ? { markup: formData.markup } : {}),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setTemplates((prev) => [...prev, newTemplate])
      setIsCreateModalOpen(false)
      resetForm()
      toast({
        title: "Success",
        description: "Pricing item created successfully",
      })
    } catch (error) {
      console.error("Error creating template:", error)
      toast({
        title: "Error",
        description: "Failed to create pricing item",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return

    try {
      // Validate required fields
      if (!formData.name || !formData.unit || formData.basePrice <= 0) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }

      // Simulate API call to PUT /api/templates/${editingTemplate.id}
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedTemplate: LineItemTemplate = {
        ...editingTemplate,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        unit: formData.unit,
        basePrice: formData.basePrice,
        // Only include advanced fields if isAdvanced is true and values are provided
        ...(formData.isAdvanced && formData.laborHours > 0
          ? { laborHours: formData.laborHours }
          : { laborHours: undefined }),
        ...(formData.isAdvanced && formData.materialCost > 0
          ? { materialCost: formData.materialCost }
          : { materialCost: undefined }),
        ...(formData.isAdvanced && formData.markup > 0 ? { markup: formData.markup } : { markup: undefined }),
        updatedAt: new Date().toISOString(),
      }

      setTemplates((prev) => prev.map((t) => (t.id === editingTemplate.id ? updatedTemplate : t)))
      setEditingTemplate(null)
      resetForm()
      toast({
        title: "Success",
        description: "Pricing item updated successfully",
      })
    } catch (error) {
      console.error("Error updating template:", error)
      toast({
        title: "Error",
        description: "Failed to update pricing item",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      // Simulate API call to DELETE /api/templates/${templateId}
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setTemplates((prev) => prev.filter((t) => t.id !== templateId))
      toast({
        title: "Success",
        description: "Pricing item deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete pricing item",
        variant: "destructive",
      })
    }
  }

  const handleDuplicateTemplate = async (template: LineItemTemplate) => {
    try {
      // Simulate API call to POST /api/templates
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newTemplate: LineItemTemplate = {
        ...template,
        id: Date.now().toString(),
        name: `${template.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setTemplates((prev) => [...prev, newTemplate])
      toast({
        title: "Success",
        description: "Pricing item duplicated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate pricing item",
        variant: "destructive",
      })
    }
  }

  const openEditModal = (template: LineItemTemplate) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      description: template.description,
      category: template.category,
      unit: template.unit,
      basePrice: template.basePrice,
      laborHours: template.laborHours || 0,
      materialCost: template.materialCost || 0,
      markup: template.markup || 0,
      isAdvanced: !!(template.laborHours || template.materialCost || template.markup),
    })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "general",
      unit: "",
      basePrice: 0,
      laborHours: 0,
      materialCost: 0,
      markup: 0,
      isAdvanced: false,
    })
  }

  const closeModals = () => {
    setIsCreateModalOpen(false)
    setEditingTemplate(null)
    resetForm()
  }

  const saveAllChanges = async () => {
    setIsSaving(true)
    try {
      // Simulate API call to PUT /api/templates/batch
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "All pricing items saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save pricing items",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const exportToExcel = () => {
    try {
      // Prepare data for export
      const exportData = templates.map((template) => ({
        "Item Name": template.name,
        Description: template.description,
        Category: categories.find((c) => c.value === template.category)?.label || template.category,
        Unit: template.unit,
        "Base Price ($)": template.basePrice,
        "Labor Hours": template.laborHours || "",
        "Material Cost ($)": template.materialCost || "",
        "Markup (%)": template.markup || "",
        Status: template.isActive ? "Active" : "Inactive",
        "Created Date": new Date(template.createdAt).toLocaleDateString(),
        "Updated Date": new Date(template.updatedAt).toLocaleDateString(),
      }))

      // Convert to CSV format
      const headers = Object.keys(exportData[0] || {})
      const csvContent = [
        headers.join(","),
        ...exportData.map((row) =>
          headers
            .map((header) => {
              const value = (row as Record<string, string | number>)[header]
              // Escape commas and quotes in CSV
              return typeof value === "string" && (value.includes(",") || value.includes('"'))
                ? `"${value.replace(/"/g, '""')}"`
                : value
            })
            .join(","),
        ),
      ].join("\n")

      // Create and download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `pricing-export-${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Success",
        description: `Pricing data exported to CSV file`,
      })
    } catch (error) {
      console.error("Export error:", error)
      toast({
        title: "Error",
        description: "Failed to export pricing data. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (state.userRole !== "contractor") {
    router.push("/dashboard")
    return null
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">Loading pricing data...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Pricing</h1>
          <p className="text-muted-foreground">Manage your service pricing for quotes and estimates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToExcel}>
            <Download className="mr-2 h-4 w-4" />
            Export to CSV
          </Button>
          <Button onClick={saveAllChanges} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save All Changes"}
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Pricing Item
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Pricing Item</DialogTitle>
                <DialogDescription>Create a new service or product pricing item for your quotes.</DialogDescription>
              </DialogHeader>
              <PricingItemForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleCreateTemplate}
                onCancel={closeModals}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pricing items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={activeCategory}
            onValueChange={(value) => setActiveCategory(value as TemplateCategory | "all")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode("table")}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Labor Rates Configuration */}
      <LaborRateManager contractorId="current_contractor_id" />

      {/* Pricing Items Display */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Pricing Items</CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.length > 0 ? (
                filteredTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="text-xs">
                              {categories.find((c) => c.value === template.category)?.label || template.category}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {template.unit}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleDuplicateTemplate(template)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(template)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Base Price:</span>
                          <span className="font-medium">${template.basePrice.toFixed(2)}</span>
                        </div>
                        {template.laborHours !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Labor Hours:</span>
                            <span className="font-medium">{template.laborHours}h</span>
                          </div>
                        )}
                        {template.materialCost !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Material Cost:</span>
                            <span className="font-medium">${template.materialCost.toFixed(2)}</span>
                          </div>
                        )}
                        {template.markup !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Markup:</span>
                            <span className="font-medium">{template.markup}%</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No pricing items found</p>
                  <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setIsCreateModalOpen(true)}>
                    Create your first pricing item
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-left py-3 px-4">Unit</th>
                    <th className="text-right py-3 px-4">Base Price</th>
                    <th className="text-right py-3 px-4">Advanced</th>
                    <th className="text-right py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                      <tr key={template.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div>
                            <div className="font-medium">{template.name}</div>
                            <div className="text-sm text-muted-foreground">{template.description}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">
                            {categories.find((c) => c.value === template.category)?.label || template.category}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{template.unit}</td>
                        <td className="py-3 px-4 text-right">${template.basePrice.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right">
                          {template.laborHours || template.materialCost || template.markup ? (
                            <Collapsible>
                              <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <ChevronDown className="h-4 w-4" />
                                </Button>
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                <div className="text-sm space-y-1 mt-2">
                                  {template.laborHours && (
                                    <div className="flex justify-between">
                                      <span>Labor Hours:</span>
                                      <span>{template.laborHours}h</span>
                                    </div>
                                  )}
                                  {template.materialCost && (
                                    <div className="flex justify-between">
                                      <span>Material Cost:</span>
                                      <span>${template.materialCost.toFixed(2)}</span>
                                    </div>
                                  )}
                                  {template.markup && (
                                    <div className="flex justify-between">
                                      <span>Markup:</span>
                                      <span>{template.markup}%</span>
                                    </div>
                                  )}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => handleDuplicateTemplate(template)}>
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openEditModal(template)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-12">
                        <p className="text-muted-foreground">No pricing items found</p>
                        <Button
                          variant="outline"
                          className="mt-4 bg-transparent"
                          onClick={() => setIsCreateModalOpen(true)}
                        >
                          Create your first pricing item
                        </Button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Pricing Item</DialogTitle>
            <DialogDescription>Update your pricing item details.</DialogDescription>
          </DialogHeader>
          <PricingItemForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateTemplate}
            onCancel={closeModals}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Pricing Item Form Component
function PricingItemForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  formData: PricingFormData
  setFormData: React.Dispatch<React.SetStateAction<PricingFormData>>
  onSubmit: () => void
  onCancel: () => void
  isSubmitting: boolean
}) {
  const handleSubmit = (e: any) => {
    e.preventDefault()
    console.log("Save button clicked with data:", formData)
    onSubmit()
  }

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Item Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Standard Bathroom Installation"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Detailed description of the work..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value as TemplateCategory }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="unit">Unit</Label>
            <Input
              id="unit"
              value={formData.unit}
              onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
              placeholder="e.g., sq ft, each, hour"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="basePrice">Base Price ($)</Label>
          <Input
            id="basePrice"
            type="number"
            step="0.01"
            value={formData.basePrice}
            onChange={(e) => setFormData((prev) => ({ ...prev, basePrice: Number.parseFloat(e.target.value) || 0 }))}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="advanced-options"
            checked={formData.isAdvanced}
            onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isAdvanced: checked }))}
          />
          <Label htmlFor="advanced-options">Show advanced pricing options</Label>
        </div>

        {formData.isAdvanced && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="laborHours">Labor Hours</Label>
                <Input
                  id="laborHours"
                  type="number"
                  step="0.5"
                  value={formData.laborHours}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, laborHours: Number.parseFloat(e.target.value) || 0 }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="materialCost">Material Cost ($)</Label>
                <Input
                  id="materialCost"
                  type="number"
                  step="0.01"
                  value={formData.materialCost}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, materialCost: Number.parseFloat(e.target.value) || 0 }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="markup">Markup (%)</Label>
              <Input
                id="markup"
                type="number"
                step="1"
                value={formData.markup}
                onChange={(e) => setFormData((prev) => ({ ...prev, markup: Number.parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Item"}
        </Button>
      </DialogFooter>
    </>
  )
}
