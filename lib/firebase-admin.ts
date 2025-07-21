// lib/firebase-admin.ts
import { cert, getApps, getApp, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

// Initialize Firebase Admin using environment variables
const adminConfig = {
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
}

export const adminApp = getApps().length ? getApp() : initializeApp(adminConfig)

export const adminAuth = getAuth(adminApp)
