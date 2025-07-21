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
  originalDescription?: string
  isManuallyPriced?: boolean
}

export interface QuoteTotals {
  subtotal: number
  totalLabor: number
  totalMaterials: number
  totalMarkup: number
  total: number
}

export interface Quote {
  id: string
  contractorId: string
  clientId: string
  clientName?: string
  projectName?: string
  lineItems: EnhancedLineItem[]
  totalLabor: number
  totalMaterials: number
  totalMarkup: number
  subtotal: number
  total: number
  status: string
  createdAt: any
  updatedAt: any
}
