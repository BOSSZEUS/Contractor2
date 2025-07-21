import { NextResponse } from "next/server"
import { getQuote, updateQuoteStatus, createProjectFromQuote } from "@/lib/firebase-services"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const quoteId = params.id
    if (!quoteId) {
      return NextResponse.json({ error: "Quote ID is required." }, { status: 400 })
    }

    const quote = await getQuote(quoteId)
    if (!quote) {
      return NextResponse.json({ error: "Quote not found." }, { status: 404 })
    }

    if (quote.status === "accepted") {
      return NextResponse.json(
        { message: "Quote has already been accepted.", projectId: quote.projectId },
        { status: 200 },
      )
    }

    await updateQuoteStatus(quoteId, "accepted")
    const projectId = await createProjectFromQuote(quote)

    const quoteDocRef = doc(db, "quotes", quoteId)
    await updateDoc(quoteDocRef, { projectId })

    return NextResponse.json({ success: true, message: "Quote accepted and project created.", projectId })
  } catch (error) {
    console.error("Error accepting quote:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: `Failed to accept quote: ${error.message}` }, { status: 500 })
    }
    return NextResponse.json({ error: "An unknown error occurred while accepting the quote." }, { status: 500 })
  }
}
