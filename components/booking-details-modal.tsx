"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  PoundSterling,
  MessageSquare,
  CheckCircle,
  XCircle,
  Edit,
  Building,
  MapPin,
} from "lucide-react"

interface BookingDetailsModalProps {
  booking: any | null
  isOpen: boolean
  onClose: () => void
  onStatusChange: (bookingId: string, newStatus: string) => void
  onEdit: (bookingId: string, updatedData: any) => void
}

export function BookingDetailsModal({ booking, isOpen, onClose, onStatusChange, onEdit }: BookingDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("details")
  const [editedBooking, setEditedBooking] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  // Initialize edit form when booking changes
  useState(() => {
    if (booking) {
      setEditedBooking({ ...booking })
    }
  })

  if (!booking) return null

  const handleApprove = () => {
    onStatusChange(booking.id, "confirmed")
  }

  const handleDecline = () => {
    onStatusChange(booking.id, "declined")
  }

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      onEdit(booking.id, editedBooking)
      setIsEditing(false)
    } else {
      // Start editing
      setEditedBooking({ ...booking })
      setIsEditing(true)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setEditedBooking((prev: any) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCustomerInputChange = (field: string, value: string) => {
    setEditedBooking((prev: any) => ({
      ...prev,
      customer: {
        ...prev.customer,
        [field]: value,
      },
    }))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              Booking Details
              {booking.status === "pending" && (
                <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">Pending Approval</Badge>
              )}
              {booking.status === "confirmed" && (
                <Badge className="ml-2 bg-green-100 text-green-800 border-green-200">Confirmed</Badge>
              )}
              {booking.status === "pending_payment" && (
                <Badge className="ml-2 bg-amber-100 text-amber-800 border-amber-200">Awaiting Payment</Badge>
              )}
              {booking.status === "cancelled" && (
                <Badge className="ml-2 bg-red-100 text-red-800 border-red-200">Cancelled</Badge>
              )}
              {booking.status === "paid" && (
                <Badge className="ml-2 bg-emerald-100 text-emerald-800 border-emerald-200">Paid/Complete</Badge>
              )}
            </span>
            <div className="flex items-center space-x-2">
              {booking.status === "pending" && (
                <>
                  <Button size="sm" variant="outline" className="text-green-600" onClick={handleApprove}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600" onClick={handleDecline}>
                    <XCircle className="w-4 h-4 mr-1" />
                    Decline
                  </Button>
                </>
              )}
              <Button size="sm" variant="outline" onClick={handleEditToggle}>
                <Edit className="w-4 h-4 mr-1" />
                {isEditing ? "Save Changes" : "Edit"}
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Booking Details</TabsTrigger>
            <TabsTrigger value="customer">Customer Information</TabsTrigger>
          </TabsList>

          {/* Booking Details Tab */}
          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Venue</Label>
                {isEditing ? (
                  <Input value={editedBooking.venue} onChange={(e) => handleInputChange("venue", e.target.value)} />
                ) : (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span>{booking.venue}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Space</Label>
                {isEditing ? (
                  <Input value={editedBooking.space} onChange={(e) => handleInputChange("space", e.target.value)} />
                ) : (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{booking.space}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editedBooking.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{formatDate(booking.date)}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Time</Label>
                {isEditing ? (
                  <Input value={editedBooking.time} onChange={(e) => handleInputChange("time", e.target.value)} />
                ) : (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{booking.time}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    value={editedBooking.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                    <PoundSterling className="w-4 h-4 text-gray-500" />
                    <span>£{booking.amount}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                  {booking.status === "pending" ? (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">Pending Approval</Badge>
                  ) : booking.status === "confirmed" ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">Confirmed</Badge>
                  ) : booking.status === "pending_payment" ? (
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200">Awaiting Payment</Badge>
                  ) : booking.status === "cancelled" ? (
                    <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>
                  ) : booking.status === "paid" ? (
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Paid/Complete</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800 border-gray-200">{booking.status}</Badge>
                  )}
                </div>
              </div>
            </div>

            {booking.invoiceNumber && (
              <div className="space-y-2">
                <Label>Invoice Information</Label>
                <div className="p-2 bg-gray-50 rounded-md space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">Invoice #:</span> {booking.invoiceNumber}
                  </p>
                  {booking.invoiceSentAt && (
                    <p className="text-sm">
                      <span className="font-medium">Sent:</span> {formatDateTime(booking.invoiceSentAt)}
                    </p>
                  )}
                  {booking.paidAt && (
                    <p className="text-sm">
                      <span className="font-medium">Paid:</span> {formatDateTime(booking.paidAt)}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Special Requirements / Notes</Label>
              {isEditing ? (
                <Textarea
                  value={editedBooking.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={4}
                />
              ) : (
                <div className="flex items-start space-x-2 p-2 bg-gray-50 rounded-md min-h-[80px]">
                  <MessageSquare className="w-4 h-4 text-gray-500 mt-0.5" />
                  <span>{booking.notes}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <p>Booking ID: {booking.id}</p>
                <p>Created: {formatDateTime(booking.createdAt)}</p>
              </div>
              <div>{booking.confirmedAt && <p>Confirmed: {formatDateTime(booking.confirmedAt)}</p>}</div>
            </div>
          </TabsContent>

          {/* Customer Information Tab */}
          <TabsContent value="customer" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                {isEditing ? (
                  <Input
                    value={editedBooking.customer.name}
                    onChange={(e) => handleCustomerInputChange("name", e.target.value)}
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>{booking.customer.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={editedBooking.customer.email}
                    onChange={(e) => handleCustomerInputChange("email", e.target.value)}
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{booking.customer.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Phone Number</Label>
              {isEditing ? (
                <Input
                  value={editedBooking.customer.phone}
                  onChange={(e) => handleCustomerInputChange("phone", e.target.value)}
                />
              ) : (
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{booking.customer.phone}</span>
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button variant="outline" size="sm" className="w-full">
                View Customer History
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
