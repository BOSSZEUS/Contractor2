import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  type QueryConstraint,
  type WhereFilterOp,
} from "firebase/firestore"
import { db } from "./firebase"

export interface FirestoreFilter {
  field: string
  operator: WhereFilterOp
  value: any
}

export interface UserProfile {
  uid: string
  email: string
  firstName?: string
  lastName?: string
  displayName?: string
  role: "client" | "contractor"
  currentRole?: "client" | "contractor"
  canActAsClient?: boolean
  verified?: boolean
  company?: string
  bio?: string
  licenseNumber?: string
  licenseState?: string
  licenseExpiry?: string
  createdAt?: any
  updatedAt?: any
}

export interface Project {
  id: string
  title: string
  description: string
  status: "pending" | "active" | "completed" | "cancelled"
  budget?: number
  clientId: string
  contractorId?: string
  createdAt: any
  updatedAt: any
}

export interface Quote {
  id: string
  projectId: string
  contractorId: string
  clientId: string
  amount: number
  description: string
  status: "pending" | "accepted" | "rejected"
  createdAt: any
  updatedAt: any
}

export interface Contract {
  id: string
  title: string
  projectId: string
  clientId: string
  contractorId: string
  client?: string
  clientName?: string
  project?: string
  projectName?: string
  amount: number
  value?: number
  status: "draft" | "signed" | "completed" | "active" | "pending" | "terminated"
  terms: string
  createdAt: any
  updatedAt: any
  signedDate?: any
  startDate?: any
}

export interface Client {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  address?: string
  createdAt: any
  updatedAt: any
}

export interface WorkOrder {
  id: string
  title: string
  description: string
  clientId: string
  status: "pending" | "in_progress" | "completed"
  budget?: number
  createdAt: any
  updatedAt: any
}

export const firestoreService = {
  async getDocument(collectionName: string, docId: string) {
    if (!db) return null
    try {
      const docRef = doc(db, collectionName, docId)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
    } catch (error) {
      console.error("Error getting document:", error)
      return null
    }
  },

  async getDocuments(
    collectionName: string,
    filters: FirestoreFilter[] = [],
    orderField?: string,
  ) {
    if (!db) return []
    try {
      const constraints: QueryConstraint[] = []
      filters.forEach((f) =>
        constraints.push(where(f.field, f.operator, f.value)),
      )
      if (orderField) constraints.push(orderBy(orderField))
      const q = constraints.length
        ? query(collection(db, collectionName), ...constraints)
        : query(collection(db, collectionName))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    } catch (error) {
      console.error("Error getting documents:", error)
      return []
    }
  },

  async addDocument(collectionName: string, data: any) {
    if (!db) return null
    try {
      const docRef = await addDoc(collection(db, collectionName), data)
      return docRef.id
    } catch (error) {
      console.error("Error adding document:", error)
      return null
    }
  },

  async updateDocument(collectionName: string, docId: string, updates: any) {
    if (!db) return false
    try {
      await updateDoc(doc(db, collectionName, docId), updates)
      return true
    } catch (error) {
      console.error("Error updating document:", error)
      return false
    }
  },

  async deleteDocument(collectionName: string, docId: string) {
    if (!db) return false
    try {
      await deleteDoc(doc(db, collectionName, docId))
      return true
    } catch (error) {
      console.error("Error deleting document:", error)
      return false
    }
  },

  subscribeToDocument(
    collectionName: string,
    docId: string,
    callback: (data: any | null) => void,
  ) {
    if (!db) {
      callback(null)
      return () => {}
    }
    const docRef = doc(db, collectionName, docId)
    return onSnapshot(docRef, (snap) => {
      callback(snap.exists() ? { id: snap.id, ...snap.data() } : null)
    })
  },

  subscribeToCollection(
    collectionName: string,
    callback: (data: any[]) => void,
    filters: FirestoreFilter[] = [],
    orderField?: string,
  ) {
    if (!db) {
      callback([])
      return () => {}
    }
    const constraints: QueryConstraint[] = []
    filters.forEach((f) => constraints.push(where(f.field, f.operator, f.value)))
    if (orderField) constraints.push(orderBy(orderField))
    const q = constraints.length
      ? query(collection(db, collectionName), ...constraints)
      : query(collection(db, collectionName))
    return onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
  },
}

