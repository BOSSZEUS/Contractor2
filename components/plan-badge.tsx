import { Badge } from "@/components/ui/badge"

type PlanType = "free" | "regular" | "pro"

interface PlanBadgeProps {
  plan: PlanType
  className?: string
}

export function PlanBadge({ plan, className }: PlanBadgeProps) {
  switch (plan) {
    case "free":
      return (
        <Badge variant="outline" className={className}>
          Free Plan
        </Badge>
      )
    case "regular":
      return (
        <Badge variant="secondary" className={className}>
          Regular Plan
        </Badge>
      )
    case "pro":
      return <Badge className={`bg-purple-500 hover:bg-purple-600 ${className}`}>Pro Plan</Badge>
    default:
      return null
  }
}
