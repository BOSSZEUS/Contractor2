import { initializeApp } from "firebase/app"
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { clientEnv } from "../lib/env.client"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: clientEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: clientEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: clientEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: clientEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: clientEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: clientEnv.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export async function seedTestData(_uid: string): Promise<{
  success: boolean
  message?: string
  error?: string
}> {
  console.log("Starting to seed data...")

  try {
    // --- Create Contractor User ---
    const contractorEmail = "contractor@example.com"
    const contractorPassword = "password"
    let contractorUid: string

    try {
      const contractorUserCredential = await createUserWithEmailAndPassword(auth, contractorEmail, contractorPassword)
      contractorUid = contractorUserCredential.user.uid
      console.log("Successfully created contractor auth user.")

      const contractorProfile = {
        uid: contractorUid,
        email: contractorEmail,
        firstName: "John",
        lastName: "The Contractor",
        displayName: "John The Contractor",
        role: "contractor",
        company: "John's General Contracting",
        canActAsClient: true, // <-- FIX: This enables role switching
        createdAt: serverTimestamp(),
        license: {
          number: "CL-12345678",
          state: "CA",
          issueDate: "2022-01-15",
          expiryDate: "2026-01-14",
          verified: true,
        },
      }
      await setDoc(doc(db, "users", contractorUid), contractorProfile)
      console.log("Successfully created contractor profile in Firestore.")
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        console.log("Contractor user already exists. Skipping creation.")
      } else {
        throw error
      }
    }

    // --- Create Client User ---
    const clientEmail = "client@example.com"
    const clientPassword = "password"
    let clientUid: string

    try {
      const clientUserCredential = await createUserWithEmailAndPassword(auth, clientEmail, clientPassword)
      clientUid = clientUserCredential.user.uid
      console.log("Successfully created client auth user.")

      const clientProfile = {
        uid: clientUid,
        email: clientEmail,
        firstName: "Jane",
        lastName: "The Client",
        displayName: "Jane The Client",
        role: "client",
        createdAt: serverTimestamp(),
      }
      await setDoc(doc(db, "users", clientUid), clientProfile)
      console.log("Successfully created client profile in Firestore.")
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        console.log("Client user already exists. Skipping creation.")
      } else {
        throw error
      }
    }

    console.log("Data seeding completed successfully!")
    return { success: true, message: "Seeded test data" }
  } catch (error: any) {
    console.error("Error seeding data:", error)
    return { success: false, error: error.message }
  }
}
