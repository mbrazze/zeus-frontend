"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { UserPlus, Building2, CheckCircle2 } from "lucide-react"

interface AddUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddUser: (userData: any) => void
  venues: string[]
}

export function AddUserModal({ open, onOpenChange, onAddUser, venues }: AddUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    assignedVenues: [] as string[],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Surname is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.role) newErrors.role = "Role is required"
    if (formData.assignedVenues.length === 0) newErrors.assignedVenues = "At least one venue must be assigned"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onAddUser(formData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      assignedVenues: [],
    })
    setErrors({})
    onOpenChange(false)
  }

  const handleVenueToggle = (venue: string) => {
    setFormData((prev) => {
      if (venue === "all") {
        return {
          ...prev,
          assignedVenues: prev.assignedVenues.includes("all") ? [] : ["all"],
        }
      }

      const newVenues = prev.assignedVenues.filter((v) => v !== "all")
      if (newVenues.includes(venue)) {
        return {
          ...prev,
          assignedVenues: newVenues.filter((v) => v !== venue),
        }
      } else {
        return {
          ...prev,
          assignedVenues: [...newVenues, venue],
        }
      }
    })
    setErrors((prev) => ({ ...prev, assignedVenues: "" }))
  }

  const allVenuesSelected = formData.assignedVenues.includes("all")

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "admin":
        return "Full system access, can manage all venues, users, and settings"
      case "manager":
        return "Can manage assigned venues, bookings, and view analytics"
      case "staff":
        return "Can manage bookings and customer interactions for assigned venues"
      default:
        return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New User
          </DialogTitle>
          <DialogDescription>Create a new user account and assign their role and venue access.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value })
                  setErrors({ ...errors, firstName: "" })
                }}
                placeholder="Enter first name"
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
            </div>

            {/* Surname */}
            <div className="space-y-2">
              <Label htmlFor="lastName">
                Surname <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => {
                  setFormData({ ...formData, lastName: e.target.value })
                  setErrors({ ...errors, lastName: "" })
                }}
                placeholder="Enter surname"
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value })
                  setErrors({ ...errors, email: "" })
                }}
                placeholder="user@zeus.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => {
                  setFormData({ ...formData, role: value })
                  setErrors({ ...errors, role: "" })
                }}
              >
                <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
              {formData.role && (
                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-md">{getRoleDescription(formData.role)}</p>
              )}
              {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
            </div>

            {/* Assigned Venues */}
            <div className="space-y-3">
              <Label>
                Assigned Venues <span className="text-red-500">*</span>
              </Label>

              {/* All Venues Option */}
              <div className="flex items-center space-x-2 p-3 border rounded-lg bg-slate-50">
                <Checkbox id="venue-all" checked={allVenuesSelected} onCheckedChange={() => handleVenueToggle("all")} />
                <label htmlFor="venue-all" className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary-600" />
                      <span className="font-medium">All Venues</span>
                    </div>
                    {allVenuesSelected && <Badge className="bg-primary-100 text-primary-800">Full Access</Badge>}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Grant access to all current and future venues</p>
                </label>
              </div>

              {/* Individual Venues */}
              <div className="space-y-2">
                {venues.map((venue) => (
                  <div key={venue} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Checkbox
                      id={`venue-${venue}`}
                      checked={formData.assignedVenues.includes(venue) || allVenuesSelected}
                      disabled={allVenuesSelected}
                      onCheckedChange={() => handleVenueToggle(venue)}
                    />
                    <label htmlFor={`venue-${venue}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className={allVenuesSelected ? "text-slate-400" : ""}>{venue}</span>
                        {(formData.assignedVenues.includes(venue) || allVenuesSelected) && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div>

              {errors.assignedVenues && <p className="text-sm text-red-500">{errors.assignedVenues}</p>}

              {/* Selection Summary */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <strong>Selected:</strong>{" "}
                  {allVenuesSelected
                    ? "All venues (full access)"
                    : formData.assignedVenues.length === 0
                      ? "No venues selected"
                      : `${formData.assignedVenues.length} venue${formData.assignedVenues.length > 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="zeus-gradient text-white">
              Add User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
