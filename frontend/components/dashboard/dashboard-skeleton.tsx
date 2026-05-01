import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#09090B]">
      {/* Top Bar Skeleton */}
      <div className="sticky top-0 z-40 border-b border-[#27272A] bg-[#09090B]/80 backdrop-blur-lg">
        <div className="flex items-center justify-between px-4 md:px-6 py-4">
          <Skeleton className="h-8 w-32 bg-[#27272A]" />
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-24 bg-[#27272A]" />
            <Skeleton className="h-10 w-10 rounded-full bg-[#27272A]" />
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-6">
        {/* Portfolio Summary Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-[#18181B] border-[#27272A]">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg bg-[#27272A]" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-20 bg-[#27272A]" />
                    <Skeleton className="h-6 w-16 bg-[#27272A]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Bar Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-md bg-[#27272A]" />
            ))}
          </div>
          <Skeleton className="h-9 w-48 rounded-md bg-[#27272A]" />
        </div>

        {/* Table Skeleton */}
        <Card className="bg-[#18181B] border-[#27272A]">
          <CardHeader className="border-b border-[#27272A]">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32 bg-[#27272A]" />
              <Skeleton className="h-5 w-24 bg-[#27272A]" />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="grid grid-cols-8 gap-4 px-6 py-3 border-b border-[#27272A] bg-[#0A0A0B]">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton key={i} className="h-4 w-full bg-[#27272A]" />
              ))}
            </div>
            {/* Table Rows */}
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row} className="grid grid-cols-8 gap-4 px-6 py-4 border-b border-[#27272A] last:border-0">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
                  <Skeleton key={col} className="h-4 w-full bg-[#27272A] animate-pulse" />
                ))}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Chart and Activity Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-[#18181B] border-[#27272A]">
            <CardHeader>
              <Skeleton className="h-6 w-40 bg-[#27272A]" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 rounded-full border-2 border-teal border-t-transparent animate-spin" />
                  <Skeleton className="h-4 w-40 bg-[#27272A]" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#18181B] border-[#27272A]">
            <CardHeader>
              <Skeleton className="h-6 w-24 bg-[#27272A]" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full bg-[#27272A]" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full bg-[#27272A]" />
                    <Skeleton className="h-3 w-16 bg-[#27272A]" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Model Breakdown Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="bg-[#18181B] border-[#27272A]">
              <CardContent className="p-4 flex flex-col items-center gap-3">
                <Skeleton className="h-16 w-16 rounded-full bg-[#27272A]" />
                <Skeleton className="h-4 w-20 bg-[#27272A]" />
                <Skeleton className="h-3 w-24 bg-[#27272A]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
