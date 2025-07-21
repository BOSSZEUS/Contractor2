"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type UserCredential,
} from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"
import { clientAuth, db } from "@/lib/firebase"
import { getUserProfile } from "@/lib/firebase-services"
import type { UserProfile } from "@/types"
import { useToast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  profileLoading: boolean
  signIn: (email: string, password: string) => Promise<UserCredential>
  signUp: (email: string, password: string, profileData: Partial<UserProfile>) => Promise<UserCredential>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [profileLoading, setProfileLoading] = useState(false)
  const { toast } = useToast()

  const signIn = async (email: string, password: string): Promise<UserCredential> => {
    try {
      if (!clientAuth) {
        throw new Error("Firebase not initialized")
      }

      const result = await signInWithEmailAndPassword(clientAuth, email, password)

      const idToken = await result.user.getIdToken()
      await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      })

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      })

      return result
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        title: "Login Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const logout = async () => {
    try {
      if (!clientAuth) {
        throw new Error("Firebase not initialized")
      }

      await signOut(clientAuth)
      setUser(null)
      setUserProfile(null)

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      console.error("Logout error:", error)
      // Clear state anyway
      setUser(null)
      setUserProfile(null)
    }
  }

  const signUp = async (
    email: string,
    password: string,
    profileData: Partial<UserProfile>,
  ): Promise<UserCredential> => {
    try {
      if (!clientAuth || !db) {
        throw new Error("Firebase not initialized")
      }

      const result = await createUserWithEmailAndPassword(clientAuth, email, password)

      // Create user profile
      const userRef = doc(db, "users", result.user.uid)
      const userData = {
        uid: result.user.uid,
        email,
        role: profileData.role || "client",
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }
      await setDoc(userRef, userData)

      toast({
        title: "Account Created",
        description: "Your account has been created successfully!",
      })

      return result
    } catch (error) {
      console.error("Sign up error:", error)
      toast({
        title: "Registration Failed",
        description: "There was an error creating your account. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  useEffect(() => {
    if (!clientAuth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(clientAuth, async (user) => {
      console.log("Auth state changed:", user ? `User: ${user.email}` : "No user")

      setLoading(true)
      setProfileLoading(true)

      if (user) {
        setUser(user)
        try {
          const profile = await getUserProfile(user.uid)
          if (profile) {
            setUserProfile(profile)
            console.log("Profile loaded:", profile)
          } else {
            console.warn("No profile found for user")
            setUserProfile(null)
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
          setUserProfile(null)
        }
      } else {
        setUser(null)
        setUserProfile(null)
      }

      setLoading(false)
      setProfileLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    profileLoading,
    signIn,
    signUp,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
