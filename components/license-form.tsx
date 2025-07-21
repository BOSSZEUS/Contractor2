"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/firebase-auth-context"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { doc, updateDoc } from "firebase/firestore"
import { db, storage } from "@/lib/firebase"
import type { UserProfile } from "@/types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

const licenseTypes = ["General Contractor", "Electrical", "Plumbing", "HVAC", "Roofing", "Other"]
const usStates = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
]

interface LicenseFormProps {
  userProfile: UserProfile | null
  onSuccess?: () => void
}

export function LicenseForm({ userProfile, onSuccess }: LicenseFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    licenseNumber: "",
    licenseType: "",
    state: "",
  })
  const [licenseFile, setLicenseFile] = useState<File | null>(null)
  const [existingFileUrl, setExistingFileUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({
    licenseNumber: "",
    licenseType: "",
    state: "",
    licenseFile: "",
  })

  useEffect(() => {
    if (userProfile?.contractorProfile) {
      setFormData({
        licenseNumber: userProfile.contractorProfile.licenseNumber || "",
        licenseType: userProfile.contractorProfile.licenseType || "",
        state: userProfile.contractorProfile.state || "",
      })
      setExistingFileUrl(userProfile.contractorProfile.licenseFileUrl)
    }
  }, [userProfile])

  const validateForm = () => {
    const newErrors = { licenseNumber: "", licenseType: "", state: "", licenseFile: "" }
    let isValid = true
    if (!formData.licenseNumber) {
      newErrors.licenseNumber = "License number is required."
      isValid = false
    }
    if (!formData.licenseType) {
      newErrors.licenseType = "Please select a license type."
      isValid = false
    }
    if (!formData.state) {
      newErrors.state = "Please select a state."
      isValid = false
    }
    // File is only required if one doesn't already exist
    if (!licenseFile && !existingFileUrl) {
      newErrors.licenseFile = "Please upload your license file."
      isValid = false
    }
    setErrors(newErrors)
    return isValid
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || !user) return

    setIsLoading(true)
    try {
      let licenseFileUrl = existingFileUrl

      // 1. If a new file is provided, upload it
      if (licenseFile) {
        const filePath = `contractor-licenses/${user.uid}/${licenseFile.name}`
        const fileRef = ref(storage, filePath)
        await uploadBytes(fileRef, licenseFile)
        licenseFileUrl = await getDownloadURL(fileRef)
      }

      // 2. Update user document in Firestore
      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, {
        "contractorProfile.licenseNumber": formData.licenseNumber,
        "contractorProfile.licenseType": formData.licenseType,
        "contractorProfile.state": formData.state,
        "contractorProfile.licenseFileUrl": licenseFileUrl,
        // 'verified' status is not changed here, it's an admin-only action
      })

      toast({
        title: "License Information Saved!",
        description: "Your profile has been updated.",
      })
      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error updating license:", error)
      toast({
        title: "Update Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="licenseNumber">License Number</Label>
        <Input
          id="licenseNumber"
          value={formData.licenseNumber}
          onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
        />
        {errors.licenseNumber && <p className="text-sm text-destructive">{errors.licenseNumber}</p>}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="licenseType">License Type</Label>
          <Select onValueChange={(value) => handleInputChange("licenseType", value)} value={formData.licenseType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type..." />
            </SelectTrigger>
            <SelectContent>
              {licenseTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.licenseType && <p className="text-sm text-destructive">{errors.licenseType}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State of Issue</Label>
          <Select onValueChange={(value) => handleInputChange("state", value)} value={formData.state}>
            <SelectTrigger>
              <SelectValue placeholder="Select state..." />
            </SelectTrigger>
            <SelectContent>
              {usStates.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="licenseFile">Upload License (PDF, PNG, JPG)</Label>
        <Input
          id="licenseFile"
          type="file"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={(e) => setLicenseFile(e.target.files ? e.target.files[0] : null)}
        />
        {existingFileUrl && !licenseFile && (
          <p className="text-sm text-muted-foreground">Current file uploaded. To replace it, choose a new file.</p>
        )}
        {errors.licenseFile && <p className="text-sm text-destructive">{errors.licenseFile}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {onSuccess ? "Submit for Verification" : "Save Changes"}
      </Button>
    </form>
  )
}
