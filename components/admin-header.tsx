"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Bell,
  LogOut,
  User,
  SettingsIcon,
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
  PoundSterling,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface Notification {
  id: string
  type: "booking" | "payment" | "system" | "alert" | "user" | "success" | "warning"
  title: string
  message: string
  time: string
  read: boolean
  actionUrl?: string
}

interface AdminHeaderProps {
  title: string
  subtitle?: string
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "booking",
      title: "New Booking Request",
      message: "Sarah Johnson requested Arena A for March 15th at 14:00-16:00",
      time: "2 min ago",
      read: false,
      actionUrl: "/admin",
    },
    {
      id: "2",
      type: "payment",
      title: "Payment Received",
      message: "£250.00 paid for Invoice #INV-2024-0128 by John Smith",
      time: "15 min ago",
      read: false,
      actionUrl: "/admin/invoices",
    },
    {
      id: "3",
      type: "alert",
      title: "Booking Cancellation",
      message: "Michael Brown cancelled booking for Training Room B on March 10th",
      time: "1 hour ago",
      read: false,
      actionUrl: "/admin",
    },
    {
      id: "4",
      type: "warning",
      title: "Low Availability Alert",
      message: "Arena A has only 2 slots remaining for next week. Consider adjusting pricing.",
      time: "2 hours ago",
      read: false,
      actionUrl: "/admin/venues",
    },
    {
      id: "5",
      type: "booking",
      title: "Block Booking Created",
      message: "Emma Wilson created a block booking for 8 sessions at Stadium Field",
      time: "3 hours ago",
      read: false,
      actionUrl: "/admin",
    },
    {
      id: "6",
      type: "user",
      title: "New User Registration",
      message: "David Martinez (david.m@email.com) registered as a new customer",
      time: "4 hours ago",
      read: true,
      actionUrl: "/admin/users",
    },
    {
      id: "7",
      type: "payment",
      title: "Invoice Overdue",
      message: "Invoice #INV-2024-0115 is 3 days overdue. Customer: Lisa Anderson",
      time: "5 hours ago",
      read: true,
      actionUrl: "/admin/invoices",
    },
    {
      id: "8",
      type: "success",
      title: "Booking Confirmed",
      message: "Booking #BK-2024-0245 has been confirmed and payment processed",
      time: "6 hours ago",
      read: true,
      actionUrl: "/admin",
    },
    {
      id: "9",
      type: "alert",
      title: "Equipment Maintenance Due",
      message: "Arena A equipment maintenance is scheduled for tomorrow 09:00",
      time: "1 day ago",
      read: true,
      actionUrl: "/admin/venues",
    },
    {
      id: "10",
      type: "booking",
      title: "Same-Day Booking Request",
      message: "Robert Taylor requested urgent booking for today at 18:00",
      time: "1 day ago",
      read: true,
      actionUrl: "/admin",
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const handleSignOut = () => {
    // Clear any stored session data (if needed in the future)
    // For now, just redirect to the login page
    router.push("/")
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-4 w-4" />
      case "payment":
        return <PoundSterling className="h-4 w-4" />
      case "alert":
        return <XCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "user":
        return <UserPlus className="h-4 w-4" />
      case "system":
        return <SettingsIcon className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "booking":
        return "bg-blue-500"
      case "payment":
        return "bg-green-500"
      case "alert":
        return "bg-red-500"
      case "warning":
        return "bg-orange-500"
      case "success":
        return "bg-emerald-500"
      case "user":
        return "bg-purple-500"
      case "system":
        return "bg-slate-500"
    }
  }

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-slate-800">{title}</span>
            {subtitle && <span className="text-sm text-slate-600">{subtitle}</span>}
          </div>
          <div className="flex items-center space-x-4">
            {/* Notifications Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">{unreadCount}</span>
                    </div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0 z-50" align="end" sideOffset={8}>
                <div className="flex items-center justify-between border-b p-4 bg-slate-50">
                  <div>
                    <h3 className="font-semibold text-slate-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <p className="text-xs text-slate-600 mt-0.5">{unreadCount} unread notifications</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs hover:bg-slate-200"
                        onClick={markAllAsRead}
                      >
                        Mark all read
                      </Button>
                    )}
                    {notifications.length > 0 && (
                      <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-slate-200" onClick={clearAll}>
                        Clear all
                      </Button>
                    )}
                  </div>
                </div>

                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-slate-100 p-4 mb-3">
                      <Bell className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-900">No notifications</p>
                    <p className="text-xs text-slate-500 mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="divide-y divide-slate-100">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={cn(
                            "p-4 transition-colors hover:bg-slate-50 cursor-pointer",
                            !notification.read && "bg-blue-50/50 hover:bg-blue-50",
                          )}
                          onClick={() => {
                            markAsRead(notification.id)
                            if (notification.actionUrl) {
                              router.push(notification.actionUrl)
                            }
                          }}
                        >
                          <div className="flex gap-3">
                            <div
                              className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white",
                                getNotificationColor(notification.type),
                              )}
                            >
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 space-y-1.5 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-semibold leading-none text-slate-900">
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <div className="h-2 w-2 rounded-full bg-blue-600 shrink-0 mt-0.5" />
                                )}
                              </div>
                              <p className="text-sm text-slate-600 line-clamp-2">{notification.message}</p>
                              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <Clock className="h-3 w-3" />
                                <span>{notification.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </PopoverContent>
            </Popover>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback className="bg-blue-500 text-white">SJ</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center space-x-3 p-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback className="bg-blue-500 text-white">SJ</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-base font-medium leading-none">Sarah Johnson</p>
                      <p className="text-sm leading-none text-muted-foreground">sarah.johnson@zeus.com</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/admin/profile")}>
                  <User className="mr-3 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/admin/security")}>
                  <SettingsIcon className="mr-3 h-4 w-4" />
                  <span>Security</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/admin/billing")}>
                  <CreditCard className="mr-3 h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={handleSignOut}>
                  <LogOut className="mr-3 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
