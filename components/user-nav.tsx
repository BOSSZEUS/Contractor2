"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useAppState } from "@/contexts/app-state-context"
import { LogOut, Settings, User, RefreshCw } from "lucide-react"
import Link from "next/link"

export function UserNav() {
  const { userProfile, logout } = useAuth()
  const { state, dispatch } = useAppState()

  if (!userProfile) {
    return null
  }

  const handleRoleSwitch = () => {
    const newRole = state.userRole === "contractor" ? "client" : "contractor"
    if (process.env.NODE_ENV === "development") {
      console.log("Switching role from", state.userRole, "to", newRole)
    }
    dispatch({ type: "SET_USER_ROLE", payload: newRole })
    dispatch({ type: "SET_DATA_LOADED", payload: false }) // Force data reload
  }

  // Check if user can switch roles - contractor accounts can act as clients
  const canSwitchRoles = userProfile.role === "contractor" || userProfile.canActAsClient === true

  const displayName =
    userProfile.firstName && userProfile.lastName
      ? `${userProfile.firstName} ${userProfile.lastName}`
      : userProfile.displayName || userProfile.email?.split("@")[0] || "User"

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">{userProfile.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs capitalize">
                {userProfile.role} Account
              </Badge>
              {state.userRole !== userProfile.role && (
                <Badge variant="secondary" className="text-xs capitalize">
                  Viewing as {state.userRole}
                </Badge>
              )}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/account" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {canSwitchRoles && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleRoleSwitch} className="cursor-pointer">
              <RefreshCw className="mr-2 h-4 w-4" />
              <span>Switch to {state.userRole === "contractor" ? "Client" : "Contractor"} View</span>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
