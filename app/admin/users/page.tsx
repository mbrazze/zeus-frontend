"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Users, UserPlus, Search, MoreHorizontal, Edit, UserX, Calendar, PoundSterling, Trash2 } from "lucide-react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AddUserModal } from "@/components/add-user-modal"
import { EditUserModal } from "@/components/edit-user-modal"
import { DeleteUserConfirmModal } from "@/components/delete-user-confirm-modal"
import { useToast } from "@/hooks/use-toast"

// Mock staff user data
const mockStaffUsers = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@zeus.com",
    role: "admin",
    status: "active",
    assignedVenues: ["all"],
    lastLogin: "2025-01-17T10:30:00Z",
    createdAt: "2024-01-15T09:00:00Z",
    disabledAt: null,
    activatedAt: "2024-01-15T09:00:00Z",
    deletedAt: null,
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@zeus.com",
    role: "manager",
    status: "active",
    assignedVenues: ["Premier Sports Complex", "Elite Conference Center"],
    lastLogin: "2025-01-17T08:45:00Z",
    createdAt: "2024-03-20T14:30:00Z",
    disabledAt: null,
    activatedAt: "2024-03-20T14:30:00Z",
    deletedAt: null,
  },
  {
    id: "3",
    firstName: "Emma",
    lastName: "Williams",
    email: "emma.williams@zeus.com",
    role: "manager",
    status: "active",
    assignedVenues: ["Community Sports Hub"],
    lastLogin: "2025-01-16T16:20:00Z",
    createdAt: "2024-05-10T11:15:00Z",
    disabledAt: null,
    activatedAt: "2024-05-10T11:15:00Z",
    deletedAt: null,
  },
  {
    id: "4",
    firstName: "James",
    lastName: "Rodriguez",
    email: "james.rodriguez@zeus.com",
    role: "staff",
    status: "inactive",
    assignedVenues: ["Premier Sports Complex"],
    lastLogin: "2025-01-17T07:30:00Z",
    createdAt: "2024-08-05T13:45:00Z",
    disabledAt: "2025-01-10T09:15:00Z",
    activatedAt: null,
    deletedAt: null,
  },
  {
    id: "5",
    firstName: "Lisa",
    lastName: "Thompson",
    email: "lisa.thompson@zeus.com",
    role: "staff",
    status: "inactive",
    assignedVenues: ["Elite Conference Center"],
    lastLogin: "2025-01-10T12:15:00Z",
    createdAt: "2024-11-12T10:20:00Z",
    disabledAt: "2024-10-15T10:20:00Z",
    activatedAt: null,
    deletedAt: null,
  },
]

// Mock action logs - in a real app, this would be in a database
const mockActionLogs = [
  {
    id: "1",
    action: "user_created",
    userId: "1",
    userName: "Sarah Johnson",
    userRole: "admin",
    performedBy: "System",
    timestamp: "2024-01-15T09:00:00Z",
    details: "User account created",
  },
  {
    id: "2",
    action: "booking_approved",
    userId: "2",
    userName: "Michael Chen",
    userRole: "manager",
    performedBy: "Michael Chen",
    timestamp: "2025-01-15T14:30:00Z",
    details: "Approved booking #12345",
  },
]

const venues = ["Premier Sports Complex", "Elite Conference Center", "Community Sports Hub"]

