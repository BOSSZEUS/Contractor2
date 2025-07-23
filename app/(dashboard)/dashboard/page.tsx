"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useAppState } from "@/contexts/app-state-context"
import { Users, FileText, DollarSign, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"
import { DashboardAnalytics } from "@/components/dashboard-analytics"

export default function DashboardPage() {
  const { userProfile } = useAuth()
  const { state } = useAppState()

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading Dashboard...</h2>
          <p className="text-muted-foreground">Please wait while we load your data.</p>
        </div>
      </div>
    )
  }

  const isContractor = userProfile.role === "contractor"
  const { projects, clients, quotes, contracts } = state

  // Calculate stats
  const activeProjects = projects.filter((p) => p.status === "active").length
  const pendingQuotes = quotes.filter((q) => q.status === "pending").length
  const totalRevenue = contracts.reduce((sum, c) => sum + (c.amount || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {userProfile.firstName || userProfile.displayName || "User"}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your {isContractor ? "contracting business" : "projects"} today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="capitalize">
            {userProfile.role}
          </Badge>
          {userProfile.canActAsClient && <Badge variant="secondary">Can Act as Client</Badge>}
        </div>
      </div>

      {/* Analytics Charts */}
      <DashboardAnalytics />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{isContractor ? "Active Projects" : "My Projects"}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">{projects.length} total projects</p>
          </CardContent>
        </Card>

        {isContractor && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
              <p className="text-xs text-muted-foreground">Active relationships</p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingQuotes}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{isContractor ? "Revenue" : "Total Spent"}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your most recent project activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {project.status === "active" && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {project.status === "pending" && <Clock className="h-5 w-5 text-yellow-500" />}
                    {project.status === "completed" && <CheckCircle className="h-5 w-5 text-blue-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{project.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {project.budget ? `$${project.budget.toLocaleString()}` : "Budget TBD"}
                    </p>
                  </div>
                  <Badge
                    variant={
                      project.status === "active" ? "default" : project.status === "pending" ? "secondary" : "outline"
                    }
                    className="capitalize"
                  >
                    {project.status}
                  </Badge>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="text-center py-6">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                  <p className="text-muted-foreground mb-4">
                    {isContractor
                      ? "Start by creating your first project or wait for client invitations."
                      : "Create your first project to get started."}
                  </p>
                  <Button asChild>
                    <Link href={isContractor ? "/contractor/projects" : "/post-work-order"}>
                      {isContractor ? "View Projects" : "Create Project"}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {isContractor ? (
              <>
                <Button asChild className="w-full justify-start">
                  <Link href="/contractor/projects">
                    <FileText className="mr-2 h-4 w-4" />
                    View All Projects
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/clients">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Clients
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/contractor/quotes">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Review Quotes
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/contractor/contracts">
                    <FileText className="mr-2 h-4 w-4" />
                    Manage Contracts
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="w-full justify-start">
                  <Link href="/post-work-order">
                    <FileText className="mr-2 h-4 w-4" />
                    New Project
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/my-projects">
                    <FileText className="mr-2 h-4 w-4" />
                    My Projects
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/my-work-orders">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Review Quotes
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/my-contracts">
                    <FileText className="mr-2 h-4 w-4" />
                    My Contracts
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Development Info */}
      {process.env.NODE_ENV === "development" && (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm">Development Info</CardTitle>
          </CardHeader>
          <CardContent className="text-xs space-y-2">
            <div>User ID: {userProfile.uid}</div>
            <div>Role: {userProfile.role}</div>
            <div>Can Act as Client: {userProfile.canActAsClient ? "Yes" : "No"}</div>
            <div>Data Loaded: {state.dataLoaded ? "Yes" : "No"}</div>
            <div>Loading: {state.loading ? "Yes" : "No"}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
