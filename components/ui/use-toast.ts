"use client"

import type React from "react"

import { useState } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function generateId() {
  return `${count++}`
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  function toast({ title, description, variant, action }: Omit<ToastProps, "id">) {
    const id = generateId()

    const newToast = {
      id,
      title,
      description,
      variant,
      action,
    }

    setToasts((prevToasts) => [...prevToasts, newToast].slice(-TOAST_LIMIT))

    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
    }, TOAST_REMOVE_DELAY)

    return id
  }

  function update(id: string, props: Partial<ToastProps>) {
    setToasts((prevToasts) => prevToasts.map((toast) => (toast.id === id ? { ...toast, ...props } : toast)))
  }

  function dismiss(id: string) {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return {
    toast,
    update,
    dismiss,
    toasts,
  }
}
