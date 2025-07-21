import type { LaborRates } from "@/components/labor-rate-manager"
import type { LineItemTemplate } from "@/types/templates"
import type { EnhancedLineItem } from "@/types/enhanced-quotes"
import { createEnhancedLineItem } from "@/lib/quote-calculations"

interface ExtractedItem {
  description: string
  quantity: number
  confidence: number
  suggestedTemplateId?: string
}

interface QuoteGenerationResult {
  success: boolean
  quoteId?: string
  enhancedLineItems?: EnhancedLineItem[]
  unmatchedItems?: ExtractedItem[]
  warnings?: string[]
  totalLabor?: number
  totalMaterials?: number
  totalMarkup?: number
  subtotal?: number
  total?: number
  error?: string
}

// Mock templates - in real app this would come from database
const mockTemplates: LineItemTemplate[] = [
  {
    id: "tpl1",
    name: "Wall Repair and Painting",
    description: "Wall repair and painting",
    category: "general",
    unit: "room",
    basePrice: 450,
    laborHours: 6,
    materialCost: 85,
    markup: 0.25,
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-06-01",
  },
  {
    id: "tpl2",
    name: "Plumbing Fixture Replacement",
    description: "Plumbing fixture replacement",
    category: "plumbing",
    unit: "each",
    basePrice: 275,
    laborHours: 3,
    materialCost: 125,
    markup: 0.3,
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-06-01",
  },
  {
    id: "tpl3",
    name: "Electrical Outlet Installation",
    description: "Electrical outlet installation",
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
    name: "Floor Tile Installation",
    description: "Floor tile installation",
    category: "flooring",
    unit: "sq ft",
    basePrice: 12,
    laborHours: 0.25,
    materialCost: 8,
    markup: 0.35,
    isActive: true,
    createdAt: "2023-01-01",
    updatedAt: "2023-06-01",
  },
]

export async function generateQuoteFromExtractedItems(
  extractedItems: ExtractedItem[],
  contractorId: string,
  clientId?: string,
  laborRates?: LaborRates,
): Promise<QuoteGenerationResult> {
  try {
    if (!extractedItems || extractedItems.length === 0) {
      return {
        success: false,
        error: "No extracted items provided",
      }
    }

    // Default labor rates if not provided
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

    const rates = laborRates || defaultLaborRates
    const enhancedLineItems: EnhancedLineItem[] = []
    const unmatchedItems: ExtractedItem[] = []
    const warnings: string[] = []

    // Process each extracted item
    for (const item of extractedItems) {
      let template: LineItemTemplate | undefined

      // Try to find template by suggested ID first
      if (item.suggestedTemplateId) {
        template = mockTemplates.find((t) => t.id === item.suggestedTemplateId && t.isActive)
      }

      // If no template found by ID, try fuzzy matching by description
      if (!template) {
        template = findBestTemplateMatch(item.description, mockTemplates)
      }

      if (template) {
        // Create enhanced line item from template
        const enhancedItem = createEnhancedLineItem(template, item.quantity, rates)

        // Add extraction metadata
        enhancedItem.extractionConfidence = item.confidence
        enhancedItem.originalDescription = item.description

        enhancedLineItems.push(enhancedItem)

        // Add warning for low confidence matches
        if (item.confidence < 0.8) {
          warnings.push(`Low confidence match for "${item.description}" - please review pricing`)
        }
      } else {
        // No template match found
        unmatchedItems.push(item)
        warnings.push(`No template found for "${item.description}" - manual pricing required`)
      }
    }

    // Calculate totals
    const totalLabor = enhancedLineItems.reduce((sum, item) => sum + item.laborCost, 0)
    const totalMaterials = enhancedLineItems.reduce((sum, item) => sum + item.materialTotal, 0)
    const totalMarkup = enhancedLineItems.reduce((sum, item) => sum + item.markupAmount, 0)
    const subtotal = enhancedLineItems.reduce((sum, item) => sum + item.subtotal, 0)
    const total = enhancedLineItems.reduce((sum, item) => sum + item.total, 0)

    // Generate quote ID
    const quoteId = `q${Date.now()}-${Math.floor(Math.random() * 1000)}`

    return {
      success: true,
      quoteId,
      enhancedLineItems,
      unmatchedItems,
      warnings,
      totalLabor,
      totalMaterials,
      totalMarkup,
      subtotal,
      total,
    }
  } catch (error) {
    console.error("Error generating quote from extracted items:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Simple fuzzy matching for template descriptions
function findBestTemplateMatch(description: string, templates: LineItemTemplate[]): LineItemTemplate | undefined {
  const normalizedDesc = description.toLowerCase().trim()

  // First try exact matches
  let bestMatch = templates.find(
    (t) => t.description.toLowerCase().includes(normalizedDesc) || normalizedDesc.includes(t.description.toLowerCase()),
  )

  if (bestMatch) return bestMatch

  // Try keyword matching
  const keywords = normalizedDesc.split(/\s+/)
  let bestScore = 0

  for (const template of templates) {
    if (!template.isActive) continue

    const templateWords = template.description.toLowerCase().split(/\s+/)
    let score = 0

    for (const keyword of keywords) {
      if (templateWords.some((word) => word.includes(keyword) || keyword.includes(word))) {
        score++
      }
    }

    if (score > bestScore && score >= keywords.length * 0.5) {
      // At least 50% keyword match
      bestScore = score
      bestMatch = template
    }
  }

  return bestMatch
}
