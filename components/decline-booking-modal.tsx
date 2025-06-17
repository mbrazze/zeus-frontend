"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { XCircle } from "lucide-react"

interface DeclineBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  booking: any
}

export function DeclineBookingModal({ isOpen, onClose, onConfirm, booking }: DeclineBookingModalProps) {
  const [reason, setReason] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(reason)
    setReason("")
    onClose()
  }

  if (!booking) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-red-600">
            <XCircle className="w-5 h-5" />
            <span>Decline Booking</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-800">
              You are about to decline the booking for <strong>{booking.customer.name}</strong> at{" "}
              <strong>{booking.venue}</strong> on <strong>{new Date(booking.date).toLocaleDateString()}</strong> at{" "}
              <strong>{booking.time}</strong>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Decline *</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                placeholder="Please provide a reason for declining this booking. This message will be sent to the customer."
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
                Decline Booking
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
