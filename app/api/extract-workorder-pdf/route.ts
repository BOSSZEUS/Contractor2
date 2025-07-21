import { type NextRequest, NextResponse } from "next/server"

interface ExtractedItem {
  description: string
  quantity: number
  confidence: number // How confident we are in the extraction
  suggestedTemplateId?: string // Suggested template match
}

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Check if the file is a PDF
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 })
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 })
    }

    // Convert the file to an array buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // In a real implementation, you would send this buffer to an AI service
    // For now, we'll simulate the AI extraction with a delay

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate extracted line items with confidence scores and template suggestions
    const extractedLineItems = simulateEnhancedExtraction(file.name)

    return NextResponse.json({
      success: true,
      lineItems: extractedLineItems,
      processingInfo: {
        fileName: file.name,
        fileSize: file.size,
        extractedItemCount: extractedLineItems.length,
        averageConfidence:
          extractedLineItems.reduce((sum, item) => sum + item.confidence, 0) / extractedLineItems.length,
      },
    })
  } catch (error) {
    console.error("Error processing PDF:", error)
    return NextResponse.json(
      {
        error: "Failed to process PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Enhanced simulation with confidence scores and template matching
function simulateEnhancedExtraction(filename: string): ExtractedItem[] {
  const baseItems = [
    {
      description: "Wall repair and painting",
      quantity: 1,
      confidence: 0.95,
      suggestedTemplateId: "tpl1",
    },
    {
      description: "Electrical outlet installation",
      quantity: 3,
      confidence: 0.88,
      suggestedTemplateId: "tpl3",
    },
    {
      description: "Plumbing fixture replacement",
      quantity: 2,
      confidence: 0.92,
      suggestedTemplateId: "tpl2",
    },
    {
      description: "Floor tile installation",
      quantity: 1,
      confidence: 0.85,
      suggestedTemplateId: "tpl4",
    },
    {
      description: "Custom carpentry work",
      quantity: 1,
      confidence: 0.65, // Lower confidence, no template match
    },
  ]

  // Add some randomness based on the filename
  const hash = filename.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  // Use the hash to determine how many items to return
  const count = Math.abs(hash % 4) + 2 // 2-5 items

  return baseItems.slice(0, count)
}
