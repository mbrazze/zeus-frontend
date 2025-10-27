"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Building2, Calendar, PoundSterling, BarChart3, Users, AlertTriangle, CheckCircle } from "lucide-react"

interface RoleManagementModalProps {
  user: any
  isOpen: boolean
  onClose: () => void
  onSave: (userId: string, updatedData: any) => void
  venues: string[]
}

const roleTemplates = {
  admin: {
    name: "Administrator",
    description: "Full system access with all permissions",
    permissions: {
      systemAdmin: true,
      venueManagement: true,
      bookingManagement: true,
      financialManagement: true,
      analytics: true,
      customerManagement: true,
    },
    assignedVenues: ["all"],
  },
  manager: {
    name: "Venue Manager",
    description: "Manage assigned venues and bookings",
    permissions: {
      systemAdmin: false,
      venueManagement: true,
      bookingManagement: true,
      financialManagement: true,
      analytics: true,
      customerManagement: true,
    },
    assignedVenues: [],
  },
  staff: {
    name: "Staff Member",
    description: "Basic booking and customer management",
    permissions: {
      systemAdmin: false,
      venueManagement: false,
      bookingManagement: true,
      financialManagement: false,
      analytics: false,
      customerManagement: true,
    },
    assignedVenues: [],
  },
}

const permissionCategories = [
  {
    id: "systemAdmin",
    name: "System Administration",
    description: "Full system access, user management, system settings",
    icon: Shield,
    critical: true,
  },
  {
    id: "venueManagement",
    name: "Venue Management",
    description: "Create, edit, and manage venue spaces and settings",
    icon: Building2,
    critical: false,
  },
  {
    id: "bookingManagement",
    name: "Booking Management",
    description: "View, create, edit, and manage all bookings",
    icon: Calendar,
    critical: false,
  },
  {
    id: "financialManagement",
    name: "Financial Management",
    description: "Access to invoicing, payments, and financial reports",
    icon: PoundSterling,
    critical: false,
  },
  {
    id: "analytics",
    name: "Analytics & Reporting",
    description: "View analytics, generate reports, and export data",
    icon: BarChart3,
    critical: false,
  },
  {
    id: "customerManagement",
    name: "Customer Management",
    description: "View and manage customer accounts and information",
    icon: Users,
    critical: false,
  },
]

