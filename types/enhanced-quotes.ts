export interface QuoteCalculation {
  laborCost: number
  materialCost: number
  subtotal: number
  markupAmount: number
  total: number
}

export interface EnhancedLineItem {
  id: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
  total: number

  // Enhanced pricing fields
  laborHours?: number
  laborRate?: number
  laborCost: number
  materialCost?: number
  materialTotal: number
  markup?: number
  markupAmount: number
  subtotal: number

  // Metadata
  deleted: boolean
  note: string
  templateId?: string | null
  extractionConfidence?: number | null
  category?: string
}

export interface QuoteTotals {
  subtotal: number
  totalLabor: number
  totalMaterials: number
  totalMarkup: number
  total: number
}
