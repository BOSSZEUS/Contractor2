import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ReviewPricingLoading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />

          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-48" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-4 border rounded-xl space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <Skeleton className="h-5 w-full max-w-md mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>

                <div className="w-full md:w-32">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4 border-t">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-7 w-24" />
          </div>

          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}
