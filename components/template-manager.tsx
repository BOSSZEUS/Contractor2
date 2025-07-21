"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type {
  LineItemTemplate,
  TemplateCategory,
  CreateLineItemTemplate,
} from "@/types/templates"

const categories: { value: TemplateCategory; label: string }[] = [
  { value: "general", label: "General" },
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "flooring", label: "Flooring" },
  { value: "roofing", label: "Roofing" },
  { value: "hvac", label: "HVAC" },
]

export function TemplateManager() {
  const [templates, setTemplates] = useState<LineItemTemplate[]>([])
  const [filteredTemplates, setFilteredTemplates] = useState<LineItemTemplate[]>([])
  const [activeCategory, setActiveCategory] = useState<TemplateCategory>("general")
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<LineItemTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Form state for create/edit modal
  const initialFormData: CreateLineItemTemplate = {
    name: "",
    description: "",
    category: "general",
    unit: "",
    basePrice: 0,
    laborHours: 0,
    materialCost: 0,
    markup: 0,
    isActive: true,
  }

  const [formData, setFormData] = useState<CreateLineItemTemplate>(
    initialFormData,
  )

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates()
  }, [])

  // Filter templates when search or category changes
  useEffect(() => {
    let filtered = templates.filter((template) => template.category === activeCategory && template.isActive)

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
      const response = await fetch("/api/templates")
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch templates",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = async () => {
    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newTemplate = await response.json()
        setTemplates((prev) => [...prev, newTemplate])
        setIsCreateModalOpen(false)
        resetForm()
        toast({
          title: "Success",
          description: "Template created successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create template",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return

    try {
      const response = await fetch(`/api/templates/${editingTemplate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedTemplate = await response.json()
        setTemplates((prev) => prev.map((t) => (t.id === editingTemplate.id ? updatedTemplate : t)))
        setEditingTemplate(null)
        resetForm()
        toast({
          title: "Success",
          description: "Template updated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update template",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/templates/${templateId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTemplates((prev) => prev.filter((t) => t.id !== templateId))
        toast({
          title: "Success",
          description: "Template deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      })
    }
  }

  const handleDuplicateTemplate = async (template: LineItemTemplate) => {
    const duplicateData = {
      ...template,
      name: `${template.name} (Copy)`,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }

    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicateData),
      })

      if (response.ok) {
        const newTemplate = await response.json()
        setTemplates((prev) => [...prev, newTemplate])
        toast({
          title: "Success",
          description: "Template duplicated successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate template",
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
      isActive: template.isActive,
    })
  }

  const resetForm = () => {
    setFormData(initialFormData)
  }

  const closeModals = () => {
    setIsCreateModalOpen(false)
    setEditingTemplate(null)
    resetForm()
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading templates...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Quote Templates</h2>
          <p className="text-muted-foreground">Create and manage reusable line items for faster quote generation</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>Create a reusable line item template for your quotes.</DialogDescription>
            </DialogHeader>
            <TemplateForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleCreateTemplate}
              onCancel={closeModals}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as TemplateCategory)}>
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category.value} value={category.value}>
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.value} value={category.value} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTemplates.map((template) => (
                <Card key={template.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {template.unit}
                        </Badge>
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
                    <CardDescription className="text-sm mb-3">{template.description}</CardDescription>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Price:</span>
                        <span className="font-medium">${template.basePrice.toFixed(2)}</span>
                      </div>
                      {template.laborHours && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Labor Hours:</span>
                          <span className="font-medium">{template.laborHours}h</span>
                        </div>
                      )}
                      {template.materialCost && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Material Cost:</span>
                          <span className="font-medium">${template.materialCost.toFixed(2)}</span>
                        </div>
                      )}
                      {template.markup && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Markup:</span>
                          <span className="font-medium">{template.markup}%</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No templates found for {category.label}</p>
                <Button variant="outline" className="mt-4" onClick={() => setIsCreateModalOpen(true)}>
                  Create your first {category.label.toLowerCase()} template
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Modal */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>Update your template details.</DialogDescription>
          </DialogHeader>
          <TemplateForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleUpdateTemplate}
            onCancel={closeModals}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Template Form Component
function TemplateForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
}: {
  formData: CreateLineItemTemplate
  setFormData: React.Dispatch<React.SetStateAction<CreateLineItemTemplate>>
  onSubmit: () => void
  onCancel: () => void
}) {
  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Template Name</Label>
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
                onValueChange={(value: TemplateCategory) =>
                  setFormData((prev) => ({ ...prev, category: value }))
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

        <div className="grid grid-cols-2 gap-4">
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

          <div className="grid gap-2">
            <Label htmlFor="laborHours">Labor Hours</Label>
            <Input
              id="laborHours"
              type="number"
              step="0.5"
              value={formData.laborHours}
              onChange={(e) => setFormData((prev) => ({ ...prev, laborHours: Number.parseFloat(e.target.value) || 0 }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
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
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSubmit}>Save Template</Button>
      </DialogFooter>
    </>
  )
}
