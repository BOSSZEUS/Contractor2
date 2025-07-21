"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, CreditCard, Building, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BillingPage() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/account")}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back to Account</span>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Payment Methods</h1>
      </div>

      <Tabs defaultValue="payment-methods">
        <TabsList>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="billing-address">Billing Address</TabsTrigger>
        </TabsList>

        <TabsContent value="payment-methods" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-md bg-muted p-2">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 12/24</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Default</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <CreditCard className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add New Payment Method</CardTitle>
              <CardDescription>Add a new credit card or debit card</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" placeholder="1234 5678 9012 3456" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name on Card</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Add Payment Method</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="billing-address" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
              <CardDescription>Manage your billing address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-md bg-muted p-2">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-muted-foreground">123 Main St</p>
                      <p className="text-sm text-muted-foreground">Anytown, CA 12345</p>
                      <p className="text-sm text-muted-foreground">United States</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Default</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <Building className="h-4 w-4 mr-2" />
                Add Billing Address
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add New Billing Address</CardTitle>
              <CardDescription>Add a new billing address</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" placeholder="John Doe" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company (Optional)</Label>
                <Input id="company" placeholder="Acme Inc." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address-line-1">Address Line 1</Label>
                <Input id="address-line-1" placeholder="123 Main St" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address-line-2">Address Line 2 (Optional)</Label>
                <Input id="address-line-2" placeholder="Apt 4B" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="Anytown" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State / Province</Label>
                  <Input id="state" placeholder="CA" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postal-code">Postal Code</Label>
                  <Input id="postal-code" placeholder="12345" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" placeholder="United States" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Save Billing Address</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
