"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Settings,
  Bell,
  User,
  CreditCard,
  LogOut,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  MoreHorizontal,
  MapPin,
  Users,
  Calendar,
  PoundSterling,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminSidebar } from "@/components/admin-sidebar"

// Mock venue data
const mockVenues = [
  {
    id: "1",
    name: "Elite Conference Center",
    location: "London, UK",
    capacity: 200,
    type: "Conference",
    status: "active",
    bookings: 45,
    revenue: 12500,
    rating: 4.8,
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: "2",
    name: "Premier Sports Complex",
    location: "Manchester, UK",
    capacity: 500,
    type: "Sports",
    status: "active",
    bookings: 78,
    revenue: 18900,
    rating: 4.6,
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: "3",
    name: "Grand Ballroom",
    location: "Birmingham, UK",
    capacity: 300,
    type: "Event",
    status: "active",
    bookings: 32,
    revenue: 9800,
    rating: 4.9,
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: "4",
    name: "Tech Hub",
    location: "Edinburgh, UK",
    capacity: 100,
    type: "Meeting",
    status: "maintenance",
    bookings: 15,
    revenue: 4200,
    rating: 4.5,
    image: "/placeholder.svg?height=100&width=150",
  },
  {
    id: "5",
    name: "Creative Studio",
    location: "Bristol, UK",
    capacity: 80,
    type: "Workshop",
    status: "inactive",
    bookings: 8,
    revenue: 2100,
    rating: 4.3,
    image: "/placeholder.svg?height=100&width=150",
  },
]

// Mock logged-in user data
const loggedInUser = {
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@zeus.com",
  role: "admin",
}

export default function VenuesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter venues based on search and filters
  const filteredVenues = mockVenues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || venue.type.toLowerCase() === typeFilter.toLowerCase()
    const matchesStatus = statusFilter === "all" || venue.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "conference":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "sports":
        return "bg-green-100 text-green-800 border-green-200"
      case "event":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "meeting":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "workshop":
        return "bg-pink-100 text-pink-800 border-pink-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-800">Venue Management</span>
                <span className="text-sm text-slate-600">Manage your venues and facilities</span>
              </div>
              <div className="flex items-center space-x-4">
                {/* Notification Bell */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
                </Button>

                {/* Profile Circle with Initials */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                      <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                        {loggedInUser.firstName.charAt(0)}
                        {loggedInUser.lastName.charAt(0)}
                      </div>
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center space-x-3 p-2">
                        <div className="h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                          {loggedInUser.firstName.charAt(0)}
                          {loggedInUser.lastName.charAt(0)}
                        </div>
                        <div className="flex flex-col space-y-1">
                          <p className="text-base font-medium leading-none">
                            {loggedInUser.firstName} {loggedInUser.lastName}
                          </p>
                          <p className="text-sm leading-none text-muted-foreground">{loggedInUser.email}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-3 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-3 h-4 w-4" />
                      <span>Security</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <CreditCard className="mr-3 h-4 w-4" />
                      <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Venues</h1>
              <p className="text-slate-600 mt-2">Manage your venue portfolio and facilities</p>
            </div>
            <Button className="zeus-gradient text-white hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Add Venue
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="zeus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Venues</CardTitle>
                <Building2 className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{mockVenues.length}</div>
                <p className="text-xs text-slate-500 mt-1">Across all locations</p>
              </CardContent>
            </Card>

            <Card className="zeus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Active Venues</CardTitle>
                <Building2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {mockVenues.filter((venue) => venue.status === "active").length}
                </div>
                <p className="text-xs text-green-600 mt-1">Currently operational</p>
              </CardContent>
            </Card>

            <Card className="zeus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {mockVenues.reduce((sum, venue) => sum + venue.bookings, 0)}
                </div>
                <p className="text-xs text-slate-500 mt-1">This month</p>
              </CardContent>
            </Card>

            <Card className="zeus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
                <PoundSterling className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  £{mockVenues.reduce((sum, venue) => sum + venue.revenue, 0).toLocaleString()}
                </div>
                <p className="text-xs text-slate-500 mt-1">This month</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search venues by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Venues Table */}
          <Card className="zeus-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Venue</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVenues.map((venue) => (
                    <TableRow key={venue.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <img
                            src={venue.image || "/placeholder.svg"}
                            alt={venue.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium text-slate-800">{venue.name}</p>
                            <p className="text-sm text-slate-500">ID: {venue.id}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-slate-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          {venue.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(venue.type)}>{venue.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-slate-600">
                          <Users className="w-3 h-3 mr-1" />
                          {venue.capacity}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(venue.status)}>{venue.status.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-slate-800 font-medium">{venue.bookings}</p>
                        <p className="text-xs text-slate-500">this month</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-slate-800 font-medium">£{venue.revenue.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">this month</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-slate-800">{venue.rating}</span>
                          <span className="text-yellow-400 ml-1">★</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Venue
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="mr-2 h-4 w-4" />
                              View Bookings
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Venue
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {filteredVenues.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No venues found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setTypeFilter("all")
                  setStatusFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
