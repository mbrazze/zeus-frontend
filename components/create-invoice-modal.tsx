"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { CalendarIcon, CheckCircle, FileText, Send, Check, ChevronsUpDown } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface CreateInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (invoiceData: any) => void
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

interface Booking {
  id: string
  customerId: string
  customerName: string
  venue: string
  space: string
  date: string
  time: string
  amount: number
  status: string
}

export function CreateInvoiceModal({ isOpen, onClose, onSubmit }: CreateInvoiceModalProps) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdInvoice, setCreatedInvoice] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false)

  // Mock customers
  const [customers] = useState<Customer[]>([
    { id: "1", name: "John Smith", email: "john.smith@example.com", phone: "+44 7700 900000" },
    { id: "2", name: "Sarah Johnson", email: "sarah.j@example.com", phone: "+44 7700 900001" },
    { id: "3", name: "Mike Williams", email: "mike.w@example.com", phone: "+44 7700 900002" },
    { id: "4", name: "Emily Brown", email: "emily.brown@example.com", phone: "+44 7700 900003" },
    { id: "5", name: "David Lee", email: "david.lee@example.com", phone: "+44 7700 900004" },
  ])

  // Mock bookings (unpaid bookings only)
  const [bookings] = useState<Booking[]>([
    {
      id: "1",
      customerId: "1",
      customerName: "John Smith",
      venue: "Powerleague Manchester",
      space: "3G Pitch - Full",
      date: "2024-02-15",
      time: "18:00 - 20:00",
      amount: 200,
      status: "confirmed",
    },
    {
      id: "2",
      customerId: "1",
      customerName: "John Smith",
      venue: "Powerleague Manchester",
      space: "3G Pitch - Full",
      date: "2024-02-22",
      time: "18:00 - 20:00",
      amount: 200,
      status: "confirmed",
    },
    {
      id: "3",
      customerId: "2",
      customerName: "Sarah Johnson",
      venue: "Goals Birmingham",
      space: "5-a-side Pitch 1",
      date: "2024-02-18",
      time: "19:00 - 21:00",
      amount: 150,
      status: "confirmed",
    },
    {
      id: "4",
      customerId: "2",
      customerName: "Sarah Johnson",
      venue: "Goals Birmingham",
      space: "5-a-side Pitch 1",
      date: "2024-02-25",
      time: "19:00 - 21:00",
      amount: 150,
      status: "confirmed",
    },
    {
      id: "5",
      customerId: "3",
      customerName: "Mike Williams",
      venue: "Powerleague Manchester",
      space: "Grass Pitch 1",
      date: "2024-02-20",
      time: "16:00 - 18:00",
      amount: 180,
      status: "confirmed",
    },
  ])

  const [formData, setFormData] = useState({
    customerId: "",
    dueDate: undefined as Date | undefined,
    paymentTerms: "14",
    notes: "",
  })

  const [selectedBookings, setSelectedBookings] = useState<string[]>([])

  // Auto-set due date when payment terms change
  useEffect(() => {
    if (formData.paymentTerms) {
      const days = Number.parseInt(formData.paymentTerms)
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + days)
      setFormData((prev) => ({ ...prev, dueDate }))
    }
  }, [formData.paymentTerms])

  // Get customer bookings
  const getCustomerBookings = () => {
    if (!formData.customerId) return []
    return bookings.filter((b) => b.customerId === formData.customerId)
  }

  const customerBookings = getCustomerBookings()
  const selectedCustomer = customers.find((c) => c.id === formData.customerId)

  // Calculate totals
  const calculateSubtotal = () => {
    return selectedBookings.reduce((sum, bookingId) => {
      const booking = bookings.find((b) => b.id === bookingId)
      return sum + (booking?.amount || 0)
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const vatRate = 0.2
  const vatAmount = subtotal * vatRate
  const total = subtotal + vatAmount

  // Toggle booking selection
  const toggleBooking = (bookingId: string) => {
    setSelectedBookings((prev) => {
      if (prev.includes(bookingId)) {
        return prev.filter((id) => id !== bookingId)
      } else {
        return [...prev, bookingId]
      }
    })
  }

  // Select all bookings
  const selectAllBookings = () => {
    setSelectedBookings(customerBookings.map((b) => b.id))
  }

  // Clear all bookings
  const clearAllBookings = () => {
    setSelectedBookings([])
  }

  // Check if form is complete
  const isFormComplete = () => {
    return !!(formData.customerId && selectedBookings.length > 0 && formData.dueDate)
  }

  const handleSubmit = async (sendNow = false) => {
    if (!isFormComplete()) return

    setIsGenerating(true)

    try {
      const invoiceNumber = `INV-${Date.now()}`
      const issueDate = new Date()

      const selectedBookingData = selectedBookings
        .map((id) => bookings.find((b) => b.id === id))
        .filter((b) => b !== undefined)

      const invoiceData = {
        invoiceNumber,
        issueDate: issueDate.toISOString().split("T")[0],
        dueDate: formData.dueDate!.toISOString().split("T")[0],
        customer: selectedCustomer,
        bookings: selectedBookingData,
        financial: {
          subtotal,
          vatRate,
          vatAmount,
          total,
        },
        notes: formData.notes,
        status: sendNow ? "pending" : "draft",
        createdAt: new Date().toISOString(),
        sentAt: sendNow ? new Date().toISOString() : null,
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setCreatedInvoice(invoiceData)
      onSubmit(invoiceData)
      setShowSuccess(true)
    } catch (error) {
      console.error("Error creating invoice:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClose = () => {
    setShowSuccess(false)
    setCreatedInvoice(null)
    setFormData({
      customerId: "",
      dueDate: undefined,
      paymentTerms: "14",
      notes: "",
    })
    setSelectedBookings([])
    onClose()
  }

  const handleCreateAnother = () => {
    setShowSuccess(false)
    setCreatedInvoice(null)
    setFormData({
      customerId: "",
      dueDate: undefined,
      paymentTerms: "14",
      notes: "",
    })
    setSelectedBookings([])
  }

  const handleSelectCustomer = (customerId: string) => {
    setFormData((prev) => ({ ...prev, customerId }))
    setSelectedBookings([]) // Reset bookings when customer changes
    setCustomerSearchOpen(false)
  }

  // Success screen
  if (showSuccess && createdInvoice) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="text-center space-y-6 py-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">
                {createdInvoice.status === "pending" ? "Invoice Sent Successfully!" : "Invoice Created!"}
              </h2>
              <p className="text-slate-600">
                {createdInvoice.status === "pending"
                  ? "The invoice has been sent to the customer."
                  : "The invoice has been saved as a draft."}
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 text-left space-y-2">
              <h3 className="font-semibold text-slate-800">Invoice Details:</h3>
              <div className="text-sm text-slate-600 space-y-1">
                <p>
                  <span className="font-medium">Invoice #:</span> {createdInvoice.invoiceNumber}
                </p>
                <p>
                  <span className="font-medium">Customer:</span> {createdInvoice.customer.name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {createdInvoice.customer.email}
                </p>
                <p>
                  <span className="font-medium">Bookings:</span> {createdInvoice.bookings.length}
                </p>
                <p>
                  <span className="font-medium">Issue Date:</span> {format(new Date(createdInvoice.issueDate), "PPP")}
                </p>
                <p>
                  <span className="font-medium">Due Date:</span> {format(new Date(createdInvoice.dueDate), "PPP")}
                </p>
                <Separator className="my-2" />
                <p>
                  <span className="font-medium">Subtotal:</span> £{createdInvoice.financial.subtotal.toFixed(2)}
                </p>
                <p>
                  <span className="font-medium">VAT (20%):</span> £{createdInvoice.financial.vatAmount.toFixed(2)}
                </p>
                <p className="text-base font-bold text-slate-800">
                  <span className="font-medium">Total:</span> £{createdInvoice.financial.total.toFixed(2)}
                </p>
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

  // Main form
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800">Create New Invoice</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {/* Customer Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-700">Customer Information</h3>
              <div className="space-y-2">
                <Label htmlFor="customer">Select Customer *</Label>
                <Popover open={customerSearchOpen} onOpenChange={setCustomerSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={customerSearchOpen}
                      className="w-full justify-between bg-transparent hover:bg-slate-50"
                    >
                      {formData.customerId
                        ? customers.find((customer) => customer.id === formData.customerId)?.name
                        : "Select a customer"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[600px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search by name or email..." className="h-9" />
                      <CommandEmpty>No customer found.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {customers.map((customer) => (
                            <CommandItem
                              key={customer.id}
                              value={customer.name.toLowerCase() + " " + customer.email.toLowerCase()}
                              onSelect={() => handleSelectCustomer(customer.id)}
                              className="cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.customerId === customer.id ? "opacity-100" : "opacity-0",
                                )}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">{customer.name}</span>
                                <span className="text-xs text-slate-500">{customer.email}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {selectedCustomer && (
                  <div className="p-3 bg-slate-50 rounded-md border border-slate-200">
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="font-medium">Email:</span> {selectedCustomer.email}
                      </p>
                      <p>
                        <span className="font-medium">Phone:</span> {selectedCustomer.phone}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bookings Selection */}
            {formData.customerId && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-slate-700">Select Bookings *</h3>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={selectAllBookings}
                      disabled={selectedBookings.length === customerBookings.length}
                      className="bg-transparent"
                    >
                      Select All
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearAllBookings}
                      disabled={selectedBookings.length === 0}
                      className="bg-transparent"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>

                {customerBookings.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-slate-300 rounded-lg">
                    <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">No unpaid bookings found</p>
                    <p className="text-sm text-slate-500 mt-1">This customer has no confirmed bookings to invoice.</p>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                      <p className="text-sm text-slate-600">
                        {selectedBookings.length} of {customerBookings.length} bookings selected
                      </p>
                    </div>
                    <div className="divide-y divide-slate-200 max-h-80 overflow-y-auto">
                      {customerBookings.map((booking) => {
                        const isSelected = selectedBookings.includes(booking.id)
                        return (
                          <div
                            key={booking.id}
                            className={`p-4 cursor-pointer transition-colors ${
                              isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                            }`}
                            onClick={() => toggleBooking(booking.id)}
                          >
                            <div className="flex items-start gap-3">
                              <Checkbox checked={isSelected} className="mt-1" />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <p className="font-medium text-slate-800">{booking.venue}</p>
                                    <p className="text-sm text-slate-600">{booking.space}</p>
                                    <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                                      <span>{format(new Date(booking.date), "PPP")}</span>
                                      <span>•</span>
                                      <span>{booking.time}</span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold text-slate-800">£{booking.amount.toFixed(2)}</p>
                                    <Badge variant="outline" className="mt-1">
                                      {booking.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Payment Terms */}
            {selectedBookings.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-slate-700">Payment Terms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms *</Label>
                    <Select
                      value={formData.paymentTerms}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentTerms: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Due Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.dueDate}
                          onSelect={(date) => setFormData((prev) => ({ ...prev, dueDate: date }))}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    placeholder="Add any additional notes for the customer..."
                  />
                </div>
              </div>
            )}

            {/* Invoice Summary */}
            {selectedBookings.length > 0 && (
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Invoice Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Number of bookings:</span>
                    <span className="font-medium">{selectedBookings.length}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">Subtotal:</span>
                    <span className="font-medium">£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">VAT (20%):</span>
                    <span className="font-medium">£{vatAmount.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-800">Total:</span>
                    <span className="text-2xl font-bold text-slate-800">£{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-white">
          <div className="flex gap-3 w-full">
            <Button type="button" variant="outline" onClick={handleClose} className="bg-transparent">
              Cancel
            </Button>

            <div className="flex-1 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSubmit(false)}
                disabled={!isFormComplete() || isGenerating}
                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 bg-transparent"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Save as Draft
                  </>
                )}
              </Button>

              <Button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={!isFormComplete() || isGenerating}
                className="flex-1 zeus-gradient text-white hover:opacity-90"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Create & Send Invoice
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
