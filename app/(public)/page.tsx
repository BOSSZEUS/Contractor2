import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckIcon, FileText, Users, CreditCard } from "lucide-react"

export default async function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-background">
        <div className="container mx-auto max-w-6xl px-4 py-24 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">Simplify Your Contracting Business</h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            Quote jobs, manage work orders, and get paid—all in one place. The all-in-one platform for contractors to
            manage projects, clients, and get paid faster.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/register">Start Free Trial</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#pricing">View Pricing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Run Your Business</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Streamline your workflow, improve client communication, and get paid faster with our comprehensive
              platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Project Management</h3>
              <p className="text-muted-foreground">
                Track all your projects in one place. Monitor progress, manage tasks, and stay on schedule.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Invoicing & Payments</h3>
              <p className="text-muted-foreground">
                Create professional invoices, track payments, and get paid faster with online payment options.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Client Management</h3>
              <p className="text-muted-foreground">
                Maintain a complete client directory with communication history, project details, and more.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that's right for your business. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* Free Tier */}
            <div className="bg-card rounded-lg overflow-hidden border shadow-sm flex flex-col">
              <div className="p-6">
                <h3 className="text-2xl font-bold">Free</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold">$0</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-muted-foreground h-12">Perfect for individuals just getting started</p>
              </div>
              <div className="p-6 flex-grow">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>1 active project</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Basic project management tools</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Client directory (up to 5 clients)</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-muted/20 mt-auto">
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            </div>

            {/* Regular Tier */}
            <div className="bg-card rounded-lg overflow-hidden border-2 border-primary shadow-lg flex flex-col relative -my-4">
              <div className="absolute top-0 right-4 -mt-3 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-full">
                Most Popular
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold">Regular</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold">$39</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-muted-foreground h-12">For growing contractors and small businesses</p>
              </div>
              <div className="p-6 flex-grow">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Unlimited projects</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Unlimited clients</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Basic invoicing and payment tracking</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-muted/20 mt-auto">
                <Button asChild className="w-full">
                  <Link href="/register">Start 14-Day Trial</Link>
                </Button>
              </div>
            </div>

            {/* Pro Tier */}
            <div className="bg-card rounded-lg overflow-hidden border shadow-sm flex flex-col">
              <div className="p-6">
                <h3 className="text-2xl font-bold">Pro</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold">$99</span>
                  <span className="ml-1 text-muted-foreground">/month</span>
                </div>
                <p className="mt-2 text-muted-foreground h-12">For established businesses with teams</p>
              </div>
              <div className="p-6 flex-grow">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Everything in Regular, plus:</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Team collaboration (up to 5 users)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Advanced analytics and reporting</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 bg-muted/20 mt-auto">
                <Button asChild className="w-full bg-transparent" variant="outline">
                  <Link href="/register">Start 14-Day Trial</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from contractors who have transformed their business with our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <img src="/placeholder.svg?height=48&width=48" alt="Customer" className="h-12 w-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-bold">Michael Johnson</h4>
                  <p className="text-sm text-muted-foreground">Johnson Construction</p>
                </div>
              </div>
              <blockquote className="text-muted-foreground italic">
                "This platform has completely transformed how I manage my contracting business. I'm saving at least 10
                hours a week on administrative tasks."
              </blockquote>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <img src="/placeholder.svg?height=48&width=48" alt="Customer" className="h-12 w-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-bold">Sarah Williams</h4>
                  <p className="text-sm text-muted-foreground">Williams Home Renovation</p>
                </div>
              </div>
              <blockquote className="text-muted-foreground italic">
                "The invoicing and payment tracking features alone have improved my cash flow by 30%. My clients love
                the professional experience too."
              </blockquote>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-card rounded-lg p-6 shadow-sm border">
              <div className="flex items-center mb-4">
                <img src="/placeholder.svg?height=48&width=48" alt="Customer" className="h-12 w-12 rounded-full mr-4" />
                <div>
                  <h4 className="font-bold">David Martinez</h4>
                  <p className="text-sm text-muted-foreground">Martinez Builders</p>
                </div>
              </div>
              <blockquote className="text-muted-foreground italic">
                "As my team grew, I needed a better way to manage projects. This platform gives everyone visibility and
                keeps us all on the same page."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Contracting Business?</h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
            Join thousands of contractors who are saving time, getting paid faster, and growing their business.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/register">Start Your Free Trial</Link>
          </Button>
          <p className="mt-4 text-sm text-primary-foreground/80">No credit card required. 14-day free trial.</p>
        </div>
      </section>
    </div>
  )
}
