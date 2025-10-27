"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { CalendarIcon, Send, Edit, Check, ChevronsUpDown } from "lucide-react"
import { format, parse } from "date-fns"
import { cn } from "@/lib/utils"

interface Invoice {
  id: string
  invoiceNumber: string
  customer: {
    name: string
    email: string
  }
  venue: string
  bookings: number
  amount: number
  subtotal: number
  vat: number
  status: "paid" | "pending" | "overdue" | "draft"
  issueDate: string
  dueDate: string
  paidDate?: string
  notes?: string
  paymentTerms?: string
}

interface ViewEditInvoiceModalProps {
  isOpen: boolean
  onClose: () => void
  invoice: Invoice | null
  onUpdate: (invoice: Invoice) => void
  onSend: (invoice: Invoice) => void
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
}

export function ViewEditInvoiceModal({ isOpen, onClose, invoice, onUpdate, onSend }: ViewEditInvoiceModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [customerSearchOpen, setCustomerSearchOpen] = useState(false)

  // Mock customers (in a real app, this would come from props or API)
  const customers: Customer[] = [
    { id: "1", name: "John Smith", email: "john.smith@example.com", phone: "+44 7700 900000" },
    { id: "2", name: "Sarah Johnson", email: "sarah.j@example.com", phone: "+44 7700 900001" },
    { id: "3", name: "Mike Williams", email: "mike.w@example.com", phone: "+44 7700 900002" },
    { id: "4", name: "Emily Brown", email: "emily.brown@example.com", phone: "+44 7700 900003" },
    { id: "5", name: "David Lee", email: "david.lee@example.com", phone: "+44 7700 900004" },
  ]

  const [formData, setFormData] = useState({
    customerId: "",
    dueDate: new Date(),
    paymentTerms: "14",
    notes: "",
  })

  // Update form data when invoice changes
  useEffect(() => {
    if (invoice) {
      // Find customer ID by matching name
      const matchingCustomer = customers.find((c) => c.name === invoice.customer.name)

      const parsedDueDate = parse(invoice.dueDate, "dd/MM/yyyy", new Date())

      setFormData({
        customerId: matchingCustomer?.id || "",
        dueDate: parsedDueDate,
        paymentTerms: invoice.paymentTerms || "14",
        notes: invoice.notes || "",
      })
      // Auto-enable editing for draft invoices
      setIsEditing(invoice.status === "draft")
    }
  }, [invoice])

  // Return null if no invoice
  if (!invoice) return null

  const isDraft = invoice.status === "draft"
  const isViewOnly = !isDraft || !isEditing

  const selectedCustomer = customers.find((c) => c.id === formData.customerId)

  const getStatusBadge = () => {
    switch (invoice.status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-700">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-100 text-red-700">Overdue</Badge>
      case "draft":
        return (
          <Badge variant="outline" className="text-slate-600">
            Draft
          </Badge>
        )
      default:
        return null
    }
  }

  const handleSelectCustomer = (customerId: string) => {
    setFormData((prev) => ({ ...prev, customerId }))
    setCustomerSearchOpen(false)
  }

  const handleUpdate = () => {
    const customer = customers.find((c) => c.id === formData.customerId)
    if (!customer) return

    const updatedInvoice = {
      ...invoice,
      customer: {
        name: customer.name,
        email: customer.email,
      },
      dueDate: format(formData.dueDate, "dd/MM/yyyy"),
      paymentTerms: formData.paymentTerms,
      notes: formData.notes,
    }
    onUpdate(updatedInvoice)
    setIsEditing(false)
  }

  const handleSend = async () => {
    setIsSending(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const customer = customers.find((c) => c.id === formData.customerId)
      if (!customer) return

      const updatedInvoice = {
        ...invoice,
        customer: {
          name: customer.name,
          email: customer.email,
        },
        status: "pending" as const,
        dueDate: format(formData.dueDate, "dd/MM/yyyy"),
        paymentTerms: formData.paymentTerms,
        notes: formData.notes,
      }
      onSend(updatedInvoice)
      onClose()
    } finally {
      setIsSending(false)
    }
  }

  const handleCancel = () => {
    if (isDraft && invoice) {
      const matchingCustomer = customers.find((c) => c.name === invoice.customer.name)
      const parsedDueDate = parse(invoice.dueDate, "dd/MM/yyyy", new Date())
      setFormData({
        customerId: matchingCustomer?.id || "",
        dueDate: parsedDueDate,
        paymentTerms: invoice.paymentTerms || "14",
        notes: invoice.notes || "",
      })
      setIsEditing(false)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{isViewOnly ? "Invoice Details" : "Edit Invoice"}</DialogTitle>
            <div className="flex items-center gap-2">{getStatusBadge()}</div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Invoice Header */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Invoice Number</p>
                <p className="text-xl font-bold text-slate-800">{invoice.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Issue Date</p>
                <p className="text-lg font-semibold text-slate-800">{invoice.issueDate}</p>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Customer Information</h3>

            {isEditing ? (
              <div className="space-y-2">
                <Label htmlFor="customer">Select Customer *</Label>
                <Popover open={customerSearchOpen} onOpenChange={setCustomerSearchOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={customerSearchOpen}
                      className="w-full justify-between bg-white hover:bg-slate-50"
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
            ) : (
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Name</p>
                    <p className="font-medium text-slate-800">{invoice.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="font-medium text-slate-800">{invoice.customer.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Booking Details</h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Venue</p>
                  <p className="font-medium text-slate-800">{invoice.venue}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Number of Bookings</p>
                  <p className="font-medium text-slate-800">{invoice.bookings}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Payment Terms</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Terms</Label>
                {isViewOnly ? (
                  <div className="p-3 bg-slate-50 rounded-md border">
                    <p className="text-sm font-medium">{formData.paymentTerms} days</p>
                  </div>
                ) : (
                  <Select
                    value={formData.paymentTerms}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, paymentTerms: value }))
                      const days = Number.parseInt(value)
                      const issueDate = parse(invoice.issueDate, "dd/MM/yyyy", new Date())
                      const newDueDate = new Date(issueDate)
                      newDueDate.setDate(newDueDate.getDate() + days)
                      setFormData((prev) => ({ ...prev, dueDate: newDueDate }))
                    }}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="space-y-2">
                <Label>Due Date</Label>
                {isViewOnly ? (
                  <div className="p-3 bg-slate-50 rounded-md border">
                    <p className="text-sm font-medium">{invoice.dueDate}</p>
                  </div>
                ) : (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-white">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.dueDate}
                        onSelect={(date) => date && setFormData((prev) => ({ ...prev, dueDate: date }))}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes {!isViewOnly && "(optional)"}</Label>
              {isViewOnly ? (
                <div className="p-3 bg-slate-50 rounded-md border min-h-[80px]">
                  <p className="text-sm text-slate-600">{formData.notes || "No notes added"}</p>
                </div>
              ) : (
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  placeholder="Add any additional notes for the customer..."
                  className="bg-white"
                />
              )}
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Invoice Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium">£{invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">VAT (20%):</span>
                <span className="font-medium">£{invoice.vat.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-slate-800">Total:</span>
                <span className="text-2xl font-bold text-slate-800">£{invoice.amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {invoice.status === "paid" && invoice.paidDate && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                <span className="font-semibold">Paid on:</span> {invoice.paidDate}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            {isEditing ? "Cancel" : "Close"}
          </Button>

          {isDraft && (
            <>
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleUpdate}>
                    Save Changes
                  </Button>
                  <Button
                    onClick={handleSend}
                    disabled={isSending || !formData.customerId}
                    className="zeus-gradient text-white hover:opacity-90"
                  >
                    {isSending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Invoice
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="zeus-gradient text-white hover:opacity-90">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Invoice
                </Button>
              )}
            </>
          )}

          {invoice.status === "pending" && (
            <Button className="zeus-gradient text-white hover:opacity-90">
              <Send className="w-4 h-4 mr-2" />
              Resend Invoice
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