export function RoleManagementModal({ user, isOpen, onClose, onSave, venues }: RoleManagementModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [customRole, setCustomRole] = useState(false)
  const [permissions, setPermissions] = useState<Record<string, boolean>>({})
  const [assignedVenues, setAssignedVenues] = useState<string[]>([])
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (user && isOpen) {
      setSelectedRole(user.role)
      setPermissions(user.permissions || {})
      setAssignedVenues(user.assignedVenues || [])
      setCustomRole(false)
      setHasChanges(false)
    }
  }, [user, isOpen])

  const handleRoleChange = (role: string) => {
    if (role === "custom") {
      setCustomRole(true)
      setSelectedRole("custom")
    } else {
      setCustomRole(false)
      setSelectedRole(role)
      const template = roleTemplates[role as keyof typeof roleTemplates]
      if (template) {
        setPermissions(template.permissions)
        setAssignedVenues(template.assignedVenues)
      }
    }
    setHasChanges(true)
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [permissionId]: checked,
    }))
    setHasChanges(true)
  }

  const handleVenueChange = (venue: string, checked: boolean) => {
    if (venue === "all") {
      setAssignedVenues(checked ? ["all"] : [])
    } else {
      setAssignedVenues((prev) => {
        const filtered = prev.filter((v) => v !== "all")
        if (checked) {
          return [...filtered, venue]
        } else {
          return filtered.filter((v) => v !== venue)
        }
      })
    }
    setHasChanges(true)
  }

  const handleSave = () => {
    if (!user) return

    const updatedData = {
      role: customRole ? "custom" : selectedRole,
      permissions,
      assignedVenues,
    }

    onSave(user.id, updatedData)
    onClose()
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "manager":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "staff":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "custom":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPermissionCount = () => {
    return Object.values(permissions).filter(Boolean).length
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Role & Permissions Management</span>
          </DialogTitle>
          <DialogDescription>
            Manage user roles, permissions, and venue access for {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info & Role Selection */}
          <div className="space-y-6">
            {/* User Profile Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-700 font-medium">
                      {user.firstName.charAt(0)}
                      {user.lastName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Current Role:</span>
                  <Badge className={`${getRoleColor(user.role)} border`}>
                    {user.role === "manager" ? "MANAGER" : user.role.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Status:</span>
                  <Badge
                    className={`${user.status === "active" ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"} border`}
                  >
                    {user.status.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Role Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Role Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="role-select">Select Role Template</Label>
                  <Select value={selectedRole} onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a role..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="manager">Venue Manager</SelectItem>
                      <SelectItem value="staff">Staff Member</SelectItem>
                      <SelectItem value="custom">Custom Role</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedRole && selectedRole !== "custom" && (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="font-medium text-sm text-slate-800">
                      {roleTemplates[selectedRole as keyof typeof roleTemplates]?.name}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {roleTemplates[selectedRole as keyof typeof roleTemplates]?.description}
                    </p>
                  </div>
                )}

                {customRole && (
                  <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <p className="font-medium text-sm text-orange-800">Custom Role</p>
                    </div>
                    <p className="text-xs text-orange-700 mt-1">Configure custom permissions below</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Permission Summary */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Permission Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Active Permissions:</span>
                  <Badge variant="outline">
                    {getPermissionCount()} of {permissionCategories.length}
                  </Badge>
                </div>
                {hasChanges && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-blue-600" />
                      <p className="text-xs text-blue-800">Unsaved changes</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Permissions */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {permissionCategories.map((category) => {
                  const Icon = category.icon
                  const isChecked = permissions[category.id] || false

                  return (
                    <div key={category.id} className="space-y-2">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={category.id}
                          checked={isChecked}
                          onCheckedChange={(checked) => handlePermissionChange(category.id, checked as boolean)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4 text-slate-600" />
                            <Label htmlFor={category.id} className="text-sm font-medium cursor-pointer">
                              {category.name}
                            </Label>
                            {category.critical && (
                              <Badge variant="destructive" className="text-xs">
                                Critical
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{category.description}</p>
                          {category.critical && isChecked && (
                            <div className="flex items-center space-x-1 mt-1">
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              <p className="text-xs text-amber-700">This permission grants sensitive system access</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {category.id !== permissionCategories[permissionCategories.length - 1].id && (
                        <Separator className="my-3" />
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Venue Access */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Venue Access</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="all-venues"
                      checked={assignedVenues.includes("all")}
                      onCheckedChange={(checked) => handleVenueChange("all", checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor="all-venues" className="text-sm font-medium cursor-pointer">
                        All Venues
                      </Label>
                      <p className="text-xs text-slate-600">Grant access to all current and future venues</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Individual Venues</Label>
                    {venues.map((venue) => (
                      <div key={venue} className="flex items-start space-x-3">
                        <Checkbox
                          id={venue}
                          checked={assignedVenues.includes(venue) && !assignedVenues.includes("all")}
                          onCheckedChange={(checked) => handleVenueChange(venue, checked as boolean)}
                          disabled={assignedVenues.includes("all")}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={venue}
                            className={`text-sm cursor-pointer ${
                              assignedVenues.includes("all") ? "text-slate-400" : ""
                            }`}
                          >
                            {venue}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preview Changes */}
            {hasChanges && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-blue-800 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Preview Changes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">New Role:</span>
                    <Badge className={`${getRoleColor(customRole ? "custom" : selectedRole)} border`}>
                      {customRole ? "CUSTOM" : selectedRole === "manager" ? "MANAGER" : selectedRole.toUpperCase()}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Permissions:</span>
                    <span className="text-sm font-medium text-blue-800">{getPermissionCount()} active</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Venue Access:</span>
                    <span className="text-sm font-medium text-blue-800">
                      {assignedVenues.includes("all") ? "All Venues" : `${assignedVenues.length} venues`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {permissions.systemAdmin && (
              <div className="flex items-center space-x-1 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs">Critical permissions enabled</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges} className="zeus-gradient text-white hover:opacity-90">
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
