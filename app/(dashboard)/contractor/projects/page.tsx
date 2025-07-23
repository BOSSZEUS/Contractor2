"use client"

import { useAppState } from "@/contexts/app-state-context"
import { ProjectCard } from "@/components/project-card"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import type { Project } from "@/lib/firebase-services"


export default function ContractorProjectsPage() {
  const { state } = useAppState()
  const router = useRouter()

  useEffect(() => {
    if (state.userRole !== "contractor") {
      router.push("/dashboard")
    }
  }, [state.userRole, router])

  if (state.userRole !== "contractor") {
    return null // or a loading spinner
  }

  // In a real app, this would be filtered to show only projects assigned to the contractor.
  const projects = state.projects || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Projects</h1>
        <Button asChild>
          <Link href="/new-project">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">No active projects.</h2>
          <p className="text-muted-foreground mt-2">Create a new project to get started.</p>
          <Button className="mt-4" asChild>
            <Link href="/new-project">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
