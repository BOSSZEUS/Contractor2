"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function NewInvoicePage() {
  const router = useRouter()
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date(new Date().setDate(new Date().getDate() + 14)))
  const [items, setItems] = useState([{ id: 1, description: "", quantity: 1, rate: 0, amount: 0 }])

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1
    setItems([...items, { id: newId, description: "", quantity: 1, rate: 0, amount: 0 }])
  }

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Recalculate amount if quantity or rate changes
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.rate)
          }

          return updatedItem
        }
        return item
      }),
    )
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + Number(item.amount), 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/contractor/payments")}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back to Payments</span>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
            <CardDescription>Enter the basic details for this invoice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah">Sarah Johnson</SelectItem>
                  <SelectItem value="michael">Michael Smith</SelectItem>
                  <SelectItem value="emily">Emily Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select>
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kitchen">Kitchen Renovation</SelectItem>
                  <SelectItem value="bathroom">Bathroom Remodel</SelectItem>
                  <SelectItem value="deck">Deck Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-number">Invoice Number</Label>
                <Input id="invoice-number" defaultValue="INV-2023-007" />
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <DatePicker date={dueDate} setDate={setDueDate} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Options</CardTitle>
            <CardDescription>Configure payment methods and terms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-terms">Payment Terms</Label>
              <Select defaultValue="14">
                <SelectTrigger id="payment-terms">
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="due">Due on receipt</SelectItem>
                  <SelectItem value="7">Net 7</SelectItem>
                  <SelectItem value="14">Net 14</SelectItem>
                  <SelectItem value="30">Net 30</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes to Client</Label>
              <Textarea id="notes" placeholder="Enter any notes or payment instructions..." className="min-h-[100px]" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Allow Online Payment</Label>
                <p className="text-sm text-muted-foreground">Let clients pay this invoice online</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Invoice Items</CardTitle>
              <CardDescription>Add the items you're invoicing for</CardDescription>
            </div>
            <Button onClick={addItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50%]">Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, "description", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          className="pl-6"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>${item.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove item</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-end">
            <div className="w-[200px] space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Subtotal:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Tax (0%):</span>
                <span>$0.00</span>
              </div>
              <div className="flex items-center justify-between font-medium">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/contractor/payments")}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">Save as Draft</Button>
            <Button onClick={() => router.push("/contractor/payments")}>Create Invoice</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
