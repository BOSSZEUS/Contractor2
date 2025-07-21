"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, Mail, Phone, MapPin, Building, Edit, Trash } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ClientDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const clientId = params.id

  // This would come from API in a real app
  const client = {
    id: clientId,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, USA",
    company: "Johnson Enterprises",
    projects: [
      {
        id: "1",
        title: "Kitchen Renovation",
        status: "in-progress",
        startDate: "2023-06-01",
        endDate: "2023-07-15",
        value: 12500,
      },
      {
        id: "2",
        title: "Bathroom Remodel",
        status: "pending-approval",
        startDate: "2023-07-10",
        endDate: "2023-08-05",
        value: 8750,
      },
    ],
    invoices: [
      {
        id: "1",
        number: "INV-2023-001",
        date: "2023-06-15",
        amount: 5000,
        status: "paid",
      },
      {
        id: "2",
        number: "INV-2023-002",
        date: "2023-07-01",
        amount: 3000,
        status: "paid",
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/clients")}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Back to Clients</span>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Client Details</h1>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <Card className="md:w-1/3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Client Information</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit Client</span>
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete Client</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" alt={client.name} />
                <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{client.name}</h2>
              <p className="text-sm text-muted-foreground">{client.company}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{client.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{client.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{client.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{client.company}</span>
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full">Contact Client</Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1 space-y-4">
          <Tabs defaultValue="projects">
            <TabsList>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>Projects associated with this client</CardDescription>
                </CardHeader>
                <CardContent>
                  {client.projects.length > 0 ? (
                    <div className="space-y-4">
                      {client.projects.map((project) => (
                        <div key={project.id} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{project.title}</h3>
                            <div className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                              {project.status}
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <p>
                              Timeline: {new Date(project.startDate).toLocaleDateString()} -{" "}
                              {new Date(project.endDate).toLocaleDateString()}
                            </p>
                            <p className="mt-1">Value: ${project.value.toLocaleString()}</p>
                          </div>
                          <Button variant="outline" size="sm" className="mt-4">
                            View Project
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No projects found for this client.</p>
                      <Button variant="outline" className="mt-2">
                        Create New Project
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="invoices">
              <Card>
                <CardHeader>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>Invoices associated with this client</CardDescription>
                </CardHeader>
                <CardContent>
                  {client.invoices.length > 0 ? (
                    <div className="space-y-4">
                      {client.invoices.map((invoice) => (
                        <div key={invoice.id} className="rounded-lg border p-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{invoice.number}</h3>
                            <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                              {invoice.status}
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <p>Date: {new Date(invoice.date).toLocaleDateString()}</p>
                            <p className="mt-1">Amount: ${invoice.amount.toLocaleString()}</p>
                          </div>
                          <Button variant="outline" size="sm" className="mt-4">
                            View Invoice
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No invoices found for this client.</p>
                      <Button variant="outline" className="mt-2">
                        Create New Invoice
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Documents associated with this client</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No documents found for this client.</p>
                    <Button variant="outline" className="mt-2">
                      Upload Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                  <CardDescription>Notes about this client</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No notes found for this client.</p>
                    <Button variant="outline" className="mt-2">
                      Add Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
