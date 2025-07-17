"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  Shield,
  Building2,
  Calendar,
  PoundSterling,
  BarChart3,
  Users,
  AlertTriangle,
  Save,
  X,
  User,
  Crown,
  UserCheck,
} from "lucide-react"

interface StaffUser {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: string
  joinDate: string
  lastLogin: string
  assignedVenues: string[]
  permissions: string[]
  avatar: string
}

interface RoleManagementModalProps {
  user: StaffUser | null
  isOpen: boolean
  onClose: () => void
  onSave: (user: StaffUser) => void
}

// Mock venue data
const mockVenues = {
  "1": "Elite Conference Center",
  "2": "Premier Sports Complex",
  "3": "Grand Ballroom",
  "4": "Tech Hub",
  "5": "Creative Studio",
}

// Permission definitions
const permissionCategories = [
  {
    id: "system_admin",
    name: "System Administration",
    icon: Shield,
    color: "text-red-600",
    permissions: [
      { id: "full_access", name: "Full System Access", description: "Complete administrative control", critical: true },
      { id: "user_management", name: "User Management", description: "Create, edit, and delete user accounts" },
      { id: "system_settings", name: "System Settings", description: "Modify system configuration and preferences" },
      {
        id: "security_management",
        name: "Security Management",
        description: "Manage security settings and access controls",
      },
    ],
  },
  {
    id: "venue_management",
    name: "Venue Management",
    icon: Building2,
    color: "text-emerald-600",
    permissions: [
      { id: "venue_create", name: "Create Venues", description: "Add new venues to the system" },
      { id: "venue_edit", name: "Edit Venues", description: "Modify venue details and settings" },
      { id: "venue_delete", name: "Delete Venues", description: "Remove venues from the system" },
      { id: "venue_pricing", name: "Venue Pricing", description: "Set and modify venue pricing" },
    ],
  },
  {
    id: "booking_management",
    name: "Booking Management",
    icon: Calendar,
    color: "text-blue-600",
    permissions: [
      { id: "booking_create", name: "Create Bookings", description: "Make new venue reservations" },
      { id: "booking_edit", name: "Edit Bookings", description: "Modify existing bookings" },
      { id: "booking_cancel", name: "Cancel Bookings", description: "Cancel and refund bookings" },
      { id: "booking_approve", name: "Approve Bookings", description: "Approve pending booking requests" },
    ],
  },
  {
    id: "financial_management",
    name: "Financial Management",
    icon: PoundSterling,
    color: "text-amber-600",
    permissions: [
      { id: "invoice_create", name: "Create Invoices", description: "Generate invoices for bookings" },
      { id: "invoice_edit", name: "Edit Invoices", description: "Modify invoice details" },
      { id: "payment_process", name: "Process Payments", description: "Handle payment transactions" },
      { id: "refund_process", name: "Process Refunds", description: "Issue refunds to customers" },
    ],
  },
  {
    id: "analytics_reporting",
    name: "Analytics & Reporting",
    icon: BarChart3,
    color: "text-purple-600",
    permissions: [
      { id: "analytics_view", name: "View Analytics", description: "Access business analytics and insights" },
      { id: "reports_generate", name: "Generate Reports", description: "Create and export business reports" },
      { id: "data_export", name: "Export Data", description: "Export system data in various formats" },
      { id: "dashboard_access", name: "Dashboard Access", description: "Access administrative dashboards" },
    ],
  },
  {
    id: "customer_management",
    name: "Customer Management",
    icon: Users,
    color: "text-indigo-600",
    permissions: [
      { id: "customer_view", name: "View Customers", description: "Access customer information" },
      { id: "customer_edit", name: "Edit Customers", description: "Modify customer details" },
      { id: "customer_communication", name: "Customer Communication", description: "Send messages to customers" },
      { id: "customer_support", name: "Customer Support", description: "Provide customer support services" },
    ],
  },
]

