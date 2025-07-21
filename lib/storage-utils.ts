import { storage } from "@/lib/firebase"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"

// File upload utilities with proper blob URL handling
export class StorageUtils {
  private static blobUrls = new Set<string>()

  // Upload file to Firebase Storage and return download URL
  static async uploadFile(file: File, path: string): Promise<string | null> {
    try {
      if (!storage) {
        console.warn("Firebase Storage not available")
        return null
      }

      if (!file || !file.size) {
        console.warn("Invalid file provided for upload")
        return null
      }

      const storageRef = ref(storage, path)
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)

      console.log("File uploaded successfully:", downloadURL)
      return downloadURL
    } catch (error) {
      console.error("Error uploading file:", error)
      return null
    }
  }

  // Get download URL from Firebase Storage path
  static async getDownloadURL(path: string): Promise<string | null> {
    try {
      if (!storage) {
        console.warn("Firebase Storage not available")
        return null
      }

      const storageRef = ref(storage, path)
      const downloadURL = await getDownloadURL(storageRef)
      return downloadURL
    } catch (error) {
      console.error("Error getting download URL:", error)
      return null
    }
  }

  // Create blob URL with tracking for cleanup
  static createBlobURL(file: File): string | null {
    try {
      if (!file || !file.size) {
        console.warn("Invalid file provided for blob URL creation")
        return null
      }

      const blobUrl = URL.createObjectURL(file)
      this.blobUrls.add(blobUrl)
      return blobUrl
    } catch (error) {
      console.error("Error creating blob URL:", error)
      return null
    }
  }

  // Revoke specific blob URL
  static revokeBlobURL(url: string) {
    try {
      if (url && url.startsWith("blob:")) {
        URL.revokeObjectURL(url)
        this.blobUrls.delete(url)
      }
    } catch (error) {
      console.error("Error revoking blob URL:", error)
    }
  }

  // Revoke all tracked blob URLs
  static revokeAllBlobURLs() {
    try {
      this.blobUrls.forEach((url) => {
        URL.revokeObjectURL(url)
      })
      this.blobUrls.clear()
    } catch (error) {
      console.error("Error revoking all blob URLs:", error)
    }
  }

  // Delete file from Firebase Storage
  static async deleteFile(path: string): Promise<boolean> {
    try {
      if (!storage) {
        console.warn("Firebase Storage not available")
        return false
      }

      const storageRef = ref(storage, path)
      await deleteObject(storageRef)
      console.log("File deleted successfully:", path)
      return true
    } catch (error) {
      console.error("Error deleting file:", error)
      return false
    }
  }

  // Get fallback image URL
  static getFallbackImageURL(type: "profile" | "document" | "project" = "document"): string {
    const fallbacks = {
      profile: "/placeholder.svg?height=100&width=100",
      document: "/placeholder.svg?height=200&width=200",
      project: "/placeholder.svg?height=300&width=400",
    }
    return fallbacks[type]
  }

  // Validate file before processing
  static validateFile(file: File, maxSizeMB = 10, allowedTypes: string[] = []): boolean {
    if (!file) {
      console.warn("No file provided for validation")
      return false
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      console.warn(`File too large: ${file.size} bytes (max: ${maxSizeBytes} bytes)`)
      return false
    }

    // Check file type if specified
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      console.warn(`File type not allowed: ${file.type}`)
      return false
    }

    return true
  }
}

// Cleanup blob URLs when page unloads
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    StorageUtils.revokeAllBlobURLs()
  })
}
