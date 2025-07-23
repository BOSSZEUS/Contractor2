"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Calendar, MapPin, User, Clock, Edit, Trash, FileText, Download, PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useAppState } from "@/contexts/app-state-context"

interface DashboardProject {
  id: string
  title: string
  client?: string
  address?: string
  startDate?: string
  endDate?: string
  status?: string
  progress?: number
  totalCost?: number
  paidAmount?: number
  description?: string
  imageUrl?: string
  downloadURL?: string
  storagePath?: string
}

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const projectId = params.id
  const { toast } = useToast()
  const { state } = useAppState()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)

  const [project, setProject] = useState<any>(null)
  const [documents, setDocuments] = useState<
    Array<{
      id: string
      name: string
      type: string
      size: string
      uploadedAt: string
      downloadURL?: string
      storagePath?: string
    }>
  >([])
  const [photos, setPhotos] = useState<
    Array<{
      id: string
      name: string
      url: string
      uploadedAt: string
      downloadURL?: string
      storagePath?: string
    }>
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("ProjectDetailsPage - Current state:", state)
      console.log("ProjectDetailsPage - Project ID:", projectId)
      console.log("ProjectDetailsPage - User Role:", state?.userRole)
    }

    if (state?.userRole !== "contractor") {
      if (process.env.NODE_ENV === "development") {
        console.log("Not contractor, redirecting to dashboard")
      }
      router.push("/dashboard")
      return
    }

    if (state && state.projects) {
      if (process.env.NODE_ENV === "development") {
        console.log("Available projects:", state.projects)
      }
      const foundProject = state.projects.find((p) => p.id === projectId)
      if (process.env.NODE_ENV === "development") {
        console.log("Found project:", foundProject)
      }

      if (foundProject) {
        const proj = foundProject as DashboardProject
        const projectWithTasks = {
          ...proj,
          tasks: [
            {
              id: "1",
              title: "Initial Assessment",
              status: "completed",
              dueDate: proj.startDate,
            },
            {
              id: "2",
              title: "Planning & Design",
              status: "completed",
              dueDate: new Date(new Date(proj.startDate as string).getTime() + 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            },
            {
              id: "3",
              title: "Material Procurement",
              status: "in-progress",
              dueDate: new Date(new Date(proj.startDate as string).getTime() + 14 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            },
            {
              id: "4",
              title: "Construction Phase",
              status: "pending",
              dueDate: new Date(new Date(proj.startDate as string).getTime() + 21 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            },
            {
              id: "5",
              title: "Final Inspection",
              status: "pending",
              dueDate: new Date(new Date(proj.endDate as string).getTime() - 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
            },
          ],
        }
        setProject(projectWithTasks)
        if (process.env.NODE_ENV === "development") {
          console.log("Project set:", projectWithTasks)
        }
      } else {
        if (process.env.NODE_ENV === "development") {
          console.log("Project not found, redirecting to dashboard")
        }
        router.push("/dashboard/contractor/projects")
      }
      setLoading(false)
    } else {
      if (process.env.NODE_ENV === "development") {
        console.log("No state or projects available")
      }
      setLoading(false)
    }
  }, [state, projectId, router])

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

  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleFileUpload = (ref: React.RefObject<HTMLInputElement | null>) =>
    ref.current?.click()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      const sizeInKB = file.size / 1024
      const formattedSize =
        sizeInKB < 1024 ? `${Math.round(sizeInKB * 10) / 10} KB` : `${Math.round(sizeInKB / 102.4) / 10} MB`

      const newDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: file.type.split("/").pop() || "unknown",
        size: formattedSize,
        uploadedAt: new Date().toLocaleDateString(),
      }

      setDocuments((prev) => [...prev, newDocument])
      toast({ title: "Document uploaded", description: `${file.name} has been uploaded.` })

      e.target.value = ""
    }
  }

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadPromises = Array.from(e.target.files).map(async (file) => {
        const url = URL.createObjectURL(file)

        return {
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          url: url,
          uploadedAt: new Date().toLocaleDateString(),
        }
      })

      try {
        const newPhotos = await Promise.all(uploadPromises)
        setPhotos((prev) => [...prev, ...newPhotos])
        toast({ title: "Photos uploaded", description: `${newPhotos.length} photo(s) uploaded.` })
      } catch (error) {
        console.error("Photo upload error:", error)
        toast({
          title: "Upload failed",
          description: "Failed to upload photos",
          variant: "destructive",
        })
      }

      e.target.value = ""
    }
  }

  const handleDownloadDocument = async (doc: any) => {
    toast({
      title: "Download started",
      description: `Downloading ${doc.name}...`,
    })
  }

  const handleDeleteDocument = async (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId))
    toast({ title: "Document deleted", description: "Document has been removed." })
  }

  const handleDeletePhoto = async (photoId: string) => {
    const photo = photos.find((p) => p.id === photoId)
    if (photo?.url) {
      URL.revokeObjectURL(photo.url)
    }
    setPhotos((prev) => prev.filter((p) => p.id !== photoId))
    toast({ title: "Photo deleted", description: "Photo has been removed." })
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project details...</p>
        </div>
      </div>
    )
  }

  // Show error state if no project found
  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => router.push("/dashboard/contractor/projects")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/contractor/projects")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Project Management</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{project.title}</CardTitle>
                <CardDescription>Project #{project.id}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon">
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Client: {project.client || "Unknown Client"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Location: {project.address || "No Address"}</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Status: {project.status || "Unknown"}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-muted-foreground">{project.progress || 0}%</span>
              </div>
              <Progress value={project.progress || 0} />
            </div>
            <div>
              <h3 className="font-medium">Description</h3>
              <p className="text-sm text-muted-foreground">{project.description || "No description provided."}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Budget</span>
                <span className="font-medium">${(project.totalCost || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Paid to Date</span>
                <span className="font-medium">${(project.paidAmount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span>Balance Due</span>
                <span>${((project.totalCost || 0) - (project.paidAmount || 0)).toLocaleString()}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Payment Progress</span>
                <span className="text-sm text-muted-foreground">
                  {project.totalCost > 0 ? Math.round(((project.paidAmount || 0) / project.totalCost) * 100) : 0}%
                </span>
              </div>
              <Progress value={project.totalCost > 0 ? ((project.paidAmount || 0) / project.totalCost) * 100 : 0} />
            </div>
            <Button className="w-full">Create Invoice</Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Tasks</CardTitle>
              <CardDescription>Track and manage project milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.tasks && project.tasks.length > 0 ? (
                  project.tasks.map((task: any) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">Due: {formatDate(task.dueDate)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTaskStatusBadge(task.status)}
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No tasks created yet</p>
                    <Button variant="outline" className="mt-2 bg-transparent">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Task
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Materials & Supplies</CardTitle>
                  <CardDescription>Track materials needed and costs</CardDescription>
                </div>
                <Button variant="outline" size="icon">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground">Materials tracking coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Project Documents</CardTitle>
                  <CardDescription>Contracts, permits, and other project files</CardDescription>
                </div>
                <Button onClick={() => handleFileUpload(fileInputRef)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
              {documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.size} • Uploaded {doc.uploadedAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleDownloadDocument(doc)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteDocument(doc.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No documents uploaded yet</p>
                  <Button
                    variant="outline"
                    className="mt-2 bg-transparent"
                    onClick={() => handleFileUpload(fileInputRef)}
                  >
                    Upload First Document
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="photos" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Project Photos</CardTitle>
                  <CardDescription>Progress photos and documentation</CardDescription>
                </div>
                <Button onClick={() => handleFileUpload(photoInputRef)}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Upload Photos
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <input
                type="file"
                ref={photoInputRef}
                onChange={handlePhotoChange}
                className="hidden"
                accept="image/*"
                multiple
              />
              {photos.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-3">
                  {photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img
                        src={photo.url || "/placeholder.svg?height=200&width=300&text=Photo"}
                        alt={photo.name}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=200&width=300&text=Photo"
                        }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button variant="destructive" size="sm" onClick={() => handleDeletePhoto(photo.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{photo.name}</p>
                      <p className="text-xs text-muted-foreground">Uploaded {photo.uploadedAt}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-12 w-12 mx-auto bg-muted rounded-lg flex items-center justify-center mb-4">
                    <PlusCircle className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">No photos uploaded yet</p>
                  <Button
                    variant="outline"
                    className="mt-2 bg-transparent"
                    onClick={() => handleFileUpload(photoInputRef)}
                  >
                    Upload First Photo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
