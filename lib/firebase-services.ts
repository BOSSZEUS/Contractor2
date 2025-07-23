import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  type QueryConstraint,
  type WhereFilterOp,
} from "firebase/firestore"
import { db } from "./firebase"
import type { UserProfile } from "@/types"

export interface FirestoreFilter {
  field: string
  operator: WhereFilterOp
  value: any
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

// Project Services
export async function getProjects(userId?: string): Promise<Project[]> {
  if (!db) return []
  try {
    if (userId) {
      const q1 = query(collection(db, "projects"), where("contractorId", "==", userId))
      const q2 = query(collection(db, "projects"), where("clientId", "==", userId))
      const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)])
      return [...snap1.docs, ...snap2.docs].map((d) => ({ id: d.id, ...d.data() })) as Project[]
    }
    const snapshot = await getDocs(collection(db, "projects"))
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Project[]
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export async function getProjectsForContractor(contractorId: string): Promise<Project[]> {
  if (!db) return []
  try {
    const q = query(collection(db, "projects"), where("contractorId", "==", contractorId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Project[]
  } catch (error) {
    console.error("Error fetching contractor projects:", error)
    return []
  }
}

export async function getProject(projectId: string): Promise<Project | null> {
  if (!db) return null
  try {
    const snap = await getDoc(doc(db, "projects", projectId))
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Project) : null
  } catch (error) {
    console.error("Error fetching project:", error)
    return null
  }
}

export async function createProject(projectData: any): Promise<string> {
  if (!db) throw new Error("Firestore not initialized")
  try {
    const docRef = await addDoc(collection(db, "projects"), {
      ...projectData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating project:", error)
    throw error
  }
}

export async function updateProject(projectId: string, updates: any): Promise<void> {
  if (!db) throw new Error("Firestore not initialized")
  try {
    await updateDoc(doc(db, "projects", projectId), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating project:", error)
    throw error
  }
}

export async function deleteProject(projectId: string): Promise<void> {
  if (!db) throw new Error("Firestore not initialized")
  try {
    await deleteDoc(doc(db, "projects", projectId))
  } catch (error) {
    console.error("Error deleting project:", error)
    throw error
  }
}

// Client Services
export async function getClients(userId?: string): Promise<Client[]> {
  if (!db) return []
  try {
    if (userId) {
      const q = query(collection(db, "clients"), where("contractorId", "==", userId))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Client[]
    }
    const snapshot = await getDocs(collection(db, "clients"))
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Client[]
  } catch (error) {
    console.error("Error fetching clients:", error)
    return []
  }
}

export async function getClientsForContractor(contractorId: string): Promise<Client[]> {
  if (!db) return []
  try {
    const q = query(collection(db, "clients"), where("contractorId", "==", contractorId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Client[]
  } catch (error) {
    console.error("Error fetching clients for contractor:", error)
    return []
  }
}

export async function getClient(clientId: string): Promise<Client | null> {
  if (!db) return null
  try {
    const docSnap = await getDoc(doc(db, "clients", clientId))
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Client) : null
  } catch (error) {
    console.error("Error fetching client:", error)
    return null
  }
}

export async function createClient(clientData: any): Promise<string> {
  if (!db) throw new Error("Firestore not initialized")
  try {
    const docRef = await addDoc(collection(db, "clients"), {
      ...clientData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating client:", error)
    throw error
  }
}

// Contract Services
export async function getContracts(userId?: string): Promise<Contract[]> {
  if (!db) return []
  try {
    if (userId) {
      const q1 = query(collection(db, "contracts"), where("contractorId", "==", userId))
      const q2 = query(collection(db, "contracts"), where("clientId", "==", userId))
      const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)])
      return [...snap1.docs, ...snap2.docs].map((d) => ({ id: d.id, ...d.data() })) as Contract[]
    }
    const snapshot = await getDocs(collection(db, "contracts"))
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Contract[]
  } catch (error) {
    console.error("Error fetching contracts:", error)
    return []
  }
}

export async function getContract(contractId: string): Promise<Contract | null> {
  if (!db) return null
  try {
    const docSnap = await getDoc(doc(db, "contracts", contractId))
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Contract) : null
  } catch (error) {
    console.error("Error fetching contract:", error)
    return null
  }
}

// Payment Services
export async function getPayments(userId?: string): Promise<any[]> {
  if (!db) return []
  try {
    if (userId) {
      const q = query(collection(db, "payments"), where("userId", "==", userId))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    }
    const snapshot = await getDocs(collection(db, "payments"))
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (error) {
    console.error("Error fetching payments:", error)
    return []
  }
}

export async function getPaymentsForContractor(contractorId: string): Promise<any[]> {
  if (!db) return []
  try {
    const q = query(collection(db, "payments"), where("contractorId", "==", contractorId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (error) {
    console.error("Error fetching contractor payments:", error)
    return []
  }
}

export async function createPayment(paymentData: any): Promise<string> {
  if (!db) throw new Error("Firestore not initialized")
  try {
    const docRef = await addDoc(collection(db, "payments"), {
      ...paymentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating payment:", error)
    throw error
  }
}

// Work Order Services
export async function getWorkOrders(userId?: string): Promise<WorkOrder[]> {
  if (!db) return []
  try {
    if (userId) {
      const q = query(collection(db, "workOrders"), where("clientId", "==", userId))
      const snapshot = await getDocs(q)
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as WorkOrder[]
    }
    const snapshot = await getDocs(collection(db, "workOrders"))
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as WorkOrder[]
  } catch (error) {
    console.error("Error fetching work orders:", error)
    return []
  }
}

export async function getWorkOrdersForContractor(contractorId: string): Promise<WorkOrder[]> {
  if (!db) return []
  try {
    const q = query(collection(db, "workOrders"), where("contractorId", "==", contractorId))
    const snapshot = await getDocs(q)
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as WorkOrder[]
  } catch (error) {
    console.error("Error fetching contractor work orders:", error)
    return []
  }
}

export async function getWorkOrder(workOrderId: string): Promise<WorkOrder | null> {
  if (!db) return null
  try {
    const docSnap = await getDoc(doc(db, "workOrders", workOrderId))
    return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as WorkOrder) : null
  } catch (error) {
    console.error("Error fetching work order:", error)
    return null
  }
}

export async function createWorkOrder(workOrderData: any): Promise<string> {
  if (!db) throw new Error("Firestore not initialized")
  try {
    const docRef = await addDoc(collection(db, "workOrders"), {
      ...workOrderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating work order:", error)
    throw error
  }
}

// User Services
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) return null
  try {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile
    }
    return null
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

export async function updateUserProfile(userId: string, updates: any): Promise<void> {
  if (!db) throw new Error("Firestore not initialized")
  try {
    await updateDoc(doc(db, "users", userId), { ...updates, updatedAt: serverTimestamp() })
  } catch (error) {
    console.error("Error updating user profile:", error)
    throw error
  }
}

// Document Services
export async function getDocuments(userId?: string): Promise<any[]> {
  if (!db) return []
  try {
    const docsRef = collection(db, "documents")
    const q = userId ? query(docsRef, where("userId", "==", userId)) : docsRef
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (error) {
    console.error("Error fetching documents:", error)
    return []
  }
}

export async function getProjectsForUser(uid: string, role: string): Promise<Project[]> {
  if (!db) return []
  try {
    const projectsRef = collection(db, "projects")
    const q =
      role === "contractor"
        ? query(projectsRef, where("contractorId", "==", uid))
        : query(projectsRef, where("clientId", "==", uid))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Project[]
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export async function getQuotesForUser(uid: string, role: string): Promise<Quote[]> {
  if (!db) return []
  try {
    const quotesRef = collection(db, "quotes")
    const q =
      role === "contractor"
        ? query(quotesRef, where("contractorId", "==", uid))
        : query(quotesRef, where("clientId", "==", uid))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Quote[]
  } catch (error) {
    console.error("Error fetching quotes:", error)
    return []
  }
}

export async function getContractsForUser(uid: string, role: string): Promise<Contract[]> {
  if (!db) return []
  try {
    const contractsRef = collection(db, "contracts")
    const q =
      role === "contractor"
        ? query(contractsRef, where("contractorId", "==", uid))
        : query(contractsRef, where("clientId", "==", uid))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Contract[]
  } catch (error) {
    console.error("Error fetching contracts:", error)
    return []
  }
}

export async function getClientsForUser(uid: string): Promise<Client[]> {
  if (!db) return []
  try {
    const clientsRef = collection(db, "clients")
    const q = query(clientsRef, where("contractorId", "==", uid))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Client[]
  } catch (error) {
    console.error("Error fetching clients:", error)
    return []
  }
}

export async function getWorkOrdersForUser(uid: string, role: string): Promise<WorkOrder[]> {
  if (!db) return []
  try {
    const workOrdersRef = collection(db, "workOrders")
    const q =
      role === "contractor"
        ? query(workOrdersRef, where("contractorId", "==", uid))
        : query(workOrdersRef, where("clientId", "==", uid))

    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as WorkOrder[]
  } catch (error) {
    console.error("Error fetching work orders:", error)
    return []
  }
}

// Additional helper functions that might be needed
export async function getProjectById(projectId: string): Promise<Project | null> {
  if (!db) return null
  try {
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
  if (!db) return null
  try {
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
  if (!db) return null
  try {
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

export async function updateQuoteStatus(quoteId: string, status: string): Promise<void> {
  if (!db) return
  try {
    await updateDoc(doc(db, "quotes", quoteId), { status })
  } catch (error) {
    console.error("Error updating quote status:", error)
  }
}

export async function createProjectFromQuote(quote: Quote): Promise<string> {
  const newId = `proj_${Date.now()}`
  const projectData: Project = {
    id: newId,
    title: "New Project",
    description: quote.description || "Project from accepted quote",
    status: "active",
    clientId: quote.clientId,
    contractorId: quote.contractorId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  if (!db) return newId
  try {
    await setDoc(doc(db, "projects", newId), projectData)
  } catch (error) {
    console.error("Error creating project from quote:", error)
  }
  return newId
}
