"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Building2,
  TrendingUp,
  Calendar,
  PoundSterling,
  MoreVertical,
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"
import { EditVenueModal } from "@/components/edit-venue-modal"
import { AddVenueModal } from "@/components/add-venue-modal"
import { VenueBookingsModal } from "@/components/venue-bookings-modal"

interface Venue {
  id: string
  name: string
  location: string
  type: string
  status: "active" | "maintenance" | "inactive"
  bookings: number
  revenue: number
  capacity?: string
  description?: string
}

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([
    {
      id: "1",
      name: "Elite Conference Center",
      location: "London, UK",
      type: "Conference",
      status: "active",
      bookings: 45,
      revenue: 12500,
    },
    {
      id: "2",
      name: "Premier Sports Complex",
      location: "Manchester, UK",
      type: "Sports",
      status: "active",
      bookings: 78,
      revenue: 18900,
    },
    {
      id: "3",
      name: "Grand Ballroom",
      location: "Birmingham, UK",
      type: "Event",
      status: "active",
      bookings: 32,
      revenue: 9800,
    },
    {
      id: "4",
      name: "Tech Hub",
      location: "Edinburgh, UK",
      type: "Meeting",
      status: "maintenance",
      bookings: 15,
      revenue: 4200,
    },
    {
      id: "5",
      name: "Creative Studio",
      location: "Bristol, UK",
      type: "Workshop",
      status: "inactive",
      bookings: 8,
      revenue: 2100,
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [viewingBookingsVenue, setViewingBookingsVenue] = useState<{
    id: string
    name: string
    location: string
  } | null>(null)
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false)

  const handleEditVenue = (venue: Venue) => {
    setEditingVenue(venue)
    setIsEditModalOpen(true)
  }

  const handleDeleteVenue = (venueId: string) => {
    if (confirm("Are you sure you want to delete this venue?")) {
      setVenues(venues.filter((v) => v.id !== venueId))
    }
  }

  const handleSaveVenue = (updatedVenue: Venue) => {
    setVenues(venues.map((v) => (v.id === updatedVenue.id ? updatedVenue : v)))
    setIsEditModalOpen(false)
  }

  const handleAddVenue = (newVenueData: {
    name: string
    location: string
    type: string
    capacity: string
    status: string
    description: string
  }) => {
    const newVenue: Venue = {
      id: (Math.max(...venues.map((v) => Number.parseInt(v.id))) + 1).toString(),
      name: newVenueData.name,
      location: newVenueData.location,
      type: newVenueData.type,
      status: newVenueData.status as "active" | "maintenance" | "inactive",
      bookings: 0,
      revenue: 0,
      capacity: newVenueData.capacity,
      description: newVenueData.description,
    }
    setVenues([...venues, newVenue])
  }

  const handleViewBookings = (venue: Venue) => {
    setViewingBookingsVenue({
      id: venue.id,
      name: venue.name,
      location: venue.location,
    })
    setIsBookingsModalOpen(true)
  }

  const filteredVenues = venues.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === "all" || venue.type.toLowerCase() === typeFilter.toLowerCase()
    const matchesStatus = statusFilter === "all" || venue.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const totalVenues = venues.length
  const activeVenues = venues.filter((v) => v.status === "active").length
  const totalBookings = venues.reduce((sum, v) => sum + v.bookings, 0)
  const totalRevenue = venues.reduce((sum, v) => sum + v.revenue, 0)

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Venue Management</h1>
              <p className="text-gray-500 mt-1">Manage your venues and facilities</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
                  <Building2 className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalVenues}</div>
                  <p className="text-xs text-gray-500 mt-1">Across all locations</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Venues</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeVenues}</div>
                  <p className="text-xs text-gray-500 mt-1">Currently operational</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalBookings}</div>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <PoundSterling className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">£{totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search venues by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
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
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Venue
              </Button>
            </div>

            {/* Venues Table */}
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Venue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bookings
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVenues.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center">
                          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-semibold text-gray-900">No venues found</h3>
                          <p className="mt-1 text-sm text-gray-500">
                            {searchQuery || typeFilter !== "all" || statusFilter !== "all"
                              ? "Try adjusting your search or filters"
                              : "Get started by adding your first venue"}
                          </p>
                          {!searchQuery && typeFilter === "all" && statusFilter === "all" && (
                            <div className="mt-6">
                              <Button onClick={() => setIsAddModalOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Your First Venue
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredVenues.map((venue) => (
                        <tr key={venue.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{venue.name}</div>
                                <div className="text-sm text-gray-500">ID: {venue.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{venue.location}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant="outline"
                              className={
                                venue.type === "Conference"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : venue.type === "Sports"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : venue.type === "Event"
                                      ? "bg-purple-50 text-purple-700 border-purple-200"
                                      : venue.type === "Meeting"
                                        ? "bg-amber-50 text-amber-700 border-amber-200"
                                        : "bg-pink-50 text-pink-700 border-pink-200"
                              }
                            >
                              {venue.type}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant="outline"
                              className={
                                venue.status === "active"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : venue.status === "maintenance"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                              }
                            >
                              {venue.status.toUpperCase()}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{venue.bookings}</div>
                            <div className="text-xs text-gray-500">this month</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">£{venue.revenue.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">this month</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditVenue(venue)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit Venue
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewBookings(venue)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Bookings
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteVenue(venue.id)} className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Venue
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Modals */}
      <EditVenueModal
        venue={editingVenue}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleSaveVenue}
      />
      <AddVenueModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onAddVenue={handleAddVenue} />
      <VenueBookingsModal
        venue={viewingBookingsVenue}
        open={isBookingsModalOpen}
        onOpenChange={setIsBookingsModalOpen}
      />
    </div>
  )
}
