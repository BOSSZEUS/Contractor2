import { Skeleton } from "@/components/ui/skeleton"

export default function RequestProjectLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-9 w-72" />
      <Skeleton className="h-[600px] w-full max-w-2xl" />
    </div>
  )
}
