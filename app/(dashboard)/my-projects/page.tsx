"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Calendar, MapPin, DollarSign, Users, Search, Filter, Plus, Eye } from "lucide-react"
import Link from "next/link"

// Mock projects data
const mockProjects = [
  {
    id: "proj-1",
    title: "Kitchen Renovation",
    description: "Complete kitchen remodel with new cabinets, countertops, and appliances",
    contractor: "ABC Construction",
    location: "123 Main St, Anytown, USA",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    status: "in-progress",
    progress: 65,
    budget: 25000,
    spent: 18000,
  },
  {
    id: "proj-2",
    title: "Bathroom Remodel",
    description: "Master bathroom renovation with new tile, fixtures, and vanity",
    contractor: "XYZ Contractors",
    location: "123 Main St, Anytown, USA",
    startDate: "2023-11-01",
    endDate: "2023-12-15",
    status: "completed",
    progress: 100,
    budget: 15000,
    spent: 14500,
  },
  {
    id: "proj-3",
    title: "Deck Construction",
    description: "Build new 300 sq ft composite deck with railing",
    contractor: "Deck Masters",
    location: "123 Main St, Anytown, USA",
    startDate: "2024-02-01",
    endDate: "2024-02-28",
    status: "pending",
    progress: 0,
    budget: 8000,
    spent: 0,
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "default"
    case "in-progress":
      return "secondary"
    case "pending":
      return "outline"
    case "on-hold":
      return "destructive"
    default:
      return "outline"
  }
}

export default function MyProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.contractor.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    return matchesSearch && project.status === activeTab
  })

  const projectsByStatus = {
    all: mockProjects.length,
    "in-progress": mockProjects.filter((p) => p.status === "in-progress").length,
    pending: mockProjects.filter((p) => p.status === "pending").length,
    completed: mockProjects.filter((p) => p.status === "completed").length,
    "on-hold": mockProjects.filter((p) => p.status === "on-hold").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
          <p className="text-muted-foreground">Track and manage all your construction projects</p>
        </div>
        <Button asChild>
          <Link href="/post-work-order">
            <Plus className="mr-2 h-4 w-4" />
            Request New Project
          </Link>
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Projects Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All ({projectsByStatus.all})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({projectsByStatus["in-progress"]})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({projectsByStatus.pending})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({projectsByStatus.completed})</TabsTrigger>
          <TabsTrigger value="on-hold">On Hold ({projectsByStatus["on-hold"]})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredProjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <Badge variant={getStatusColor(project.status)} className="capitalize">
                          {project.status.replace("-", " ")}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="line-clamp-2">{project.description}</CardDescription>

                    {project.status === "in-progress" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    )}

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Users className="mr-2 h-4 w-4" />
                        <span>{project.contractor}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        <span className="truncate">{project.location}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>
                          {project.startDate} - {project.endDate}
                        </span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <DollarSign className="mr-2 h-4 w-4" />
                        <span>
                          ${project.spent.toLocaleString()} / ${project.budget.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <Button asChild className="w-full">
                      <Link href={`/my-projects/${project.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Project
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <div className="space-y-4">
                  <div className="text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      {searchQuery
                        ? "No projects found"
                        : activeTab === "all"
                          ? "No projects yet"
                          : `No ${activeTab.replace("-", " ")} projects`}
                    </h3>
                    <p>
                      {searchQuery
                        ? `No projects match "${searchQuery}"`
                        : "Get started by requesting your first project"}
                    </p>
                  </div>
                  {!searchQuery && (
                    <Button asChild>
                      <Link href="/post-work-order">
                        <Plus className="mr-2 h-4 w-4" />
                        Request Your First Project
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
