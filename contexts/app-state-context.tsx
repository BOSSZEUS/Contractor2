"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { useAuth } from "./auth-context"

// Types
interface Project {
  id: string
  title: string
  description: string
  status: "active" | "pending" | "completed" | "on-hold"
  budget?: number
  clientId?: string
  contractorId?: string
  startDate?: string
  endDate?: string
  progress?: number
}

interface Client {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  company?: string
  createdAt?: any
  projectsCount?: number
}

interface Quote {
  id: string
  projectId: string
  contractorId: string
  amount: number
  status: "pending" | "accepted" | "rejected"
  submittedAt: string
  description?: string
}

interface Contract {
  id: string
  title?: string
  projectId: string
  clientId: string
  contractorId: string
  client?: string
  clientName?: string
  project?: string
  projectName?: string
  amount: number
  value?: number
  status:
    | "draft"
    | "signed"
    | "completed"
    | "active"
    | "pending"
    | "terminated"
  signedAt?: string
  createdAt?: any
  startDate?: any
}

interface WorkOrder {
  id: string
  title: string
  description: string
  clientId: string
  status: "open" | "quoted" | "in-progress" | "completed"
  budget?: string
  location?: string
  postedAt: string
}

interface AppState {
  projects: Project[]
  clients: Client[]
  quotes: Quote[]
  contracts: Contract[]
  workOrders: WorkOrder[]
  userRole: "client" | "contractor"
  loading: boolean
  dataLoaded: boolean
}

type AppAction =
  | { type: "SET_PROJECTS"; payload: Project[] }
  | { type: "SET_CLIENTS"; payload: Client[] }
  | { type: "SET_QUOTES"; payload: Quote[] }
  | { type: "SET_CONTRACTS"; payload: Contract[] }
  | { type: "SET_WORK_ORDERS"; payload: WorkOrder[] }
  | { type: "SET_USER_ROLE"; payload: "client" | "contractor" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_DATA_LOADED"; payload: boolean }
  | { type: "CLEAR_DATA" }
  | { type: "ADD_CLIENT"; payload: Client }
 vzqpep-codex/remove-mock-user-creation-and-use-firebase-auth
  | { type: "ADD_PROJECT"; payload: Project }


const initialState: AppState = {
  projects: [],
  clients: [],
  quotes: [],
  contracts: [],
  workOrders: [],
  userRole: "client",
  loading: false,
  dataLoaded: false,
}

// Mock data
const mockClientData = {
  projects: [
    {
      id: "proj-1",
      title: "Kitchen Renovation",
      description: "Complete kitchen remodel with new cabinets and appliances",
      status: "active" as const,
      budget: 25000,
      progress: 65,
    },
    {
      id: "proj-2",
      title: "Bathroom Remodel",
      description: "Master bathroom renovation",
      status: "completed" as const,
      budget: 15000,
      progress: 100,
    },
  ],
  quotes: [
    {
      id: "quote-1",
      projectId: "proj-1",
      contractorId: "contractor-1",
      amount: 25000,
      status: "accepted" as const,
      submittedAt: "2024-01-15",
    },
    {
      id: "quote-2",
      projectId: "proj-3",
      contractorId: "contractor-2",
      amount: 8000,
      status: "pending" as const,
      submittedAt: "2024-01-20",
    },
  ],
  contracts: [
    {
      id: "contract-1",
      projectId: "proj-1",
      clientId: "client-1",
      contractorId: "contractor-1",
      amount: 25000,
      status: "signed" as const,
      signedAt: "2024-01-16",
    },
  ],
  workOrders: [
    {
      id: "wo-1",
      title: "Deck Construction",
      description: "Build new composite deck",
      clientId: "client-1",
      status: "open" as const,
      budget: "$8,000 - $12,000",
      location: "123 Main St",
      postedAt: "2024-01-22",
    },
  ],
  clients: [],
}

const mockContractorData = {
  projects: [
    {
      id: "proj-1",
      title: "Kitchen Renovation",
      description: "Complete kitchen remodel with new cabinets and appliances",
      status: "active" as const,
      budget: 25000,
      clientId: "client-1",
      progress: 65,
    },
    {
      id: "proj-2",
      title: "Bathroom Remodel",
      description: "Master bathroom renovation",
      status: "completed" as const,
      budget: 15000,
      clientId: "client-2",
      progress: 100,
    },
    {
      id: "proj-3",
      title: "Deck Construction",
      description: "Build new composite deck with railing",
      status: "pending" as const,
      budget: 8000,
      clientId: "client-3",
      progress: 0,
    },
  ],
  clients: [
    {
      id: "client-1",
      name: "John Smith",
      email: "john@example.com",
      phone: "(555) 123-4567",
      address: "123 Main St, Anytown, USA",
      projectsCount: 2,
    },
    {
      id: "client-2",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "(555) 987-6543",
      address: "456 Oak Ave, Somewhere, USA",
      projectsCount: 1,
    },
    {
      id: "client-3",
      name: "Mike Wilson",
      email: "mike@example.com",
      phone: "(555) 456-7890",
      address: "789 Pine St, Elsewhere, USA",
      projectsCount: 1,
    },
  ],
  quotes: [
    {
      id: "quote-1",
      projectId: "proj-1",
      contractorId: "contractor-1",
      amount: 25000,
      status: "accepted" as const,
      submittedAt: "2024-01-15",
    },
    {
      id: "quote-2",
      projectId: "proj-2",
      contractorId: "contractor-1",
      amount: 15000,
      status: "accepted" as const,
      submittedAt: "2024-01-10",
    },
    {
      id: "quote-3",
      projectId: "proj-3",
      contractorId: "contractor-1",
      amount: 8000,
      status: "pending" as const,
      submittedAt: "2024-01-20",
    },
  ],
  contracts: [
    {
      id: "contract-1",
      projectId: "proj-1",
      clientId: "client-1",
      contractorId: "contractor-1",
      amount: 25000,
      status: "signed" as const,
      signedAt: "2024-01-16",
    },
    {
      id: "contract-2",
      projectId: "proj-2",
      clientId: "client-2",
      contractorId: "contractor-1",
      amount: 15000,
      status: "signed" as const,
      signedAt: "2024-01-12",
    },
  ],
  workOrders: [],
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_PROJECTS":
      return { ...state, projects: action.payload }
    case "SET_CLIENTS":
      return { ...state, clients: action.payload }
    case "SET_QUOTES":
      return { ...state, quotes: action.payload }
    case "SET_CONTRACTS":
      return { ...state, contracts: action.payload }
    case "SET_WORK_ORDERS":
      return { ...state, workOrders: action.payload }
    case "SET_USER_ROLE":
      return { ...state, userRole: action.payload, dataLoaded: false } // Reset data when switching roles
    case "SET_LOADING":
      return { ...state, loading: action.payload }
    case "SET_DATA_LOADED":
      return { ...state, dataLoaded: action.payload }
    case "CLEAR_DATA":
      return {
        ...initialState,
        userRole: state.userRole, // Preserve user role when clearing
      }
    case "ADD_CLIENT":
      return { ...state, clients: [...state.clients, action.payload] }
vzqpep-codex/remove-mock-user-creation-and-use-firebase-auth
    case "ADD_PROJECT":
      return { ...state, projects: [...state.projects, action.payload] }

main
    default:
      return state
  }
}

const AppStateContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
  addClient: (client: Client) => void
  addProject: (project: Project) => void
} | null>(null)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const { userProfile, user } = useAuth()
  const [state, dispatch] = useReducer(appReducer, {
    ...initialState,
    userRole: userProfile?.role || "contractor", // Default to contractor since that's what our mock user is
  })

  // Load mock data when user profile is available or when role changes
  useEffect(() => {
    if (userProfile && user && !state.dataLoaded) {
      console.log("AppState: Loading mock data for role:", state.userRole)
      dispatch({ type: "SET_LOADING", payload: true })

      // Simulate loading delay
      setTimeout(() => {
        const mockData = state.userRole === "contractor" ? mockContractorData : mockClientData

        dispatch({ type: "SET_PROJECTS", payload: mockData.projects })
        dispatch({ type: "SET_CLIENTS", payload: mockData.clients })
        dispatch({ type: "SET_QUOTES", payload: mockData.quotes })
        dispatch({ type: "SET_CONTRACTS", payload: mockData.contracts })
        dispatch({ type: "SET_WORK_ORDERS", payload: mockData.workOrders })
        dispatch({ type: "SET_DATA_LOADED", payload: true })
        dispatch({ type: "SET_LOADING", payload: false })

        console.log("AppState: Mock data loaded successfully for", state.userRole)
      }, 1000)
    }
  }, [userProfile, user, state.dataLoaded, state.userRole])

  // Clear data when user logs out
  useEffect(() => {
    if (!user) {
      console.log("AppState: User logged out, clearing data")
      dispatch({ type: "CLEAR_DATA" })
    }
  }, [user])

  const addClient = (client: Client) => {
    dispatch({ type: "ADD_CLIENT", payload: client })
  }

  const addProject = (project: Project) => {
    dispatch({ type: "ADD_PROJECT", payload: project })
  }
  return (
    <AppStateContext.Provider value={{ state, dispatch, addClient, addProject }}>

  return (
    <AppStateContext.Provider value={{ state, dispatch, addClient }}>

      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider")
  }
  return context
}
