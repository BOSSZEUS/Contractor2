"use client"

import type React from "react"
import { useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  PlusCircle,
  MessageSquare,
  Users,
  FileText,
  CreditCard,
  User,
  BarChart2,
  Home,
  FileQuestion,
  Clock,
  ClipboardList,
} from "lucide-react"
import { useAppState } from "@/contexts/app-state-context"
import { useAuth } from "@/contexts/auth-context"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const { state } = useAppState()
  const { userProfile } = useAuth()
  const { userRole } = state

  const routes = useMemo(() => {
    // Use userProfile.role as fallback if userRole is not set
    const currentRole = userRole || userProfile?.role || "client"

    const isActive = (href: string, isPrefix = false) => (isPrefix ? pathname.startsWith(href) : pathname === href)

    const baseContractorRoutes = [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/job-board", label: "Available Jobs", icon: ClipboardList },
      { href: "/contractor/quotes", label: "My Quotes", icon: FileText },
      { href: "/contractor/projects", label: "My Projects", icon: Home, isPrefix: true },
      { href: "/contractor/pricing", label: "My Pricing", icon: CreditCard, isPrefix: true },
      { href: "/project-tools", label: "Project Tools", icon: BarChart2 },
      { href: "/messages", label: "Messages", icon: MessageSquare },
      { href: "/clients", label: "Clients", icon: Users, isPrefix: true },
      { href: "/contractor/contracts", label: "Contracts", icon: FileText, isPrefix: true },
      { href: "/contractor/payments", label: "Payments", icon: CreditCard, isPrefix: true },
      { href: "/documents", label: "Documents", icon: FileText },
      { href: "/account", label: "Account", icon: User },
    ]

    // A contractor who can also be a client gets a "Post Work Order" button
    if (userProfile?.role === "contractor" && userProfile?.canActAsClient) {
      baseContractorRoutes.splice(2, 0, {
        href: "/post-work-order",
        label: "Post Work Order",
        icon: PlusCircle,
      })
    }

    const clientRoutes = [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/post-work-order", label: "Post Work Order", icon: PlusCircle },
      { href: "/my-work-orders", label: "My Work Orders", icon: ClipboardList },
      { href: "/my-projects", label: "My Projects", icon: Home, isPrefix: true },
      { href: "/my-contracts", label: "My Contracts", icon: FileText, isPrefix: true },
      { href: "/messages", label: "Messages", icon: MessageSquare },
      { href: "/my-approvals", label: "Approvals", icon: Clock },
      { href: "/my-payments", label: "Invoices & Payments", icon: CreditCard, isPrefix: true },
      { href: "/documents", label: "Documents", icon: FileText },
      { href: "/help", label: "Help & Support", icon: FileQuestion },
      { href: "/account", label: "Account", icon: User },
    ]

    const currentRoutes = currentRole === "contractor" ? baseContractorRoutes : clientRoutes

    return currentRoutes.map((route) => ({
      ...route,
      active: isActive(route.href, route.isPrefix),
    }))
  }, [pathname, userRole, userProfile])

  // Show navigation even if role is loading - use default client view
  const displayRole = userRole || userProfile?.role || "client"

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <div className="flex items-center gap-2 mr-4">
        <Badge variant={displayRole === "contractor" ? "default" : "secondary"} className="text-xs capitalize">
          {displayRole} View
        </Badge>
      </div>
      {routes.map((route) => (
        <Button key={route.href} variant={route.active ? "secondary" : "ghost"} asChild className="h-9 px-3">
          <Link href={route.href} className="flex items-center gap-2 text-sm font-medium">
            <route.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{route.label}</span>
          </Link>
        </Button>
      ))}
    </nav>
  )
}
