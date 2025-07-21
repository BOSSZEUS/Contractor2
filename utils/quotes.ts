import type { EnhancedLineItem } from "@/types/enhanced-quotes"
import type { LaborRates } from "@/components/labor-rate-manager"
import { calculateLineItemTotal } from "@/lib/quote-calculations"

export interface QuoteCreationData {
  clientId?: string
  workOrderId?: string
  contractorId: string
  lineItems: EnhancedLineItem[]
  notes?: string
  validUntil?: string
}

export interface QuoteSubmissionResult {
  success: boolean
  quoteId?: string
  error?: string
  warnings?: string[]
}

// Shared quote creation service
export class QuoteService {
  static async createQuote(data: QuoteCreationData): Promise<QuoteSubmissionResult> {
    try {
      // Validate required fields
      if (!data.contractorId) {
        return { success: false, error: "Contractor ID is required" }
      }

      if (!data.lineItems || data.lineItems.length === 0) {
        return { success: false, error: "At least one line item is required" }
      }

      // Calculate totals
      const totals = this.calculateQuoteTotals(data.lineItems)

      // Prepare quote payload
      const quotePayload = {
        contractorId: data.contractorId,
        clientId: data.clientId,
        workOrderId: data.workOrderId,
        lineItems: data.lineItems,
        totals,
        notes: data.notes,
        validUntil: data.validUntil || this.getDefaultValidUntil(),
        status: "pending_client_review",
        createdAt: new Date().toISOString(),
      }

      // Simulate API call to POST /api/quotes
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const quoteId = `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      return {
        success: true,
        quoteId,
        warnings: this.validateQuoteData(data),
      }
    } catch (error) {
      console.error("Quote creation error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create quote",
      }
    }
  }

  static calculateQuoteTotals(lineItems: EnhancedLineItem[]) {
    const activeItems = lineItems.filter((item) => !item.deleted)

    return activeItems.reduce(
      (totals, item) => {
        const itemCalculation = calculateLineItemTotal({
          quantity: item.quantity,
          basePrice: item.unitPrice,
          laborHours: item.laborHours,
          laborRate: item.laborRate,
          materialCost: item.materialCost,
          markup: item.markup,
        })

        return {
          subtotal: totals.subtotal + itemCalculation.subtotal,
          totalLabor: totals.totalLabor + itemCalculation.laborCost,
          totalMaterials: totals.totalMaterials + itemCalculation.materialCost,
          totalMarkup: totals.totalMarkup + itemCalculation.markupAmount,
          total: totals.total + itemCalculation.total,
        }
      },
      {
        subtotal: 0,
        totalLabor: 0,
        totalMaterials: 0,
        totalMarkup: 0,
        total: 0,
      },
    )
  }

  static validateQuoteData(data: QuoteCreationData): string[] {
    const warnings: string[] = []

    // Check for missing client
    if (!data.clientId) {
      warnings.push("No client assigned - quote will need client assignment before submission")
    }

    // Check for zero-cost items
    const zeroCostItems = data.lineItems.filter((item) => item.total === 0)
    if (zeroCostItems.length > 0) {
      warnings.push(`${zeroCostItems.length} line items have zero cost`)
    }

    // Check for missing labor rates
    const missingLaborItems = data.lineItems.filter((item) => item.laborHours && !item.laborRate)
    if (missingLaborItems.length > 0) {
      warnings.push(`${missingLaborItems.length} items have labor hours but no labor rate`)
    }

    return warnings
  }

  static getDefaultValidUntil(): string {
    const date = new Date()
    date.setDate(date.getDate() + 30) // 30 days from now
    return date.toISOString()
  }

  // Convert extracted PDF items to EnhancedLineItems
  static convertPdfItemsToEnhanced(
    pdfItems: Array<{ description: string; quantity: number }>,
    laborRates: LaborRates,
  ): EnhancedLineItem[] {
    return pdfItems.map((item, index) => ({
      id: `pdf-item-${Date.now()}-${index}`,
      description: item.description,
      quantity: item.quantity,
      unit: "each",
      unitPrice: 0, // Will be filled by template matching or manual entry
      total: 0,
      laborHours: 0,
      laborRate: laborRates.global,
      laborCost: 0,
      materialCost: 0,
      materialTotal: 0,
      markup: 0,
      markupAmount: 0,
      subtotal: 0,
      deleted: false,
      note: "",
      extractionConfidence: 0.8, // Mock confidence score
    }))
  }
}
