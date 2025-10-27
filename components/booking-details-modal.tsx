"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, User, Mail, Phone, PoundSterling, FileText, Tag, Users, Trophy } from "lucide-react"

interface BookingDetailsModalProps {
  booking: any
  isOpen: boolean
  onClose: () => void
  onStatusChange: (bookingId: string, newStatus: string) => void
  onEdit: (bookingId: string, updatedData: any) => void
}

export function BookingDetailsModal({ booking, isOpen, onClose, onStatusChange, onEdit }: BookingDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedBooking, setEditedBooking] = useState(booking)

  if (!booking) return null

  const handleSave = () => {
    onEdit(booking.id, editedBooking)
    setIsEditing(false)
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

  // Check if booking is in the past
  const bookingDate = new Date(booking.date)
  const bookingEndTime = booking.time.split(" - ")[1]
  const [endHour, endMinute] = bookingEndTime.split(":").map(Number)
  const bookingEndDateTime = new Date(bookingDate)
  bookingEndDateTime.setHours(endHour, endMinute)
  const isPastBooking = bookingEndDateTime < new Date()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Booking Details</span>
            <Badge className={getStatusColor(booking.status)}>{booking.status.replace("_", " ").toUpperCase()}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center">
              <User className="w-5 h-5 mr-2" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                {isEditing ? (
                  <Input
                    value={editedBooking.customer.name}
                    onChange={(e) =>
                      setEditedBooking({
                        ...editedBooking,
                        customer: { ...editedBooking.customer, name: e.target.value },
                      })
                    }
                  />
                ) : (
                  <p className="text-sm font-medium">{booking.customer.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  Email
                </Label>
                {isEditing ? (
                  <Input
                    value={editedBooking.customer.email}
                    onChange={(e) =>
                      setEditedBooking({
                        ...editedBooking,
                        customer: { ...editedBooking.customer, email: e.target.value },
                      })
                    }
                  />
                ) : (
                  <p className="text-sm">{booking.customer.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  Phone
                </Label>
                {isEditing ? (
                  <Input
                    value={editedBooking.customer.phone}
                    onChange={(e) =>
                      setEditedBooking({
                        ...editedBooking,
                        customer: { ...editedBooking.customer, phone: e.target.value },
                      })
                    }
                  />
                ) : (
                  <p className="text-sm">{booking.customer.phone}</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Booking Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Venue
                </Label>
                <p className="text-sm font-medium">{booking.venue}</p>
              </div>
              <div className="space-y-2">
                <Label>Space</Label>
                <p className="text-sm font-medium">{booking.space}</p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Date
                </Label>
                <p className="text-sm">{new Date(booking.date).toLocaleDateString()}</p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Time
                </Label>
                <p className="text-sm">{booking.time}</p>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center">
                  <PoundSterling className="w-4 h-4 mr-1" />
                  Amount
                </Label>
                <p className="text-sm font-medium">
                  £{booking.amount} ({booking.duration}h @ £{booking.hourlyRate}/h)
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Classification */}
          {booking.classification && (
            <>
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Classification
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Badge variant="outline">{booking.classification.category}</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>Subcategory</Label>
                    <Badge variant="outline">{booking.classification.subcategory}</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Age Group
                    </Label>
                    <Badge variant="secondary">{booking.classification.ageGroup}</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Trophy className="w-4 h-4 mr-1" />
                      Match Type
                    </Label>
                    <Badge variant="secondary">{booking.classification.matchType}</Badge>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Disability Category</Label>
                    <Badge variant="secondary">{booking.classification.disabilityCategory}</Badge>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Notes */}
          {booking.notes && (
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Notes
              </h3>
              {isEditing ? (
                <Textarea
                  value={editedBooking.notes}
                  onChange={(e) => setEditedBooking({ ...editedBooking, notes: e.target.value })}
                  rows={3}
                />
              ) : (
                <p className="text-sm text-gray-600">{booking.notes}</p>
              )}
            </div>
          )}

          {/* Actions */}
          {isPastBooking ? (
            <div className="bg-slate-100 p-4 rounded-lg text-center">
              <p className="text-sm text-slate-600">This booking has ended. No actions available for past bookings.</p>
            </div>
          ) : (
            <div className="flex justify-end space-x-2 pt-4">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                  {booking.status === "pending" && (
                    <>
                      <Button
                        onClick={() => {
                          onStatusChange(booking.id, "confirmed")
                          onClose()
                        }}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => {
                          onStatusChange(booking.id, "cancelled")
                          onClose()
                        }}
                        variant="destructive"
                      >
                        Decline
                      </Button>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
