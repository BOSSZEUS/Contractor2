import type React from "react"

export interface ContractorProfile {
  licenseNumber: string
  licenseType: string
  licenseFileUrl: string
  state: string
  verified: boolean
}

export interface UserProfile {
  uid: string
  firstName: string
  lastName: string
  email: string
  role: "client" | "contractor"
  canActAsClient?: boolean
  verified?: boolean
  contractorProfile?: ContractorProfile
  createdAt: any // Firestore Timestamp
}

export interface MainNavItem {
  title: string
  href: string
  icon?: React.ReactNode
  active?: boolean
  label?: string
}