export default function UsersPage() {
  const [users, setUsers] = useState(mockStaffUsers)
  const [actionLogs, setActionLogs] = useState(mockActionLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const { toast } = useToast()

  // Filter users based on search and filters - exclude deleted users
  const filteredUsers = users
    .filter((user) => !user.deletedAt)
    .filter((user) => {
      const matchesSearch =
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole = roleFilter === "all" || user.role === roleFilter
      const matchesStatus = statusFilter === "all" || user.status === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })

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

  const formatVenues = (assignedVenues: string[]) => {
    if (assignedVenues.includes("all")) {
      return "All Venues"
    }
    return assignedVenues.join(", ")
  }

  const formatStatusDate = (date: string) => {
    const d = new Date(date)
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusTooltip = (user: any) => {
    if (user.status === "inactive" && user.disabledAt) {
      return `Disabled on ${formatStatusDate(user.disabledAt)}`
    } else if (user.status === "active" && user.activatedAt) {
      return `Activated on ${formatStatusDate(user.activatedAt)}`
    }
    return "Status date unavailable"
  }

  // Check if user has been disabled for 90+ days
  const canDeleteUser = (user: any) => {
    if (!user.disabledAt || user.status === "active") return false

    const disabledDate = new Date(user.disabledAt)
    const now = new Date()
    const daysDifference = Math.floor((now.getTime() - disabledDate.getTime()) / (1000 * 60 * 60 * 24))

    return daysDifference >= 90
  }

  // Get days since disabled
  const getDaysSinceDisabled = (user: any) => {
    if (!user.disabledAt) return 0

    const disabledDate = new Date(user.disabledAt)
    const now = new Date()
    return Math.floor((now.getTime() - disabledDate.getTime()) / (1000 * 60 * 60 * 24))
  }

  const handleAddUser = (userData: any) => {
    const newUser = {
      id: (users.length + 1).toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
      status: "active",
      assignedVenues: userData.assignedVenues,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      disabledAt: null,
      activatedAt: new Date().toISOString(),
      deletedAt: null,
    }

    setUsers([...users, newUser])

    // Add to action log
    const logEntry = {
      id: (actionLogs.length + 1).toString(),
      action: "user_created",
      userId: newUser.id,
      userName: `${userData.firstName} ${userData.lastName}`,
      userRole: userData.role,
      performedBy: "Sarah Johnson", // Current admin
      timestamp: new Date().toISOString(),
      details: "User account created",
    }
    setActionLogs([...actionLogs, logEntry])

    toast({
      title: "User added successfully",
      description: `${userData.firstName} ${userData.lastName} has been added to the system.`,
    })
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleSaveUser = (userId: string, updatedData: any) => {
    const user = users.find((u) => u.id === userId)
    setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, ...updatedData } : user)))

    // Add to action log
    const logEntry = {
      id: (actionLogs.length + 1).toString(),
      action: "user_updated",
      userId: userId,
      userName: `${updatedData.firstName} ${updatedData.lastName}`,
      userRole: updatedData.role,
      performedBy: "Sarah Johnson", // Current admin
      timestamp: new Date().toISOString(),
      details: "User information updated",
    }
    setActionLogs([...actionLogs, logEntry])

    toast({
      title: "User updated successfully",
      description: `${updatedData.firstName} ${updatedData.lastName}'s information has been updated.`,
    })
  }

  const handleDisableUser = (user: any) => {
    const newStatus = user.status === "active" ? "inactive" : "active"
    const now = new Date().toISOString()
    const disabledAt = newStatus === "inactive" ? now : null
    const activatedAt = newStatus === "active" ? now : null

    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === user.id ? { ...u, status: newStatus, disabledAt: disabledAt, activatedAt: activatedAt } : u,
      ),
    )

    // Add to action log
    const logEntry = {
      id: (actionLogs.length + 1).toString(),
      action: newStatus === "active" ? "user_enabled" : "user_disabled",
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userRole: user.role,
      performedBy: "Sarah Johnson", // Current admin
      timestamp: new Date().toISOString(),
      details: `User account ${newStatus === "active" ? "enabled" : "disabled"}`,
    }
    setActionLogs([...actionLogs, logEntry])

    toast({
      title: `User ${newStatus === "active" ? "enabled" : "disabled"}`,
      description: `${user.firstName} ${user.lastName} has been ${newStatus === "active" ? "enabled" : "disabled"}.`,
      variant: newStatus === "active" ? "default" : "destructive",
    })
  }

  const handleDeleteUser = (user: any) => {
    setSelectedUser(user)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteUser = () => {
    if (!selectedUser) return

    // Mark user as deleted
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.id === selectedUser.id ? { ...u, deletedAt: new Date().toISOString() } : u)),
    )

    // Add to action log - keeping user info for reporting
    const logEntry = {
      id: (actionLogs.length + 1).toString(),
      action: "user_deleted",
      userId: selectedUser.id,
      userName: `${selectedUser.firstName} ${selectedUser.lastName}`,
      userRole: selectedUser.role,
      performedBy: "Sarah Johnson", // Current admin
      timestamp: new Date().toISOString(),
      details: `User account permanently deleted after ${getDaysSinceDisabled(selectedUser)} days of being disabled`,
    }
    setActionLogs([...actionLogs, logEntry])

    toast({
      title: "User deleted",
      description: `${selectedUser.firstName} ${selectedUser.lastName} has been permanently deleted. Their information is retained in system logs.`,
      variant: "destructive",
    })

    setIsDeleteModalOpen(false)
    setSelectedUser(null)
  }

  const activeUsers = users.filter((user) => user.status === "active" && !user.deletedAt).length
  const totalRevenue = 4720 // Mock data
  const avgBookings = 7 // Mock data

  return (
    <TooltipProvider>
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 shadow-sm">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
                  <p className="text-slate-600 mt-1">Manage customer accounts and permissions</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button onClick={() => setIsAddModalOpen(true)} className="zeus-gradient text-white hover:opacity-90">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="zeus-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{users.filter((u) => !u.deletedAt).length}</div>
                  <p className="text-xs text-slate-500 mt-1">+2 from last month</p>
                </CardContent>
              </Card>

              <Card className="zeus-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{activeUsers}</div>
                  <p className="text-xs text-green-600 mt-1">85% active rate</p>
                </CardContent>
              </Card>

              <Card className="zeus-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Revenue</CardTitle>
                  <PoundSterling className="h-4 w-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">£{totalRevenue}</div>
                  <p className="text-xs text-slate-500 mt-1">From all users</p>
                </CardContent>
              </Card>

              <Card className="zeus-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">Avg. Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-slate-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900">{avgBookings}</div>
                  <p className="text-xs text-slate-500 mt-1">Per user</p>
                </CardContent>
              </Card>
            </div>

            {/* Users Section */}
            <Card className="zeus-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-slate-800">Users</CardTitle>
                  <p className="text-sm text-slate-600">Manage customer accounts and user permissions</p>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="All Roles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
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
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Users Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assigned Venues</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => {
                        const isDeletable = canDeleteUser(user)
                        const daysSinceDisabled = getDaysSinceDisabled(user)

                        return (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                                  <span className="text-primary-700 font-medium text-sm">
                                    {user.firstName.charAt(0)}
                                    {user.lastName.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium text-slate-800">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  <p className="text-sm text-slate-500">
                                    Joined {new Date(user.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm text-slate-800">{user.email}</p>
                            </TableCell>
                            <TableCell>
                              <Badge className={`${getRoleColor(user.role)} border`}>
                                {user.role === "manager" ? "MANAGER" : user.role.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge className={`${getStatusColor(user.status)} border cursor-help`}>
                                      {user.status.toUpperCase()}
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{getStatusTooltip(user)}</p>
                                  </TooltipContent>
                                </Tooltip>
                                {user.status === "inactive" && daysSinceDisabled > 0 && (
                                  <span className="text-xs text-slate-500">
                                    Disabled {daysSinceDisabled} days ago
                                    {isDeletable && <span className="text-red-600 font-medium"> (Deletable)</span>}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="max-w-[200px]">
                                <p className="text-sm text-slate-800 truncate">{formatVenues(user.assignedVenues)}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm text-slate-800">{new Date(user.lastLogin).toLocaleDateString()}</p>
                              <p className="text-xs text-slate-500">{new Date(user.lastLogin).toLocaleTimeString()}</p>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit User
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDisableUser(user)}
                                    className={user.status === "active" ? "text-red-600" : "text-green-600"}
                                  >
                                    <UserX className="w-4 h-4 mr-2" />
                                    {user.status === "active" ? "Disable User" : "Enable User"}
                                  </DropdownMenuItem>
                                  {isDeletable && (
                                    <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-red-600">
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete User
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No users found</h3>
                    <p className="text-slate-600 mb-4">Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add User Modal */}
        <AddUserModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onAddUser={handleAddUser}
          venues={venues}
        />

        {/* Edit User Modal */}
        <EditUserModal
          user={selectedUser}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSaveUser={handleSaveUser}
          venues={venues}
        />

        {/* Delete User Confirmation Modal */}
        <DeleteUserConfirmModal
          user={selectedUser}
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          onConfirmDelete={confirmDeleteUser}
          daysSinceDisabled={selectedUser ? getDaysSinceDisabled(selectedUser) : 0}
        />
      </div>
    </TooltipProvider>
  )
}
