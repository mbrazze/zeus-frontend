"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  CalendarIcon,
  CheckCircle,
  FileText,
  Send,
  X,
  AlertTriangle,
  Clock,
  ArrowRight,
  ChevronsRight,
  ChevronsLeft,
} from "lucide-react"
import { format, addDays, isSameDay } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface CreateBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (bookingData: any) => void
  existingBookings?: Record<string, any>
}

interface BookingConflict {
  date: string
  conflicts: Array<{
    customer: string
    time: string
    status: string
  }>
}

interface AlternativeSlot {
  startTime: string
  endTime: string
  duration: number
  availableDates: number
  conflictDates: string[]
}

export function CreateBookingModal({ isOpen, onClose, onSubmit, existingBookings = {} }: CreateBookingModalProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdBooking, setCreatedBooking] = useState<any>(null)
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false)
  const [bookingType, setBookingType] = useState<"single" | "block">("single")
  const [conflicts, setConflicts] = useState<BookingConflict[]>([])
  const [alternativeSlots, setAlternativeSlots] = useState<AlternativeSlot[]>([])
  const [timeShiftHours, setTimeShiftHours] = useState<number>(0)
  const [showTimeShift, setShowTimeShift] = useState(false)

  // Block booking states
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [recurringDays, setRecurringDays] = useState<number[]>([]) // 0 = Sunday, 1 = Monday, etc.
  const [recurrencePattern, setRecurrencePattern] = useState<"weekly" | "biweekly" | "monthly">("weekly")
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | undefined>()
  const [blockBookingMethod, setBlockBookingMethod] = useState<"dates" | "recurring">("dates")

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    venue: "",
    space: "",
    date: undefined as Date | undefined,
    startTime: "",
    endTime: "",
    hourlyRate: "",
    notes: "",
    // New classification fields
    category: "",
    subcategory: "",
    ageGroup: "",
    matchType: "",
    disabilityCategory: "",
  })

  const venues = [
    {
      id: "1",
      name: "Premier Sports Complex",
      spaces: ["3G Pitch - Full", "Grass Pitch 1", "Grass Pitch 2", "Conference Room A", "Conference Room B"],
    },
    { id: "2", name: "Elite Conference Center", spaces: ["Main Conference Hall", "Meeting Room 1", "Meeting Room 2"] },
    { id: "3", name: "Community Sports Hub", spaces: ["Sports Hall", "Community Room"] },
  ]

  // New dropdown options
  const bookingCategories = [
    "Recreational",
    "Match",
    "Club Training",
    "FA Flexi League",
    "Small-sided League",
    "School/College/University Extra-Curricular/Enrichment (Includes match play)",
    "School/College/University Curricular use",
    "Holiday camps",
    "Festival / Tournament",
    "Continued Professional Development Session",
  ]

  const subcategories = [
    "FA Wildcats (Girls)",
    "Mini Kickers/Development Group (4-6yrs)",
    "Pay and play sessions",
    "Pro-Club Community Trust Programmes",
    "PL Kicks",
    "Refugee/Asylum Seekers session",
    "Social Inclusion/LSEG",
    "PDC (Player Development Centre session)",
    "FA Comets",
    "Holiday camps",
    "Walking Football or Touch Rugby",
    "FA Flexi League",
    "Festival / Tournament",
    "Childrens Parties",
    "Other",
  ]

  const ageGroups = [
    "U5",
    "U14",
    "U15",
    "U16",
    "U17",
    "U18",
    "U19",
    "U20",
    "U23",
    "Open",
    "Vets (36+)",
    "Senior (56+)",
    "Mixed age",
  ]

  const matchTypes = ["3v3", "4v4", "5v5", "6v6", "7v7", "8v8", "9v9", "11v11"]

  const disabilityCategories = [
    "Non Disability",
    "Amputee",
    "Blind",
    "Cerebral Palsy",
    "Deaf/Hearing Impaired",
    "Down Syndrome",
    "Dwarfism",
    "Frame",
    "Learning Disability",
    "Mental Health",
    "Pan Disability",
    "Partially Sighted",
    "Powerchair",
    "Blind Powerchair Football",
    "Other",
  ]

  const selectedVenue = venues.find((v) => v.name === formData.venue)

  const daysOfWeek = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ]

  // Generate time slots from 08:00 to 23:00
  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = i + 8
    return `${hour.toString().padStart(2, "0")}:00`
  })

  // Parse time string to minutes
  const parseTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
  }

  // Convert minutes to time string
  const minutesToTimeString = (minutes: number): string => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`
  }

  // Calculate shifted time
  const calculateShiftedTime = (time: string, hoursToShift: number): string | null => {
    if (!time) return null

    const minutes = parseTimeToMinutes(time)
    const shiftedMinutes = minutes + hoursToShift * 60

    // Check if within operating hours (08:00 - 23:00)
    const minMinutes = 8 * 60 // 08:00
    const maxMinutes = 23 * 60 // 23:00

    if (shiftedMinutes < minMinutes || shiftedMinutes > maxMinutes) {
      return null
    }

    return minutesToTimeString(shiftedMinutes)
  }

  // Get shifted time preview
  const getShiftedTimePreview = () => {
    if (!formData.startTime || !formData.endTime || timeShiftHours === 0) return null

    const newStartTime = calculateShiftedTime(formData.startTime, timeShiftHours)
    const newEndTime = calculateShiftedTime(formData.endTime, timeShiftHours)

    if (!newStartTime || !newEndTime) return null

    return {
      startTime: newStartTime,
      endTime: newEndTime,
      isValid: true,
    }
  }

  // Apply time shift
  const applyTimeShift = () => {
    const preview = getShiftedTimePreview()
    if (preview && preview.isValid) {
      setFormData((prev) => ({
        ...prev,
        startTime: preview.startTime,
        endTime: preview.endTime,
      }))
      setTimeShiftHours(0)
      setShowTimeShift(false)
    }
  }

  // Check if two time ranges overlap
  const timeRangesOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
    const s1 = parseTimeToMinutes(start1)
    const e1 = parseTimeToMinutes(end1)
    const s2 = parseTimeToMinutes(start2)
    const e2 = parseTimeToMinutes(end2)

    return s1 < e2 && s2 < e1
  }

  // Check for booking conflicts
  const checkForConflicts = (dates: Date[]): BookingConflict[] => {
    if (!formData.venue || !formData.space || !formData.startTime || !formData.endTime) {
      return []
    }

    const conflicts: BookingConflict[] = []

    dates.forEach((date) => {
      const dateKey = date.toISOString().split("T")[0]
      const dateConflicts: BookingConflict["conflicts"] = []

      // Check all existing bookings for this date
      Object.values(existingBookings).forEach((booking: any) => {
        // Skip cancelled bookings
        if (booking.status === "cancelled") return

        // Check if same venue, space, and date
        if (booking.venue === formData.venue && booking.space === formData.space && booking.date === dateKey) {
          // Extract time range from booking
          const [bookingStart, bookingEnd] = booking.time.split(" - ")

          // Check if times overlap
          if (timeRangesOverlap(formData.startTime, formData.endTime, bookingStart, bookingEnd)) {
            dateConflicts.push({
              customer: booking.customer.name,
              time: booking.time,
              status: booking.status,
            })
          }
        }
      })

      if (dateConflicts.length > 0) {
        conflicts.push({
          date: dateKey,
          conflicts: dateConflicts,
        })
      }
    })

    return conflicts
  }

  // Find alternative time slots
  const findAlternativeSlots = (dates: Date[], requestedDuration: number): AlternativeSlot[] => {
    if (!formData.venue || !formData.space || requestedDuration <= 0) {
      return []
    }

    const alternatives: AlternativeSlot[] = []
    const allTimeSlots = timeSlots

    // Generate all possible time slot combinations for the requested duration
    for (let i = 0; i < allTimeSlots.length; i++) {
      const startTime = allTimeSlots[i]
      const startHour = Number.parseInt(startTime.split(":")[0])

      // Calculate end time based on duration
      const endHour = startHour + Math.floor(requestedDuration)
      const endMinutes = (requestedDuration % 1) * 60
      const endTime = `${endHour.toString().padStart(2, "0")}:${endMinutes.toString().padStart(2, "0")}`

      // Skip if end time is beyond operating hours (23:00)
      if (endHour > 23 || (endHour === 23 && endMinutes > 0)) continue

      // Skip if this is the currently selected time
      if (startTime === formData.startTime && endTime === formData.endTime) continue

      // Check availability for this time slot across all selected dates
      let availableDates = 0
      const conflictDates: string[] = []

      dates.forEach((date) => {
        const dateKey = date.toISOString().split("T")[0]
        let hasConflict = false

        // Check all existing bookings for this date
        Object.values(existingBookings).forEach((booking: any) => {
          if (booking.status === "cancelled") return

          if (booking.venue === formData.venue && booking.space === formData.space && booking.date === dateKey) {
            const [bookingStart, bookingEnd] = booking.time.split(" - ")
            if (timeRangesOverlap(startTime, endTime, bookingStart, bookingEnd)) {
              hasConflict = true
            }
          }
        })

        if (!hasConflict) {
          availableDates++
        } else {
          conflictDates.push(dateKey)
        }
      })

      // Only include slots that have at least some availability
      if (availableDates > 0) {
        alternatives.push({
          startTime,
          endTime,
          duration: requestedDuration,
          availableDates,
          conflictDates,
        })
      }
    }

    // Sort by number of available dates (descending) and then by start time
    return alternatives.sort((a, b) => {
      if (b.availableDates !== a.availableDates) {
        return b.availableDates - a.availableDates
      }
      return a.startTime.localeCompare(b.startTime)
    })
  }

  // Apply alternative time slot
  const applyAlternativeSlot = (slot: AlternativeSlot) => {
    setFormData((prev) => ({
      ...prev,
      startTime: slot.startTime,
      endTime: slot.endTime,
    }))
  }

  // Calculate available end times based on start time
  const getAvailableEndTimes = () => {
    if (!formData.startTime) return []

    const startHour = Number.parseInt(formData.startTime.split(":")[0])
    const endTimes = []

    // Minimum 1 hour booking
    for (let hour = startHour + 1; hour <= 23; hour++) {
      endTimes.push(`${hour.toString().padStart(2, "0")}:00`)
      // Add 30-minute option after each hour (except for the last slot)
      if (hour < 23) {
        endTimes.push(`${hour.toString().padStart(2, "0")}:30`)
      }
    }

    return endTimes
  }

  // Calculate duration in hours
  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0

    const startMinutes = parseTimeToMinutes(formData.startTime)
    const endMinutes = parseTimeToMinutes(formData.endTime)

    return (endMinutes - startMinutes) / 60
  }

  // Calculate total price
  const calculateTotalPrice = () => {
    const duration = calculateDuration()
    const rate = Number.parseFloat(formData.hourlyRate) || 0
    return (duration * rate).toFixed(2)
  }

  // Generate all booking dates based on recurrence pattern
  const generateRecurringDates = (): Date[] => {
    if (!formData.date || !recurrenceEndDate || recurringDays.length === 0) return []

    const dates: Date[] = []
    let currentDate = new Date(formData.date)
    const endDate = new Date(recurrenceEndDate)

    while (currentDate <= endDate) {
      // Check if current date's day is in selected days
      if (recurringDays.includes(currentDate.getDay())) {
        dates.push(new Date(currentDate))
      }

      // Move to next day
      currentDate = addDays(currentDate, 1)
    }

    return dates
  }

  // Get all booking dates (either selected dates or generated recurring dates)
  const getAllBookingDates = (): Date[] => {
    if (bookingType === "single") {
      return formData.date ? [formData.date] : []
    }

    if (blockBookingMethod === "dates") {
      return selectedDates
    } else {
      return generateRecurringDates()
    }
  }

  // Calculate total for all bookings
  const calculateBlockBookingTotal = () => {
    const dates = getAllBookingDates()
    const singleBookingPrice = Number.parseFloat(calculateTotalPrice())
    return (dates.length * singleBookingPrice).toFixed(2)
  }

  // Check for conflicts and find alternatives whenever relevant fields change
  useEffect(() => {
    if (formData.venue && formData.space && formData.startTime && formData.endTime) {
      const dates = getAllBookingDates()
      if (dates.length > 0) {
        const foundConflicts = checkForConflicts(dates)
        setConflicts(foundConflicts)

        // Find alternative slots if there are conflicts
        if (foundConflicts.length > 0) {
          const duration = calculateDuration()
          const alternatives = findAlternativeSlots(dates, duration)
          setAlternativeSlots(alternatives.slice(0, 5)) // Show top 5 alternatives
        } else {
          setAlternativeSlots([])
        }
      } else {
        setConflicts([])
        setAlternativeSlots([])
      }
    } else {
      setConflicts([])
      setAlternativeSlots([])
    }
  }, [
    formData.venue,
    formData.space,
    formData.startTime,
    formData.endTime,
    formData.date,
    selectedDates,
    recurringDays,
    recurrenceEndDate,
    blockBookingMethod,
    bookingType,
  ])

  // Check if all required fields are filled
  const isFormComplete = () => {
    const baseFieldsComplete = !!(
      formData.customerName.trim() &&
      formData.customerEmail.trim() &&
      formData.customerPhone.trim() &&
      formData.venue &&
      formData.space &&
      formData.startTime &&
      formData.endTime &&
      formData.hourlyRate &&
      Number.parseFloat(formData.hourlyRate) > 0 &&
      // New required fields
      formData.category &&
      formData.subcategory &&
      formData.ageGroup &&
      formData.matchType &&
      formData.disabilityCategory
    )

    if (!baseFieldsComplete) return false

    if (bookingType === "single") {
      return !!formData.date
    } else {
      if (blockBookingMethod === "dates") {
        return selectedDates.length > 0
      } else {
        return !!(formData.date && recurringDays.length > 0 && recurrenceEndDate)
      }
    }
  }

  // Generate invoice data
  const generateInvoiceData = (totalAmount: number, dates: Date[]) => {
    const invoiceNumber = `INV-${Date.now()}`
    const issueDate = new Date()
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14) // 14 days payment terms

    const subtotal = totalAmount
    const vatRate = 0.2 // 20% VAT
    const vatAmount = subtotal * vatRate
    const total = subtotal + vatAmount

    return {
      invoiceNumber,
      issueDate: issueDate.toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
      customer: {
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
      },
      booking: {
        venue: formData.venue,
        space: formData.space,
        dates: dates.map((d) => d.toISOString().split("T")[0]),
        time: `${formData.startTime} - ${formData.endTime}`,
        duration: calculateDuration(),
        rate: Number.parseFloat(formData.hourlyRate),
        notes: formData.notes,
        isBlockBooking: bookingType === "block",
        numberOfBookings: dates.length,
        // Add classification data
        classification: {
          category: formData.category,
          subcategory: formData.subcategory,
          ageGroup: formData.ageGroup,
          matchType: formData.matchType,
          disabilityCategory: formData.disabilityCategory,
        },
      },
      financial: {
        subtotal,
        vatRate,
        vatAmount,
        total,
      },
    }
  }

  const handleSendInvoice = async () => {
    setIsGeneratingInvoice(true)

    try {
      const dates = getAllBookingDates()
      const totalAmount = Number.parseFloat(
        bookingType === "block" ? calculateBlockBookingTotal() : calculateTotalPrice(),
      )
      const invoiceData = generateInvoiceData(totalAmount, dates)

      // Simulate API call to generate and send invoice
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create booking data array for block bookings
      const bookings = dates.map((date) => ({
        customer: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
        },
        venue: formData.venue,
        space: formData.space,
        date: date.toISOString().split("T")[0],
        time: `${formData.startTime} - ${formData.endTime}`,
        amount: Number.parseFloat(calculateTotalPrice()) * 1.2, // Including VAT
        hourlyRate: Number.parseFloat(formData.hourlyRate),
        duration: calculateDuration(),
        status: "pending_payment",
        notes: formData.notes,
        // Add classification data
        classification: {
          category: formData.category,
          subcategory: formData.subcategory,
          ageGroup: formData.ageGroup,
          matchType: formData.matchType,
          disabilityCategory: formData.disabilityCategory,
        },
        createdAt: new Date().toISOString(),
        invoiceNumber: invoiceData.invoiceNumber,
        invoiceSentAt: new Date().toISOString(),
        createdBy: "admin",
      }))

      // Store booking data for success message
      setCreatedBooking({
        ...bookings[0],
        isBlockBooking: bookingType === "block",
        numberOfBookings: dates.length,
        dates: dates.map((d) => d.toISOString().split("T")[0]),
        invoiceData,
      })

      // Submit the bookings
      onSubmit(bookings)

      // Show success message
      setShowSuccess(true)
    } catch (error) {
      console.error("Error generating invoice:", error)
    } finally {
      setIsGeneratingInvoice(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const dates = getAllBookingDates()

    // Create booking data array for block bookings
    const bookings = dates.map((date) => ({
      customer: {
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
      },
      venue: formData.venue,
      space: formData.space,
      date: date.toISOString().split("T")[0],
      time: `${formData.startTime} - ${formData.endTime}`,
      amount: Number.parseFloat(calculateTotalPrice()) * 1.2, // Including VAT
      hourlyRate: Number.parseFloat(formData.hourlyRate),
      duration: calculateDuration(),
      status: "confirmed",
      notes: formData.notes,
      // Add classification data
      classification: {
        category: formData.category,
        subcategory: formData.subcategory,
        ageGroup: formData.ageGroup,
        matchType: formData.matchType,
        disabilityCategory: formData.disabilityCategory,
      },
      createdAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
      createdBy: "admin",
    }))

    // Store booking data for success message
    setCreatedBooking({
      ...bookings[0],
      isBlockBooking: bookingType === "block",
      numberOfBookings: dates.length,
      dates: dates.map((d) => d.toISOString().split("T")[0]),
    })

    // Submit the bookings
    onSubmit(bookings)

    // Show success message
    setShowSuccess(true)
  }

  const handleClose = () => {
    // Reset all states
    setShowSuccess(false)
    setCreatedBooking(null)
    setBookingType("single")
    setSelectedDates([])
    setRecurringDays([])
    setRecurrencePattern("weekly")
    setRecurrenceEndDate(undefined)
    setBlockBookingMethod("dates")
    setConflicts([])
    setAlternativeSlots([])
    setTimeShiftHours(0)
    setShowTimeShift(false)
    setFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      venue: "",
      space: "",
      date: undefined,
      startTime: "",
      endTime: "",
      hourlyRate: "",
      notes: "",
      category: "",
      subcategory: "",
      ageGroup: "",
      matchType: "",
      disabilityCategory: "",
    })
    onClose()
  }

  const handleCreateAnother = () => {
    // Reset form but keep modal open
    setShowSuccess(false)
    setCreatedBooking(null)
    setBookingType("single")
    setSelectedDates([])
    setRecurringDays([])
    setRecurrencePattern("weekly")
    setRecurrenceEndDate(undefined)
    setBlockBookingMethod("dates")
    setConflicts([])
    setAlternativeSlots([])
    setTimeShiftHours(0)
    setShowTimeShift(false)
    setFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      venue: "",
      space: "",
      date: undefined,
      startTime: "",
      endTime: "",
      hourlyRate: "",
      notes: "",
      category: "",
      subcategory: "",
      ageGroup: "",
      matchType: "",
      disabilityCategory: "",
    })
  }

  const toggleDate = (date: Date) => {
    setSelectedDates((prev) => {
      const exists = prev.some((d) => isSameDay(d, date))
      if (exists) {
        return prev.filter((d) => !isSameDay(d, date))
      } else {
        return [...prev, date].sort((a, b) => a.getTime() - b.getTime())
      }
    })
  }

  const toggleDay = (day: number) => {
    setRecurringDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day)
      } else {
        return [...prev, day].sort()
      }
    })
  }

  // Success Message Component
  if (showSuccess && createdBooking) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center space-y-6 py-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">
                {createdBooking.invoiceData ? "Invoice Sent Successfully!" : "Booking Confirmed Successfully!"}
              </h2>
              <p className="text-slate-600">
                {createdBooking.invoiceData
                  ? "The invoice has been generated and sent to the customer."
                  : "The booking has been confirmed and is ready for invoicing."}
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 text-left space-y-2">
              <h3 className="font-semibold text-slate-800">
                {createdBooking.invoiceData ? "Invoice Details:" : "Booking Details:"}
              </h3>
              <div className="text-sm text-slate-600 space-y-1">
                {createdBooking.invoiceData && (
                  <p>
                    <span className="font-medium">Invoice #:</span> {createdBooking.invoiceNumber}
                  </p>
                )}
                <p>
                  <span className="font-medium">Customer:</span> {createdBooking.customer.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {createdBooking.customer.email}
                </p>
                <p>
                  <span className="font-medium">Venue:</span> {createdBooking.venue}
                </p>
                <p>
                  <span className="font-medium">Space:</span> {createdBooking.space}
                </p>
                {createdBooking.isBlockBooking ? (
                  <>
                    <p>
                      <span className="font-medium">Number of Bookings:</span> {createdBooking.numberOfBookings}
                    </p>
                    <p>
                      <span className="font-medium">First Date:</span>{" "}
                      {format(new Date(createdBooking.dates[0]), "PPP")}
                    </p>
                    <p>
                      <span className="font-medium">Last Date:</span>{" "}
                      {format(new Date(createdBooking.dates[createdBooking.dates.length - 1]), "PPP")}
                    </p>
                  </>
                ) : (
                  <p>
                    <span className="font-medium">Date:</span> {format(new Date(createdBooking.dates[0]), "PPP")}
                  </p>
                )}
                <p>
                  <span className="font-medium">Time:</span> {createdBooking.time}
                </p>
                <p>
                  <span className="font-medium">Duration:</span> {createdBooking.duration} hours
                </p>
                {/* Add classification information */}
                {createdBooking.classification && (
                  <>
                    <div className="border-t pt-2 mt-2">
                      <p className="font-medium text-slate-800 mb-1">Classification:</p>
                    </div>
                    <p>
                      <span className="font-medium">Category:</span> {createdBooking.classification.category}
                    </p>
                    <p>
                      <span className="font-medium">Subcategory:</span> {createdBooking.classification.subcategory}
                    </p>
                    <p>
                      <span className="font-medium">Age Group:</span> {createdBooking.classification.ageGroup}
                    </p>
                    <p>
                      <span className="font-medium">Match Type:</span> {createdBooking.classification.matchType}
                    </p>
                    <p>
                      <span className="font-medium">Disability Category:</span>{" "}
                      {createdBooking.classification.disabilityCategory}
                    </p>
                  </>
                )}
                <p>
                  <span className="font-medium">Total Amount:</span> £{createdBooking.amount.toFixed(2)}
                  {createdBooking.invoiceData && " (inc. VAT)"}
                </p>
                {createdBooking.invoiceData && (
                  <p>
                    <span className="font-medium">Payment Due:</span>{" "}
                    {format(new Date(createdBooking.invoiceData.dueDate), "PPP")}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleCreateAnother} className="flex-1 bg-transparent">
                Create Another
              </Button>
              <Button onClick={handleClose} className="flex-1 zeus-gradient text-white hover:opacity-90">
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Main Form Component
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800">Create New Booking</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Booking Type Selection */}
            <div className="space-y-4">
              <Label>Booking Type</Label>
              <Tabs value={bookingType} onValueChange={(value) => setBookingType(value as "single" | "block")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="single">Single Booking</TabsTrigger>
                  <TabsTrigger value="block">Block Booking</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-700">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerName: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email Address *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData((prev) => ({ ...prev, customerEmail: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone Number *</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customerPhone: e.target.value }))}
                  required
                />
              </div>
            </div>

            {/* Booking Classification */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-700">Booking Classification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {bookingCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory *</Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, subcategory: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((sub) => (
                        <SelectItem key={sub} value={sub}>
                          {sub}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ageGroup">Age Group *</Label>
                  <Select
                    value={formData.ageGroup}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, ageGroup: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select age group" />
                    </SelectTrigger>
                    <SelectContent>
                      {ageGroups.map((age) => (
                        <SelectItem key={age} value={age}>
                          {age}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="matchType">Match Type *</Label>
                  <Select
                    value={formData.matchType}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, matchType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select match type" />
                    </SelectTrigger>
                    <SelectContent>
                      {matchTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disabilityCategory">Disability Category *</Label>
                  <Select
                    value={formData.disabilityCategory}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, disabilityCategory: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {disabilityCategories.map((dis) => (
                        <SelectItem key={dis} value={dis}>
                          {dis}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-700">Booking Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue *</Label>
                  <Select
                    value={formData.venue}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, venue: value, space: "" }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select venue" />
                    </SelectTrigger>
                    <SelectContent>
                      {venues.map((venue) => (
                        <SelectItem key={venue.id} value={venue.name}>
                          {venue.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="space">Space *</Label>
                  <Select
                    value={formData.space}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, space: value }))}
                    disabled={!formData.venue}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select space" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedVenue?.spaces.map((space) => (
                        <SelectItem key={space} value={space}>
                          {space}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date Selection - Different for Single vs Block */}
              {bookingType === "single" ? (
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => setFormData((prev) => ({ ...prev, date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              ) : (
                <div className="space-y-4">
                  <Label>Select Dates *</Label>
                  <Tabs
                    value={blockBookingMethod}
                    onValueChange={(value) => setBlockBookingMethod(value as "dates" | "recurring")}
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="dates">Select Specific Dates</TabsTrigger>
                      <TabsTrigger value="recurring">Recurring Pattern</TabsTrigger>
                    </TabsList>

                    <TabsContent value="dates" className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <Calendar
                          mode="multiple"
                          selected={selectedDates}
                          onSelect={(dates) => setSelectedDates(dates || [])}
                          className="rounded-md"
                        />
                        {selectedDates.length > 0 && (
                          <div className="mt-4 p-3 bg-slate-50 rounded-md">
                            <p className="text-sm font-medium text-slate-700 mb-2">
                              Selected Dates ({selectedDates.length}):
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {selectedDates.map((date, index) => (
                                <div
                                  key={index}
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                                >
                                  {format(date, "MMM d, yyyy")}
                                  <button
                                    type="button"
                                    onClick={() => toggleDate(date)}
                                    className="text-slate-400 hover:text-slate-600"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="recurring" className="space-y-4">
                      <div className="space-y-4 border rounded-lg p-4">
                        <div className="space-y-2">
                          <Label>Start Date *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal bg-transparent"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.date ? format(formData.date, "PPP") : "Pick start date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={formData.date}
                                onSelect={(date) => setFormData((prev) => ({ ...prev, date }))}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <Label>Select Day(s) of the Week *</Label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {daysOfWeek.map((day) => (
                              <div key={day.value} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`day-${day.value}`}
                                  checked={recurringDays.includes(day.value)}
                                  onCheckedChange={() => toggleDay(day.value)}
                                />
                                <Label htmlFor={`day-${day.value}`} className="text-sm font-normal cursor-pointer">
                                  {day.label}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="recurrencePattern">Recurrence Pattern *</Label>
                          <Select
                            value={recurrencePattern}
                            onValueChange={(value) => setRecurrencePattern(value as "weekly" | "biweekly" | "monthly")}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="biweekly">Bi-weekly (Every 2 weeks)</SelectItem>
                              <SelectItem value="monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>End Date *</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal bg-transparent"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {recurrenceEndDate ? format(recurrenceEndDate, "PPP") : "Pick end date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={recurrenceEndDate}
                                onSelect={setRecurrenceEndDate}
                                disabled={(date) => (formData.date ? date < formData.date : false)}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        {formData.date && recurringDays.length > 0 && recurrenceEndDate && (
                          <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                            <p className="text-sm font-medium text-blue-900">
                              This will create {generateRecurringDates().length} bookings
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                              From {format(formData.date, "MMM d, yyyy")} to {format(recurrenceEndDate, "MMM d, yyyy")}
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Select
                    value={formData.startTime}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, startTime: value, endTime: "" }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="08:--" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time *</Label>
                  <Select
                    value={formData.endTime}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, endTime: value }))}
                    disabled={!formData.startTime}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="--:--" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableEndTimes().map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="hourlyRate">Rate per Hour (£) *</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, hourlyRate: e.target.value }))}
                    placeholder="45.00"
                    required
                  />
                </div>
              </div>

              {/* Bulk Time Shift Tool - Only for Block Bookings */}
              {bookingType === "block" && formData.startTime && formData.endTime && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-900">Bulk Time Adjustment</h4>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTimeShift(!showTimeShift)}
                      className="text-purple-600 hover:text-purple-800 hover:bg-purple-100"
                    >
                      {showTimeShift ? "Hide" : "Show"}
                    </Button>
                  </div>

                  {showTimeShift && (
                    <div className="space-y-4">
                      <p className="text-sm text-purple-800">
                        Shift all booking times earlier or later by adjusting hours below
                      </p>

                      <div className="flex items-center space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setTimeShiftHours((prev) => Math.max(prev - 1, -8))}
                          disabled={timeShiftHours <= -8}
                          className="border-purple-300 text-purple-700 hover:bg-purple-100 bg-white"
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>

                        <div className="flex-1 flex items-center justify-center space-x-2">
                          <Input
                            type="number"
                            value={timeShiftHours}
                            onChange={(e) => setTimeShiftHours(Number(e.target.value))}
                            className="text-center w-20 border-purple-300"
                            min="-8"
                            max="8"
                          />
                          <span className="text-sm font-medium text-purple-900">
                            {Math.abs(timeShiftHours)} hour{Math.abs(timeShiftHours) !== 1 ? "s" : ""}{" "}
                            {timeShiftHours > 0 ? "later" : timeShiftHours < 0 ? "earlier" : ""}
                          </span>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setTimeShiftHours((prev) => Math.min(prev + 1, 8))}
                          disabled={timeShiftHours >= 8}
                          className="border-purple-300 text-purple-700 hover:bg-purple-100 bg-white"
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>

                      {timeShiftHours !== 0 &&
                        (() => {
                          const preview = getShiftedTimePreview()
                          if (!preview) {
                            return (
                              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-sm text-red-800 font-medium">
                                  ⚠️ Invalid time range - would be outside operating hours (08:00 - 23:00)
                                </p>
                              </div>
                            )
                          }
                          return (
                            <div className="bg-white border border-purple-200 rounded-lg p-3 space-y-2">
                              <p className="text-sm font-medium text-purple-900">Preview:</p>
                              <div className="flex items-center space-x-3 text-sm">
                                <div className="text-slate-600">
                                  <span className="line-through">
                                    {formData.startTime} - {formData.endTime}
                                  </span>
                                </div>
                                <ArrowRight className="h-4 w-4 text-purple-600" />
                                <div className="font-semibold text-purple-900">
                                  {preview.startTime} - {preview.endTime}
                                </div>
                              </div>
                              <Button
                                type="button"
                                onClick={applyTimeShift}
                                className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white"
                                size="sm"
                              >
                                Apply Time Shift to All Bookings
                              </Button>
                            </div>
                          )
                        })()}

                      <div className="text-xs text-purple-700 space-y-1">
                        <p>
                          • Current time: {formData.startTime} - {formData.endTime}
                        </p>
                        <p>• Operating hours: 08:00 - 23:00</p>
                        <p>• This will shift all {getAllBookingDates().length} bookings</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Conflict Warning */}
              {conflicts.length > 0 && (
                <Alert variant="destructive" className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertTitle className="text-orange-900">Booking Conflicts Detected</AlertTitle>
                  <AlertDescription className="text-orange-800">
                    <p className="mb-2">{conflicts.length} date(s) have conflicting bookings at the selected time:</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {conflicts.map((conflict, index) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium">{format(new Date(conflict.date), "PPP")}:</p>
                          <ul className="list-disc list-inside pl-2">
                            {conflict.conflicts.map((c, idx) => (
                              <li key={idx}>
                                {c.customer} - {c.time} ({c.status})
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <p className="mt-2 text-xs">
                      You can still proceed with the booking, but please verify with the customer and existing bookings.
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              {/* Alternative Time Slots */}
              {alternativeSlots.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">Alternative Time Slots Available</h4>
                  </div>
                  <p className="text-sm text-blue-800 mb-3">
                    We found {alternativeSlots.length} alternative time slots with better availability:
                  </p>
                  <div className="space-y-2">
                    {alternativeSlots.map((slot, index) => {
                      const totalDates = getAllBookingDates().length
                      const availabilityPercentage = Math.round((slot.availableDates / totalDates) * 100)

                      return (
                        <div
                          key={index}
                          className="bg-white border border-blue-200 rounded-lg p-3 hover:border-blue-400 transition-colors cursor-pointer"
                          onClick={() => applyAlternativeSlot(slot)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-blue-600" />
                                <span className="font-medium text-blue-900">
                                  {slot.startTime} - {slot.endTime}
                                </span>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  availabilityPercentage === 100
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-blue-100 text-blue-800 border-blue-200"
                                }
                              >
                                {slot.availableDates} of {totalDates} dates available
                              </Badge>
                            </div>
                            <ArrowRight className="h-4 w-4 text-blue-600" />
                          </div>
                          {slot.conflictDates.length > 0 && (
                            <p className="text-xs text-slate-600 mt-2">
                              Conflicts on: {slot.conflictDates.map((d) => format(new Date(d), "MMM d")).join(", ")}
                            </p>
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-xs text-blue-700 mt-3">Click on any alternative slot to apply it automatically</p>
                </div>
              )}

              {/* Total Price Display */}
              {formData.startTime && formData.endTime && formData.hourlyRate && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Duration per booking:</span>
                      <span className="font-medium">{calculateDuration()} hours</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-600">Rate per hour:</span>
                      <span className="font-medium">£{formData.hourlyRate}</span>
                    </div>
                    {bookingType === "block" && (
                      <>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600">Number of bookings:</span>
                          <span className="font-medium">{getAllBookingDates().length}</span>
                        </div>
                        {conflicts.length > 0 && (
                          <div className="flex justify-between items-center text-sm text-orange-600">
                            <span>Bookings with conflicts:</span>
                            <span className="font-medium">{conflicts.length}</span>
                          </div>
                        )}
                      </>
                    )}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">Subtotal:</span>
                        <span className="font-medium">
                          £{bookingType === "block" ? calculateBlockBookingTotal() : calculateTotalPrice()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-600">VAT (20%):</span>
                        <span className="font-medium">
                          £
                          {(
                            Number.parseFloat(
                              bookingType === "block" ? calculateBlockBookingTotal() : calculateTotalPrice(),
                            ) * 0.2
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t mt-2">
                        <span className="text-lg font-bold text-slate-800">Total:</span>
                        <span className="text-lg font-bold text-slate-800">
                          £
                          {(
                            Number.parseFloat(
                              bookingType === "block" ? calculateBlockBookingTotal() : calculateTotalPrice(),
                            ) * 1.2
                          ).toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 text-right mt-1">(inc. VAT)</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Special Requirements / Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Any special requirements or notes for this booking..."
                />
              </div>
            </div>
          </form>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-white">
          <div className="flex gap-3 w-full">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleSendInvoice}
              disabled={!isFormComplete() || isGeneratingInvoice}
              className="border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-50 bg-transparent"
            >
              {isGeneratingInvoice ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Invoice
                </>
              )}
            </Button>

            <Button
              type="submit"
              className="zeus-gradient text-white hover:opacity-90"
              onClick={handleSubmit}
              disabled={!isFormComplete()}
            >
              <FileText className="w-4 h-4 mr-2" />
              Create {bookingType === "block" ? "Block " : ""}Booking
              {conflicts.length > 0 && " (Override Conflicts)"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
