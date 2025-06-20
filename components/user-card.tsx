"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, GraduationCap, Building } from "lucide-react"

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

interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  const fullName = `${user.firstName} ${user.lastName}`
  const initials = `${user.firstName[0]}${user.lastName[0]}`

  return (
    <Card
      className="h-[200px] mt-5 hover:shadow-md transition-shadow duration-200 focus-within:ring-0 focus-within:ring-ring focus-within:ring-offset-0 rounded-none"
      tabIndex={0}
      role="article"
      aria-label={`User profile for ${fullName}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12 flex-shrink-0">
            <AvatarImage
              src={user.image || "/placeholder.svg"}
              alt={`${fullName}'s profile picture`}
              crossOrigin="anonymous"
            />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">{initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 space-y-2">
            <div>
              <h3 className="font-semibold text-lg leading-tight truncate">{fullName}</h3>
              <Badge variant="secondary" className="mt-1">
                <Building className="h-3 w-3 mr-1" />
                {user.company.title}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2 min-w-0">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="truncate" title={user.email}>
                  {user.email}
                </span>
              </div>

              <div className="flex items-center space-x-2 min-w-0">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="truncate" title={user.phone}>
                  {user.phone}
                </span>
              </div>

              <div className="flex items-center space-x-2 min-w-0 sm:col-span-2">
                <GraduationCap className="h-4 w-4 flex-shrink-0" />
                <span className="truncate" title={user.university}>
                  {user.university}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
