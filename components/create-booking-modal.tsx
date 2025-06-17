"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, CheckCircle, FileText, Send } from "lucide-react"
import { format } from "date-fns"

interface CreateBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (bookingData: any) => void
}

export function CreateBookingModal({ isOpen, onClose, onSubmit }: CreateBookingModalProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdBooking, setCreatedBooking] = useState<any>(null)
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false)
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

  const selectedVenue = venues.find((v) => v.name === formData.venue)

  // Generate time slots from 8:00 to 21:00
  const timeSlots = Array.from({ length: 14 }, (_, i) => {
    const hour = i + 8
    return `${hour.toString().padStart(2, "0")}:00`
  })

  // Calculate available end times based on start time
  const getAvailableEndTimes = () => {
    if (!formData.startTime) return []

    const startHour = Number.parseInt(formData.startTime.split(":")[0])
    const endTimes = []

    // Minimum 1 hour booking
    for (let hour = startHour + 1; hour <= 21; hour++) {
      endTimes.push(`${hour.toString().padStart(2, "0")}:00`)
      // Add 30-minute option after each hour (except for the last slot)
      if (hour < 21) {
        endTimes.push(`${hour.toString().padStart(2, "0")}:30`)
      }
    }

    return endTimes
  }

  // Calculate duration in hours
  const calculateDuration = () => {
    if (!formData.startTime || !formData.endTime) return 0

    const [startHour, startMin] = formData.startTime.split(":").map(Number)
    const [endHour, endMin] = formData.endTime.split(":").map(Number)

    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin

    return (endMinutes - startMinutes) / 60
  }

  // Calculate total price
  const calculateTotalPrice = () => {
    const duration = calculateDuration()
    const rate = Number.parseFloat(formData.hourlyRate) || 0
    return (duration * rate).toFixed(2)
  }

  // Check if all required fields are filled
  const isFormComplete = () => {
    return !!(
      formData.customerName.trim() &&
      formData.customerEmail.trim() &&
      formData.customerPhone.trim() &&
      formData.venue &&
      formData.space &&
      formData.date &&
      formData.startTime &&
      formData.endTime &&
      formData.hourlyRate &&
      Number.parseFloat(formData.hourlyRate) > 0
    )
  }

  // Add this after the isFormComplete function for debugging
  const getMissingFields = () => {
    const missing = []
    if (!formData.customerName.trim()) missing.push("customerName")
    if (!formData.customerEmail.trim()) missing.push("customerEmail")
    if (!formData.customerPhone.trim()) missing.push("customerPhone")
    if (!formData.venue) missing.push("venue")
    if (!formData.space) missing.push("space")
    if (!formData.date) missing.push("date")
    if (!formData.startTime) missing.push("startTime")
    if (!formData.endTime) missing.push("endTime")
    if (!formData.hourlyRate || Number.parseFloat(formData.hourlyRate) <= 0) missing.push("hourlyRate")
    return missing
  }

  // Generate invoice data
  const generateInvoiceData = () => {
    const invoiceNumber = `INV-${Date.now()}`
    const issueDate = new Date()
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 14) // 14 days payment terms

    const subtotal = Number.parseFloat(calculateTotalPrice())
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
        date: formData.date?.toISOString().split("T")[0],
        time: `${formData.startTime} - ${formData.endTime}`,
        duration: calculateDuration(),
        rate: Number.parseFloat(formData.hourlyRate),
        notes: formData.notes,
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
      const invoiceData = generateInvoiceData()

      // Simulate API call to generate and send invoice
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create booking data
      const bookingData = {
        id: `new-${Date.now()}`,
        invoiceNumber: invoiceData.invoiceNumber,
        customer: {
          name: formData.customerName,
          email: formData.customerEmail,
          phone: formData.customerPhone,
        },
        venue: formData.venue,
        space: formData.space,
        date: formData.date?.toISOString().split("T")[0],
        time: `${formData.startTime} - ${formData.endTime}`,
        amount: invoiceData.financial.total,
        hourlyRate: Number.parseFloat(formData.hourlyRate),
        duration: calculateDuration(),
        status: "pending_payment",
        notes: formData.notes,
        createdAt: new Date().toISOString(),
        invoiceData,
      }

      // Store booking data for success message
      setCreatedBooking(bookingData)

      // Submit the booking
      onSubmit(bookingData)

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

    const bookingData = {
      id: `new-${Date.now()}`,
      customer: {
        name: formData.customerName,
        email: formData.customerEmail,
        phone: formData.customerPhone,
      },
      venue: formData.venue,
      space: formData.space,
      date: formData.date?.toISOString().split("T")[0],
      time: `${formData.startTime} - ${formData.endTime}`,
      amount: Number.parseFloat(calculateTotalPrice()),
      hourlyRate: Number.parseFloat(formData.hourlyRate),
      duration: calculateDuration(),
      status: "confirmed", // Admin-created bookings are automatically confirmed
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      confirmedAt: new Date().toISOString(),
      createdBy: "admin", // Mark as admin-created
    }

    // Store booking data for success message
    setCreatedBooking(bookingData)

    // Submit the booking
    onSubmit(bookingData)

    // Show success message
    setShowSuccess(true)
  }

  const handleClose = () => {
    // Reset all states
    setShowSuccess(false)
    setCreatedBooking(null)
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
    })
    onClose()
  }

  const handleCreateAnother = () => {
    // Reset form but keep modal open
    setShowSuccess(false)
    setCreatedBooking(null)
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
                <p>
                  <span className="font-medium">Date:</span> {format(new Date(createdBooking.date), "PPP")}
                </p>
                <p>
                  <span className="font-medium">Time:</span> {createdBooking.time}
                </p>
                <p>
                  <span className="font-medium">Duration:</span> {createdBooking.duration} hours
                </p>
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
              <Button variant="outline" onClick={handleCreateAnother} className="flex-1">
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
      <DialogContent className="max-w-2xl h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800">Create New Booking</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
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
                <div className="space-y-2">
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

              {/* Total Price Display */}
              {formData.startTime && formData.endTime && formData.hourlyRate && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-600">Duration: {calculateDuration()} hours</p>
                      <p className="text-sm text-slate-600">Rate: £{formData.hourlyRate}/hour</p>
                      <p className="text-sm text-slate-600">Subtotal: £{calculateTotalPrice()}</p>
                      <p className="text-sm text-slate-600">
                        VAT (20%): £{(Number.parseFloat(calculateTotalPrice()) * 0.2).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-800">
                        Total: £{(Number.parseFloat(calculateTotalPrice()) * 1.2).toFixed(2)}
                      </p>
                      <p className="text-xs text-slate-500">(inc. VAT)</p>
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

            {/* Debug info - remove this after testing */}
            {!isFormComplete() && <div className="text-xs text-red-500">Missing: {getMissingFields().join(", ")}</div>}

            {/* Send Invoice Button - now always visible for testing */}
            <Button
              type="button"
              variant="outline"
              onClick={handleSendInvoice}
              disabled={!isFormComplete() || isGeneratingInvoice}
              className="border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
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

            <Button type="submit" className="zeus-gradient text-white hover:opacity-90" onClick={handleSubmit}>
              <FileText className="w-4 h-4 mr-2" />
              Create Booking
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
