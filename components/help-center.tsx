"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, HelpCircle, FileText, Video, BookOpen, MessageSquare, CreditCard } from "lucide-react"

// Mock help data
const faqData = [
  {
    question: "How do I create a new project?",
    answer:
      "To create a new project, navigate to the Dashboard and click on the 'New Project' button. Fill in the project details in the form and click 'Create Project'.",
  },
  {
    question: "How do I invite clients to view their projects?",
    answer:
      "From the project details page, click on the 'Share' button. Enter the client's email address and click 'Send Invitation'. The client will receive an email with instructions to access the project.",
  },
  {
    question: "How do I track time spent on a project?",
    answer:
      "Open the project details page and navigate to the 'Time Tracking' tab. Click 'Start Timer' to begin tracking time. You can pause and resume the timer as needed, and add notes about the work performed.",
  },
  {
    question: "How do I generate an invoice?",
    answer:
      "From the project details page, go to the 'Payments' tab and click 'Generate Invoice'. Select the items to include in the invoice, add any additional details, and click 'Create Invoice'. You can then download the invoice as a PDF or send it directly to the client.",
  },
  {
    question: "How do I process client payments?",
    answer:
      "When a client makes a payment, go to the 'Payments' tab in the project details page. Click 'Record Payment', enter the payment details, and click 'Save'. The payment will be recorded and reflected in the project's payment history.",
  },
  {
    question: "Can I duplicate an existing project?",
    answer:
      "Yes, you can duplicate a project by going to the project details page and clicking the 'More' menu (three dots). Select 'Duplicate Project', adjust any details as needed, and click 'Create Duplicate'.",
  },
]

const guideData = [
  {
    title: "Getting Started Guide",
    description: "Learn the basics of using the platform",
    icon: BookOpen,
    url: "#getting-started",
  },
  {
    title: "Project Management",
    description: "How to create and manage projects effectively",
    icon: FileText,
    url: "#project-management",
  },
  {
    title: "Client Communication",
    description: "Best practices for client communication",
    icon: MessageSquare,
    url: "#client-communication",
  },
  {
    title: "Invoicing and Payments",
    description: "Complete guide to invoicing and receiving payments",
    icon: CreditCard,
    url: "#invoicing",
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step video guides for all features",
    icon: Video,
    url: "#video-tutorials",
  },
]

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Help Center
        </CardTitle>
        <CardDescription>Find answers to common questions and learn how to use the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for help..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="faq">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
              <TabsTrigger value="guides">Guides & Tutorials</TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="mt-4">
              {filteredFaqs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="rounded-md border border-dashed p-8 text-center">
                  <h3 className="text-lg font-medium">No Results Found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We couldn't find any FAQs matching your search. Try different keywords or browse our guides.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="guides" className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {guideData.map((guide, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0">
                      <Button variant="ghost" className="h-auto w-full justify-start p-4 text-left" asChild>
                        <a href={guide.url}>
                          <div className="flex items-start gap-4">
                            <div className="rounded-md bg-primary/10 p-2">
                              <guide.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium">{guide.title}</h3>
                              <p className="text-sm text-muted-foreground">{guide.description}</p>
                            </div>
                          </div>
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 rounded-md bg-muted p-4">
            <h3 className="font-medium">Need more help?</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Can't find what you're looking for? Contact our support team for assistance.
            </p>
            <Button variant="outline" className="mt-2">
              Contact Support
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
