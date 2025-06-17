"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Building2,
  CalendarIcon,
  PoundSterling,
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  Menu,
  Users,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { BookingDetailsModal } from "@/components/booking-details-modal"
import { CreateBookingModal } from "@/components/create-booking-modal"
import { DeclineBookingModal } from "@/components/decline-booking-modal"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

// Mock booking data
const initialMockBookingData = {
  // Pending bookings
  "pending-mon-08": {
    id: "p1",
    customer: {
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+44 7123 456789",
    },
    venue: "Premier Sports Complex",
    space: "3G Pitch - Full",
    date: "2025-05-26",
    time: "08:00 - 09:00",
    amount: 45,
    status: "pending",
    notes: "Team practice session, need goals set up.",
    createdAt: "2025-05-20T14:30:00Z",
  },
  "pending-thu-08": {
    id: "p2",
    customer: {
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+44 7234 567890",
    },
    venue: "Premier Sports Complex",
    space: "3G Pitch - Full",
    date: "2025-05-29",
    time: "08:00 - 09:00",
    amount: 45,
    status: "pending",
    notes: "Corporate team building event.",
    createdAt: "2025-05-22T09:15:00Z",
  },
  "pending-fri-08": {
    id: "p3",
    customer: {
      name: "David Williams",
      email: "david.w@example.com",
      phone: "+44 7345 678901",
    },
    venue: "Premier Sports Complex",
    space: "3G Pitch - Full",
    date: "2025-05-30",
    time: "08:00 - 09:00",
    amount: 45,
    status: "pending",
    notes: "Youth team training session.",
    createdAt: "2025-05-23T16:45:00Z",
  },
  "pending-sat-08": {
    id: "p4",
    customer: {
      name: "Emma Brown",
      email: "emma.b@example.com",
      phone: "+44 7456 789012",
    },
    venue: "Premier Sports Complex",
    space: "3G Pitch - Full",
    date: "2025-05-31",
    time: "08:00 - 09:00",
    amount: 45,
    status: "pending",
    notes: "Friendly match, will bring own equipment.",
    createdAt: "2025-05-24T11:20:00Z",
  },
  "pending-thu-09": {
    id: "p5",
    customer: {
      name: "Michael Taylor",
      email: "michael.t@example.com",
      phone: "+44 7567 890123",
    },
    venue: "Premier Sports Complex",
    space: "3G Pitch - Full",
    date: "2025-05-29",
    time: "09:00 - 10:00",
    amount: 45,
    status: "pending",
    notes: "Need access to changing rooms.",
    createdAt: "2025-05-25T08:30:00Z",
  },

  // Booked slots
  "booked-fri-09": {
    id: "b1",
    customer: {
      name: "Robert Johnson",
      email: "robert.j@example.com",
      phone: "+44 7234 567891",
    },
    venue: "Premier Sports Complex",
    space: "3G Pitch - Full",
    date: "2025-05-30",
    time: "09:00 - 10:00",
    amount: 45,
    status: "confirmed",
    notes: "Weekly training session, confirmed.",
    createdAt: "2025-05-15T10:30:00Z",
    confirmedAt: "2025-05-16T09:20:00Z",
  },
  "booked-sat-10": {
    id: "b2",
    customer: {
      name: "Emily Davis",
      email: "emily.d@example.com",
      phone: "+44 7345 678902",
    },
    venue: "Premier Sports Complex",
    space: "3G Pitch - Full",
    date: "2025-05-31",
    time: "10:00 - 11:00",
    amount: 45,
    status: "confirmed",
    notes: "Birthday party, 12 children.",
    createdAt: "2025-05-10T14:45:00Z",
    confirmedAt: "2025-05-11T11:30:00Z",
  },
  "booked-tue-13": {
    id: "b3",
    customer: {
      name: "Thomas Wilson",
      email: "thomas.w@example.com",
      phone: "+44 7456 789013",
    },
    venue: "Premier Sports Complex",
    space: "3G Pitch - Full",
    date: "2025-05-27",
    time: "13:00 - 14:00",
    amount: 45,
    status: "confirmed",
    notes: "Corporate team building.",
    createdAt: "2025-05-05T16:20:00Z",
    confirmedAt: "2025-05-06T09:15:00Z",
  },
  "cancelled-wed-12": {
    id: "c1",
    customer: {
      name: "Jessica Brown",
      email: "jessica.b@example.com",
      phone: "+44 7567 890124",
    },
    venue: "Premier Sports Complex",
    space: "3G Pitch - Full",
    date: "2025-05-28",
    time: "12:00 - 13:00",
    amount: 45,
    status: "cancelled",
    notes: "School sports day - cancelled due to weather.",
    createdAt: "2025-05-01T11:10:00Z",
    cancelledAt: "2025-05-02T14:25:00Z",
    cancellationReason: "Weather conditions not suitable for outdoor event.",
  },
  "admin-created-1": {
    id: "ac1",
    customer: {
      name: "Corporate Client Ltd",
      email: "events@corporateclient.com",
      phone: "+44 7890 123456",
    },
    venue: "Premier Sports Complex",
    space: "Conference Room A",
    date: "2025-06-02",
    time: "14:00 - 16:00",
    amount: 50,
    status: "confirmed",
    notes: "Corporate meeting - admin created booking",
    createdAt: "2025-05-25T10:00:00Z",
    confirmedAt: "2025-05-25T10:00:00Z",
    createdBy: "admin",
  },
  "admin-created-2": {
    id: "ac2",
    customer: {
      name: "Local Sports Club",
      email: "manager@localsports.com",
      phone: "+44 7901 234567",
    },
    venue: "Premier Sports Complex",
    space: "3G Pitch - Full",
    date: "2025-06-03",
    time: "18:00 - 19:00",
    amount: 45,
    status: "pending_payment",
    notes: "Weekly training session - invoice sent",
    createdAt: "2025-05-24T15:30:00Z",
    confirmedAt: "2025-05-24T15:30:00Z",
    createdBy: "admin",
    invoiceSent: true,
    invoiceNumber: "INV-2025-001",
  },
}

