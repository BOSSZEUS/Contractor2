"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// Mock project data
const projects = [
  {
    id: "1",
    title: "Kitchen Renovation",
    client: "Sarah Johnson",
    startDate: "2023-06-01",
    endDate: "2023-07-15",
    status: "in-progress",
    progress: 65,
    totalCost: 12500,
    paidAmount: 8000,
    tasksCompleted: 18,
    totalTasks: 25,
    daysRemaining: 14,
  },
  {
    id: "2",
    title: "Bathroom Remodel",
    client: "Michael Smith",
    startDate: "2023-07-10",
    endDate: "2023-08-05",
    status: "pending-approval",
    progress: 90,
    totalCost: 8750,
    paidAmount: 7000,
    tasksCompleted: 22,
    totalTasks: 24,
    daysRemaining: 5,
  },
  {
    id: "3",
    title: "Deck Construction",
    client: "Emily Davis",
    startDate: "2023-08-15",
    endDate: "2023-09-01",
    status: "completed",
    progress: 100,
    totalCost: 5500,
    paidAmount: 5500,
    tasksCompleted: 15,
    totalTasks: 15,
    daysRemaining: 0,
  },
  {
    id: "4",
    title: "Basement Finishing",
    client: "Robert Wilson",
    startDate: "2023-09-10",
    endDate: "2023-10-20",
    status: "pending",
    progress: 0,
    totalCost: 15000,
    paidAmount: 0,
    tasksCompleted: 0,
    totalTasks: 30,
    daysRemaining: 40,
  },
]

export function ProjectComparison() {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])

  const handleProjectSelect = (projectId: string) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter((id) => id !== projectId))
    } else if (selectedProjects.length < 3) {
      setSelectedProjects([...selectedProjects, projectId])
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Badge variant="default">In Progress</Badge>
      case "pending-approval":
        return <Badge variant="secondary">Pending Approval</Badge>
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const selectedProjectsData = projects.filter((project) => selectedProjects.includes(project.id))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Comparison</CardTitle>
        <CardDescription>Compare up to 3 projects side by side</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Select Projects to Compare</label>
            <Select onValueChange={handleProjectSelect} disabled={selectedProjects.length >= 3}>
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects
                  .filter((project) => !selectedProjects.includes(project.id))
                  .map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.title}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {selectedProjects.length === 0
                ? "Select up to 3 projects to compare"
                : `${selectedProjects.length} of 3 projects selected`}
            </p>
          </div>

          {selectedProjectsData.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Metric</TableHead>
                    {selectedProjectsData.map((project) => (
                      <TableHead key={project.id}>{project.title}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Client</TableCell>
                    {selectedProjectsData.map((project) => (
                      <TableCell key={project.id}>{project.client}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Status</TableCell>
                    {selectedProjectsData.map((project) => (
                      <TableCell key={project.id}>{getStatusBadge(project.status)}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Timeline</TableCell>
                    {selectedProjectsData.map((project) => (
                      <TableCell key={project.id}>
                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Progress</TableCell>
                    {selectedProjectsData.map((project) => (
                      <TableCell key={project.id}>
                        <div className="space-y-1">
                          <Progress value={project.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">{project.progress}% complete</p>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Cost</TableCell>
                    {selectedProjectsData.map((project) => (
                      <TableCell key={project.id}>${project.totalCost.toLocaleString()}</TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Payment Status</TableCell>
                    {selectedProjectsData.map((project) => (
                      <TableCell key={project.id}>
                        <div className="space-y-1">
                          <Progress value={(project.paidAmount / project.totalCost) * 100} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            ${project.paidAmount.toLocaleString()} / ${project.totalCost.toLocaleString()}
                          </p>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Tasks</TableCell>
                    {selectedProjectsData.map((project) => (
                      <TableCell key={project.id}>
                        {project.tasksCompleted} of {project.totalTasks} completed
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Days Remaining</TableCell>
                    {selectedProjectsData.map((project) => (
                      <TableCell key={project.id}>{project.daysRemaining} days</TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="rounded-md border border-dashed p-8 text-center">
              <h3 className="text-lg font-medium">No Projects Selected</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Select projects from the dropdown above to compare them side by side.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
