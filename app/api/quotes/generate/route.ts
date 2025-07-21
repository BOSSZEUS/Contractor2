import { NextResponse } from "next/server"
import { getContractorPricing, saveGeneratedQuote, getQuote } from "@/lib/firebase-services"
import { createEnhancedLineItem } from "@/lib/quote-calculations"
import type { Quote, EnhancedLineItem } from "@/types/enhanced-quotes"

export async function POST(request: Request) {
  try {
    const { contractorId, clientId, clientName, projectName, lineItems } = await request.json()

    if (!contractorId || !lineItems || !Array.isArray(lineItems)) {
      return NextResponse.json(
        { error: "Missing required fields: contractorId and lineItems are required." },
        { status: 400 },
      )
    }

    const pricingData = await getContractorPricing(contractorId)
    if (!pricingData) {
      return NextResponse.json({ error: "Could not find pricing information for the contractor." }, { status: 404 })
    }

    const enhancedLineItems: EnhancedLineItem[] = lineItems.map((item: any) => {
      const mockTemplate = {
        id: `template-${Math.random()}`,
        name: item.description,
        description: item.description,
        category: "general" as const,
        unit: "each",
        basePrice: Math.floor(Math.random() * 200) + 50,
        laborHours: Math.floor(Math.random() * 8) + 1,
        materialCost: Math.floor(Math.random() * 100) + 25,
        markup: 15,
        isActive: true,
      }
      return createEnhancedLineItem(mockTemplate, item.quantity, pricingData.labor_rates)
    })

    const totalLabor = enhancedLineItems.reduce((sum, item) => sum + item.laborCost, 0)
    const totalMaterials = enhancedLineItems.reduce((sum, item) => sum + item.materialTotal, 0)
    const totalMarkup = enhancedLineItems.reduce((sum, item) => sum + item.markupAmount, 0)
    const subtotal = enhancedLineItems.reduce((sum, item) => sum + item.subtotal, 0)
    const total = enhancedLineItems.reduce((sum, item) => sum + item.total, 0)

    const newQuoteData: Omit<Quote, "id" | "createdAt" | "updatedAt"> = {
      contractorId,
      clientId,
      clientName,
      projectName,
      lineItems: enhancedLineItems,
      totalLabor,
      totalMaterials,
      totalMarkup,
      subtotal,
      total,
      status: "pending_client_review",
    }

    const quoteId = await saveGeneratedQuote(newQuoteData)
    const savedQuote = await getQuote(quoteId)

    return NextResponse.json(savedQuote)
  } catch (error) {
    console.error("Error generating quote:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: `Failed to generate quote: ${error.message}` }, { status: 500 })
    }
    return NextResponse.json({ error: "An unknown error occurred while generating the quote." }, { status: 500 })
  }
}
