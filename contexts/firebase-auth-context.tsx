"use client"

/**
 * Compatibility shim.
 * Older modules import "@/contexts/firebase-auth-context".
 * We forward those exports from the actual implementation in `auth-context.tsx`.
 */

export * from "./auth-context"