// Role templates
const roleTemplates = {
  admin: {
    name: "Administrator",
    description: "Full system access with all permissions",
    permissions: ["full_access"],
    venues: ["all"],
    icon: Crown,
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  venue_manager: {
    name: "Venue Manager",
    description: "Manage specific venues and their bookings",
    permissions: [
      "venue_edit",
      "venue_pricing",
      "booking_create",
      "booking_edit",
      "booking_cancel",
      "booking_approve",
      "invoice_create",
      "analytics_view",
      "customer_view",
      "customer_communication",
    ],
    venues: [],
    icon: Building2,
    color: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  staff: {
    name: "Staff",
    description: "Basic booking management for assigned venues",
    permissions: ["booking_create", "booking_edit", "customer_view", "customer_communication"],
    venues: [],
    icon: UserCheck,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
}

export function RoleManagementModal({ user, isOpen, onClose, onSave }: RoleManagementModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [selectedVenues, setSelectedVenues] = useState<string[]>([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    if (user && isOpen) {
      setSelectedRole(user.role)
      setSelectedPermissions([...user.permissions])
      setSelectedVenues([...user.assignedVenues])
      setHasUnsavedChanges(false)
    }
  }, [user, isOpen])

  const handleRoleChange = (role: string) => {
    setSelectedRole(role)
    if (role !== "custom") {
      const template = roleTemplates[role as keyof typeof roleTemplates]
      setSelectedPermissions([...template.permissions])
      setSelectedVenues([...template.venues])
    }
    setHasUnsavedChanges(true)
  }

  const handlePermissionToggle = (permissionId: string) => {
    const newPermissions = selectedPermissions.includes(permissionId)
      ? selectedPermissions.filter((p) => p !== permissionId)
      : [...selectedPermissions, permissionId]

    setSelectedPermissions(newPermissions)
    setHasUnsavedChanges(true)
  }

  const handleVenueToggle = (venueId: string) => {
    if (venueId === "all") {
      setSelectedVenues(selectedVenues.includes("all") ? [] : ["all"])
    } else {
      const newVenues = selectedVenues.includes(venueId)
        ? selectedVenues.filter((v) => v !== venueId && v !== "all")
        : [...selectedVenues.filter((v) => v !== "all"), venueId]
      setSelectedVenues(newVenues)
    }
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    if (!user) return

    const updatedUser: StaffUser = {
      ...user,
      role: selectedRole,
      permissions: selectedPermissions,
      assignedVenues: selectedVenues,
    }

    onSave(updatedUser)
    setHasUnsavedChanges(false)
    onClose()
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "venue_manager":
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
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const hasCriticalPermissions = selectedPermissions.some((p) =>
    permissionCategories.some((cat) => cat.permissions.some((perm) => perm.id === p && perm.critical)),
  )

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-primary-600" />
            <span>Role & Permissions Management</span>
          </DialogTitle>
          <DialogDescription>Configure user role, permissions, and venue assignments for {user.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information Card */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="bg-primary-100 text-primary-700 text-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800">{user.name}</h3>
                  <p className="text-sm text-slate-600">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge className={getRoleColor(user.role)}>
                      {user.role === "venue_manager" ? "MANAGER" : user.role.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusColor(user.status)}>{user.status.toUpperCase()}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Role Assignment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(roleTemplates).map(([key, template]) => {
                  const Icon = template.icon
                  return (
                    <div
                      key={key}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedRole === key
                          ? "border-primary-500 bg-primary-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                      onClick={() => handleRoleChange(key)}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <Icon className="w-5 h-5 text-slate-600" />
                        <span className="font-medium text-slate-800">{template.name}</span>
                      </div>
                      <p className="text-sm text-slate-600">{template.description}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Venue Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="w-4 h-4" />
                <span>Venue Assignment</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all-venues"
                  checked={selectedVenues.includes("all")}
                  onCheckedChange={() => handleVenueToggle("all")}
                />
                <Label htmlFor="all-venues" className="font-medium">
                  All Venues (Full Access)
                </Label>
              </div>

              {!selectedVenues.includes("all") && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(mockVenues).map(([id, name]) => (
                      <div key={id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`venue-${id}`}
                          checked={selectedVenues.includes(id)}
                          onCheckedChange={() => handleVenueToggle(id)}
                        />
                        <Label htmlFor={`venue-${id}`} className="text-sm">
                          {name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Permissions</span>
                <Badge variant="outline" className="ml-2">
                  {selectedPermissions.length} selected
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {hasCriticalPermissions && (
                <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm text-amber-800">
                    This user has critical system permissions. Please review carefully.
                  </span>
                </div>
              )}

              {permissionCategories.map((category) => {
                const Icon = category.icon
                const categoryPermissions = category.permissions.filter((p) => selectedPermissions.includes(p.id))

                return (
                  <div key={category.id} className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-4 h-4 ${category.color}`} />
                      <span className="font-medium text-slate-800">{category.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {categoryPermissions.length}/{category.permissions.length}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                      {category.permissions.map((permission) => (
                        <div key={permission.id} className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={permission.id}
                              checked={selectedPermissions.includes(permission.id)}
                              onCheckedChange={() => handlePermissionToggle(permission.id)}
                            />
                            <Label htmlFor={permission.id} className="text-sm font-medium">
                              {permission.name}
                              {permission.critical && <AlertTriangle className="w-3 h-3 text-red-500 inline ml-1" />}
                            </Label>
                          </div>
                          <p className="text-xs text-slate-500 ml-6">{permission.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-1 text-amber-600">
                <AlertTriangle className="w-3 h-3" />
                <span className="text-xs">Unsaved changes</span>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
