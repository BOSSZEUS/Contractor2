"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { format, differenceInDays, isBefore, isAfter, isSameDay } from "date-fns"

// Mock project data
const projects = [
  {
    id: "1",
    title: "Kitchen Renovation",
    client: "Sarah Johnson",
    startDate: new Date("2023-06-01"),
    endDate: new Date("2023-07-15"),
    status: "in-progress",
    milestones: [
      { id: "m1", title: "Demo Day", date: new Date("2023-06-01"), completed: true },
      { id: "m2", title: "Framing", date: new Date("2023-06-08"), completed: true },
      { id: "m3", title: "Cabinet Installation", date: new Date("2023-06-15"), completed: true },
      { id: "m4", title: "Countertops & Appliances", date: new Date("2023-06-22"), completed: false },
      { id: "m5", title: "Finishing & Cleanup", date: new Date("2023-07-10"), completed: false },
    ],
  },
  {
    id: "2",
    title: "Bathroom Remodel",
    client: "Michael Smith",
    startDate: new Date("2023-07-10"),
    endDate: new Date("2023-08-05"),
    status: "pending-approval",
    milestones: [
      { id: "m1", title: "Demo & Prep", date: new Date("2023-07-10"), completed: true },
      { id: "m2", title: "Plumbing Rough-in", date: new Date("2023-07-15"), completed: true },
      { id: "m3", title: "Tile Work", date: new Date("2023-07-22"), completed: true },
      { id: "m4", title: "Fixtures & Finishing", date: new Date("2023-07-30"), completed: false },
    ],
  },
]

export function ProjectTimeline() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const project = selectedProject ? projects.find((p) => p.id === selectedProject) : null

  const getTimelineItems = () => {
    if (!project) return []

    const days = differenceInDays(project.endDate, project.startDate) + 1
    const timelineItems = []

    // Add start date
    timelineItems.push({
      date: project.startDate,
      type: "start",
      title: "Project Start",
      milestone: null,
    })

    // Add milestones
    project.milestones.forEach((milestone) => {
      timelineItems.push({
        date: milestone.date,
        type: "milestone",
        title: milestone.title,
        milestone,
      })
    })

    // Add end date
    timelineItems.push({
      date: project.endDate,
      type: "end",
      title: "Project End",
      milestone: null,
    })

    // Sort by date
    return timelineItems.sort((a, b) => a.date.getTime() - b.date.getTime())
  }

  const timelineItems = getTimelineItems()
  const today = new Date()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Timeline</CardTitle>
        <CardDescription>Visualize project milestones and progress</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Select onValueChange={setSelectedProject}>
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {project ? (
            <div className="space-y-6">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">Client: {project.client}</p>
                  </div>
                  <Badge variant={project.status === "in-progress" ? "default" : "secondary"}>
                    {project.status === "in-progress" ? "In Progress" : "Pending Approval"}
                  </Badge>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Timeline: </span>
                  {format(project.startDate, "MMM d, yyyy")} - {format(project.endDate, "MMM d, yyyy")}
                </div>
              </div>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                {/* Timeline items */}
                <div className="space-y-8 relative">
                  {timelineItems.map((item, index) => {
                    const isPast = isBefore(item.date, today) && !isSameDay(item.date, today)
                    const isFuture = isAfter(item.date, today) && !isSameDay(item.date, today)
                    const isToday = isSameDay(item.date, today)

                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div
                          className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                            isPast
                              ? item.type === "milestone" && item.milestone?.completed
                                ? "bg-green-500 border-green-500"
                                : "bg-muted border-muted-foreground"
                              : isToday
                                ? "bg-primary border-primary"
                                : "bg-background border-border"
                          }`}
                        >
                          {item.type === "milestone" && item.milestone?.completed && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-primary-foreground"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{item.title}</h4>
                            {isToday && <Badge variant="outline">Today</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{format(item.date, "MMM d, yyyy")}</p>
                          {item.type === "milestone" && (
                            <p className="text-sm mt-1">
                              {item.milestone?.completed ? "Completed" : isPast ? "Overdue" : "Upcoming"}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-md border border-dashed p-8 text-center">
              <h3 className="text-lg font-medium">No Project Selected</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Select a project from the dropdown above to view its timeline.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
