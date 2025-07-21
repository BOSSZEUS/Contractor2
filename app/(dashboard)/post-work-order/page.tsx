"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Trash2, Plus, FileText, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAppState } from "@/contexts/app-state-context"
import { useRouter } from "next/navigation"

interface LineItem {
  id: string
  description: string
  quantity: number
}

export default function PostWorkOrderClient() {
  const router = useRouter()
  const { state } = useAppState()

  const [propertyAddress, setPropertyAddress] = useState("")
  const [title, setTitle] = useState("")
  const [urgency, setUrgency] = useState("")
  const [startDate, setStartDate] = useState<Date>()
  const [lineItems, setLineItems] = useState<LineItem[]>([{ id: "1", description: "", quantity: 1 }])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractionError, setExtractionError] = useState<string | null>(null)
  const [extractionSuccess, setExtractionSuccess] = useState(false)
  const { toast } = useToast()

  if (state.userRole !== "client") {
    router.push("/dashboard")
    return null
  }

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
    }
    setLineItems([...lineItems, newItem])
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id))
    }
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setPdfFile(file)
    setIsExtracting(true)
    setExtractionError(null)
    setExtractionSuccess(false)

    const formData = new FormData()
    formData.append("file", file)

    try {
      // Call the API to extract line items from the PDF
      const response = await fetch("/api/extract-workorder-pdf", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to extract data from PDF")
      }

      const data = await response.json()

      if (data.lineItems && data.lineItems.length > 0) {
        // Update the line items with the extracted data
        setLineItems(
          data.lineItems.map((item: { description: string; quantity: number }, index: number) => ({
            id: (Date.now() + index).toString(),
            description: item.description,
            quantity: item.quantity || 1,
          })),
        )
        setExtractionSuccess(true)
        toast({
          title: "PDF Processed Successfully",
          description: `${data.lineItems.length} tasks extracted from your document.`,
        })
      } else {
        throw new Error("No tasks found in the document")
      }
    } catch (error) {
      console.error("Error extracting data from PDF:", error)
      setExtractionError("We couldn't read this work order. Please enter line items manually.")
      toast({
        title: "Extraction Failed",
        description: "We couldn't read this work order. Please enter line items manually.",
        variant: "destructive",
      })
    } finally {
      setIsExtracting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!propertyAddress || !title || !urgency || !startDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const validLineItems = lineItems.filter((item) => item.description.trim())
    if (validLineItems.length === 0) {
      toast({
        title: "No Tasks",
        description: "Please add at least one task description.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        property_address: propertyAddress,
        title: title,
        urgency: urgency,
        start_date: startDate.toISOString().split("T")[0],
        line_items: validLineItems.map((item) => ({
          description: item.description,
          quantity: item.quantity,
        })),
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Work Order Submitted",
        description: "Your work order has been submitted successfully. You'll receive a quote soon.",
      })

      // Reset form
      setPropertyAddress("")
      setTitle("")
      setUrgency("")
      setStartDate(undefined)
      setLineItems([{ id: "1", description: "", quantity: 1 }])
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your work order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Post Work Order</h1>
        <p className="text-muted-foreground">Submit a new work order with detailed task breakdown</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PDF Upload Section */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Upload Work Order PDF</CardTitle>
            <CardDescription>Upload a PDF to automatically extract tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="pdf-upload">Work Order PDF</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="pdf-upload"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      disabled={isExtracting}
                      className="flex-1"
                    />
                    {pdfFile && !isExtracting && !extractionError && (
                      <Button variant="outline" size="icon" disabled>
                        <FileText className="h-4 w-4 text-green-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {isExtracting && (
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Extracting tasks from your document...</span>
                </div>
              )}

              {extractionError && <div className="text-destructive text-sm">{extractionError}</div>}

              {extractionSuccess && (
                <div className="text-green-500 text-sm">Tasks successfully extracted and added to the form below.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Header Section */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Work Order Details</CardTitle>
            <CardDescription>Provide basic information about your work order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="property-address">Property Address *</Label>
                <Input
                  id="property-address"
                  placeholder="123 Main St, City, State"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Work Order Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Bathroom Renovation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Urgency Level *</Label>
                <Select value={urgency} onValueChange={setUrgency} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Normal">Normal</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preferred Start Date *</Label>
                <DatePicker date={startDate} setDate={setStartDate} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Item Builder */}
        <Card className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>Task Breakdown</CardTitle>
            <CardDescription>Add detailed tasks for this work order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {lineItems.map((item, index) => (
              <div key={item.id} className="flex gap-4 items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor={`task-${item.id}`}>Task Description {index + 1}</Label>
                  <Input
                    id={`task-${item.id}`}
                    placeholder="Describe the task to be completed"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                  />
                </div>
                <div className="w-24 space-y-2">
                  <Label htmlFor={`quantity-${item.id}`}>Quantity</Label>
                  <Input
                    id={`quantity-${item.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeLineItem(item.id)}
                  disabled={lineItems.length === 1}
                  className="mb-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addLineItem} className="w-full bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add Another Task
            </Button>
          </CardContent>
        </Card>

        {/* Submission Section */}
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6">
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Work Order"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
