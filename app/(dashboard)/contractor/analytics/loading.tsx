import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function Loading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>

        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger
              value="quotes"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              asChild
            >
              <Link href="/contractor/my-quotes" className="w-full">
                Quotes
              </Link>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              asChild
            >
              <Link href="/contractor/analytics" className="w-full">
                Analytics
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
