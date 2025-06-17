"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CalendarIcon,
  MapPin,
  Clock,
  PoundSterling,
  Settings,
  User,
  Bell,
  LogOut,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

const upcomingBookings = [
  {
    id: 1,
    venue: "Premier Sports Complex",
    space: "3G Pitch - Full",
    date: "2025-01-15",
    time: "14:00 - 16:00",
    status: "confirmed",
    amount: 90,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    venue: "Elite Conference Center",
    space: "Meeting Room A",
    date: "2025-01-18",
    time: "09:00 - 17:00",
    status: "pending",
    amount: 600,
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    venue: "Community Sports Hub",
    space: "Indoor Court 1",
    date: "2025-01-22",
    time: "18:00 - 20:00",
    status: "confirmed",
    amount: 70,
    image: "/placeholder.svg?height=80&width=80",
  },
]

const pastBookings = [
  {
    id: 4,
    venue: "Premier Sports Complex",
    space: "Conference Room B",
    date: "2025-01-05",
    time: "10:00 - 12:00",
    status: "completed",
    amount: 150,
    image: "/placeholder.svg?height=80&width=80",
    canReview: true,
  },
  {
    id: 5,
    venue: "Urban Sports Arena",
    space: "Basketball Court",
    date: "2024-12-28",
    time: "16:00 - 18:00",
    status: "completed",
    amount: 80,
    image: "/placeholder.svg?height=80&width=80",
    canReview: false,
  },
]

export default function CustomerDashboard() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-blue-600" />
      case "pending_payment":
        return <Clock className="w-4 h-4 text-amber-600" />
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <CheckCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending_payment":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">Z</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Zeus</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link href="/browse">Browse Venues</Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="User" />
                      <AvatarFallback>JS</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">John Smith</p>
                      <p className="text-xs leading-none text-muted-foreground">john@example.com</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <PoundSterling className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h1>
          <p className="text-gray-600">Manage your bookings and discover new venues</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Bookings</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Next 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <PoundSterling className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">£1,240</div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorite Venues</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Saved venues</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming Bookings</TabsTrigger>
            <TabsTrigger value="past">Past Bookings</TabsTrigger>
            <TabsTrigger value="favorites">Favorite Venues</TabsTrigger>
          </TabsList>

          {/* Upcoming Bookings */}
          <TabsContent value="upcoming" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Upcoming Bookings</h2>
              <Button asChild>
                <Link href="/browse">Book New Venue</Link>
              </Button>
            </div>

            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={booking.image || "/placeholder.svg"}
                        alt={booking.venue}
                        className="w-20 h-20 rounded-lg object-cover"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold truncate">{booking.venue}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </Badge>
                        </div>

                        <p className="text-gray-600 mb-2">{booking.space}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {new Date(booking.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {booking.time}
                          </div>
                          <div className="flex items-center">
                            <PoundSterling className="w-4 h-4 mr-1" />£{booking.amount}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {booking.status === "confirmed" && (
                          <Button variant="outline" size="sm">
                            Reschedule
                          </Button>
                        )}
                        {booking.status === "pending" && (
                          <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Past Bookings */}
          <TabsContent value="past" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Booking History</h2>
            </div>

            <div className="space-y-4">
              {pastBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={booking.image || "/placeholder.svg"}
                        alt={booking.venue}
                        className="w-20 h-20 rounded-lg object-cover"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold truncate">{booking.venue}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </Badge>
                        </div>

                        <p className="text-gray-600 mb-2">{booking.space}</p>

                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-1" />
                            {new Date(booking.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {booking.time}
                          </div>
                          <div className="flex items-center">
                            <PoundSterling className="w-4 h-4 mr-1" />£{booking.amount}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <Button variant="outline" size="sm">
                          Book Again
                        </Button>
                        {booking.canReview && (
                          <Button variant="outline" size="sm">
                            <Star className="w-4 h-4 mr-1" />
                            Write Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Favorite Venues */}
          <TabsContent value="favorites" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Favorite Venues</h2>
              <Button variant="outline" asChild>
                <Link href="/browse">Discover More Venues</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src="/placeholder.svg?height=200&width=300"
                      alt="Venue"
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </Button>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">Premier Sports Complex</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Downtown District
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">4.8</span>
                        <span className="text-sm text-gray-500 ml-1">(124)</span>
                      </div>
                      <Button size="sm" asChild>
                        <Link href="/venue/1">Book Now</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
