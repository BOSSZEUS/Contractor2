"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { useAuth } from "./auth-context"
import {
  getProjectsForUser,
  getQuotesForUser,
  getContractsForUser,
  getWorkOrdersForUser,
  getClientsForUser,
  getClients,
} from "@/lib/firebase-services"

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
    case "ADD_PROJECT":
      return { ...state, projects: [...state.projects, action.payload] }
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
    userRole: userProfile?.role || "contractor",
  })

  // Load data from Firestore when user profile is available
  useEffect(() => {
    if (userProfile && user && !state.dataLoaded) {
      dispatch({ type: "SET_LOADING", payload: true })
      const load = async () => {
        try {
          const role = state.userRole
          const uid = user.uid
          const [projects, quotes, contracts, workOrders, clients] = await Promise.all([
            getProjectsForUser(uid, role),
            getQuotesForUser(uid, role),
            getContractsForUser(uid, role),
            getWorkOrdersForUser(uid, role),
            role === "contractor" ? getClientsForUser(uid) : getClients(uid),
          ])
          dispatch({ type: "SET_PROJECTS", payload: projects })
          dispatch({ type: "SET_CLIENTS", payload: clients })
          dispatch({ type: "SET_QUOTES", payload: quotes })
          dispatch({ type: "SET_CONTRACTS", payload: contracts })
          dispatch({ type: "SET_WORK_ORDERS", payload: workOrders })
        } catch (err) {
          console.error("Failed loading app data", err)
        } finally {
          dispatch({ type: "SET_DATA_LOADED", payload: true })
          dispatch({ type: "SET_LOADING", payload: false })
        }
      }
      load()
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
