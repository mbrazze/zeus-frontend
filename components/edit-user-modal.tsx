"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Edit, Building2, CheckCircle2, AlertTriangle } from "lucide-react"

interface EditUserModalProps {
  user: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaveUser: (userId: string, userData: any) => void
  venues: string[]
}

export function EditUserModal({ user, open, onOpenChange, onSaveUser, venues }: EditUserModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    assignedVenues: [] as string[],
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (user && open) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "",
        assignedVenues: user.assignedVenues || [],
      })
      setHasChanges(false)
      setErrors({})
    }
  }, [user, open])

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

    onSaveUser(user.id, formData)
    handleClose()
  }

  const handleClose = () => {
    if (hasChanges) {
      const confirmed = window.confirm("You have unsaved changes. Are you sure you want to close?")
      if (!confirmed) return
    }
    onOpenChange(false)
  }

  const handleVenueToggle = (venue: string) => {
    setHasChanges(true)
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

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "manager":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "staff":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

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

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit User
          </DialogTitle>
          <DialogDescription>Update user information, role, and venue access permissions.</DialogDescription>
        </DialogHeader>

        {/* Current User Info Banner */}
        <div className="bg-slate-50 p-4 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-slate-700">Current User Information</p>
            <div className="flex gap-2">
              <Badge className={`${getStatusColor(user.status)} border`}>{user.status.toUpperCase()}</Badge>
              <Badge className={`${getRoleColor(user.role)} border`}>{user.role.toUpperCase()}</Badge>
            </div>
          </div>
          <p className="text-sm text-slate-600">
            Joined {new Date(user.createdAt).toLocaleDateString()} • Last login{" "}
            {new Date(user.lastLogin).toLocaleDateString()}
          </p>
        </div>

        {hasChanges && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>You have unsaved changes</AlertDescription>
          </Alert>
        )}

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
                  setHasChanges(true)
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
                  setHasChanges(true)
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
                  setHasChanges(true)
                  setErrors({ ...errors, email: "" })
                }}
                placeholder="user@zeus.com"
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value })
                  setHasChanges(true)
                }}
                placeholder="+44 7XXX XXXXXX"
              />
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
                  setHasChanges(true)
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
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
