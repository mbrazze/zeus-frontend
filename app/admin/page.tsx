"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  Search,
  Plus,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  X,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookingDetailsModal } from "@/components/booking-details-modal"
import { CreateBookingModal } from "@/components/create-booking-modal"
import { DeclineBookingModal } from "@/components/decline-booking-modal"
import { useSearchParams } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AdminHeader } from "@/components/admin-header"

// Venue and space relationships
const venueSpaces = {
  "Premier Sports Complex": [
    "3G Pitch - Full",
    "3G Pitch - Half",
    "Sports Hall - Full",
    "Sports Hall - Half",
    "Conference Room A",
    "Conference Room B",
  ],
  "Elite Conference Center": [
    "Main Conference Hall",
    "Meeting Room A",
    "Meeting Room B",
    "Meeting Room C",
    "Studio Room",
  ],
  "Community Sports Hub": ["Indoor Court 1", "Indoor Court 2", "Outdoor Pitch", "Meeting Room"],
}

// Generate 30+ customers
const customers = [
  { name: "John Smith", email: "john.smith@email.com" },
  { name: "Sarah Johnson", email: "sarah.johnson@email.com" },
  { name: "Michael Chen", email: "michael.chen@email.com" },
  { name: "Emma Williams", email: "emma.williams@email.com" },
  { name: "James Rodriguez", email: "james.rodriguez@email.com" },
  { name: "Lisa Thompson", email: "lisa.thompson@email.com" },
  { name: "Robert Wilson", email: "robert.wilson@email.com" },
  { name: "Maria Garcia", email: "maria.garcia@email.com" },
  { name: "David Lee", email: "david.lee@email.com" },
  { name: "Jennifer Brown", email: "jennifer.brown@email.com" },
  { name: "Thomas Anderson", email: "thomas.anderson@email.com" },
  { name: "Emily Davis", email: "emily.davis@email.com" },
  { name: "Daniel Martinez", email: "daniel.martinez@email.com" },
  { name: "Amanda Taylor", email: "amanda.taylor@email.com" },
  { name: "Christopher Moore", email: "christopher.moore@email.com" },
  { name: "Jessica White", email: "jessica.white@email.com" },
  { name: "Matthew Harris", email: "matthew.harris@email.com" },
  { name: "Ashley Martin", email: "ashley.martin@email.com" },
  { name: "Andrew Thompson", email: "andrew.thompson@email.com" },
  { name: "Melissa Jackson", email: "melissa.jackson@email.com" },
  { name: "Joshua Robinson", email: "joshua.robinson@email.com" },
  { name: "Stephanie Clark", email: "stephanie.clark@email.com" },
  { name: "Ryan Lewis", email: "ryan.lewis@email.com" },
  { name: "Nicole Walker", email: "nicole.walker@email.com" },
  { name: "Kevin Hall", email: "kevin.hall@email.com" },
  { name: "Laura Allen", email: "laura.allen@email.com" },
  { name: "Brandon Young", email: "brandon.young@email.com" },
  { name: "Rachel King", email: "rachel.king@email.com" },
  { name: "Justin Wright", email: "justin.wright@email.com" },
  { name: "Samantha Green", email: "samantha.green@email.com" },
  { name: "Eric Baker", email: "eric.baker@email.com" },
  { name: "Michelle Adams", email: "michelle.adams@email.com" },
  { name: "Brian Nelson", email: "brian.nelson@email.com" },
  { name: "Kimberly Carter", email: "kimberly.carter@email.com" },
  { name: "Steven Mitchell", email: "steven.mitchell@email.com" },
]

