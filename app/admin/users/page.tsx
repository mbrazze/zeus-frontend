"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Settings,
  Bell,
  User,
  CreditCard,
  LogOut,
  Search,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  UserPlus,
  Download,
  MoreHorizontal,
  Building2,
  Shield,
  UserCheck,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminSidebar } from "@/components/admin-sidebar"
import { RoleManagementModal } from "@/components/role-management-modal"

// Mock staff user data - focusing on admin and staff only
const mockStaffUsers = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@zeus.com",
    phone: "+44 20 1234 5678",
    role: "admin",
    status: "active",
    joinDate: "2024-01-01",
    lastLogin: "2025-01-20T15:00:00Z",
    assignedVenues: ["all"],
    permissions: ["full_access"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@zeus.com",
    phone: "+44 20 1234 5679",
    role: "venue_manager",
    status: "active",
    joinDate: "2024-02-15",
    lastLogin: "2025-01-20T14:30:00Z",
    assignedVenues: ["1", "2"], // Elite Conference Center, Premier Sports Complex
    permissions: ["venue_management", "booking_management"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Emma Wilson",
    email: "emma.wilson@zeus.com",
    phone: "+44 20 1234 5680",
    role: "venue_manager",
    status: "active",
    joinDate: "2024-03-10",
    lastLogin: "2025-01-20T13:15:00Z",
    assignedVenues: ["3", "4"], // Grand Ballroom, Tech Hub
    permissions: ["venue_management", "booking_management"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "James Rodriguez",
    email: "james.rodriguez@zeus.com",
    phone: "+44 20 1234 5681",
    role: "staff",
    status: "active",
    joinDate: "2024-04-20",
    lastLogin: "2025-01-19T16:45:00Z",
    assignedVenues: ["1"], // Elite Conference Center
    permissions: ["booking_management"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    email: "lisa.thompson@zeus.com",
    phone: "+44 20 1234 5682",
    role: "staff",
    status: "active",
    joinDate: "2024-05-15",
    lastLogin: "2025-01-19T11:20:00Z",
    assignedVenues: ["2", "3"], // Premier Sports Complex, Grand Ballroom
    permissions: ["booking_management"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    name: "David Park",
    email: "david.park@zeus.com",
    phone: "+44 20 1234 5683",
    role: "staff",
    status: "inactive",
    joinDate: "2024-06-01",
    lastLogin: "2024-12-20T09:30:00Z",
    assignedVenues: ["4"], // Tech Hub
    permissions: ["booking_management"],
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

// Mock venue data for display
const mockVenues = {
  "1": "Elite Conference Center",
  "2": "Premier Sports Complex",
  "3": "Grand Ballroom",
  "4": "Tech Hub",
  "5": "Creative Studio",
}

// Mock logged-in user data
const loggedInUser = {
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah.johnson@zeus.com",
  role: "admin",
}

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

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [users, setUsers] = useState<StaffUser[]>(mockStaffUsers)
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null)
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)

  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
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

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getAssignedVenuesText = (assignedVenues: string[]) => {
    if (assignedVenues.includes("all")) {
      return "All Venues"
    }
    return assignedVenues.map((venueId) => mockVenues[venueId as keyof typeof mockVenues]).join(", ")
  }

  const handleEditRole = (user: StaffUser) => {
    setSelectedUser(user)
    setIsRoleModalOpen(true)
  }

  const handleSaveUser = (updatedUser: StaffUser) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
  }

  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 shadow-sm">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-800">Staff Management</span>
                <span className="text-sm text-slate-600">Manage admin and staff user accounts</span>
              </div>
              <div className="flex items-center space-x-4">
                {/* Notification Bell */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></div>
                </Button>

                {/* Profile Circle with Initials */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                      <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                        {loggedInUser.firstName.charAt(0)}
                        {loggedInUser.lastName.charAt(0)}
                      </div>
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex items-center space-x-3 p-2">
                        <div className="h-12 w-12 rounded-full bg-primary-600 flex items-center justify-center text-white font-medium">
                          {loggedInUser.firstName.charAt(0)}
                          {loggedInUser.lastName.charAt(0)}
                        </div>
                        <div className="flex flex-col space-y-1">
                          <p className="text-base font-medium leading-none">
                            {loggedInUser.firstName} {loggedInUser.lastName}
                          </p>
                          <p className="text-sm leading-none text-muted-foreground">{loggedInUser.email}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <User className="mr-3 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Settings className="mr-3 h-4 w-4" />
                      <span>Security</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <CreditCard className="mr-3 h-4 w-4" />
                      <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600">
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Staff Users</h1>
              <p className="text-slate-600 mt-2">Manage admin and staff accounts with venue assignments</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="zeus-gradient text-white hover:opacity-90">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Staff User
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="zeus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Staff</CardTitle>
                <Users className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{users.length}</div>
                <p className="text-xs text-slate-500 mt-1">Admin and staff users</p>
              </CardContent>
            </Card>

            <Card className="zeus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Active Staff</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {users.filter((user) => user.status === "active").length}
                </div>
                <p className="text-xs text-green-600 mt-1">83% active rate</p>
              </CardContent>
            </Card>

            <Card className="zeus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Venue Managers</CardTitle>
                <Building2 className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {users.filter((user) => user.role === "venue_manager").length}
                </div>
                <p className="text-xs text-slate-500 mt-1">Managing venues</p>
              </CardContent>
            </Card>

            <Card className="zeus-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Administrators</CardTitle>
                <Shield className="h-4 w-4 text-slate-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {users.filter((user) => user.role === "admin").length}
                </div>
                <p className="text-xs text-slate-500 mt-1">Full access</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search staff by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="venue_manager">Venue Manager</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Staff Table */}
          <Card className="zeus-card">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Member</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Venues</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback className="bg-primary-100 text-primary-700">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-800">{user.name}</p>
                            <p className="text-sm text-slate-500">
                              Joined {new Date(user.joinDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-slate-600">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                          <div className="flex items-center text-sm text-slate-600">
                            <Phone className="w-3 h-3 mr-1" />
                            {user.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role === "venue_manager" ? "MANAGER" : user.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>{user.status.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <p className="text-sm text-slate-800 font-medium truncate">
                            {getAssignedVenuesText(user.assignedVenues)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {user.assignedVenues.includes("all")
                              ? "Full access"
                              : `${user.assignedVenues.length} venue${user.assignedVenues.length > 1 ? "s" : ""}`}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-slate-600">{formatLastLogin(user.lastLogin)}</p>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditRole(user)}>
                              <Shield className="mr-2 h-4 w-4" />
                              Manage Role & Permissions
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Building2 className="mr-2 h-4 w-4" />
                              Manage Venues
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "active" ? (
                              <DropdownMenuItem className="text-red-600" onClick={() => handleToggleStatus(user.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Deactivate User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-green-600" onClick={() => handleToggleStatus(user.id)}>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Activate User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No staff users found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setRoleFilter("all")
                  setStatusFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Role Management Modal */}
      <RoleManagementModal
        user={selectedUser}
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false)
          setSelectedUser(null)
        }}
        onSave={handleSaveUser}
      />
    </div>
  )
}
