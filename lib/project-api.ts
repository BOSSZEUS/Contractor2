import { firestoreService } from "@/lib/firebase-services"

// Project API functions using the Firestore service
export const projectApi = {
  // Get all projects for a user
  async getAllProjects(userId: string, role: "client" | "contractor") {
    try {
      const field = role === "client" ? "clientId" : "contractorId"
      const projects = await firestoreService.getDocuments(
        "projects",
        [{ field, operator: "==", value: userId }],
        "createdAt",
      )
      return projects
    } catch (error) {
      console.error("Error getting all projects:", error)
      return []
    }
  },

  // Get a single project by ID
  async getProjectById(projectId: string) {
    try {
      const project = await firestoreService.getDocument("projects", projectId)
      return project
    } catch (error) {
      console.error("Error getting project by ID:", error)
      return null
    }
  },

  // Create a new project
  async createProject(projectData: any) {
    try {
      const projectId = await firestoreService.addDocument("projects", {
        ...projectData,
        status: "active",
        totalCost: projectData.totalCost || 0,
        paidAmount: projectData.paidAmount || 0,
      })
      return projectId
    } catch (error) {
      console.error("Error creating project:", error)
      throw error
    }
  },

  // Update an existing project
  async updateProject(projectId: string, updates: any) {
    try {
      const success = await firestoreService.updateDocument("projects", projectId, updates)
      return success
    } catch (error) {
      console.error("Error updating project:", error)
      throw error
    }
  },

  // Delete a project
  async deleteProject(projectId: string) {
    try {
      const success = await firestoreService.deleteDocument("projects", projectId)
      return success
    } catch (error) {
      console.error("Error deleting project:", error)
      throw error
    }
  },

  // Subscribe to real-time project updates
  subscribeToProject(projectId: string, callback: (project: any) => void) {
    return firestoreService.subscribeToDocument("projects", projectId, callback)
  },

  // Subscribe to real-time projects list updates
  subscribeToProjects(userId: string, role: "client" | "contractor", callback: (projects: any[]) => void) {
    const field = role === "client" ? "clientId" : "contractorId"
    return firestoreService.subscribeToCollection("projects", callback, [{ field, operator: "==", value: userId }])
  },
}

// Export individual functions for backward compatibility
export const getAllProjects = projectApi.getAllProjects
export const getProjectById = projectApi.getProjectById
export const createProject = projectApi.createProject
export const updateProject = projectApi.updateProject
export const deleteProject = projectApi.deleteProject
export const subscribeToProject = projectApi.subscribeToProject
export const subscribeToProjects = projectApi.subscribeToProjects

// Default export
export default projectApi
