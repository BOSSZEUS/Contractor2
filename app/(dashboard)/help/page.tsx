"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, HelpCircle, FileText, Video, BookOpen, MessageSquare, Send, Phone, Mail } from "lucide-react"

// Mock FAQ data
const faqData = [
  {
    id: "faq-1",
    question: "How do I post a new work order?",
    answer:
      "To post a new work order, click the 'Post Work Order' button in the navigation or on your dashboard. Fill out the project details, location, budget, and timeline. Once submitted, contractors in your area will be able to view and quote on your project.",
  },
  {
    id: "faq-2",
    question: "How do I review and compare quotes?",
    answer:
      "When contractors submit quotes for your work order, you'll receive notifications. Go to 'My Work Orders' and click on the specific work order to view all submitted quotes. You can compare pricing, timelines, contractor ratings, and reviews before making a decision.",
  },
  {
    id: "faq-3",
    question: "How do payments work?",
    answer:
      "Payments are processed securely through our platform. Contractors will send invoices for completed work milestones. You can pay using credit card, debit card, or bank transfer. All payment history is available in the 'Invoices & Payments' section.",
  },
  {
    id: "faq-4",
    question: "What if I'm not satisfied with the work?",
    answer:
      "If you're not satisfied with the work, first try to resolve the issue directly with your contractor through our messaging system. If that doesn't work, you can contact our support team who will help mediate the situation and ensure a fair resolution.",
  },
  {
    id: "faq-5",
    question: "How do I track project progress?",
    answer:
      "You can track project progress in the 'My Projects' section. Contractors update project status and upload progress photos. You'll also receive notifications for important milestones and updates.",
  },
]

// Mock guide data
const guideData = [
  {
    id: "guide-1",
    title: "Getting Started Guide",
    description: "Learn the basics of using the platform",
    icon: BookOpen,
    category: "basics",
  },
  {
    id: "guide-2",
    title: "Posting Your First Work Order",
    description: "Step-by-step guide to creating effective work orders",
    icon: FileText,
    category: "work-orders",
  },
  {
    id: "guide-3",
    title: "Evaluating Contractors",
    description: "How to choose the right contractor for your project",
    icon: HelpCircle,
    category: "contractors",
  },
  {
    id: "guide-4",
    title: "Managing Payments",
    description: "Understanding invoices, payments, and billing",
    icon: FileText,
    category: "payments",
  },
  {
    id: "guide-5",
    title: "Video Tutorials",
    description: "Watch step-by-step video guides",
    icon: Video,
    category: "videos",
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  })

  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock form submission
    alert("Thank you for your message! Our support team will get back to you within 24 hours.")
    setContactForm({ subject: "", message: "" })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
          <p className="text-muted-foreground">Find answers to common questions and get help when you need it</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search for help..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Help Tabs */}
      <Tabs defaultValue="faq" className="space-y-4">
        <TabsList>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFaqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8">
                  <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    We couldn't find any FAQs matching "{searchQuery}". Try different keywords or browse our guides.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Help Guides</CardTitle>
              <CardDescription>Comprehensive guides to help you get the most out of the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {guideData.map((guide) => (
                  <Card key={guide.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <guide.icon className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold">{guide.title}</h3>
                          <p className="text-sm text-muted-foreground">{guide.description}</p>
                          <Button variant="link" className="p-0 h-auto text-sm">
                            Read Guide →
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Send us a message and we'll get back to you within 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="What do you need help with?"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, subject: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Describe your issue or question in detail..."
                      className="min-h-[120px]"
                      value={contactForm.message}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Other Ways to Reach Us</CardTitle>
                <CardDescription>Alternative contact methods for urgent issues</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone Support</h3>
                    <p className="text-sm text-muted-foreground">Call us at (555) 123-4567</p>
                    <p className="text-sm text-muted-foreground">Monday - Friday, 9am - 6pm EST</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email Support</h3>
                    <p className="text-sm text-muted-foreground">support@contractorplatform.com</p>
                    <p className="text-sm text-muted-foreground">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Live Chat</h3>
                    <p className="text-sm text-muted-foreground">Available Monday - Friday</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Start Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
