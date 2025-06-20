"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { FixedSizeList as List } from "react-window"
import InfiniteLoader from "react-window-infinite-loader"
import useSWRInfinite from "swr/infinite"
import { UserCard } from "./user-card"
import { UserCardSkeleton } from "./user-card-skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw, Users } from "lucide-react"

interface User {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  image: string
  university: string
  company: {
    title: string
  }
}

interface ApiResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

const ITEMS_PER_PAGE = 10
const ITEM_HEIGHT = 150

const fetcher = async (url: string): Promise<ApiResponse> => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

const getKey = (pageIndex: number, previousPageData: ApiResponse | null) => {
  if (previousPageData && previousPageData.users.length === 0) return null

  const skip = pageIndex * ITEMS_PER_PAGE
  return `https://tech-test.raintor.com/api/users/GetUsersList?take=${ITEMS_PER_PAGE}&skip=${skip}`
}

export default function UserFeed() {
  const { data, error, size, setSize, isValidating, mutate } = useSWRInfinite<ApiResponse>(getKey, fetcher, {
    revalidateFirstPage: false,
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  })

  const [containerHeight, setContainerHeight] = useState(400)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const availableHeight = window.innerHeight - rect.top - 40
        setContainerHeight(Math.max(400, Math.min(500, availableHeight)))
      }
    }

    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [])

  const allUsers = data ? data.flatMap((page) => page.users) : []
  const totalCount = data?.[0]?.total ?? 0
  const hasNextPage = allUsers.length < totalCount
  const isLoadingMore = isValidating && data && data.length > 0

  const loadMoreItems = useCallback(() => {
    if (!isValidating && hasNextPage) {
      setSize(size + 1)
    }
  }, [hasNextPage, isValidating, setSize, size])

  const isItemLoaded = useCallback(
    (index: number) => {
      return !!allUsers[index]
    },
    [allUsers],
  )

  const Item = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const user = allUsers[index]

    return (
      <div style={style} className="px-4 py-2">
        {user ? <UserCard user={user} /> : <UserCardSkeleton />}
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="mt-2">
            <div className="space-y-2">
              <p className="font-medium">Something went wrong</p>
              <p className="text-sm text-muted-foreground">
                {error.message || "Please check your connection and try again."}
              </p>

            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (data && allUsers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No users found</h3>
        <p className="text-muted-foreground mb-4">There are no users to display at the moment.</p>
        <Button onClick={() => mutate()} disabled={isValidating}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isValidating ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-4">
            <UserCardSkeleton />
          </div>
        ))}
      </div>
    )
  }

  const itemCount = hasNextPage ? allUsers.length + 1 : allUsers.length

  return (
    <div ref={containerRef} className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {allUsers.length} of {totalCount} users
        </p>
        {isLoadingMore && (
          <div className="flex items-center text-sm text-muted-foreground">
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Loading more...
          </div>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden w-[500px]">
        <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems}>
          {({ onItemsRendered, ref }) => (
            <List
              width={"100%"}
              ref={ref}
              height={containerHeight}
              itemCount={itemCount}
              itemSize={ITEM_HEIGHT}
              onItemsRendered={onItemsRendered}
              className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            >
              {Item}
            </List>
          )}
        </InfiniteLoader>
      </div>

      {error && data && (
        <Alert className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>Failed to load more users</span>
              <Button onClick={() => mutate()} size="sm" variant="outline" disabled={isValidating}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isValidating ? "animate-spin" : ""}`} />
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
