import type { LineItemTemplate } from "@/types/templates"
import type { LaborRates } from "@/components/labor-rate-manager"
import { createEnhancedLineItem } from "@/lib/quote-calculations"
import type { EnhancedLineItem } from "@/types/enhanced-quotes"

interface ExtractedLineItem {
  description: string
  quantity: number
}

interface TemplateMatch {
  template: LineItemTemplate
  confidence: number
}

export function matchLineItemWithTemplate(
  extractedItem: ExtractedLineItem,
  templates: LineItemTemplate[],
): TemplateMatch | null {
  if (templates.length === 0) return null

  const itemDescription = extractedItem.description.toLowerCase()

  // Simple keyword matching - in production, this could use fuzzy matching or ML
  const matches = templates.map((template) => {
    const templateName = template.name.toLowerCase()
    const templateDesc = template.description.toLowerCase()

    let confidence = 0

    // Exact name match
    if (templateName === itemDescription) {
      confidence = 1.0
    }
    // Partial name match
    else if (itemDescription.includes(templateName) || templateName.includes(itemDescription)) {
      confidence = 0.8
    }
    // Description match
    else if (templateDesc.includes(itemDescription) || itemDescription.includes(templateDesc)) {
      confidence = 0.6
    }
    // Keyword matching
    else {
      const itemWords = itemDescription.split(" ")
      const templateWords = [...templateName.split(" "), ...templateDesc.split(" ")]
      const matchingWords = itemWords.filter(
        (word) => word.length > 3 && templateWords.some((tWord) => tWord.includes(word)),
      )
      confidence = (matchingWords.length / Math.max(itemWords.length, 1)) * 0.4
    }

    return { template, confidence }
  })

  // Return best match if confidence is above threshold
  const bestMatch = matches.reduce((best, current) => (current.confidence > best.confidence ? current : best))

  return bestMatch.confidence > 0.3 ? bestMatch : null
}

export function generateEnhancedQuoteFromPDF(
  extractedItems: ExtractedLineItem[],
  templates: LineItemTemplate[],
  laborRates: LaborRates,
  contractorId: string,
  clientId?: string,
): {
  lineItems: EnhancedLineItem[]
  unmatchedItems: ExtractedLineItem[]
  totalLabor: number
  totalMaterials: number
  totalMarkup: number
  subtotal: number
  total: number
} {
  const enhancedLineItems: EnhancedLineItem[] = []
  const unmatchedItems: ExtractedLineItem[] = []

  for (const extractedItem of extractedItems) {
    const match = matchLineItemWithTemplate(extractedItem, templates)

    if (match) {
      const enhancedItem = createEnhancedLineItem(match.template, extractedItem.quantity, laborRates)

      // Override description with extracted description if different
      enhancedItem.description = extractedItem.description
      enhancedLineItems.push(enhancedItem)
    } else {
      // Create a basic line item for unmatched items
      const basicItem: EnhancedLineItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        description: extractedItem.description,
        quantity: extractedItem.quantity,
        unit: "each",
        laborCost: 0,
        materialTotal: 0,
        subtotal: 100 * extractedItem.quantity, // Default pricing
        markupAmount: 0,
        total: 100 * extractedItem.quantity,
        unitPrice: 100,
        deleted: false,
        note: "No template match found - please review pricing",
      }

      enhancedLineItems.push(basicItem)
      unmatchedItems.push(extractedItem)
    }
  }

  // Calculate totals
  const totalLabor = enhancedLineItems.reduce((sum, item) => sum + item.laborCost, 0)
  const totalMaterials = enhancedLineItems.reduce((sum, item) => sum + item.materialTotal, 0)
  const totalMarkup = enhancedLineItems.reduce((sum, item) => sum + item.markupAmount, 0)
  const subtotal = enhancedLineItems.reduce((sum, item) => sum + item.subtotal, 0)
  const total = enhancedLineItems.reduce((sum, item) => sum + item.total, 0)

  return {
    lineItems: enhancedLineItems,
    unmatchedItems,
    totalLabor,
    totalMaterials,
    totalMarkup,
    subtotal,
    total,
  }
}
