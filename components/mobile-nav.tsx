"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Building } from "lucide-react"
import { useAppState } from "@/contexts/app-state-context"
import { useAuth } from "@/contexts/auth-context"
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

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { state } = useAppState()
  const { userProfile } = useAuth()
  const { userRole } = state

  const routes = useMemo(() => {
    // Guard against undefined userRole
    if (!userRole) return []

    const baseContractorRoutes = [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/job-board", label: "Available Jobs", icon: ClipboardList },
      { href: "/contractor/my-quotes", label: "My Quotes", icon: FileText },
      { href: "/contractor/projects", label: "My Projects", icon: Home },
      { href: "/contractor/pricing", label: "My Pricing", icon: CreditCard },
      { href: "/project-tools", label: "Project Tools", icon: BarChart2 },
      { href: "/messages", label: "Messages", icon: MessageSquare },
      { href: "/clients", label: "Clients", icon: Users },
      { href: "/contractor/contracts", label: "Contracts", icon: FileText },
      { href: "/contractor/payments", label: "Payments", icon: CreditCard },
      { href: "/documents", label: "Documents", icon: FileText },
      { href: "/account", label: "Account", icon: User },
    ]

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
      { href: "/my-projects", label: "My Projects", icon: Home },
      { href: "/my-contracts", label: "My Contracts", icon: FileText },
      { href: "/messages", label: "Messages", icon: MessageSquare },
      { href: "/my-approvals", label: "Approvals", icon: Clock },
      { href: "/my-payments", label: "Invoices & Payments", icon: CreditCard },
      { href: "/documents", label: "Documents", icon: FileText },
      { href: "/help", label: "Help & Support", icon: FileQuestion },
      { href: "/account", label: "Account", icon: User },
    ]

    return userRole === "contractor" ? baseContractorRoutes : clientRoutes
  }, [userRole, userProfile])

  if (!userRole || routes.length === 0) {
    return null
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden bg-transparent">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Building className="h-6 w-6" />
            <span>Contractor App</span>
          </Link>
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                pathname.startsWith(route.href) ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
