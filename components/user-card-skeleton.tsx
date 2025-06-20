import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function UserCardSkeleton() {
  return (
    <Card className="h-full">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />

          <div className="flex-1 space-y-2">
            <div className="space-y-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-40" />
              </div>

              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>

              <div className="flex items-center space-x-2 sm:col-span-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