// Mock data for v0 preview
const mockUserProfile: UserProfile = {
  uid: "mock-user-id",
  email: "demo@example.com",
  firstName: "John",
  lastName: "Doe",
  displayName: "John Doe",
  role: "contractor",
  currentRole: "contractor",
  canActAsClient: true,
  verified: true,
  company: "Doe Construction",
  bio: "Experienced contractor with 10+ years in residential construction",
  licenseNumber: "C-12345",
  licenseState: "CA",
  licenseExpiry: "2025-12-31",
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockProjects: Project[] = [
  {
    id: "proj-1",
    title: "Kitchen Renovation",
    description: "Complete kitchen remodel including cabinets, countertops, and appliances",
    status: "active",
    budget: 25000,
    clientId: "client-1",
    contractorId: "mock-user-id",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "proj-2",
    title: "Bathroom Upgrade",
    description: "Master bathroom renovation with new fixtures and tile work",
    status: "pending",
    budget: 15000,
    clientId: "client-2",
    contractorId: "mock-user-id",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "proj-3",
    title: "Deck Construction",
    description: "Build new outdoor deck with composite materials",
    status: "completed",
    budget: 8000,
    clientId: "client-1",
    contractorId: "mock-user-id",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockQuotes: Quote[] = [
  {
    id: "quote-1",
    projectId: "proj-1",
    contractorId: "mock-user-id",
    clientId: "client-1",
    amount: 25000,
    description: "Complete kitchen renovation including materials and labor",
    status: "accepted",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "quote-2",
    projectId: "proj-2",
    contractorId: "mock-user-id",
    clientId: "client-2",
    amount: 15000,
    description: "Bathroom renovation with premium fixtures",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockContracts: Contract[] = [
  {
    id: "contract-1",
    title: "Kitchen Renovation Contract",
    projectId: "proj-1",
    clientId: "client-1",
    contractorId: "mock-user-id",
    client: "Alice Johnson",
    clientName: "Alice Johnson",
    project: "Kitchen Renovation",
    projectName: "Kitchen Renovation",
    amount: 25000,
    value: 25000,
    status: "signed",
    terms: "Standard construction contract with 30-day completion timeline",
    createdAt: new Date(),
    updatedAt: new Date(),
    signedDate: new Date("2024-01-10"),
    startDate: new Date("2024-01-15"),
  },
  {
    id: "contract-2",
    title: "Bathroom Upgrade Contract",
    projectId: "proj-2",
    clientId: "client-2",
    contractorId: "mock-user-id",
    client: "Bob Smith",
    clientName: "Bob Smith",
    project: "Bathroom Upgrade",
    projectName: "Bathroom Upgrade",
    amount: 15000,
    value: 15000,
    status: "active",
    terms: "Bathroom renovation contract with premium fixtures",
    createdAt: new Date(),
    updatedAt: new Date(),
    signedDate: new Date("2024-02-01"),
    startDate: new Date("2024-02-05"),
  },
  {
    id: "contract-3",
    title: "Deck Construction Contract",
    projectId: "proj-3",
    clientId: "client-1",
    contractorId: "mock-user-id",
    client: "Alice Johnson",
    clientName: "Alice Johnson",
    project: "Deck Construction",
    projectName: "Deck Construction",
    amount: 8000,
    value: 8000,
    status: "completed",
    terms: "Outdoor deck construction with composite materials",
    createdAt: new Date(),
    updatedAt: new Date(),
    signedDate: new Date("2024-03-01"),
    startDate: new Date("2024-03-05"),
  },
]

const mockClients: Client[] = [
  {
    id: "client-1",
    name: "Alice Johnson",
    email: "alice@example.com",
    company: "Johnson Enterprises",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, CA 90210",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "client-2",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "(555) 987-6543",
    address: "456 Oak Ave, Somewhere, CA 90211",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockWorkOrders: WorkOrder[] = [
  {
    id: "wo-1",
    title: "Plumbing Repair",
    description: "Fix leaky pipes in basement",
    clientId: "client-1",
    status: "pending",
    budget: 500,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "wo-2",
    title: "Electrical Work",
    description: "Install new outlets in garage",
    clientId: "client-2",
    status: "in_progress",
    budget: 800,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockPayments: any[] = [
  // Mock payment data here
]

// Project Services
export async function getProjects(userId?: string): Promise<Project[]> {
  try {
    // In v0 preview, return mock data
    return mockProjects
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export async function getProjectsForContractor(contractorId: string): Promise<Project[]> {
  try {
    // In v0 preview, return mock data filtered by contractor
    return mockProjects.filter((project) => project.contractorId === contractorId)
  } catch (error) {
    console.error("Error fetching contractor projects:", error)
    return []
  }
}

export async function getProject(projectId: string): Promise<Project | null> {
  try {
    // In v0 preview, return mock data
    return mockProjects.find((project) => project.id === projectId) || null
  } catch (error) {
    console.error("Error fetching project:", error)
    return null
  }
}

export async function createProject(projectData: any): Promise<string> {
  try {
    // In v0 preview, simulate creation
    const newId = `proj_${Date.now()}`
    console.log("Created project:", newId, projectData)
    return newId
  } catch (error) {
    console.error("Error creating project:", error)
    throw error
  }
}

export async function updateProject(projectId: string, updates: any): Promise<void> {
  try {
    // In v0 preview, simulate update
    console.log("Updated project:", projectId, updates)
  } catch (error) {
    console.error("Error updating project:", error)
    throw error
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  try {
    // In v0 preview, simulate deletion
    console.log("Deleted project:", projectId)
  } catch (error) {
    console.error("Error deleting project:", error)
    throw error
  }
}

// Client Services
export async function getClients(userId?: string): Promise<Client[]> {
  try {
    // In v0 preview, return mock data
    return mockClients
  } catch (error) {
    console.error("Error fetching clients:", error)
    return []
  }
}

export async function getClientsForContractor(contractorId: string): Promise<Client[]> {
  try {
    // In v0 preview, return mock data
    return mockClients
  } catch (error) {
    console.error("Error fetching clients for contractor:", error)
    return []
  }
}

export async function getClient(clientId: string): Promise<Client | null> {
  try {
    // In v0 preview, return mock data
    return mockClients.find((client) => client.id === clientId) || null
  } catch (error) {
    console.error("Error fetching client:", error)
    return null
  }
}

export async function createClient(clientData: any): Promise<string> {
  try {
    // In v0 preview, simulate creation
    const newId = `client_${Date.now()}`
    console.log("Created client:", newId, clientData)
    return newId
  } catch (error) {
    console.error("Error creating client:", error)
    throw error
  }
}

// Contract Services
export async function getContracts(userId?: string): Promise<Contract[]> {
  try {
    // In v0 preview, return mock data
    return mockContracts
  } catch (error) {
    console.error("Error fetching contracts:", error)
    return []
  }
}

export async function getContract(contractId: string): Promise<Contract | null> {
  try {
    // In v0 preview, return mock data
    return mockContracts.find((contract) => contract.id === contractId) || null
  } catch (error) {
    console.error("Error fetching contract:", error)
    return null
  }
}

// Payment Services
export async function getPayments(userId?: string): Promise<any[]> {
  try {
    // In v0 preview, return mock data
    return mockPayments
  } catch (error) {
    console.error("Error fetching payments:", error)
    return []
  }
}

export async function getPaymentsForContractor(contractorId: string): Promise<any[]> {
  try {
    // In v0 preview, return mock data
    return mockPayments
  } catch (error) {
    console.error("Error fetching contractor payments:", error)
    return []
  }
}

export async function createPayment(paymentData: any): Promise<string> {
  try {
    // In v0 preview, simulate creation
    const newId = `payment_${Date.now()}`
    console.log("Created payment:", newId, paymentData)
    return newId
  } catch (error) {
    console.error("Error creating payment:", error)
    throw error
  }
}

// Work Order Services
export async function getWorkOrders(userId?: string): Promise<WorkOrder[]> {
  try {
    // In v0 preview, return mock data
    return mockWorkOrders
  } catch (error) {
    console.error("Error fetching work orders:", error)
    return []
  }
}

export async function getWorkOrdersForContractor(contractorId: string): Promise<WorkOrder[]> {
  try {
    // In v0 preview, return mock data
    return mockWorkOrders
  } catch (error) {
    console.error("Error fetching contractor work orders:", error)
    return []
  }
}

export async function getWorkOrder(workOrderId: string): Promise<WorkOrder | null> {
  try {
    // In v0 preview, return mock data
    return mockWorkOrders.find((wo) => wo.id === workOrderId) || null
  } catch (error) {
    console.error("Error fetching work order:", error)
    return null
  }
}

export async function createWorkOrder(workOrderData: any): Promise<string> {
  try {
    // In v0 preview, simulate creation
    const newId = `wo_${Date.now()}`
    console.log("Created work order:", newId, workOrderData)
    return newId
  } catch (error) {
    console.error("Error creating work order:", error)
    throw error
  }
}

// User Services
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    // For v0 preview, return mock data
    if (process.env.NODE_ENV === "development" || !db) {
      return mockUserProfile
    }

    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile
    }
    return null
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return mockUserProfile // Fallback to mock data
  }
}

export async function updateUserProfile(userId: string, updates: any): Promise<void> {
  try {
    // In v0 preview, simulate update
    console.log("Updated user profile:", userId, updates)
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// Document Services
export async function getDocuments(userId?: string): Promise<any[]> {
  try {
    // In v0 preview, return mock documents
    return [
      {
        id: "doc_001",
        name: "Kitchen Contract.pdf",
        type: "contract",
        size: "2.4 MB",
        uploadDate: "2024-01-10",
        projectId: "proj-1",
      },
      {
        id: "doc_002",
        name: "Bathroom Plans.pdf",
        type: "plans",
        size: "5.1 MB",
        uploadDate: "2024-01-25",
        projectId: "proj-2",
      },
    ]
  } catch (error) {
    console.error("Error fetching documents:", error)
    return []
  }
}

export async function getProjectsForUser(uid: string, role: string): Promise<Project[]> {
  try {
    // For v0 preview, return mock data
    if (process.env.NODE_ENV === "development" || !db) {
      return mockProjects
    }

    const projectsRef = collection(db, "projects")
    const q =
      role === "contractor"
        ? query(projectsRef, where("contractorId", "==", uid))
        : query(projectsRef, where("clientId", "==", uid))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Project)
  } catch (error) {
    console.error("Error fetching projects:", error)
    return mockProjects // Fallback to mock data
  }
}

export async function getQuotesForUser(uid: string, role: string): Promise<Quote[]> {
  try {
    // For v0 preview, return mock data
    if (process.env.NODE_ENV === "development" || !db) {
      return mockQuotes
    }

    const quotesRef = collection(db, "quotes")
    const q =
      role === "contractor"
        ? query(quotesRef, where("contractorId", "==", uid))
        : query(quotesRef, where("clientId", "==", uid))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Quote)
  } catch (error) {
    console.error("Error fetching quotes:", error)
    return mockQuotes // Fallback to mock data
  }
}

export async function getContractsForUser(uid: string, role: string): Promise<Contract[]> {
  try {
    // For v0 preview, return mock data
    if (process.env.NODE_ENV === "development" || !db) {
      return mockContracts
    }

    const contractsRef = collection(db, "contracts")
    const q =
      role === "contractor"
        ? query(contractsRef, where("contractorId", "==", uid))
        : query(contractsRef, where("clientId", "==", uid))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Contract)
  } catch (error) {
    console.error("Error fetching contracts:", error)
    return mockContracts // Fallback to mock data
  }
}

export async function getClientsForUser(uid: string): Promise<Client[]> {
  try {
    // For v0 preview, return mock data
    if (process.env.NODE_ENV === "development" || !db) {
      return mockClients
    }

    const clientsRef = collection(db, "clients")
    const q = query(clientsRef, where("contractorId", "==", uid))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Client)
  } catch (error) {
    console.error("Error fetching clients:", error)
    return mockClients // Fallback to mock data
  }
}

export async function getWorkOrdersForUser(uid: string, role: string): Promise<WorkOrder[]> {
  try {
    // For v0 preview, return mock data
    if (process.env.NODE_ENV === "development" || !db) {
      return mockWorkOrders
    }

    const workOrdersRef = collection(db, "workOrders")
    const q =
      role === "contractor"
        ? query(workOrdersRef, where("contractorId", "==", uid))
        : query(workOrdersRef, where("clientId", "==", uid))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as WorkOrder)
  } catch (error) {
    console.error("Error fetching work orders:", error)
    return mockWorkOrders // Fallback to mock data
  }
}

// Additional helper functions that might be needed
export async function getProjectById(projectId: string): Promise<Project | null> {
  try {
    if (process.env.NODE_ENV === "development" || !db) {
      return mockProjects.find((p) => p.id === projectId) || null
    }

    const projectDoc = await getDoc(doc(db, "projects", projectId))
    if (projectDoc.exists()) {
      return { id: projectDoc.id, ...projectDoc.data() } as Project
    }
    return null
  } catch (error) {
    console.error("Error fetching project:", error)
    return null
  }
}

export async function getQuoteById(quoteId: string): Promise<Quote | null> {
  try {
    if (process.env.NODE_ENV === "development" || !db) {
      return mockQuotes.find((q) => q.id === quoteId) || null
    }

    const quoteDoc = await getDoc(doc(db, "quotes", quoteId))
    if (quoteDoc.exists()) {
      return { id: quoteDoc.id, ...quoteDoc.data() } as Quote
    }
    return null
  } catch (error) {
    console.error("Error fetching quote:", error)
    return null
  }
}

export async function getContractById(contractId: string): Promise<Contract | null> {
  try {
    if (process.env.NODE_ENV === "development" || !db) {
      return mockContracts.find((c) => c.id === contractId) || null
    }

    const contractDoc = await getDoc(doc(db, "contracts", contractId))
    if (contractDoc.exists()) {
      return { id: contractDoc.id, ...contractDoc.data() } as Contract
    }
    return null
  } catch (error) {
    console.error("Error fetching contract:", error)
    return null
  }
}

// Stub implementations for quote generation API
export async function getContractorPricing(_contractorId: string): Promise<any> {
  return null
}

export async function saveGeneratedQuote(_data: any): Promise<string> {
  return "mock-quote-id"
}

export async function getQuote(_id: string): Promise<any> {
  return null
}
