"use client"

import { useState } from "react"
import { useAppState } from "@/contexts/app-state-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Mail, Phone, MapPin, Building, Users } from "lucide-react"
import Link from "next/link"

export default function ClientsPage() {
  const { state } = useAppState()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredClients = state.clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const activeClients = filteredClients.filter((client) => {
    // Check if client has active projects
    return state.projects.some((project) => project.clientId === client.id && project.status === "active")
  })

  const allClients = filteredClients

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships and contact information</p>
        </div>
        <Button asChild>
          <Link href="/clients/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Link>
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{state.clients.length}</div>
            <p className="text-xs text-muted-foreground">All registered clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients.length}</div>
            <p className="text-xs text-muted-foreground">With active projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                state.clients.filter((client) => {
                  const clientDate = new Date(client.createdAt)
                  const now = new Date()
                  return clientDate.getMonth() === now.getMonth() && clientDate.getFullYear() === now.getFullYear()
                }).length
              }
            </div>
            <p className="text-xs text-muted-foreground">New clients added</p>
          </CardContent>
        </Card>
      </div>

      {/* Clients List */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Clients ({allClients.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeClients.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {allClients.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allClients.map((client) => {
                const clientProjects = state.projects.filter((p) => p.clientId === client.id)
                const activeProjectsCount = clientProjects.filter((p) => p.status === "active").length

                return (
                  <Card key={client.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{client.name}</CardTitle>
                          {client.company && (
                            <CardDescription className="flex items-center mt-1">
                              <Building className="h-3 w-3 mr-1" />
                              {client.company}
                            </CardDescription>
                          )}
                        </div>
                        {activeProjectsCount > 0 && (
                          <Badge variant="default" className="text-xs">
                            {activeProjectsCount} Active
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Mail className="h-3 w-3 mr-2" />
                          <span className="truncate">{client.email}</span>
                        </div>
                        {client.phone && (
                          <div className="flex items-center text-muted-foreground">
                            <Phone className="h-3 w-3 mr-2" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                        {client.address && (
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-3 w-3 mr-2" />
                            <span className="truncate">{client.address}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-xs text-muted-foreground">
                          {clientProjects.length} project{clientProjects.length !== 1 ? "s" : ""}
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/clients/${client.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No clients found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchTerm
                    ? "No clients match your search criteria. Try adjusting your search terms."
                    : "You haven't added any clients yet. Start by adding your first client."}
                </p>
                {!searchTerm && (
                  <Button asChild>
                    <Link href="/clients/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Client
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {activeClients.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeClients.map((client) => {
                const clientProjects = state.projects.filter((p) => p.clientId === client.id)
                const activeProjectsCount = clientProjects.filter((p) => p.status === "active").length

                return (
                  <Card key={client.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{client.name}</CardTitle>
                          {client.company && (
                            <CardDescription className="flex items-center mt-1">
                              <Building className="h-3 w-3 mr-1" />
                              {client.company}
                            </CardDescription>
                          )}
                        </div>
                        <Badge variant="default" className="text-xs">
                          {activeProjectsCount} Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Mail className="h-3 w-3 mr-2" />
                          <span className="truncate">{client.email}</span>
                        </div>
                        {client.phone && (
                          <div className="flex items-center text-muted-foreground">
                            <Phone className="h-3 w-3 mr-2" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="text-xs text-muted-foreground">
                          {clientProjects.length} total project{clientProjects.length !== 1 ? "s" : ""}
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/clients/${client.id}`}>View Details</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No active clients</h3>
                <p className="text-muted-foreground text-center mb-4">
                  You don't have any clients with active projects at the moment.
                </p>
                <Button asChild>
                  <Link href="/new-project">
                    <Plus className="mr-2 h-4 w-4" />
                    Start New Project
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
