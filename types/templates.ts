export interface LineItemTemplate {
  id: string
  name: string
  description: string
  category: "plumbing" | "electrical" | "general" | "flooring" | "roofing" | "hvac"
  unit: string // 'sq ft', 'linear ft', 'each', 'hour', etc.
  basePrice: number
  laborHours?: number
  materialCost?: number
  markup?: number // percentage markup on material cost
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TemplateBundle {
  id: string
  name: string
  description: string
  category: string
  lineItems: LineItemTemplate[]
  totalEstimate: number
}

// Helper type for template categories
export type TemplateCategory = LineItemTemplate["category"]

// Helper type for creating new templates (without generated fields)
export type CreateLineItemTemplate = Omit<LineItemTemplate, "id" | "createdAt" | "updatedAt">

// Helper type for updating templates (optional fields except id)
export type UpdateLineItemTemplate = Partial<Omit<LineItemTemplate, "id">> & { id: string }