const venues = [
  {
    id: 1,
    name: "Premier Sports Complex",
    location: "Downtown District",
    spaces: 8,
    status: "Active",
    bookings: 45,
    revenue: 12500,
  },
  {
    id: 2,
    name: "Elite Conference Center",
    location: "Business Park",
    spaces: 12,
    status: "Active",
    bookings: 32,
    revenue: 8900,
  },
  {
    id: 3,
    name: "Community Sports Hub",
    location: "Riverside",
    spaces: 6,
    status: "Active",
    bookings: 28,
    revenue: 6700,
  },
]

// Mock logged-in user data
const loggedInUser = {
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@zeus.com",
  role: "admin",
}

// Function to get greeting based on time of day
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

type SortField = "customer" | "venue" | "date" | "status"
type SortDirection = "asc" | "desc"

export default function AdminDashboard() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isCreateBookingModalOpen, setIsCreateBookingModalOpen] = useState(false)
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false)
  const [selectedSpace, setSelectedSpace] = useState("3G Pitch - Full")
  const [mockBookingData, setMockBookingData] = useState(initialMockBookingData)
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("calendar")

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["venues", "bookings", "calendar", "analytics"].includes(tab)) {
      setActiveTab(tab)
    }

    const filter = searchParams.get("filter")
    if (filter && ["pending", "confirmed", "cancelled", "completed"].includes(filter)) {
      setStatusFilter(filter)
    }
  }, [searchParams])

  // Add this useEffect after the existing useEffects
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMenuOpen) {
        const target = event.target as Element
        if (!target.closest(".relative")) {
          setIsMenuOpen(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  // Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    let bookings = Object.values(mockBookingData)

    // Apply status filter
    if (statusFilter !== "all") {
      bookings = bookings.filter((booking) => booking.status === statusFilter)
    }

    // Apply sorting
    bookings.sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortField) {
        case "customer":
          aValue = a.customer.name.toLowerCase()
          bValue = b.customer.name.toLowerCase()
          break
        case "venue":
          aValue = `${a.venue} ${a.space}`.toLowerCase()
          bValue = `${b.venue} ${b.space}`.toLowerCase()
          break
        case "date":
          aValue = new Date(`${a.date} ${a.time.split(" - ")[0]}`).getTime()
          bValue = new Date(`${b.date} ${a.time.split(" - ")[0]}`).getTime()
          break
        case "status":
          aValue = a.status.toLowerCase()
          bValue = b.status.toLowerCase()
          break
        default:
          aValue = a.createdAt
          bValue = b.createdAt
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return bookings
  }, [mockBookingData, statusFilter, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
  }

  // Function to get the start of the week (Monday) for a given date
  const getStartOfWeek = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust to Monday
    return new Date(d.setDate(diff))
  }

  // Get the week dates based on the selected date
  const getWeekDates = () => {
    if (!selectedDate) return []

    const startOfWeek = getStartOfWeek(selectedDate)
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return date
    })
  }

  const weekDates = getWeekDates()

  // Function to get booking key based on day and time
  const getBookingKey = (dayIndex: number, hour: number) => {
    const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
    return `${days[dayIndex]}-${hour.toString().padStart(2, "0")}`
  }

  // Function to handle slot click
  const handleSlotClick = (status: string, dayIndex: number, hour: number) => {
    if (status === "available") return

    const bookingKey = `${status}-${getBookingKey(dayIndex, hour)}`
    const booking = mockBookingData[bookingKey as keyof typeof mockBookingData]

    if (booking) {
      setSelectedBooking(booking)
      setIsBookingModalOpen(true)
    }
  }

  // Function to handle booking status change
  const handleBookingStatusChange = (bookingId: string, newStatus: string) => {
    setMockBookingData((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((key) => {
        if (updated[key as keyof typeof updated].id === bookingId) {
          updated[key as keyof typeof updated] = {
            ...updated[key as keyof typeof updated],
            status: newStatus,
            ...(newStatus === "confirmed" && { confirmedAt: new Date().toISOString() }),
          }
        }
      })
      return updated
    })
    setIsBookingModalOpen(false)
  }

  // Function to handle booking edit
  const handleBookingEdit = (bookingId: string, updatedData: any) => {
    setMockBookingData((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((key) => {
        if (updated[key as keyof typeof updated].id === bookingId) {
          updated[key as keyof typeof updated] = {
            ...updated[key as keyof typeof updated],
            ...updatedData,
          }
        }
      })
      return updated
    })
    setIsBookingModalOpen(false)
  }

  // Function to get slot status
  const getSlotStatus = (dayIndex: number, hour: number) => {
    const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
    const day = days[dayIndex]

    // Check for pending booking
    const pendingKey = `pending-${day}-${hour.toString().padStart(2, "0")}`
    if (mockBookingData[pendingKey as keyof typeof mockBookingData]) {
      return "pending"
    }

    // Check for confirmed booking
    const bookedKey = `booked-${day}-${hour.toString().padStart(2, "0")}`
    if (mockBookingData[bookedKey as keyof typeof mockBookingData]) {
      return "booked"
    }

    return "available"
  }

  const [dateRange, setDateRange] = useState("30")
  const [customDateRange, setCustomDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false)

  const handleApproveBooking = (booking: any) => {
    handleBookingStatusChange(booking.id, "confirmed")
  }

  const handleDeclineBooking = (booking: any) => {
    setSelectedBooking(booking)
    setIsDeclineModalOpen(true)
  }

  const handleDeclineConfirm = (reason: string) => {
    if (selectedBooking) {
      setMockBookingData((prev) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((key) => {
          if (updated[key as keyof typeof updated].id === selectedBooking.id) {
            updated[key as keyof typeof updated] = {
              ...updated[key as keyof typeof updated],
              status: "cancelled",
              cancellationReason: reason,
              cancelledAt: new Date().toISOString(),
            }
          }
        })
        return updated
      })
    }
  }

  const handleViewBooking = (booking: any) => {
    setSelectedBooking(booking)
    setIsBookingModalOpen(true)
  }

  const handleEditBooking = (booking: any) => {
    setSelectedBooking(booking)
    setIsBookingModalOpen(true)
  }

  const handleCreateBooking = (bookingData: any) => {
    const newKey = `new-${Date.now()}`
    setMockBookingData((prev) => ({
      ...prev,
      [newKey]: bookingData,
    }))
  }

  const handleSendInvoice = (booking: any) => {
    setMockBookingData((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((key) => {
        if (updated[key as keyof typeof updated].id === booking.id) {
          updated[key as keyof typeof updated] = {
            ...updated[key as keyof typeof updated],
            status: "pending_payment",
            invoiceSent: true,
            invoiceNumber: `INV-${Date.now()}`,
            invoiceSentAt: new Date().toISOString(),
          }
        }
      })
      return updated
    })
  }

  const handleResendInvoice = (booking: any) => {
    setMockBookingData((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((key) => {
        if (updated[key as keyof typeof updated].id === booking.id) {
          updated[key as keyof typeof updated] = {
            ...updated[key as keyof typeof updated],
            invoiceResent: true,
            invoiceResentAt: new Date().toISOString(),
          }
        }
      })
      return updated
    })
  }

  const handleMarkAsPaid = (booking: any) => {
    setMockBookingData((prev) => {
      const updated = { ...prev }
      Object.keys(updated).forEach((key) => {
        if (updated[key as keyof typeof updated].id === booking.id) {
          updated[key as keyof typeof updated] = {
            ...updated[key as keyof typeof updated],
            status: "paid",
            paidAt: new Date().toISOString(),
          }
        }
      })
      return updated
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center space-x-3">
                <div className="w-10 h-10 zeus-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">Z</span>
                </div>
              </Link>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-800">Zeus Admin</span>
                <span className="text-sm text-slate-600">
                  {getGreeting()}, {loggedInUser.firstName}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Hamburger Menu */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-200 text-slate-600 hover:bg-slate-50"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Menu className="w-4 h-4" />
                </Button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-50">
                    <div className="py-1">
                      <Link
                        href="/admin/users"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Users className="w-4 h-4 mr-3" />
                        Users
                      </Link>
                      <Link
                        href="/admin/settings"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Button variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:bg-slate-50">
                <Link href="/">Back to Site</Link>
              </Button>
              <Button variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:bg-slate-50">
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => router.push("/admin?tab=analytics")}
          >
            <Card className="zeus-card hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
                <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <PoundSterling className="h-4 w-4 text-secondary-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">£28,100</div>
                <div className="flex items-center text-xs text-secondary-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last month
                </div>
              </CardContent>
            </Card>
          </div>

          <div
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => router.push("/admin?tab=bookings")}
          >
            <Card className="zeus-card hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Bookings</CardTitle>
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="h-4 w-4 text-primary-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">105</div>
                <div className="flex items-center text-xs text-primary-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% from last month
                </div>
              </CardContent>
            </Card>
          </div>

          <div
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => router.push("/admin?tab=venues")}
          >
            <Card className="zeus-card hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Active Venues</CardTitle>
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">3</div>
                <p className="text-xs text-slate-500 mt-1">All venues active</p>
              </CardContent>
            </Card>
          </div>

          <div
            className="cursor-pointer transition-transform hover:scale-105"
            onClick={() => router.push("/admin?tab=bookings&filter=pending")}
          >
            <Card className="zeus-card hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Pending Approvals</CardTitle>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {Object.values(mockBookingData).filter((b) => b.status === "pending").length}
                </div>
                <p className="text-xs text-orange-600 mt-1">Requires attention</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-100">
            <TabsTrigger value="venues" className="data-[state=active]:bg-white data-[state=active]:text-primary-600">
              Venues
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-white data-[state=active]:text-primary-600">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-white data-[state=active]:text-primary-600">
              Calendar
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-white data-[state=active]:text-primary-600"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Venues Tab */}
          <TabsContent value="venues" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Venue Management</h2>
              <Button className="zeus-gradient text-white hover:opacity-90">
                <Building2 className="w-4 h-4 mr-2" />
                Add New Venue
              </Button>
            </div>

            <div className="grid gap-6">
              {venues.map((venue) => (
                <Card key={venue.id} className="zeus-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-slate-800">{venue.name}</CardTitle>
                        <p className="text-slate-600 mt-1">{venue.location}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="border-slate-200">
                          Edit Venue
                        </Button>
                        <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4 text-slate-500" />
                          <span>{venue.spaces} Spaces</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="w-4 h-4 text-slate-500" />
                          <span>{venue.bookings} Bookings</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <PoundSterling className="w-4 h-4 text-slate-500" />
                          <span>£{venue.revenue.toLocaleString()}</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-slate-700">Hirable Spaces</h4>
                          <Button variant="outline" size="sm" className="text-xs">
                            Add Space
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {venue.id === 1 && (
                            <>
                              <div className="p-3 bg-slate-50 rounded-lg border">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-sm">3G Pitch - Full</p>
                                    <p className="text-xs text-slate-500">£45/hr</p>
                                  </div>
                                  <Button variant="ghost" size="sm" className="text-xs">
                                    Edit
                                  </Button>
                                </div>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg border">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-sm">Grass Pitch 1</p>
                                    <p className="text-xs text-slate-500">£35/hr</p>
                                  </div>
                                  <Button variant="ghost" size="sm" className="text-xs">
                                    Edit
                                  </Button>
                                </div>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg border">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-sm">Grass Pitch 2</p>
                                    <p className="text-xs text-slate-500">£35/hr</p>
                                  </div>
                                  <Button variant="ghost" size="sm" className="text-xs">
                                    Edit
                                  </Button>
                                </div>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg border">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-sm">Conference Room A</p>
                                    <p className="text-xs text-slate-500">£25/hr</p>
                                  </div>
                                  <Button variant="ghost" size="sm" className="text-xs">
                                    Edit
                                  </Button>
                                </div>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg border">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-sm">Conference Room B</p>
                                    <p className="text-xs text-slate-500">£25/hr</p>
                                  </div>
                                  <Button variant="ghost" size="sm" className="text-xs">
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}
                          {venue.id === 2 && (
                            <>
                              <div className="p-3 bg-slate-50 rounded-lg border">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-sm">Main Conference Hall</p>
                                    <p className="text-xs text-slate-500">£80/hr</p>
                                  </div>
                                  <Button variant="ghost" size="sm" className="text-xs">
                                    Edit
                                  </Button>
                                </div>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg border">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-sm">Meeting Room 1</p>
                                    <p className="text-xs text-slate-500">£30/hr</p>
                                  </div>
                                  <Button variant="ghost" size="sm" className="text-xs">
                                    Edit
                                  </Button>
                                </div>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg border">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-sm">Meeting Room 2</p>
                                    <p className="text-xs text-slate-500">£30/hr</p>
                                  </div>
                                  <Button variant="ghost" size="sm" className="text-xs">
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}
                          {venue.id === 3 && (
                            <>
                              <div className="p-3 bg-slate-50 rounded-lg border">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-sm">Sports Hall</p>
                                    <p className="text-xs text-slate-500">£40/hr</p>
                                  </div>
                                  <Button variant="ghost" size="sm" className="text-xs">
                                    Edit
                                  </Button>
                                </div>
                              </div>
                              <div className="p-3 bg-slate-50 rounded-lg border">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium text-sm">Community Room</p>
                                    <p className="text-xs text-slate-500">£20/hr</p>
                                  </div>
                                  <Button variant="ghost" size="sm" className="text-xs">
                                    Edit
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Booking Management</h2>
              <div className="flex items-center space-x-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 border-slate-200">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bookings</SelectItem>
                    <SelectItem value="pending">Pending Approval</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending_payment">Awaiting Payment</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="paid">Paid/Complete</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  className="zeus-gradient text-white hover:opacity-90"
                  onClick={() => setIsCreateBookingModalOpen(true)}
                >
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  Create Booking
                </Button>
              </div>
            </div>

            <Card className="zeus-card">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b">
                      <tr>
                        <th
                          className="text-left p-4 font-medium text-slate-600 cursor-pointer hover:bg-slate-100"
                          onClick={() => handleSort("customer")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Customer</span>
                            {getSortIcon("customer")}
                          </div>
                        </th>
                        <th
                          className="text-left p-4 font-medium text-slate-600 cursor-pointer hover:bg-slate-100"
                          onClick={() => handleSort("venue")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Venue & Space</span>
                            {getSortIcon("venue")}
                          </div>
                        </th>
                        <th
                          className="text-left p-4 font-medium text-slate-600 cursor-pointer hover:bg-slate-100"
                          onClick={() => handleSort("date")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Date & Time</span>
                            {getSortIcon("date")}
                          </div>
                        </th>
                        <th className="text-left p-4 font-medium text-slate-600">Amount</th>
                        <th
                          className="text-left p-4 font-medium text-slate-600 cursor-pointer hover:bg-slate-100"
                          onClick={() => handleSort("status")}
                        >
                          <div className="flex items-center space-x-1">
                            <span>Status</span>
                            {getSortIcon("status")}
                          </div>
                        </th>
                        <th className="text-left p-4 font-medium text-slate-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedBookings.map((booking) => (
                        <tr key={booking.id} className="border-b hover:bg-slate-50">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-slate-800">{booking.customer.name}</p>
                              <p className="text-sm text-slate-500">{booking.customer.email}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-slate-800">{booking.venue}</p>
                              <p className="text-sm text-slate-500">{booking.space}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-slate-800">
                                {new Date(booking.date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-slate-500">{booking.time}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <p className="font-medium text-slate-800">£{booking.amount}</p>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                booking.status === "pending"
                                  ? "bg-blue-100 text-blue-800"
                                  : booking.status === "confirmed"
                                    ? "bg-green-100 text-green-800"
                                    : booking.status === "pending_payment"
                                      ? "bg-amber-100 text-amber-800"
                                      : booking.status === "cancelled"
                                        ? "bg-red-100 text-red-800"
                                        : booking.status === "paid"
                                          ? "bg-emerald-100 text-emerald-800"
                                          : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {booking.status === "pending"
                                ? "Pending"
                                : booking.status === "confirmed"
                                  ? "Confirmed"
                                  : booking.status === "pending_payment"
                                    ? "Awaiting Payment"
                                    : booking.status === "cancelled"
                                      ? "Cancelled"
                                      : booking.status === "paid"
                                        ? "Paid/Complete"
                                        : booking.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              {booking.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                    onClick={() => handleApproveBooking(booking)}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50 text-xs"
                                    onClick={() => handleDeclineBooking(booking)}
                                  >
                                    Decline
                                  </Button>
                                </>
                              )}
                              {booking.status === "confirmed" && booking.createdBy === "admin" && (
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                                  onClick={() => handleSendInvoice(booking)}
                                >
                                  Send Invoice
                                </Button>
                              )}
                              {booking.status === "pending_payment" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-blue-200 text-blue-600 hover:bg-blue-50 text-xs"
                                    onClick={() => handleResendInvoice(booking)}
                                  >
                                    Resend Invoice
                                  </Button>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white text-xs"
                                    onClick={() => handleMarkAsPaid(booking)}
                                  >
                                    Mark as Paid
                                  </Button>
                                </>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => handleViewBooking(booking)}
                              >
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                onClick={() => handleEditBooking(booking)}
                              >
                                Edit
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Availability Calendar</h2>
              <div className="flex items-center space-x-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-48 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Venues</SelectItem>
                    <SelectItem value="1">Premier Sports Complex</SelectItem>
                    <SelectItem value="2">Elite Conference Center</SelectItem>
                    <SelectItem value="3">Community Sports Hub</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <Card className="lg:col-span-1 zeus-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-slate-800">Select Date</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border-0 p-0"
                  />
                </CardContent>
              </Card>

              <Card className="lg:col-span-3 zeus-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-slate-800">
                      Schedule for {selectedDate ? selectedDate.toLocaleDateString() : ""}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-200 text-slate-600 hover:bg-slate-50"
                        onClick={() => {
                          if (selectedDate) {
                            const newDate = new Date(selectedDate)
                            newDate.setDate(newDate.getDate() - 7)
                            setSelectedDate(newDate)
                          }
                        }}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous Week
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-200 text-slate-600 hover:bg-slate-50"
                        onClick={() => {
                          if (selectedDate) {
                            const newDate = new Date(selectedDate)
                            newDate.setDate(newDate.getDate() + 7)
                            setSelectedDate(newDate)
                          }
                        }}
                      >
                        Next Week
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Week Header - Monday to Sunday */}
                    <div className="grid grid-cols-8 gap-2 text-sm font-medium text-gray-600 border-b pb-4 mb-2">
                      <div className="text-right pr-2">Time</div>
                      {weekDates.map((date, index) => (
                        <div key={index} className="text-center">
                          <div className="font-semibold">{date.toLocaleDateString("en-GB", { weekday: "short" })}</div>
                          <div className="text-xs text-gray-500">
                            {date.getDate()}/{date.getMonth() + 1}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Space Selector */}
                    <div className="flex items-center space-x-4 py-4 border-b mb-4">
                      <Label className="text-sm font-medium">Space:</Label>
                      <Select value={selectedSpace} onValueChange={setSelectedSpace}>
                        <SelectTrigger className="w-48">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3G Pitch - Full">3G Pitch - Full</SelectItem>
                          <SelectItem value="Meeting Room A">Meeting Room A</SelectItem>
                          <SelectItem value="Grass Pitch">Grass Pitch</SelectItem>
                          <SelectItem value="Conference Room B">Conference Room B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Time Slots Grid */}
                    <div className="space-y-2 max-h-96 overflow-y-auto py-2">
                      {Array.from({ length: 9 }, (_, i) => i + 8).map((hour) => (
                        <div key={hour} className="grid grid-cols-8 gap-2 items-center">
                          <div className="text-sm font-medium text-gray-600 text-right pr-3 py-2">
                            {hour.toString().padStart(2, "0")}:00
                          </div>
                          {Array.from({ length: 7 }, (_, dayIndex) => {
                            const status = getSlotStatus(dayIndex, hour)

                            let bgColor = "bg-green-100 border-green-200 hover:bg-green-200"
                            let textColor = "text-green-800"
                            let statusText = "Available"
                            let cursor = "cursor-default"

                            if (status === "pending") {
                              bgColor = "bg-blue-100 border-blue-200 hover:bg-blue-200"
                              textColor = "text-blue-800"
                              statusText = "Pending"
                              cursor = "cursor-pointer"
                            } else if (status === "booked") {
                              bgColor = "bg-red-100 border-red-200 hover:bg-red-200"
                              textColor = "text-red-800"
                              statusText = "Booked"
                              cursor = "cursor-pointer"
                            } else {
                              cursor = "cursor-pointer"
                            }

                            return (
                              <div key={dayIndex} className="relative group">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`h-10 text-xs w-full ${bgColor} ${textColor} ${cursor}`}
                                  onClick={() => handleSlotClick(status, dayIndex, hour)}
                                >
                                  {statusText}
                                </Button>
                                {status === "available" && (
                                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      size="sm"
                                      className="h-10 w-full text-xs bg-primary-600 hover:bg-primary-700 text-white"
                                      onClick={() => {
                                        setIsCreateBookingModalOpen(true)
                                      }}
                                    >
                                      + Book
                                    </Button>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center space-x-8 text-sm pt-6 mt-4 border-t border-slate-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-secondary-100 border border-secondary-200 rounded"></div>
                        <span className="text-slate-600">Available</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-primary-100 border border-primary-200 rounded"></div>
                        <span className="text-slate-600">Pending Approval</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                        <span className="text-slate-600">Booked</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h2>
              <div className="flex items-center space-x-4">
                <Select
                  value={dateRange}
                  onValueChange={(value) => {
                    setDateRange(value)
                    if (value === "custom") {
                      setShowCustomDatePicker(true)
                    } else {
                      setShowCustomDatePicker(false)
                    }
                  }}
                >
                  <SelectTrigger className="w-48 border-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="custom">Custom date range</SelectItem>
                  </SelectContent>
                </Select>

                {showCustomDatePicker && (
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 p-2 border border-slate-200 rounded-lg bg-white">
                      <Label className="text-sm font-medium text-slate-600">From:</Label>
                      <input
                        type="date"
                        className="text-sm border-0 focus:outline-none"
                        onChange={(e) =>
                          setCustomDateRange((prev) => ({
                            ...prev,
                            from: e.target.value ? new Date(e.target.value) : undefined,
                          }))
                        }
                      />

                      <Label className="text-sm font-medium text-slate-600">To:</Label>
                      <input
                        type="date"
                        className="text-sm border-0 focus:outline-none"
                        onChange={(e) =>
                          setCustomDateRange((prev) => ({
                            ...prev,
                            to: e.target.value ? new Date(e.target.value) : undefined,
                          }))
                        }
                      />
                    </div>
                    <Button
                      size="sm"
                      className="zeus-gradient text-white hover:opacity-90"
                      onClick={() => {
                        console.log("Apply custom date range:", customDateRange)
                        // Here you would apply the custom date range to your analytics data
                      }}
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="zeus-card">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-800">Revenue Trends</CardTitle>
                  <p className="text-sm text-slate-500">
                    {dateRange === "custom" && customDateRange.from && customDateRange.to
                      ? `${customDateRange.from.toLocaleDateString()} - ${customDateRange.to.toLocaleDateString()}`
                      : dateRange === "7"
                        ? "Last 7 days"
                        : dateRange === "30"
                          ? "Last 30 days"
                          : dateRange === "90"
                            ? "Last 90 days"
                            : "Select date range"}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-slate-500">
                    Revenue chart would go here
                  </div>
                </CardContent>
              </Card>

              <Card className="zeus-card">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-800">Booking Trends</CardTitle>
                  <p className="text-sm text-slate-500">
                    {dateRange === "custom" && customDateRange.from && customDateRange.to
                      ? `${customDateRange.from.toLocaleDateString()} - ${customDateRange.to.toLocaleDateString()}`
                      : dateRange === "7"
                        ? "Last 7 days"
                        : dateRange === "30"
                          ? "Last 30 days"
                          : dateRange === "90"
                            ? "Last 90 days"
                            : "Select date range"}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-slate-500">
                    Booking chart would go here
                  </div>
                </CardContent>
              </Card>

              <Card className="zeus-card">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-800">Popular Venues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {venues.map((venue, index) => (
                      <div key={venue.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                            <span className="text-primary-600 font-medium text-sm">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{venue.name}</p>
                            <p className="text-sm text-slate-500">{venue.bookings} bookings</p>
                          </div>
                        </div>
                        <p className="font-medium text-slate-800">£{venue.revenue.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="zeus-card">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-800">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm text-slate-600">New booking approved for Premier Sports Complex</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm text-slate-600">Booking request pending approval</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <p className="text-sm text-slate-600">Payment received for Elite Conference Center</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onStatusChange={handleBookingStatusChange}
        onEdit={handleBookingEdit}
      />

      <CreateBookingModal
        isOpen={isCreateBookingModalOpen}
        onClose={() => setIsCreateBookingModalOpen(false)}
        onSubmit={handleCreateBooking}
      />

      <DeclineBookingModal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        onConfirm={handleDeclineConfirm}
        booking={selectedBooking}
      />
    </div>
  )
}
