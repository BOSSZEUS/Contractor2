// lib/firebase-admin.ts
// Mock Firebase Admin for v0 preview
export const adminAuth = {
  verifyIdToken: async (token: string) => {
    // Mock verification for preview
    return {
      uid: "mock-user-id",
      email: "user@example.com",
    }
  },
  createCustomToken: async (uid: string) => {
    return "mock-custom-token"
  },
}

export const adminApp = {
  // Mock admin app
}
