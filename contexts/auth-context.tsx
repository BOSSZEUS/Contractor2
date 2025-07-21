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
import { getUserProfile, type UserProfile } from "@/lib/firebase-services"
import { useToast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  profileLoading: boolean
  signIn: (email: string, password: string) => Promise<any>
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

  const signIn = async (email: string, password: string) => {
    try {
      // For v0 preview, simulate login with mock data
      if (process.env.NODE_ENV === "development" || !clientAuth) {
        console.log("Mock login for:", email)

        // Create mock user
        const mockUser = {
          uid: "mock-user-id",
          email,
          emailVerified: true,
        } as User

        setUser(mockUser)

        // Create mock profile with contractor permissions
        const mockProfile: UserProfile = {
          uid: "mock-user-id",
          email,
          role: "contractor", // Set as contractor so they can switch views
          canActAsClient: true, // Allow switching to client view
          firstName: "John",
          lastName: "Contractor",
          displayName: "John Contractor",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        setUserProfile(mockProfile)

        toast({
          title: "Login Successful",
          description: "Welcome back!",
        })

        return { user: mockUser }
      }

      // Production: use Firebase Auth
      const result = await signInWithEmailAndPassword(clientAuth, email, password)

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
      if (process.env.NODE_ENV === "development" || !clientAuth) {
        setUser(null)
        setUserProfile(null)
        toast({
          title: "Logged Out",
          description: "You have been successfully logged out.",
        })
        return
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
    // For v0 preview, don't set up Firebase listener
    if (process.env.NODE_ENV === "development" || !clientAuth) {
      setLoading(false)
      return
    }

    // Production: use Firebase auth state listener
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
