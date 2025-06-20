"use client"

import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"
import UserFeed from "@/components/user-feed"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <Alert className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="mt-2">
          <div className="space-y-2">
            <p className="font-medium">Something went wrong</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
            <Button onClick={resetErrorBoundary} size="sm" className="mt-3">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}

export default function Home() {
  return (
    <div className="h-[cal(100vh-100px)] bg-background">
      <div className="w-fit mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">User Directory</h1>
        </div>

        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<div>Loading...</div>}>
            <UserFeed />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}
