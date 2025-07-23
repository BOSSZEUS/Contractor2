"use client"

import type React from "react"
import type { Project } from "@/lib/firebase-services"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, MapPin, DollarSign, User, Eye, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAppState } from "@/contexts/app-state-context"

interface ProjectCardProps {
  project: Project & {
    client?: string
    address?: string
    startDate?: string
    endDate?: string
    progress?: number
    totalCost?: number
    paidAmount?: number
    imageUrl?: string
    downloadURL?: string
    storagePath?: string
  }
  onEdit?: (project: any) => void
  onDelete?: (projectId: string) => void
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const router = useRouter()
  const { state } = useAppState()
  const { userRole } = state

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return "N/A"
    }
  }

  const getStatusColor = (status: string) => {
    if (!status) return "bg-gray-100 text-gray-800 border-gray-200"

    switch (status.toLowerCase()) {
      case "active":
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "on-hold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleViewProject = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (process.env.NODE_ENV === "development") {
      console.log("Navigating to project:", project.id, "as role:", userRole)
    }

    if (userRole === "contractor") {
      router.push(`/contractor/projects/${project.id}`)
    } else {
      router.push(`/my-projects/${project.id}`)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onEdit) {
      onEdit(project)
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete(project.id)
    }
  }

  // Safe value extraction with defaults
  const safeProject = {
    id: project?.id || "N/A",
    title: project?.title || "Untitled Project",
    client: project?.client || "Unknown Client",
    address: project?.address || "No Address",
    startDate: project?.startDate || "",
    endDate: project?.endDate || "",
    status: project?.status || "unknown",
    progress: typeof project?.progress === "number" ? project.progress : 0,
    totalCost: typeof project?.totalCost === "number" ? project.totalCost : 0,
    paidAmount: typeof project?.paidAmount === "number" ? project.paidAmount : 0,
    description: project?.description || "",
  }

  // Use placeholder image
  const projectImageUrl =
    project?.downloadURL || project?.imageUrl || "/placeholder.svg?height=200&width=300&text=Project"

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{safeProject.title}</CardTitle>
            <CardDescription>Project #{safeProject.id}</CardDescription>
          </div>
          <Badge className={getStatusColor(safeProject.status)}>{safeProject.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Project Image */}
        <div className="aspect-video rounded-lg overflow-hidden bg-muted">
          <img
            src={projectImageUrl || "/placeholder.svg"}
            alt={safeProject.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=200&width=300&text=Project"
            }}
          />
        </div>

        {/* Project Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{safeProject.client}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{safeProject.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              {formatDate(safeProject.startDate)} - {formatDate(safeProject.endDate)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            <span>${safeProject.totalCost.toLocaleString()}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{safeProject.progress}%</span>
          </div>
          <Progress value={safeProject.progress} />
        </div>

        {/* Payment Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Payment</span>
            <span className="text-sm text-muted-foreground">
              ${safeProject.paidAmount.toLocaleString()} / ${safeProject.totalCost.toLocaleString()}
            </span>
          </div>
          <Progress value={safeProject.totalCost > 0 ? (safeProject.paidAmount / safeProject.totalCost) * 100 : 0} />
        </div>

        {/* Description */}
        {safeProject.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{safeProject.description}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={handleViewProject}>
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          {userRole === "contractor" && (
            <>
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
