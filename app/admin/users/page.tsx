"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Search, Plus, Edit, Trash2, Mail, Phone, Calendar, Menu, Settings } from "lucide-react"
import Link from "next/link"

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+44 7123 456789",
    role: "Customer",
    status: "Active",
    joinDate: "2024-01-15",
    totalBookings: 12,
    totalSpent: 540,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+44 7234 567890",
    role: "Customer",
    status: "Active",
    joinDate: "2024-02-20",
    totalBookings: 8,
    totalSpent: 360,
  },
  {
    id: 3,
    name: "Admin User",
    email: "admin@zeus.com",
    phone: "+44 7000 000000",
    role: "Admin",
    status: "Active",
    joinDate: "2023-12-01",
    totalBookings: 0,
    totalSpent: 0,
  },
  {
    id: 4,
    name: "David Williams",
    email: "david.w@example.com",
    phone: "+44 7345 678901",
    role: "Customer",
    status: "Inactive",
    joinDate: "2024-03-10",
    totalBookings: 3,
    totalSpent: 135,
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter
    const matchesStatus = statusFilter === "all" || user.status.toLowerCase() === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center space-x-3">
                <div className="w-10 h-10 zeus-gradient rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">Z</span>
                </div>
                <span className="text-2xl font-bold text-slate-800">Zeus Admin</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {/* Hamburger Menu */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-200 text-slate-600 hover:bg-slate-50"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Menu className="w-4 h-4" />
                </Button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-50">
                    <div className="py-1">
                      <Link
                        href="/admin/users"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 bg-slate-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Users className="w-4 h-4 mr-3" />
                        Users
                      </Link>
                      <Link
                        href="/admin/settings"
                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Button variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:bg-slate-50">
                <Link href="/">Back to Site</Link>
              </Button>
              <Button variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:bg-slate-50">
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
            <p className="text-slate-600 mt-2">Manage customer accounts and admin users</p>
          </div>
          <Button className="zeus-gradient text-white hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="zeus-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
              <Users className="h-4 w-4 text-primary-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{mockUsers.length}</div>
            </CardContent>
          </Card>

          <Card className="zeus-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Active Users</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {mockUsers.filter((u) => u.status === "Active").length}
              </div>
            </CardContent>
          </Card>

          <Card className="zeus-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Customers</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {mockUsers.filter((u) => u.role === "Customer").length}
              </div>
            </CardContent>
          </Card>

          <Card className="zeus-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Admins</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {mockUsers.filter((u) => u.role === "Admin").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="zeus-card mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
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
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="customer">Customers</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="zeus-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-slate-600">User</th>
                    <th className="text-left p-4 font-medium text-slate-600">Contact</th>
                    <th className="text-left p-4 font-medium text-slate-600">Role</th>
                    <th className="text-left p-4 font-medium text-slate-600">Status</th>
                    <th className="text-left p-4 font-medium text-slate-600">Join Date</th>
                    <th className="text-left p-4 font-medium text-slate-600">Bookings</th>
                    <th className="text-left p-4 font-medium text-slate-600">Total Spent</th>
                    <th className="text-left p-4 font-medium text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-slate-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-slate-800">{user.name}</p>
                          <p className="text-sm text-slate-500">ID: {user.id}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-slate-600">
                            <Mail className="w-3 h-3 mr-2" />
                            {user.email}
                          </div>
                          <div className="flex items-center text-sm text-slate-600">
                            <Phone className="w-3 h-3 mr-2" />
                            {user.phone}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "Admin" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-sm text-slate-600">
                          <Calendar className="w-3 h-3 mr-2" />
                          {new Date(user.joinDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-slate-800">{user.totalBookings}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-slate-800">£{user.totalSpent}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button size="sm" variant="outline" className="text-xs">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
