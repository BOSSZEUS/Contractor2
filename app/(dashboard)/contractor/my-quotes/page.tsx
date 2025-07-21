"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, FileText, Upload, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TemplateSelector } from "@/components/template-selector"
import { QuoteService } from "@/utils/quotes"
import type { EnhancedLineItem } from "@/types/enhanced-quotes"
import type { LaborRates } from "@/components/labor-rate-manager"
import { UnmatchedItemsHandler } from "@/components/unmatched-items-handler"
import { useAuth } from "@/contexts/auth-context"
import { getQuotesForUser, getClientsForContractor } from "@/lib/firebase-services"
import { useAppState } from "@/contexts/app-state-context"

interface LineItem {
  id: string
  description: string
  quantity: number
  unit: string
  unitPrice: number
  total: number
}

export default function ContractorQuotes() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, userProfile } = useAuth()
  const { state } = useAppState()
  const { userRole: currentRole } = state

  const [isUploading, setIsUploading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedClient, setSelectedClient] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [extractedItems, setExtractedItems] = useState<Array<{ description: string; quantity: number }>>([])
  const [enhancedLineItems, setEnhancedLineItems] = useState<EnhancedLineItem[]>([])
  const [laborRates, setLaborRates] = useState<LaborRates>({
    global: 75,
    categories: {
      general: 65,
      plumbing: 85,
      electrical: 90,
      flooring: 70,
      roofing: 80,
      hvac: 95,
    },
  })
  const [quoteWarnings, setQuoteWarnings] = useState<string[]>([])
  const [unmatchedItems, setUnmatchedItems] = useState<any[]>([])

  // Data from Firestore
  const [quotes, setQuotes] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Manual quote creation state
  const [manualLineItems, setManualLineItems] = useState<LineItem[]>([])
  const [newLineItem, setNewLineItem] = useState({
    description: "",
    quantity: 1,
    unit: "each",
    unitPrice: 0,
  })

  useEffect(() => {
    if (!user || !userProfile) return

    if (currentRole !== "contractor") {
      router.push("/dashboard")
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch quotes and clients in parallel
        const [quotesData, clientsData] = await Promise.all([
          getQuotesForUser(user.uid, "contractor"),
          getClientsForContractor(user.uid),
        ])

        if (quotesData.length === 0) {
          // Add mock data for testing
          const mockQuotes = [
            {
              id: "mock-quote-1",
              projectName: "Garage Door Installation",
              clientName: "Jane Smith",
              status: "pending_client_review",
              total: 2500,
              lineItems: [
                {
                  description: "Garage Door - 16x7 Insulated Steel",
                  quantity: 1,
                  unitPrice: 800,
                  total: 800,
                },
                {
                  description: "Installation Labor",
                  quantity: 6,
                  unitPrice: 75,
                  total: 450,
                },
              ],
              createdAt: { toDate: () => new Date("2024-01-12") },
            },
            {
              id: "mock-quote-2",
              projectName: "Deck Staining",
              clientName: "Bob Wilson",
              status: "accepted",
              total: 1800,
              lineItems: [
                {
                  description: "Deck Cleaning and Prep",
                  quantity: 1,
                  unitPrice: 400,
                  total: 400,
                },
                {
                  description: "Premium Deck Stain Application",
                  quantity: 1,
                  unitPrice: 1400,
                  total: 1400,
                },
              ],
              createdAt: { toDate: () => new Date("2024-01-08") },
            },
          ]

          setQuotes(mockQuotes)
        } else {
          setQuotes(quotesData)
        }

        if (clientsData.length === 0) {
          // Add mock clients
          const mockClients = [
            {
              id: "mock-client-1",
              firstName: "Alice",
              lastName: "Johnson",
              name: "Alice Johnson",
              email: "alice@example.com",
              phone: "(555) 123-4567",
            },
            {
              id: "mock-client-2",
              firstName: "Bob",
              lastName: "Wilson",
              name: "Bob Wilson",
              email: "bob@example.com",
              phone: "(555) 987-6543",
            },
          ]

          setClients(mockClients)
        } else {
          setClients(clientsData)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load your data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, userProfile, currentRole, router, toast])

  if (!user || !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (currentRole !== "contractor") {
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleExtractAndGenerate = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a PDF file to upload",
        variant: "destructive",
      })
      return
    }

    try {
      // Step 1: Extract line items from PDF
      setIsUploading(true)
      const formData = new FormData()
      formData.append("file", selectedFile)

      const extractResponse = await fetch("/api/extract-workorder-pdf", {
        method: "POST",
        body: formData,
      })

      if (!extractResponse.ok) {
        const errorData = await extractResponse.json()
        throw new Error(errorData.error || "Failed to extract PDF content")
      }

      const extractData = await extractResponse.json()
      setExtractedItems(extractData.lineItems)
      setIsUploading(false)

      // Step 2: Convert to enhanced line items
      const enhancedItems = QuoteService.convertPdfItemsToEnhanced(extractData.lineItems, laborRates)
      setEnhancedLineItems(enhancedItems)

      // Step 3: Generate quote using shared service
      setIsGenerating(true)

      const quoteResult = await QuoteService.createQuote({
        contractorId: user.uid,
        clientId: selectedClient || undefined,
        lineItems: enhancedItems,
      })

      setIsGenerating(false)

      if (!quoteResult.success) {
        throw new Error(quoteResult.error || "Failed to generate quote")
      }

      // Handle warnings
      if (quoteResult.warnings && quoteResult.warnings.length > 0) {
        setQuoteWarnings(quoteResult.warnings)
      }

      // Show success message
      toast({
        title: "Quote generated successfully",
        description: quoteResult.warnings?.length
          ? `Generated with ${quoteResult.warnings.length} warnings - please review`
          : "Redirecting to quote approval page",
      })

      if (!selectedClient) {
        toast({
          title: "Quote created without assigned client",
          description: "You can assign a client during final approval.",
        })
      }

      // Redirect to quote approval page
      router.push(`/contractor/quote-approval/${quoteResult.quoteId}`)
    } catch (error) {
      setIsUploading(false)
      setIsGenerating(false)

      console.error("Quote generation error:", error)

      toast({
        title: "Error processing quote",
        description: error instanceof Error ? error.message : "Please try again or contact support.",
        variant: "destructive",
      })
    }
  }

  // Handle template selection
  const handleTemplateAdd = (enhancedLineItem: EnhancedLineItem) => {
    setEnhancedLineItems((prev) => [...prev, enhancedLineItem])

    toast({
      title: "Template added",
      description: `${enhancedLineItem.description} has been added to your quote`,
    })
  }

  const handleUnmatchedItemsConverted = (convertedItems: EnhancedLineItem[]) => {
    setEnhancedLineItems((prev) => [...prev, ...convertedItems])
    setUnmatchedItems([]) // Clear unmatched items
    setQuoteWarnings([]) // Clear warnings

    toast({
      title: "Items added to quote",
      description: `${convertedItems.length} items have been manually priced and added to your quote`,
    })
  }

  // Handle manual line item addition
  const handleAddManualLineItem = () => {
    if (!newLineItem.description.trim()) {
      toast({
        title: "Description required",
        description: "Please enter a description for the line item",
        variant: "destructive",
      })
      return
    }

    // Create an enhanced line item instead of a basic line item
    const enhancedLineItem: EnhancedLineItem = {
      id: `item-${Date.now()}-${Math.random()}`,
      description: newLineItem.description,
      quantity: newLineItem.quantity,
      unit: newLineItem.unit,
      unitPrice: newLineItem.unitPrice,
      total: newLineItem.quantity * newLineItem.unitPrice,
      laborHours: 0,
      laborRate: 0,
      laborCost: 0,
      materialCost: 0,
      materialTotal: 0,
      markup: 0,
      markupAmount: 0,
      subtotal: newLineItem.quantity * newLineItem.unitPrice,
      deleted: false,
      note: "",
    }

    // Add to enhanced line items instead of manual line items
    setEnhancedLineItems((prev) => [...prev, enhancedLineItem])

    setNewLineItem({
      description: "",
      quantity: 1,
      unit: "each",
      unitPrice: 0,
    })

    toast({
      title: "Line item added",
      description: "Custom line item has been added to your quote",
    })
  }

  // Handle line item removal
  const handleRemoveLineItem = (id: string) => {
    setManualLineItems((prev) => prev.filter((item) => item.id !== id))
  }

  // Calculate total for manual quote
  const manualQuoteTotal = manualLineItems.reduce((sum, item) => sum + item.total, 0)

  // Calculate total for enhanced quote
  const enhancedQuoteTotal = enhancedLineItems.reduce((sum, item) => sum + item.total, 0)

  // Handle enhanced quote generation
  const handleGenerateEnhancedQuote = async () => {
    if (enhancedLineItems.length === 0) {
      toast({
        title: "No line items",
        description: "Please add at least one line item to generate a quote",
        variant: "destructive",
      })
      return
    }

    try {
      setIsGenerating(true)

      const quoteResult = await QuoteService.createQuote({
        contractorId: user.uid,
        clientId: selectedClient || undefined,
        lineItems: enhancedLineItems,
      })

      setIsGenerating(false)

      if (!quoteResult.success) {
        throw new Error(quoteResult.error || "Failed to generate quote")
      }

      toast({
        title: "Quote generated successfully",
        description: "Redirecting to quote approval page",
      })

      // Redirect to quote approval page
      router.push(`/contractor/quote-approval/${quoteResult.quoteId}`)
    } catch (error) {
      setIsGenerating(false)
      console.error("Quote generation error:", error)

      toast({
        title: "Error generating quote",
        description: error instanceof Error ? error.message : "Please try again or contact support.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_client_review":
        return "bg-yellow-100 text-yellow-800"
      case "client_edited":
        return "bg-blue-100 text-blue-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending_client_review":
        return "Pending Review"
      case "client_edited":
        return "Changes Requested"
      case "accepted":
        return "Accepted"
      case "rejected":
        return "Rejected"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading quotes...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Quotes</h2>
        <Button onClick={() => router.push("/contractor/pricing")}>Manage Pricing</Button>
      </div>

      {/* Quote Creation Tabs */}
      <Tabs defaultValue="pdf-upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pdf-upload">PDF Upload</TabsTrigger>
          <TabsTrigger value="manual-entry">Manual Entry</TabsTrigger>
        </TabsList>

        {/* PDF Upload Tab */}
        <TabsContent value="pdf-upload">
          <Card>
            <CardHeader>
              <CardTitle>Create Quote from Uploaded PDF</CardTitle>
              <CardDescription>
                Upload a work order PDF to automatically extract line items and generate a quote
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Select Client (Optional)</Label>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Optional — select a known client or leave blank" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name || `${client.firstName} ${client.lastName}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdf-upload">Upload Work Order PDF</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={isUploading || isGenerating}
                    className="flex-1"
                  />
                  {selectedFile && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      {selectedFile.name}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleExtractAndGenerate}
                disabled={!selectedFile || isUploading || isGenerating}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Extracting from PDF...
                  </>
                ) : isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Quote...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Extract and Generate Quote
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Warnings and Unmatched Items Display */}
          {(quoteWarnings.length > 0 || unmatchedItems.length > 0) && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="text-yellow-800">Quote Generation Warnings</CardTitle>
                <CardDescription className="text-yellow-700">
                  Please review these items before finalizing your quote
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {quoteWarnings.length > 0 && (
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-2">Warnings:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                      {quoteWarnings.map((warning, index) => (
                        <li key={index}>{warning}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {unmatchedItems.length > 0 && (
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-2">Unmatched Items (Require Manual Pricing):</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                      {unmatchedItems.map((item, index) => (
                        <li key={index}>
                          {item.description} (Qty: {item.quantity}) - Confidence: {(item.confidence * 100).toFixed(0)}%
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Unmatched Items Handler */}
          {unmatchedItems.length > 0 && (
            <UnmatchedItemsHandler
              unmatchedItems={unmatchedItems}
              laborRates={laborRates}
              onItemsConverted={handleUnmatchedItemsConverted}
            />
          )}
        </TabsContent>

        {/* Manual Entry Tab */}
        <TabsContent value="manual-entry">
          <div className="space-y-6">
            {/* Template Selector */}
            <TemplateSelector onTemplateSelect={handleTemplateAdd} laborRates={laborRates} />

            {/* Manual Line Item Entry */}
            <Card>
              <CardHeader>
                <CardTitle>Add Custom Line Item</CardTitle>
                <CardDescription>Manually add line items not covered by your templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter line item description..."
                      value={newLineItem.description}
                      onChange={(e) => setNewLineItem((prev) => ({ ...prev, description: e.target.value }))}
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={newLineItem.quantity}
                      onChange={(e) => setNewLineItem((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={newLineItem.unit}
                      onValueChange={(value) => setNewLineItem((prev) => ({ ...prev, unit: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="each">Each</SelectItem>
                        <SelectItem value="sq ft">Sq Ft</SelectItem>
                        <SelectItem value="linear ft">Linear Ft</SelectItem>
                        <SelectItem value="hour">Hour</SelectItem>
                        <SelectItem value="day">Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="unit-price">Unit Price</Label>
                    <Input
                      id="unit-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newLineItem.unitPrice}
                      onChange={(e) => setNewLineItem((prev) => ({ ...prev, unitPrice: Number(e.target.value) }))}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddManualLineItem} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Line Item
                </Button>
              </CardFooter>
            </Card>

            {/* Enhanced Line Items Summary */}
            {enhancedLineItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Quote Line Items</CardTitle>
                  <CardDescription>Review and modify your quote items before generating</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {enhancedLineItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{item.description}</p>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>
                              {item.quantity} {item.unit} × ${item.unitPrice.toFixed(2)} = ${item.total.toFixed(2)}
                            </p>
                            <div className="flex gap-4">
                              {item.laborCost > 0 && <span>Labor: ${item.laborCost.toFixed(2)}</span>}
                              {item.materialTotal > 0 && <span>Materials: ${item.materialTotal.toFixed(2)}</span>}
                              {item.markupAmount > 0 && <span>Markup: ${item.markupAmount.toFixed(2)}</span>}
                            </div>
                            {item.extractionConfidence && (
                              <p className="text-xs">
                                Extraction confidence: {(item.extractionConfidence * 100).toFixed(0)}%
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEnhancedLineItems((prev) => prev.filter((i) => i.id !== item.id))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Labor Total:</span>
                        <span>${enhancedLineItems.reduce((sum, item) => sum + item.laborCost, 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Materials Total:</span>
                        <span>${enhancedLineItems.reduce((sum, item) => sum + item.materialTotal, 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Markup Total:</span>
                        <span>${enhancedLineItems.reduce((sum, item) => sum + item.markupAmount, 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span>Total:</span>
                        <span>${enhancedQuoteTotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={enhancedLineItems.length === 0 || isGenerating}
                    onClick={handleGenerateEnhancedQuote}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Quote...
                      </>
                    ) : (
                      "Generate Quote"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Existing Quotes */}
      <Tabs defaultValue="all">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Quotes</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Input placeholder="Search quotes..." className="w-[250px]" />
            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="highest">Highest Amount</SelectItem>
                <SelectItem value="lowest">Lowest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <TabsContent value="all" className="mt-4">
          <div className="grid gap-4">
            {quotes.map((quote) => (
              <Card key={quote.id} className="overflow-hidden">
                <CardHeader className="flex flex-row items-start justify-between p-4">
                  <div>
                    <CardTitle className="text-lg">{quote.projectName || "Untitled Quote"}</CardTitle>
                    <CardDescription>{quote.clientName || "No client assigned"}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(quote.status)}>{getStatusLabel(quote.status)}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {quote.createdAt?.toDate?.()?.toLocaleDateString() || "Unknown date"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex justify-between">
                    <span className="font-medium">Quote Amount:</span>
                    <span className="font-bold">${quote.total?.toLocaleString() || "0"}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 p-4 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/contractor/quote-approval/${quote.id}`)}
                  >
                    View Details
                  </Button>
                  {quote.status === "pending_client_review" && (
                    <Button size="sm" onClick={() => router.push(`/contractor/quote-approval/${quote.id}`)}>
                      Edit Quote
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <div className="grid gap-4">
            {quotes
              .filter((quote) => quote.status === "pending_client_review")
              .map((quote) => (
                <Card key={quote.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-start justify-between p-4">
                    <div>
                      <CardTitle className="text-lg">{quote.projectName || "Untitled Quote"}</CardTitle>
                      <CardDescription>{quote.clientName || "No client assigned"}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(quote.status)}>{getStatusLabel(quote.status)}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {quote.createdAt?.toDate?.()?.toLocaleDateString() || "Unknown date"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-between">
                      <span className="font-medium">Quote Amount:</span>
                      <span className="font-bold">${quote.total?.toLocaleString() || "0"}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 p-4 pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/contractor/quote-approval/${quote.id}`)}
                    >
                      View Details
                    </Button>
                    <Button size="sm" onClick={() => router.push(`/contractor/quote-approval/${quote.id}`)}>
                      Edit Quote
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="approved" className="mt-4">
          <div className="grid gap-4">
            {quotes
              .filter((quote) => quote.status === "accepted")
              .map((quote) => (
                <Card key={quote.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-start justify-between p-4">
                    <div>
                      <CardTitle className="text-lg">{quote.projectName || "Untitled Quote"}</CardTitle>
                      <CardDescription>{quote.clientName || "No client assigned"}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(quote.status)}>{getStatusLabel(quote.status)}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {quote.createdAt?.toDate?.()?.toLocaleDateString() || "Unknown date"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-between">
                      <span className="font-medium">Quote Amount:</span>
                      <span className="font-bold">${quote.total?.toLocaleString() || "0"}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 p-4 pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/contractor/quote-approval/${quote.id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="rejected" className="mt-4">
          <div className="grid gap-4">
            {quotes
              .filter((quote) => quote.status === "rejected")
              .map((quote) => (
                <Card key={quote.id} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-start justify-between p-4">
                    <div>
                      <CardTitle className="text-lg">{quote.projectName || "Untitled Quote"}</CardTitle>
                      <CardDescription>{quote.clientName || "No client assigned"}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(quote.status)}>{getStatusLabel(quote.status)}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {quote.createdAt?.toDate?.()?.toLocaleDateString() || "Unknown date"}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-between">
                      <span className="font-medium">Quote Amount:</span>
                      <span className="font-bold">${quote.total?.toLocaleString() || "0"}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2 p-4 pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/contractor/quote-approval/${quote.id}`)}
                    >
                      View Details
                    </Button>
                    <Button size="sm">Create New Quote</Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
