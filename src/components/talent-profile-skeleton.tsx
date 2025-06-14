import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function TalentProfileSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar Skeleton */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
              <Skeleton className="h-8 w-48 mx-auto mb-2" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex flex-wrap gap-2 justify-center">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
              </div>

              <div className="text-center">
                <Skeleton className="h-6 w-24 mx-auto" />
              </div>

              <div className="border-t pt-6">
                <Skeleton className="h-5 w-16 mb-3" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-14" />
                  <Skeleton className="h-6 w-18" />
                </div>
              </div>

              <div className="space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-16" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>

          {/* Workflows Section Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-5 w-8 ml-2" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-6 w-64" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Skeleton className="h-5 w-12" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-14" />
                    </div>
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
