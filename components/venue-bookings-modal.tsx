"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Clock, User, MapPin, Building2, Search, Download, ChevronRight } from "lucide-react"
import { BookingDetailsModal } from "./booking-details-modal"

interface VenueBooking {
  id: string
  spaceName: string
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  startTime: string
  endTime: string
  status: "confirmed" | "pending" | "cancelled" | "completed" | "pending_payment" | "paid"
  attendees: number
  totalPrice: number
  bookingDate: string
  notes?: string
}

interface VenueBookingsModalProps {
  venue: {
    id: string
    name: string
    location: string
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock bookings data
const mockBookings: VenueBooking[] = [
  {
    id: "BK001",
    spaceName: "Main Hall",
    customerName: "John Smith",
    customerEmail: "john.smith@example.com",
    customerPhone: "+44 7700 900001",
    date: "2025-10-25",
    startTime: "09:00",
    endTime: "13:00",
    status: "confirmed",
    attendees: 50,
    totalPrice: 850,
    bookingDate: "2025-10-01",
    notes: "Need projector and sound system setup",
  },
  {
    id: "BK002",
    spaceName: "Conference Room A",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@company.com",
    customerPhone: "+44 7700 900002",
    date: "2025-10-22",
    startTime: "14:00",
    endTime: "17:00",
    status: "confirmed",
    attendees: 20,
    totalPrice: 450,
    bookingDate: "2025-09-28",
    notes: "Board meeting - need whiteboard and markers",
  },
  {
    id: "BK003",
    spaceName: "Training Room",
    customerName: "Michael Brown",
    customerEmail: "m.brown@business.com",
    customerPhone: "+44 7700 900003",
    date: "2025-10-18",
    startTime: "10:00",
    endTime: "16:00",
    status: "completed",
    attendees: 30,
    totalPrice: 720,
    bookingDate: "2025-09-15",
    notes: "Training session - need laptop connections for all attendees",
  },
  {
    id: "BK004",
    spaceName: "Main Hall",
    customerName: "Emma Wilson",
    customerEmail: "emma.w@events.com",
    customerPhone: "+44 7700 900004",
    date: "2025-11-05",
    startTime: "09:00",
    endTime: "18:00",
    status: "pending",
    attendees: 100,
    totalPrice: 1500,
    bookingDate: "2025-10-10",
    notes: "Corporate conference - full day event with catering required",
  },
  {
    id: "BK005",
    spaceName: "Meeting Room B",
    customerName: "David Lee",
    customerEmail: "david.lee@startup.com",
    customerPhone: "+44 7700 900005",
    date: "2025-10-15",
    startTime: "11:00",
    endTime: "13:00",
    status: "cancelled",
    attendees: 15,
    totalPrice: 280,
    bookingDate: "2025-09-20",
    notes: "Client meeting - cancelled due to schedule conflict",
  },
  {
    id: "BK006",
    spaceName: "Conference Room A",
    customerName: "Lisa Anderson",
    customerEmail: "l.anderson@corp.com",
    customerPhone: "+44 7700 900006",
    date: "2025-10-28",
    startTime: "09:00",
    endTime: "12:00",
    status: "confirmed",
    attendees: 25,
    totalPrice: 520,
    bookingDate: "2025-10-05",
    notes: "Strategy planning session",
  },
  {
    id: "BK007",
    spaceName: "Training Room",
    customerName: "Robert Taylor",
    customerEmail: "r.taylor@edu.com",
    customerPhone: "+44 7700 900007",
    date: "2025-11-12",
    startTime: "13:00",
    endTime: "17:00",
    status: "confirmed",
    attendees: 35,
    totalPrice: 680,
    bookingDate: "2025-10-12",
    notes: "Educational workshop - need flip charts",
  },
  {
    id: "BK008",
    spaceName: "Main Hall",
    customerName: "Jennifer White",
    customerEmail: "j.white@social.com",
    customerPhone: "+44 7700 900008",
    date: "2025-10-10",
    startTime: "18:00",
    endTime: "22:00",
    status: "completed",
    attendees: 80,
    totalPrice: 1200,
    bookingDate: "2025-09-10",
    notes: "Evening gala event",
  },
]

export function VenueBookingsModal({ venue, open, onOpenChange }: VenueBookingsModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  if (!venue) return null

  const today = new Date().toISOString().split("T")[0]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending_payment":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "paid":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const filterBookings = (bookings: VenueBooking[], tab: string) => {
    let filtered = bookings

    // Filter by time period
    if (tab === "upcoming") {
      filtered = filtered.filter((b) => b.date >= today && b.status !== "completed")
    } else if (tab === "past") {
      filtered = filtered.filter((b) => b.date < today || b.status === "completed")
    } else if (tab === "pending") {
      filtered = filtered.filter((b) => b.status === "pending")
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (b) =>
          b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.spaceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const filteredBookings = filterBookings(mockBookings, activeTab)

  const stats = {
    total: mockBookings.length,
    upcoming: mockBookings.filter((b) => b.date >= today && b.status !== "completed").length,
    past: mockBookings.filter((b) => b.date < today || b.status === "completed").length,
    pending: mockBookings.filter((b) => b.status === "pending").length,
  }

  const totalRevenue = mockBookings.filter((b) => b.status !== "cancelled").reduce((sum, b) => sum + b.totalPrice, 0)

  const handleViewDetails = (booking: VenueBooking) => {
    // Convert booking to format expected by BookingDetailsModal
    const formattedBooking = {
      id: booking.id,
      venue: venue.name,
      space: booking.spaceName,
      date: booking.date,
      time: `${booking.startTime} - ${booking.endTime}`,
      amount: booking.totalPrice.toString(),
      status: booking.status,
      notes: booking.notes || "",
      customer: {
        name: booking.customerName,
        email: booking.customerEmail,
        phone: booking.customerPhone,
      },
      createdAt: booking.bookingDate,
    }
    setSelectedBooking(formattedBooking)
    setDetailsModalOpen(true)
  }

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    console.log(`Changing status of ${bookingId} to ${newStatus}`)
    // Handle status change logic here
    setDetailsModalOpen(false)
  }

  const handleEdit = (bookingId: string, updatedData: any) => {
    console.log(`Editing booking ${bookingId}`, updatedData)
    // Handle edit logic here
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div>
                <DialogTitle className="text-2xl font-bold">Venue Bookings</DialogTitle>
                <div className="flex items-center gap-2 mt-2 text-slate-600">
                  <Building2 className="w-4 h-4" />
                  <span className="font-semibold">{venue.name}</span>
                  <ChevronRight className="w-4 h-4" />
                  <MapPin className="w-4 h-4" />
                  <span>{venue.location}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </DialogHeader>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-slate-600">Total Bookings</div>
                <div className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-slate-600">Upcoming</div>
                <div className="text-2xl font-bold text-green-600 mt-1">{stats.upcoming}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-slate-600">Pending</div>
                <div className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-slate-600">Total Revenue</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">£{totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex gap-2 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search by booking ID, customer, space..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming ({stats.upcoming})</TabsTrigger>
              <TabsTrigger value="past">Past ({stats.past})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {filteredBookings.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 font-medium">No bookings found</p>
                      <p className="text-slate-500 text-sm mt-1">
                        {searchQuery ? "Try adjusting your search" : "There are no bookings in this category"}
                      </p>
                    </div>
                  ) : (
                    filteredBookings.map((booking) => (
                      <Card key={booking.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                  <Calendar className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-slate-800">{booking.id}</span>
                                    <Badge variant="outline" className={getStatusColor(booking.status)}>
                                      {booking.status.toUpperCase()}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-slate-600 mt-1">{booking.spaceName}</div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 ml-13">
                                <div className="space-y-2">
                                  <div className="flex items-center text-sm text-slate-600">
                                    <User className="w-4 h-4 mr-2" />
                                    <div>
                                      <div className="font-medium text-slate-800">{booking.customerName}</div>
                                      <div className="text-xs">{booking.customerEmail}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center text-sm text-slate-600">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>
                                      {new Date(booking.date).toLocaleDateString("en-GB", {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })}
                                    </span>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center text-sm text-slate-600">
                                    <Clock className="w-4 h-4 mr-2" />
                                    <span>
                                      {booking.startTime} - {booking.endTime}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-sm text-slate-600">
                                    <User className="w-4 h-4 mr-2" />
                                    <span>{booking.attendees} attendees</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-2xl font-bold text-slate-800">
                                £{booking.totalPrice.toLocaleString()}
                              </div>
                              <div className="text-xs text-slate-500 mt-1">
                                Booked on {new Date(booking.bookingDate).toLocaleDateString("en-GB")}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3 bg-transparent"
                                onClick={() => handleViewDetails(booking)}
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Booking Details Modal */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        onStatusChange={handleStatusChange}
        onEdit={handleEdit}
      />
    </>
  )
}
