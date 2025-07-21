"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CheckIcon, XIcon, LockIcon } from "lucide-react"
import Link from "next/link"

interface FeatureLimitProps {
  feature: string
  description: string
  currentPlan: "free" | "regular" | "pro"
  requiredPlan: "free" | "regular" | "pro"
  children: React.ReactNode
}

export function FeatureLimit({ feature, description, currentPlan, requiredPlan, children }: FeatureLimitProps) {
  const [open, setOpen] = useState(false)

  const planLevels = {
    free: 0,
    regular: 1,
    pro: 2,
  }

  const hasAccess = planLevels[currentPlan] >= planLevels[requiredPlan]

  if (hasAccess) {
    return <>{children}</>
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] flex items-center justify-center rounded-md z-10">
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <LockIcon className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">
                This feature requires the {requiredPlan.charAt(0).toUpperCase() + requiredPlan.slice(1)} plan
              </p>
              <Button size="sm" variant="outline">
                Upgrade to Access
              </Button>
            </div>
          </div>
          <div className="opacity-40 pointer-events-none">{children}</div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upgrade to Access {feature}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <h3 className="font-medium mb-2">Available on plans:</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-6 mr-2">
                {planLevels["free"] >= planLevels[requiredPlan] ? (
                  <CheckIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <XIcon className="h-5 w-5 text-red-500" />
                )}
              </div>
              <span>Free</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 mr-2">
                {planLevels["regular"] >= planLevels[requiredPlan] ? (
                  <CheckIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <XIcon className="h-5 w-5 text-red-500" />
                )}
              </div>
              <span>Regular ($39/month)</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 mr-2">
                {planLevels["pro"] >= planLevels[requiredPlan] ? (
                  <CheckIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <XIcon className="h-5 w-5 text-red-500" />
                )}
              </div>
              <span>Pro ($99/month)</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button asChild>
            <Link href="/account?tab=billing">Upgrade Now</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
