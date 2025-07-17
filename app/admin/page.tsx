"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  PoundSterling,
  CalendarIcon,
  TrendingUp,
  Bell,
  User,
  CreditCard,
  LogOut,
  Settings,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AdminSidebar } from "@/components/admin-sidebar"
import BookingDetailsModal from "@/components/BookingDetailsModal"
import CreateBookingModal from "@/components/CreateBookingModal"
import DeclineBookingModal from "@/components/DeclineBookingModal"
import { useRouter, useSearchParams } from "next/navigation"

// Mock data for dashboard
const dashboardStats = {
  totalRevenue: 45680,
  totalBookings: 234,
  activeVenues: 12,
  totalUsers: 1847,
}

const recentBookings = [
  {
    id: "1",
    customerName: "John Smith",
    venue: "Elite Conference Center",
    date: "2025-01-25",
    time: "14:00 - 18:00",
    status: "confirmed",
    amount: 450,
  },
  {
    id: "2",
    customerName: "Sarah Johnson",
    venue: "Premier Sports Complex",
    date: "2025-01-26",
    time: "09:00 - 12:00",
    status: "pending",
    amount: 280,
  },
  {
    id: "3",
    customerName: "Mike Wilson",
    venue: "Grand Ballroom",
    date: "2025-01-27",
    time: "19:00 - 23:00",
    status: "confirmed",
    amount: 680,
  },
  {
    id: "4",
    customerName: "Emma Davis",
    venue: "Tech Hub",
    date: "2025-01-28",
    time: "10:00 - 16:00",
    status: "cancelled",
    amount: 320,
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

const initialMockBookingData = {
  "pending-mon-09": {
    id: "pending-mon-09",
    status: "pending",
    date: "2025-01-22",
    time: "09:00 - 10:00",
    customer: { name: "Alice" },
    venue: "Venue A",
    space: "Space 1",
  },
  "booked-tue-14": {
    id: "booked-tue-14",
    status: "confirmed",
    date: "2025-01-23",
    time: "14:00 - 15:00",
    customer: { name: "Bob" },
    venue: "Venue B",
    space: "Space 2",
  },
}

export default function AdminDashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />
      case "pending":
        return <Clock className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }
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
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-800">Dashboard</span>
                <span className="text-sm text-slate-600">Welcome back, {loggedInUser.firstName}!</span>
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
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {getGreeting()}, {loggedInUser.firstName}!
            </h1>
            <p className="text-slate-600">Here's what's happening with your venue bookings today.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="zeus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
                <PoundSterling className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">£{dashboardStats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="zeus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Bookings</CardTitle>
                <CalendarIcon className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{dashboardStats.totalBookings}</div>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card className="zeus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Active Venues</CardTitle>
                <Building2 className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{dashboardStats.activeVenues}</div>
                <p className="text-xs text-slate-500 mt-1">All venues operational</p>
              </CardContent>
            </Card>

            <Card className="zeus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
                <Users className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{dashboardStats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-green-600 mt-1">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  +15% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card className="zeus-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CalendarIcon className="w-5 h-5" />
                <span>Recent Bookings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(booking.status)}
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{booking.customerName}</p>
                        <p className="text-sm text-slate-600">{booking.venue}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-800">£{booking.amount}</p>
                      <p className="text-sm text-slate-600">
                        {booking.date} • {booking.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
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
