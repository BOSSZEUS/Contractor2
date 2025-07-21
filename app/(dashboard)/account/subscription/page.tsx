"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { PlanBadge } from "@/components/plan-badge"
import { ChevronLeft, CreditCard, CheckCircle, AlertCircle, Calendar, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock user data - in a real app, this would come from auth context
const currentUser = {
  plan: "regular" as "free" | "regular" | "pro",
  billingCycle: "monthly" as "monthly" | "annual",
  nextBillingDate: "2023-08-15",
  paymentMethod: {
    type: "card",
    last4: "4242",
    expiry: "12/24",
    brand: "visa",
  },
}

// Pricing data
const pricingPlans = {
  free: {
    monthly: 0,
    annual: 0,
    features: [
      "1 active project",
      "Basic project management tools",
      "Client directory (up to 5 clients)",
      "Basic reporting",
      "Mobile access",
      "Community support",
    ],
  },
  regular: {
    monthly: 39,
    annual: 390, // 10 months for annual billing (2 months free)
    features: [
      "Unlimited projects",
      "Unlimited clients",
      "Basic invoicing and payment tracking",
      "Document storage (5GB)",
      "Email support",
      "Basic contract templates",
      "Time tracking",
      "Basic analytics",
    ],
  },
  pro: {
    monthly: 99,
    annual: 990, // 10 months for annual billing (2 months free)
    features: [
      "Everything in Regular, plus:",
      "Team collaboration (up to 5 users)",
      "Advanced analytics and reporting",
      "Custom contract templates",
      "Client portal access",
      "Unlimited document storage",
      "Priority support",
      "Advanced financial tools",
      "Change order management",
      "Material tracking",
      "Integration with accounting software",
    ],
  },
}

export default function SubscriptionPage() {
  const router = useRouter()
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<"free" | "regular" | "pro">(currentUser.plan)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(currentUser.billingCycle)
  const [cancelOpen, setCancelOpen] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const getAnnualSavings = (plan: "free" | "regular" | "pro") => {
    const monthlyTotal = pricingPlans[plan].monthly * 12
    const annualTotal = pricingPlans[plan].annual
    return monthlyTotal - annualTotal
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/account")}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back to Account</span>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Manage your subscription plan and billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold capitalize">{currentUser.plan} Plan</h3>
                <p className="text-muted-foreground">
                  {currentUser.billingCycle === "annual" ? "Annual billing" : "Monthly billing"}
                </p>
              </div>
              <PlanBadge plan={currentUser.plan} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-medium">
                  {formatCurrency(pricingPlans[currentUser.plan][currentUser.billingCycle])}
                  {currentUser.billingCycle === "monthly" ? "/month" : "/year"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Next billing date</span>
                <span className="font-medium">{formatDate(currentUser.nextBillingDate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment method</span>
                <span className="font-medium capitalize">
                  {currentUser.paymentMethod.brand} ending in {currentUser.paymentMethod.last4}
                </span>
              </div>
            </div>

            <div className="rounded-md border p-4 bg-muted/50">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {currentUser.plan === "free" ? (
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">
                    {currentUser.plan === "free" ? "Free Plan" : `Your ${currentUser.plan} plan is active`}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {currentUser.plan === "free"
                      ? "Upgrade to unlock more features and capabilities."
                      : "Your subscription is active and will renew automatically."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-stretch gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" onClick={() => router.push("/account/billing")}>
              <CreditCard className="h-4 w-4 mr-2" />
              Update Payment Method
            </Button>
            {currentUser.plan === "free" ? (
              <Button onClick={() => setUpgradeOpen(true)}>Upgrade Plan</Button>
            ) : (
              <>
                <Button onClick={() => setUpgradeOpen(true)}>Change Plan</Button>
                <Button variant="outline" className="text-destructive" onClick={() => setCancelOpen(true)}>
                  Cancel Subscription
                </Button>
              </>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Plan Features</CardTitle>
            <CardDescription>Features included in your current plan</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {pricingPlans[currentUser.plan].features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            {currentUser.plan !== "pro" && (
              <Button className="w-full" onClick={() => setUpgradeOpen(true)}>
                Upgrade to {currentUser.plan === "free" ? "Regular" : "Pro"}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your past invoices and payment history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-left p-3 font-medium">Description</th>
                  <th className="text-left p-3 font-medium">Amount</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">Jul 15, 2023</td>
                  <td className="p-3">Regular Plan - Monthly</td>
                  <td className="p-3">{formatCurrency(39)}</td>
                  <td className="p-3">
                    <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Jun 15, 2023</td>
                  <td className="p-3">Regular Plan - Monthly</td>
                  <td className="p-3">{formatCurrency(39)}</td>
                  <td className="p-3">
                    <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td className="p-3">May 15, 2023</td>
                  <td className="p-3">Regular Plan - Monthly</td>
                  <td className="p-3">{formatCurrency(39)}</td>
                  <td className="p-3">
                    <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm">
                      Download
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade/Change Plan Dialog */}
      <Dialog open={upgradeOpen} onOpenChange={setUpgradeOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{currentUser.plan === "free" ? "Upgrade Your Plan" : "Change Your Plan"}</DialogTitle>
            <DialogDescription>Choose the plan that best fits your business needs</DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <Tabs defaultValue="monthly" className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList>
                  <TabsTrigger value="monthly" onClick={() => setBillingCycle("monthly")}>
                    Monthly
                  </TabsTrigger>
                  <TabsTrigger value="annual" onClick={() => setBillingCycle("annual")}>
                    Annual{" "}
                    <span className="ml-1.5 text-xs bg-green-500/20 text-green-700 dark:text-green-500 rounded-full px-2 py-0.5">
                      Save 16%
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="monthly" className="mt-0">
                <RadioGroup
                  defaultValue={currentUser.plan}
                  value={selectedPlan}
                  onValueChange={(value) => setSelectedPlan(value as "free" | "regular" | "pro")}
                  className="space-y-4"
                >
                  <div className={`relative rounded-lg border p-4 ${selectedPlan === "free" ? "border-primary" : ""}`}>
                    <RadioGroupItem value="free" id="free" className="absolute right-4 top-4" />
                    <div className="pr-6">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="free" className="text-xl font-bold">
                          Free
                        </Label>
                        <span className="text-xl font-bold">{formatCurrency(0)}</span>
                      </div>
                      <p className="text-muted-foreground mb-4">Perfect for individuals just getting started</p>
                      <ul className="space-y-2 text-sm">
                        {pricingPlans.free.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div
                    className={`relative rounded-lg border p-4 ${selectedPlan === "regular" ? "border-primary" : ""}`}
                  >
                    <RadioGroupItem value="regular" id="regular" className="absolute right-4 top-4" />
                    <div className="pr-6">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="regular" className="text-xl font-bold">
                          Regular
                        </Label>
                        <span className="text-xl font-bold">{formatCurrency(pricingPlans.regular.monthly)}/mo</span>
                      </div>
                      <p className="text-muted-foreground mb-4">For growing contractors and small businesses</p>
                      <ul className="space-y-2 text-sm">
                        {pricingPlans.regular.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className={`relative rounded-lg border p-4 ${selectedPlan === "pro" ? "border-primary" : ""}`}>
                    <RadioGroupItem value="pro" id="pro" className="absolute right-4 top-4" />
                    <div className="pr-6">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pro" className="text-xl font-bold">
                          Pro
                        </Label>
                        <span className="text-xl font-bold">{formatCurrency(pricingPlans.pro.monthly)}/mo</span>
                      </div>
                      <p className="text-muted-foreground mb-4">For established businesses with teams</p>
                      <ul className="space-y-2 text-sm">
                        {pricingPlans.pro.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </RadioGroup>
              </TabsContent>

              <TabsContent value="annual" className="mt-0">
                <RadioGroup
                  defaultValue={currentUser.plan}
                  value={selectedPlan}
                  onValueChange={(value) => setSelectedPlan(value as "free" | "regular" | "pro")}
                  className="space-y-4"
                >
                  <div className={`relative rounded-lg border p-4 ${selectedPlan === "free" ? "border-primary" : ""}`}>
                    <RadioGroupItem value="free" id="free-annual" className="absolute right-4 top-4" />
                    <div className="pr-6">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="free-annual" className="text-xl font-bold">
                          Free
                        </Label>
                        <span className="text-xl font-bold">{formatCurrency(0)}</span>
                      </div>
                      <p className="text-muted-foreground mb-4">Perfect for individuals just getting started</p>
                      <ul className="space-y-2 text-sm">
                        {pricingPlans.free.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div
                    className={`relative rounded-lg border p-4 ${selectedPlan === "regular" ? "border-primary" : ""}`}
                  >
                    <RadioGroupItem value="regular" id="regular-annual" className="absolute right-4 top-4" />
                    <div className="pr-6">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="regular-annual" className="text-xl font-bold">
                          Regular
                        </Label>
                        <div className="text-right">
                          <div className="text-xl font-bold">{formatCurrency(pricingPlans.regular.annual)}/year</div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(pricingPlans.regular.annual / 12)}/mo (billed annually)
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">For growing contractors and small businesses</p>
                      <ul className="space-y-2 text-sm">
                        {pricingPlans.regular.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className={`relative rounded-lg border p-4 ${selectedPlan === "pro" ? "border-primary" : ""}`}>
                    <RadioGroupItem value="pro" id="pro-annual" className="absolute right-4 top-4" />
                    <div className="pr-6">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="pro-annual" className="text-xl font-bold">
                          Pro
                        </Label>
                        <div className="text-right">
                          <div className="text-xl font-bold">{formatCurrency(pricingPlans.pro.annual)}/year</div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(pricingPlans.pro.annual / 12)}/mo (billed annually)
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">For established businesses with teams</p>
                      <ul className="space-y-2 text-sm">
                        {pricingPlans.pro.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </RadioGroup>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpgradeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setUpgradeOpen(false)}>
              {currentUser.plan === selectedPlan
                ? "Confirm Plan"
                : currentUser.plan === "free" || (currentUser.plan === "regular" && selectedPlan === "pro")
                  ? "Upgrade Plan"
                  : "Change Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Subscription</DialogTitle>
            <DialogDescription>Are you sure you want to cancel your subscription?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-md border p-4 bg-muted/50 mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <h4 className="font-medium">What happens when you cancel</h4>
                  <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-0.5" />
                      <span>Your subscription will remain active until {formatDate(currentUser.nextBillingDate)}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5" />
                      <span>After that date, your account will be downgraded to the Free plan</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ArrowRight className="h-4 w-4 mt-0.5" />
                      <span>You'll lose access to premium features and be limited to 1 active project</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              If you're experiencing issues with our service, please contact our support team. We'd love to help before
              you go.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={() => setCancelOpen(false)}>
              Cancel Subscription
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
