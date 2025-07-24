"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { useAppState } from "@/contexts/app-state-context"

export default function MyWorkOrderDetailPage({ params }: { params: { id: string } }) {
  const { state } = useAppState()
  const router = useRouter()

  useEffect(() => {
    if (state.userRole !== "client") {
      router.push("/dashboard")
    }
  }, [state.userRole, router])

  if (state.userRole !== "client") {
    return null
  }

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/my-work-orders">My Work Orders</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbPage>{params.id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold">Work Order Details</h1>
        <p className="text-muted-foreground">
          Placeholder details for work order {params.id}
        </p>
      </div>
    </div>
  )
}