const venues = ["Premier Sports Complex", "Elite Conference Center", "Community Sports Hub"]
const categories = [
  "Recreational",
  "Match",
  "Club Training",
  "FA Flexi League",
  "Small-sided League",
  "School/College/University Extra-Curricular/Enrichment (Includes match play)",
  "Holiday camps",
  "Festival / Tournament",
]
const subcategories = [
  "FA Wildcats (Girls)",
  "Mini Kickers/Development Group (4-6yrs)",
  "Pay and play sessions",
  "Pro-Club Community Trust Programmes",
  "Walking Football or Touch Rugby",
  "FA Comets",
  "Holiday camps",
  "Festival / Tournament",
  "Other",
]
const ageGroups = ["U5", "U14", "U15", "U16", "U17", "U18", "Open", "Vets (36+)", "Mixed age"]
const matchTypes = ["3v3", "4v4", "5v5", "6v6", "7v7", "8v8", "9v9", "11v11"]
const disabilityCategories = [
  "Non Disability",
  "Amputee",
  "Cerebral Palsy",
  "Learning Disability",
  "Mental Health",
  "Pan Disability",
]
const statuses = ["pending", "confirmed", "pending_payment", "paid", "cancelled"]

// Generate 120 bookings (10 per month for 2025)
const generateMockBookings = () => {
  const bookings: Record<string, any> = {}
  let bookingId = 1

  for (let month = 0; month < 12; month++) {
    for (let bookingNum = 0; bookingNum < 10; bookingNum++) {
      const customer = customers[Math.floor(Math.random() * customers.length)]
      const venue = venues[Math.floor(Math.random() * venues.length)]
      const spaces = venueSpaces[venue]
      const space = spaces[Math.floor(Math.random() * spaces.length)]

      // Random day in the month (1-28 to avoid date edge cases)
      const day = Math.floor(Math.random() * 28) + 1
      const date = `2025-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

      // Random time slots
      const startHour = Math.floor(Math.random() * 8) + 10 // 10:00 to 18:00
      const duration = Math.floor(Math.random() * 3) + 1 // 1-3 hours
      const endHour = startHour + duration
      const time = `${String(startHour).padStart(2, "0")}:00 - ${String(endHour).padStart(2, "0")}:00`

      const hourlyRate = Math.floor(Math.random() * 40) + 30 // £30-70 per hour
      const amount = hourlyRate * duration * 1.2 // Including VAT

      // Status distribution: more paid/confirmed than pending
      let status: string
      const statusRand = Math.random()
      if (statusRand < 0.4) status = "paid"
      else if (statusRand < 0.7) status = "confirmed"
      else if (statusRand < 0.8) status = "pending_payment"
      else if (statusRand < 0.9) status = "pending"
      else status = "cancelled"

      const category = categories[Math.floor(Math.random() * categories.length)]
      const subcategory = subcategories[Math.floor(Math.random() * subcategories.length)]
      const ageGroup = ageGroups[Math.floor(Math.random() * ageGroups.length)]
      const matchType = matchTypes[Math.floor(Math.random() * matchTypes.length)]
      const disabilityCategory = disabilityCategories[Math.floor(Math.random() * disabilityCategories.length)]

      const createdDate = new Date(2025, month, Math.max(1, day - 7))
      const booking: any = {
        customer: {
          name: customer.name,
          email: customer.email,
          phone: `+44 ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 900000) + 100000}`,
        },
        venue,
        space,
        date,
        time,
        amount: Number(amount.toFixed(2)),
        hourlyRate,
        duration,
        status,
        notes: "",
        classification: {
          category,
          subcategory,
          ageGroup,
          matchType,
          disabilityCategory,
        },
        createdAt: createdDate.toISOString(),
        createdBy: Math.random() > 0.5 ? "admin" : "customer",
      }

      if (status === "confirmed" || status === "paid" || status === "pending_payment") {
        const confirmedDate = new Date(createdDate)
        confirmedDate.setDate(confirmedDate.getDate() + 1)
        booking.confirmedAt = confirmedDate.toISOString()
      }

      if (status === "pending_payment" || status === "paid") {
        booking.invoiceNumber = `INV-2025-${String(bookingId).padStart(4, "0")}`
        const sentDate = new Date(createdDate)
        sentDate.setDate(sentDate.getDate() + 2)
        booking.invoiceSentAt = sentDate.toISOString()
      }

      if (status === "paid") {
        const paidDate = new Date(createdDate)
        paidDate.setDate(paidDate.getDate() + Math.floor(Math.random() * 10) + 3)
        booking.paidAt = paidDate.toISOString()
      }

      if (status === "cancelled") {
        const cancelledDate = new Date(createdDate)
        cancelledDate.setDate(cancelledDate.getDate() + Math.floor(Math.random() * 5) + 1)
        booking.cancelledAt = cancelledDate.toISOString()
        booking.cancellationReason = ["Customer request", "Weather conditions", "Venue maintenance", "Double booking"][
          Math.floor(Math.random() * 4)
        ]
      }

      bookings[bookingId.toString()] = booking
      bookingId++
    }
  }

  return bookings
}

const initialMockBookingData = generateMockBookings()

// Function to get greeting based on time of day
const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

type SortField = "customer" | "venue" | "date" | "status" | "amount"
type SortDirection = "asc" | "desc"

export default function AdminDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isCreateBookingModalOpen, setIsCreateBookingModalOpen] = useState(false)
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false)
  const [mockBookingData, setMockBookingData] = useState(initialMockBookingData)
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [ageGroupFilter, setAgeGroupFilter] = useState("all")
  const [disabilityFilter, setDisabilityFilter] = useState("all")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("bookings")
  const [currentWeek, setCurrentWeek] = useState(new Date(2025, 0, 1))

  const [selectedVenue, setSelectedVenue] = useState("All Venues")
  const [selectedSpace, setSelectedSpace] = useState("All Spaces")

  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ]

  const bookingCategories = Array.from(
    new Set(
      Object.values(mockBookingData)
        .map((b) => b.classification?.category)
        .filter(Boolean),
    ),
  ).sort()

  const ageGroups = Array.from(
    new Set(
      Object.values(mockBookingData)
        .map((b) => b.classification?.ageGroup)
        .filter(Boolean),
    ),
  ).sort()

  const disabilityCategories = Array.from(
    new Set(
      Object.values(mockBookingData)
        .map((b) => b.classification?.disabilityCategory)
        .filter(Boolean),
    ),
  ).sort()

  const getAvailableSpaces = () => {
    if (selectedVenue === "All Venues") {
      return ["All Spaces"]
    }
    return ["All Spaces", ...venueSpaces[selectedVenue]]
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (statusFilter !== "all") count++
    if (categoryFilter !== "all") count++
    if (ageGroupFilter !== "all") count++
    if (disabilityFilter !== "all") count++
    return count
  }

  const clearAllFilters = () => {
    setStatusFilter("all")
    setCategoryFilter("all")
    setAgeGroupFilter("all")
    setDisabilityFilter("all")
    setSearchTerm("")
  }

  const getCalendarBookings = () => {
    const calendarBookings = {}

    Object.entries(mockBookingData).forEach(([id, booking]) => {
      const dateKey = booking.date
      const timeSlot = booking.time.split(" - ")[0]

      if (!calendarBookings[dateKey]) {
        calendarBookings[dateKey] = {}
      }

      let calendarStatus = "available"
      switch (booking.status) {
        case "pending":
          calendarStatus = "pending"
          break
        case "pending_payment":
          calendarStatus = "pending_payment"
          break
        case "confirmed":
        case "paid":
          calendarStatus = "booked"
          break
        case "cancelled":
          calendarStatus = "available"
          break
        default:
          calendarStatus = "available"
      }

      calendarBookings[dateKey][timeSlot] = {
        status: calendarStatus,
        bookingId: id,
        booking: booking,
        customer: booking.customer.name,
        venue: booking.venue,
        space: booking.space,
      }
    })

    return calendarBookings
  }

  const calendarBookings = getCalendarBookings()

  const getWeekDates = (startDate: Date) => {
    const dates = []
    const start = new Date(startDate)
    const day = start.getDay()
    const diff = start.getDate() - day + (day === 0 ? -6 : 1)
    start.setDate(diff)

    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const weekDates = getWeekDates(currentWeek)

  const getFilteredCalendarBookings = () => {
    const filtered = {}

    Object.entries(calendarBookings).forEach(([date, slots]) => {
      const filteredSlots = {}

      Object.entries(slots).forEach(([time, slotData]) => {
        const venueMatch = selectedVenue === "All Venues" || slotData.venue === selectedVenue
        const spaceMatch = selectedSpace === "All Spaces" || slotData.space === selectedSpace

        if (venueMatch && spaceMatch) {
          filteredSlots[time] = slotData
        }
      })

      if (Object.keys(filteredSlots).length > 0) {
        filtered[date] = filteredSlots
      }
    })

    return filtered
  }

  const filteredCalendarBookings = getFilteredCalendarBookings()

  const getSlotStatus = (date: Date, timeSlot: string) => {
    const dateKey = date.toISOString().split("T")[0]
    const bookingSlot = filteredCalendarBookings[dateKey]?.[timeSlot]
    return bookingSlot?.status || "available"
  }

  const getSlotBooking = (date: Date, timeSlot: string) => {
    const dateKey = date.toISOString().split("T")[0]
    return filteredCalendarBookings[dateKey]?.[timeSlot]
  }

  const getSlotColor = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-green-100 border-green-200 text-green-800"
      case "pending":
        return "bg-yellow-100 border-yellow-200 text-yellow-800"
      case "pending_payment":
        return "bg-blue-100 border-blue-200 text-blue-800"
      default:
        return "bg-white border-gray-200 text-gray-800 hover:bg-gray-50"
    }
  }

  const nextWeek = () => {
    const next = new Date(currentWeek)
    next.setDate(next.getDate() + 7)
    setCurrentWeek(next)
  }

  const prevWeek = () => {
    const prev = new Date(currentWeek)
    prev.setDate(prev.getDate() - 7)
    setCurrentWeek(prev)
  }

  const formatWeekRange = () => {
    const start = weekDates[0]
    const end = weekDates[6]
    return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()}`
  }

  const onTimeSlotSelect = (date: Date, timeSlot: string) => {
    const slotBooking = getSlotBooking(date, timeSlot)

    if (slotBooking && slotBooking.bookingId) {
      setSelectedBooking({ id: slotBooking.bookingId, ...slotBooking.booking })
      setIsBookingModalOpen(true)
    } else {
      setIsCreateBookingModalOpen(true)
    }
  }

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
      case "paid":
        return <CheckCircle className="w-4 h-4 text-emerald-600" />
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
      case "paid":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    setMockBookingData((prevData) => ({
      ...prevData,
      [bookingId]: {
        ...prevData[bookingId],
        status: newStatus,
        ...(newStatus === "confirmed" && { confirmedAt: new Date().toISOString() }),
        ...(newStatus === "cancelled" && { cancelledAt: new Date().toISOString() }),
      },
    }))
  }

  const handleBookingEdit = (bookingId: string, updatedData: any) => {
    setMockBookingData((prevData) => ({
      ...prevData,
      [bookingId]: {
        ...prevData[bookingId],
        ...updatedData,
      },
    }))
  }

  const handleBookingSubmit = (bookingData: any) => {
    if (Array.isArray(bookingData)) {
      const newBookings = {}
      bookingData.forEach((booking, index) => {
        const newId = `block-${Date.now()}-${index}`
        newBookings[newId] = booking
      })
      setMockBookingData((prevData) => ({
        ...prevData,
        ...newBookings,
      }))
    } else {
      const newId = `new-${Date.now()}`
      setMockBookingData((prevData) => ({
        ...prevData,
        [newId]: bookingData,
      }))
    }
  }

  const filteredBookings = Object.entries(mockBookingData)
    .filter(([id, booking]) => {
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter
      const matchesCategory = categoryFilter === "all" || booking.classification?.category === categoryFilter
      const matchesAgeGroup = ageGroupFilter === "all" || booking.classification?.ageGroup === ageGroupFilter
      const matchesDisability =
        disabilityFilter === "all" || booking.classification?.disabilityCategory === disabilityFilter
      const matchesSearch =
        booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.space.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesStatus && matchesCategory && matchesAgeGroup && matchesDisability && matchesSearch
    })
    .sort(([, a], [, b]) => {
      let comparison = 0
      switch (sortField) {
        case "customer":
          comparison = a.customer.name.localeCompare(b.customer.name)
          break
        case "venue":
          comparison = a.venue.localeCompare(b.venue)
          break
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "amount":
          comparison = a.amount - b.amount
          break
        default:
          comparison = 0
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

  useEffect(() => {
    setSelectedSpace("All Spaces")
  }, [selectedVenue])

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["bookings", "calendar"].includes(tab)) {
      setActiveTab(tab)
    }

    const filter = searchParams.get("filter")
    if (filter && ["pending", "confirmed", "cancelled", "completed"].includes(filter)) {
      setStatusFilter(filter)
    }
  }, [searchParams])

  const totalBookings = Object.keys(mockBookingData).length
  const totalRevenue = Object.values(mockBookingData)
    .filter((b) => b.status === "paid")
    .reduce((sum, b) => sum + b.amount, 0)
  const pendingApprovals = Object.values(mockBookingData).filter((b) => b.status === "pending").length

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminHeader title="Dashboard" subtitle={`${getGreeting()}, Sarah`} />

        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card
              className="zeus-card hover:shadow-lg transition-all cursor-pointer hover:scale-105"
              onClick={() => router.push("/admin/invoices")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
                <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <PoundSterling className="h-4 w-4 text-secondary-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">£{totalRevenue.toFixed(2)}</div>
                <div className="flex items-center text-xs text-secondary-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last year
                </div>
              </CardContent>
            </Card>

            <Card
              className="zeus-card hover:shadow-lg transition-all cursor-pointer hover:scale-105"
              onClick={() => setActiveTab("bookings")}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Bookings</CardTitle>
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                  <CalendarIcon className="h-4 w-4 text-primary-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{totalBookings}</div>
                <div className="flex items-center text-xs text-primary-600 mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  120 bookings in 2025
                </div>
              </CardContent>
            </Card>

            <Card
              className="zeus-card hover:shadow-lg transition-all cursor-pointer hover:scale-105"
              onClick={() => router.push("/admin/venues")}
            >
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

            <Card
              className="zeus-card hover:shadow-lg transition-all cursor-pointer hover:scale-105"
              onClick={() => {
                setActiveTab("bookings")
                setStatusFilter("pending")
              }}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Pending Approvals</CardTitle>
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{pendingApprovals}</div>
                <p className="text-xs text-orange-600 mt-1">Requires attention</p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100">
              <TabsTrigger
                value="bookings"
                className="data-[state=active]:bg-white data-[state=active]:text-primary-600"
              >
                Bookings
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="data-[state=active]:bg-white data-[state=active]:text-primary-600"
              >
                Calendar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-800">Booking Management</h3>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => setIsCreateBookingModalOpen(true)}
                    className="zeus-gradient text-white hover:opacity-90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Booking
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search by customer name, email, venue, or space..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <Label className="text-sm font-medium text-slate-700">Filters:</Label>
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending_payment">Pending Payment</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {bookingCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={ageGroupFilter} onValueChange={setAgeGroupFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Age Group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ages</SelectItem>
                      {ageGroups.map((age) => (
                        <SelectItem key={age} value={age}>
                          {age}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={disabilityFilter} onValueChange={setDisabilityFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Disability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {disabilityCategories.map((dis) => (
                        <SelectItem key={dis} value={dis}>
                          {dis}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-2 ml-auto">
                    <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="venue">Venue</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="amount">Amount</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
                    >
                      {sortDirection === "asc" ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>

                    {getActiveFilterCount() > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-red-600">
                        <X className="w-4 h-4 mr-1" />
                        Clear ({getActiveFilterCount()})
                      </Button>
                    )}
                  </div>
                </div>

                {getActiveFilterCount() > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {statusFilter !== "all" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Status: {statusFilter}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setStatusFilter("all")} />
                      </Badge>
                    )}
                    {categoryFilter !== "all" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Category: {categoryFilter}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setCategoryFilter("all")} />
                      </Badge>
                    )}
                    {ageGroupFilter !== "all" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Age: {ageGroupFilter}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setAgeGroupFilter("all")} />
                      </Badge>
                    )}
                    {disabilityFilter !== "all" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Disability: {disabilityFilter}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setDisabilityFilter("all")} />
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-lg">
                <span>
                  Showing <span className="font-semibold text-slate-900">{filteredBookings.length}</span> of{" "}
                  <span className="font-semibold text-slate-900">{Object.keys(mockBookingData).length}</span> bookings
                </span>
                {getActiveFilterCount() > 0 && (
                  <span className="text-xs">
                    {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? "s" : ""} active
                  </span>
                )}
              </div>

              <Card className="zeus-card">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Venue & Space</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Classification</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map(([id, booking]) => (
                        <TableRow key={id} className="hover:bg-slate-50">
                          <TableCell>
                            <div>
                              <p className="font-medium text-slate-800">{booking.customer.name}</p>
                              <p className="text-sm text-slate-500">{booking.customer.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-slate-800">{booking.venue}</p>
                              <p className="text-sm text-slate-500">{booking.space}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-slate-800">
                                {new Date(booking.date).toLocaleDateString()}
                              </p>
                              <p className="text-sm text-slate-500">{booking.time}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Badge variant="outline" className="text-xs">
                                {booking.classification?.category}
                              </Badge>
                              <div className="flex gap-1">
                                <Badge variant="secondary" className="text-xs">
                                  {booking.classification?.ageGroup}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {booking.classification?.matchType}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium text-slate-800">£{booking.amount}</p>
                            <p className="text-xs text-slate-500">
                              {booking.duration}h @ £{booking.hourlyRate}/h
                            </p>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(booking.status)} flex items-center w-fit`}>
                              {getStatusIcon(booking.status)}
                              <span className="ml-1 capitalize">{booking.status.replace("_", " ")}</span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedBooking({ id, ...booking })
                                  setIsBookingModalOpen(true)
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {booking.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-green-600 border-green-200 hover:bg-green-50 bg-transparent"
                                    onClick={() => handleStatusChange(id, "confirmed")}
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                                    onClick={() => {
                                      setSelectedBooking({ id, ...booking })
                                      setIsDeclineModalOpen(true)
                                    }}
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No bookings found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
                  <Button onClick={clearAllFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-800">Availability Calendar</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm font-medium whitespace-nowrap">Venue:</Label>
                    <Select value={selectedVenue} onValueChange={setSelectedVenue}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All Venues">All Venues</SelectItem>
                        <SelectItem value="Premier Sports Complex">Premier Sports Complex</SelectItem>
                        <SelectItem value="Elite Conference Center">Elite Conference Center</SelectItem>
                        <SelectItem value="Community Sports Hub">Community Sports Hub</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Label className="text-sm font-medium whitespace-nowrap">Space:</Label>
                    <Select
                      value={selectedSpace}
                      onValueChange={setSelectedSpace}
                      disabled={selectedVenue === "All Venues"}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableSpaces().map((space) => (
                          <SelectItem key={space} value={space}>
                            {space}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => setIsCreateBookingModalOpen(true)}
                    className="zeus-gradient text-white hover:opacity-90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Booking
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="zeus-card">
                  <CardHeader>
                    <CardTitle className="flex flex-col space-y-1">
                      <span>Select Date</span>
                      <div className="text-xs text-slate-500 font-normal">
                        {selectedVenue} {selectedSpace !== "All Spaces" && `• ${selectedSpace}`}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date)
                        if (date) setCurrentWeek(date)
                      }}
                      className="rounded-md border"
                      disabled={(date) => date.getFullYear() !== 2025}
                    />
                  </CardContent>
                </Card>

                <div className="lg:col-span-2">
                  <Card className="zeus-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <Clock className="w-5 h-5 mr-2" />
                          Week of {formatWeekRange()}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" onClick={prevWeek}>
                            <ChevronLeft className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={nextWeek}>
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-8 gap-2 text-sm font-medium text-gray-600 border-b pb-2">
                          <div className="text-right pr-2">Time</div>
                          {weekDates.map((date, index) => (
                            <div key={index} className="text-center">
                              <div className="font-semibold">
                                {date.toLocaleDateString("en-GB", { weekday: "short" })}
                              </div>
                              <div className="text-xs text-gray-500">
                                {date.getDate()}/{date.getMonth() + 1}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-1 max-h-80 overflow-y-auto">
                          {timeSlots.map((timeSlot) => (
                            <div key={timeSlot} className="grid grid-cols-8 gap-2 items-center">
                              <div className="text-sm font-medium text-gray-600 text-right pr-2 py-1">{timeSlot}</div>
                              {weekDates.map((date, dateIndex) => {
                                const status = getSlotStatus(date, timeSlot)
                                const slotBooking = getSlotBooking(date, timeSlot)
                                const now = new Date()
                                const isToday = date.toDateString() === now.toDateString()
                                const isPast =
                                  date < new Date(now.getFullYear(), now.getMonth(), now.getDate()) ||
                                  (isToday && Number.parseInt(timeSlot.split(":")[0]) < now.getHours())

                                return (
                                  <Button
                                    key={dateIndex}
                                    variant="outline"
                                    size="sm"
                                    disabled={isPast}
                                    className={`h-8 text-xs ${getSlotColor(status)} ${
                                      isPast ? "opacity-50 cursor-not-allowed" : ""
                                    } ${slotBooking ? "cursor-pointer" : ""}`}
                                    onClick={() => onTimeSlotSelect(date, timeSlot)}
                                    title={slotBooking ? `${slotBooking.customer} - ${slotBooking.venue}` : undefined}
                                  >
                                    {status === "available"
                                      ? "Book"
                                      : status === "pending"
                                        ? slotBooking
                                          ? slotBooking.customer.split(" ")[0]
                                          : "Pending"
                                        : slotBooking
                                          ? slotBooking.customer.split(" ")[0]
                                          : "Booked"}
                                  </Button>
                                )
                              })}
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-center space-x-6 text-sm pt-4 border-t">
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
                            <span>Available</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded"></div>
                            <span>Pending Approval</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                            <span>Pending Payment</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                            <span>Booked</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                <p className="font-medium mb-2">Calendar Legend:</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-white border border-gray-200 rounded"></div>
                    <span>Available - Click to book</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
                    <span>Pending Approval - Click to view</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
                    <span>Pending Payment - Click to view</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                    <span>Booked - Click to view</span>
                  </div>
                  <div className="text-slate-500 col-span-2">
                    <span>Shows customer name when booked</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onStatusChange={handleStatusChange}
        onEdit={handleBookingEdit}
      />

      <CreateBookingModal
        isOpen={isCreateBookingModalOpen}
        onClose={() => setIsCreateBookingModalOpen(false)}
        onSubmit={handleBookingSubmit}
        existingBookings={mockBookingData}
      />

      <DeclineBookingModal
        isOpen={isDeclineModalOpen}
        onClose={() => setIsDeclineModalOpen(false)}
        booking={selectedBooking}
        onConfirm={(reason) => {
          if (selectedBooking) {
            handleStatusChange(selectedBooking.id, "cancelled")
            setMockBookingData((prevData) => ({
              ...prevData,
              [selectedBooking.id]: {
                ...prevData[selectedBooking.id],
                cancellationReason: reason,
                cancelledAt: new Date().toISOString(),
              },
            }))
          }
          setIsDeclineModalOpen(false)
          setIsBookingModalOpen(false)
        }}
      />
    </div>
  )
}
