// lib/firebase-admin.ts
import { cert, getApps, getApp, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { serverEnv } from "./env.server"

// Initialize Firebase Admin using environment variables
const adminConfig = {
  credential: cert({
    projectId: serverEnv.FIREBASE_PROJECT_ID,
    clientEmail: serverEnv.FIREBASE_CLIENT_EMAIL,
    privateKey: serverEnv.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
}

export const adminApp = getApps().length ? getApp() : initializeApp(adminConfig)

export const adminAuth = getAuth(adminApp)
