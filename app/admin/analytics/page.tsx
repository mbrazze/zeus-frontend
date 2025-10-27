"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  DollarSign,
  Building2,
  Activity,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock analytics data for current period
const currentPeriod = {
  totalBookings: 348,
  totalRevenue: 69600,
  avgBookingValue: 200,
  activeCustomers: 156,
  bookingsByCategory: [
    { name: "Recreational", count: 145, revenue: 21750, percentage: 42 },
    { name: "Match", count: 98, revenue: 19600, percentage: 28 },
    { name: "Club Training", count: 67, revenue: 13400, percentage: 19 },
    { name: "Tournament", count: 23, revenue: 6900, percentage: 7 },
    { name: "Other", count: 15, revenue: 2250, percentage: 4 },
  ],
  bookingsByAgeGroup: [
    { name: "U11", count: 89, revenue: 13350 },
    { name: "U16", count: 76, revenue: 15200 },
    { name: "U23", count: 54, revenue: 10800 },
    { name: "Open", count: 112, revenue: 22400 },
    { name: "Vets", count: 17, revenue: 2550 },
  ],
  venuePerformance: [
    {
      name: "Powerleague Manchester",
      bookings: 156,
      revenue: 31200,
      utilization: 87,
      avgBooking: 200,
    },
    {
      name: "Goals Birmingham",
      bookings: 134,
      revenue: 26800,
      utilization: 79,
      avgBooking: 200,
    },
    {
      name: "Powerleague Leeds",
      bookings: 98,
      revenue: 19600,
      utilization: 68,
      avgBooking: 200,
    },
  ],
  monthlyData: [
    { month: "Aug", bookings: 98, revenue: 19600 },
    { month: "Sep", bookings: 112, revenue: 22400 },
    { month: "Oct", bookings: 134, revenue: 26800 },
    { month: "Nov", bookings: 145, revenue: 29000 },
    { month: "Dec", bookings: 156, revenue: 31200 },
    { month: "Jan", bookings: 167, revenue: 33400 },
  ],
  topCustomers: [
    { name: "John Smith", bookings: 24, revenue: 4800, avgBooking: 200 },
    { name: "Sarah Johnson", bookings: 18, revenue: 3600, avgBooking: 200 },
    { name: "Mike Williams", bookings: 15, revenue: 3000, avgBooking: 200 },
    { name: "Emily Brown", bookings: 12, revenue: 2400, avgBooking: 200 },
    { name: "David Lee", bookings: 10, revenue: 2000, avgBooking: 200 },
  ],
  peakHours: [
    { time: "18:00-19:00", bookings: 67, percentage: 89 },
    { time: "19:00-20:00", bookings: 64, percentage: 85 },
    { time: "20:00-21:00", bookings: 58, percentage: 77 },
    { time: "17:00-18:00", bookings: 45, percentage: 60 },
    { time: "16:00-17:00", bookings: 34, percentage: 45 },
  ],
}

// Mock analytics data for previous period
const previousPeriod = {
  totalBookings: 309,
  totalRevenue: 60300,
  avgBookingValue: 195,
  activeCustomers: 144,
  bookingsByCategory: [
    { name: "Recreational", count: 132, revenue: 19800, percentage: 43 },
    { name: "Match", count: 85, revenue: 16575, percentage: 27 },
    { name: "Club Training", count: 58, revenue: 11310, percentage: 19 },
    { name: "Tournament", count: 20, revenue: 6000, percentage: 6 },
    { name: "Other", count: 14, revenue: 2100, percentage: 5 },
  ],
  bookingsByAgeGroup: [
    { name: "U11", count: 78, revenue: 11700 },
    { name: "U16", count: 71, revenue: 13845 },
    { name: "U23", count: 49, revenue: 9555 },
    { name: "Open", count: 98, revenue: 19110 },
    { name: "Vets", count: 13, revenue: 2535 },
  ],
  venuePerformance: [
    {
      name: "Powerleague Manchester",
      bookings: 140,
      revenue: 27300,
      utilization: 82,
      avgBooking: 195,
    },
    {
      name: "Goals Birmingham",
      bookings: 118,
      revenue: 23010,
      utilization: 73,
      avgBooking: 195,
    },
    {
      name: "Powerleague Leeds",
      bookings: 91,
      revenue: 17745,
      utilization: 63,
      avgBooking: 195,
    },
  ],
  monthlyData: [
    { month: "Feb", bookings: 87, revenue: 16965 },
    { month: "Mar", bookings: 95, revenue: 18525 },
    { month: "Apr", bookings: 108, revenue: 21060 },
    { month: "May", bookings: 124, revenue: 24180 },
    { month: "Jun", bookings: 138, revenue: 26910 },
    { month: "Jul", bookings: 148, revenue: 28860 },
  ],
  topCustomers: [
    { name: "John Smith", bookings: 20, revenue: 3900, avgBooking: 195 },
    { name: "Sarah Johnson", bookings: 16, revenue: 3120, avgBooking: 195 },
    { name: "Mike Williams", bookings: 13, revenue: 2535, avgBooking: 195 },
    { name: "Emily Brown", bookings: 11, revenue: 2145, avgBooking: 195 },
    { name: "David Lee", bookings: 9, revenue: 1755, avgBooking: 195 },
  ],
  peakHours: [
    { time: "18:00-19:00", bookings: 58, percentage: 84 },
    { time: "19:00-20:00", bookings: 56, percentage: 81 },
    { time: "20:00-21:00", bookings: 51, percentage: 74 },
    { time: "17:00-18:00", bookings: 39, percentage: 56 },
    { time: "16:00-17:00", bookings: 29, percentage: 42 },
  ],
}

// Helper function to calculate percentage change
function calculateChange(current: number, previous: number): number {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

// Helper function to get trend component
function TrendIndicator({ change, value }: { change: number; value?: string }) {
  const isPositive = change > 0
  const isNeutral = change === 0

  if (isNeutral) {
    return (
      <div className="flex items-center text-sm">
        <Minus className="w-4 h-4 text-slate-400 mr-1" />
        <span className="text-slate-600 font-medium">0%</span>
        <span className="text-slate-600 ml-1">vs previous</span>
      </div>
    )
  }

  return (
    <div className="flex items-center text-sm">
      {isPositive ? (
        <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
      ) : (
        <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
      )}
      <span className={cn("font-medium", isPositive ? "text-green-600" : "text-red-600")}>
        {Math.abs(change).toFixed(1)}%
      </span>
      <span className="text-slate-600 ml-1">vs previous</span>
      {value && <span className="text-slate-500 ml-1">({value})</span>}
    </div>
  )
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30")
  const [showComparison, setShowComparison] = useState(true)

  // Calculate changes
  const bookingGrowth = calculateChange(currentPeriod.totalBookings, previousPeriod.totalBookings)
  const revenueGrowth = calculateChange(currentPeriod.totalRevenue, previousPeriod.totalRevenue)
  const avgBookingChange = calculateChange(currentPeriod.avgBookingValue, previousPeriod.avgBookingValue)
  const customerGrowth = calculateChange(currentPeriod.activeCustomers, previousPeriod.activeCustomers)

  const exportData = () => {
    console.log("Exporting analytics data with comparison...")
    // In a real app, this would generate a CSV or Excel file with both periods
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics</h1>
              <p className="text-slate-600">Performance metrics and insights</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-start sm:items-center">
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
                <Switch id="comparison-mode" checked={showComparison} onCheckedChange={setShowComparison} />
                <Label htmlFor="comparison-mode" className="text-sm font-medium cursor-pointer">
                  Show Comparison
                </Label>
              </div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={exportData} className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Bookings</CardDescription>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl">{currentPeriod.totalBookings}</CardTitle>
                  <Calendar className="w-8 h-8 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <TrendIndicator
                  change={bookingGrowth}
                  value={showComparison ? `${previousPeriod.totalBookings}` : undefined}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Revenue</CardDescription>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl">£{currentPeriod.totalRevenue.toLocaleString()}</CardTitle>
                  <DollarSign className="w-8 h-8 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <TrendIndicator
                  change={revenueGrowth}
                  value={showComparison ? `£${previousPeriod.totalRevenue.toLocaleString()}` : undefined}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Avg Booking Value</CardDescription>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl">£{currentPeriod.avgBookingValue}</CardTitle>
                  <Activity className="w-8 h-8 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <TrendIndicator
                  change={avgBookingChange}
                  value={showComparison ? `£${previousPeriod.avgBookingValue}` : undefined}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Active Customers</CardDescription>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl">{currentPeriod.activeCustomers}</CardTitle>
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
              </CardHeader>
              <CardContent>
                <TrendIndicator
                  change={customerGrowth}
                  value={showComparison ? `${previousPeriod.activeCustomers}` : undefined}
                />
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Different Analytics Views */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="venues">Venues</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Monthly Trend with Comparison */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Monthly Trend</CardTitle>
                      <CardDescription>Bookings and revenue over time</CardDescription>
                    </div>
                    {showComparison && (
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-primary-500 rounded" />
                          <span>Current Period</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-slate-300 rounded" />
                          <span>Previous Period</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-end justify-between gap-2">
                    {currentPeriod.monthlyData.map((item, index) => {
                      const maxRevenue = Math.max(
                        ...currentPeriod.monthlyData.map((m) => m.revenue),
                        ...previousPeriod.monthlyData.map((m) => m.revenue),
                      )
                      const currentHeight = (item.revenue / maxRevenue) * 100
                      const previousItem = previousPeriod.monthlyData[index]
                      const previousHeight = previousItem ? (previousItem.revenue / maxRevenue) * 100 : 0
                      const change = previousItem ? calculateChange(item.revenue, previousItem.revenue) : 0

                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div className="w-full flex gap-1 items-end" style={{ height: "280px" }}>
                            {showComparison && (
                              <div
                                className="flex-1 bg-slate-200 rounded-t-lg hover:bg-slate-300 transition-colors cursor-pointer relative group"
                                style={{ height: `${previousHeight}%` }}
                              >
                                <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 bg-slate-700 text-white px-3 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                  Previous Period
                                  <br />
                                  {previousItem.bookings} bookings
                                  <br />£{previousItem.revenue.toLocaleString()}
                                </div>
                              </div>
                            )}
                            <div
                              className="flex-1 bg-primary-500 rounded-t-lg hover:bg-primary-600 transition-colors cursor-pointer relative group"
                              style={{ height: `${currentHeight}%` }}
                            >
                              <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-3 py-2 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                Current Period
                                <br />
                                {item.bookings} bookings
                                <br />£{item.revenue.toLocaleString()}
                                {showComparison && (
                                  <>
                                    <br />
                                    <span className={change >= 0 ? "text-green-400" : "text-red-400"}>
                                      {change >= 0 ? "+" : ""}
                                      {change.toFixed(1)}%
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-slate-600">{item.month}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Peak Hours with Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Peak Hours</CardTitle>
                    <CardDescription>Most popular booking times</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentPeriod.peakHours.map((hour, index) => {
                      const prevHour = previousPeriod.peakHours[index]
                      const change = calculateChange(hour.bookings, prevHour.bookings)

                      return (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">{hour.time}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-600">{hour.bookings} bookings</span>
                              {showComparison && change !== 0 && (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    change > 0
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-red-50 text-red-700 border-red-200",
                                  )}
                                >
                                  {change > 0 ? "+" : ""}
                                  {change.toFixed(0)}%
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="relative">
                            {showComparison && (
                              <div className="absolute inset-0 w-full bg-slate-100 rounded-full h-2" />
                            )}
                            <div className="relative w-full bg-slate-100 rounded-full h-2">
                              {showComparison && (
                                <div
                                  className="absolute bg-slate-300 h-2 rounded-full transition-all"
                                  style={{ width: `${prevHour.percentage}%` }}
                                />
                              )}
                              <div
                                className="bg-primary-500 h-2 rounded-full transition-all"
                                style={{ width: `${hour.percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                {/* Top Customers with Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Customers</CardTitle>
                    <CardDescription>Highest revenue customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentPeriod.topCustomers.map((customer, index) => {
                        const prevCustomer = previousPeriod.topCustomers[index]
                        const revenueChange = calculateChange(customer.revenue, prevCustomer.revenue)
                        const bookingChange = calculateChange(customer.bookings, prevCustomer.bookings)

                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <p className="font-medium text-slate-900">{customer.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm text-slate-600">{customer.bookings} bookings</p>
                                {showComparison && bookingChange !== 0 && (
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-xs h-5",
                                      bookingChange > 0
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-red-50 text-red-700 border-red-200",
                                    )}
                                  >
                                    {bookingChange > 0 ? "+" : ""}
                                    {bookingChange.toFixed(0)}%
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-slate-900">£{customer.revenue.toLocaleString()}</p>
                              {showComparison && (
                                <div className="flex items-center justify-end gap-1 mt-1">
                                  <p className="text-xs text-slate-500">£{prevCustomer.revenue.toLocaleString()}</p>
                                  {revenueChange !== 0 &&
                                    (revenueChange > 0 ? (
                                      <ArrowUpRight className="w-3 h-3 text-green-600" />
                                    ) : (
                                      <ArrowDownRight className="w-3 h-3 text-red-600" />
                                    ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bookings by Category with Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Bookings by Category</CardTitle>
                    <CardDescription>Distribution of booking types</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentPeriod.bookingsByCategory.map((category, index) => {
                        const prevCategory = previousPeriod.bookingsByCategory.find((c) => c.name === category.name)
                        const countChange = prevCategory ? calculateChange(category.count, prevCategory.count) : 0
                        const revenueChange = prevCategory ? calculateChange(category.revenue, prevCategory.revenue) : 0

                        return (
                          <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-slate-700">{category.name}</span>
                              <div className="text-right flex items-center gap-2">
                                <div>
                                  <span className="text-sm font-medium text-slate-900">{category.count}</span>
                                  <span className="text-sm text-slate-600 ml-2">({category.percentage}%)</span>
                                </div>
                                {showComparison && countChange !== 0 && (
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-xs",
                                      countChange > 0
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-red-50 text-red-700 border-red-200",
                                    )}
                                  >
                                    {countChange > 0 ? "+" : ""}
                                    {countChange.toFixed(0)}%
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all"
                                style={{
                                  width: `${category.percentage}%`,
                                  backgroundColor: `hsl(${220 - index * 20}, 70%, 50%)`,
                                }}
                              />
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-xs text-slate-600">Revenue: £{category.revenue.toLocaleString()}</p>
                              {showComparison && prevCategory && revenueChange !== 0 && (
                                <p
                                  className={cn(
                                    "text-xs font-medium",
                                    revenueChange > 0 ? "text-green-600" : "text-red-600",
                                  )}
                                >
                                  {revenueChange > 0 ? "+" : ""}
                                  {revenueChange.toFixed(1)}%
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Bookings by Age Group with Comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Bookings by Age Group</CardTitle>
                    <CardDescription>Distribution by age categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {currentPeriod.bookingsByAgeGroup.map((group, index) => {
                        const prevGroup = previousPeriod.bookingsByAgeGroup.find((g) => g.name === group.name)
                        const countChange = prevGroup ? calculateChange(group.count, prevGroup.count) : 0
                        const revenueChange = prevGroup ? calculateChange(group.revenue, prevGroup.revenue) : 0

                        return (
                          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-slate-900">{group.name}</p>
                                {showComparison && countChange !== 0 && (
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-xs",
                                      countChange > 0
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-red-50 text-red-700 border-red-200",
                                    )}
                                  >
                                    {countChange > 0 ? "+" : ""}
                                    {countChange.toFixed(0)}%
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 mt-1">
                                {group.count} bookings
                                {showComparison && prevGroup && (
                                  <span className="text-xs text-slate-500 ml-1">({prevGroup.count})</span>
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-slate-900">£{group.revenue.toLocaleString()}</p>
                              <div className="flex items-center justify-end gap-1 mt-1">
                                <p className="text-sm text-slate-600">£{Math.round(group.revenue / group.count)} avg</p>
                                {showComparison &&
                                  prevGroup &&
                                  revenueChange !== 0 &&
                                  (revenueChange > 0 ? (
                                    <ArrowUpRight className="w-3 h-3 text-green-600" />
                                  ) : (
                                    <ArrowDownRight className="w-3 h-3 text-red-600" />
                                  ))}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Venues Tab */}
            <TabsContent value="venues" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Venue Performance</CardTitle>
                  <CardDescription>Booking and revenue metrics by venue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {currentPeriod.venuePerformance.map((venue, index) => {
                      const prevVenue = previousPeriod.venuePerformance.find((v) => v.name === venue.name)
                      const bookingChange = prevVenue ? calculateChange(venue.bookings, prevVenue.bookings) : 0
                      const revenueChange = prevVenue ? calculateChange(venue.revenue, prevVenue.revenue) : 0
                      const utilizationChange = prevVenue ? venue.utilization - prevVenue.utilization : 0

                      return (
                        <div key={index} className="p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <Building2 className="w-5 h-5 text-slate-400" />
                              <div>
                                <p className="font-medium text-slate-900">{venue.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-sm text-slate-600">{venue.bookings} bookings</p>
                                  {showComparison && bookingChange !== 0 && (
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "text-xs",
                                        bookingChange > 0
                                          ? "bg-green-50 text-green-700 border-green-200"
                                          : "bg-red-50 text-red-700 border-red-200",
                                      )}
                                    >
                                      {bookingChange > 0 ? "+" : ""}
                                      {bookingChange.toFixed(0)}%
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            {bookingChange > 0 ? (
                              <Badge className="bg-green-100 text-green-800">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Growing
                              </Badge>
                            ) : bookingChange < 0 ? (
                              <Badge className="bg-orange-100 text-orange-800">
                                <TrendingDown className="w-3 h-3 mr-1" />
                                Declining
                              </Badge>
                            ) : (
                              <Badge className="bg-slate-100 text-slate-800">
                                <Minus className="w-3 h-3 mr-1" />
                                Stable
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                              <p className="text-xs text-slate-600 mb-1">Revenue</p>
                              <p className="font-medium text-slate-900">£{venue.revenue.toLocaleString()}</p>
                              {showComparison && prevVenue && revenueChange !== 0 && (
                                <p
                                  className={cn("text-xs mt-1", revenueChange > 0 ? "text-green-600" : "text-red-600")}
                                >
                                  {revenueChange > 0 ? "+" : ""}
                                  {revenueChange.toFixed(1)}%
                                </p>
                              )}
                            </div>
                            <div>
                              <p className="text-xs text-slate-600 mb-1">Utilization</p>
                              <p className="font-medium text-slate-900">{venue.utilization}%</p>
                              {showComparison && prevVenue && utilizationChange !== 0 && (
                                <p
                                  className={cn(
                                    "text-xs mt-1",
                                    utilizationChange > 0 ? "text-green-600" : "text-red-600",
                                  )}
                                >
                                  {utilizationChange > 0 ? "+" : ""}
                                  {utilizationChange.toFixed(1)}pp
                                </p>
                              )}
                            </div>
                            <div>
                              <p className="text-xs text-slate-600 mb-1">Avg Booking</p>
                              <p className="font-medium text-slate-900">£{venue.avgBooking}</p>
                              {showComparison && prevVenue && (
                                <p className="text-xs text-slate-600 mt-1">(£{prevVenue.avgBooking})</p>
                              )}
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="w-full bg-slate-200 rounded-full h-2 relative">
                              {showComparison && prevVenue && (
                                <div
                                  className="absolute top-0 h-2 bg-slate-300 rounded-full"
                                  style={{ width: `${prevVenue.utilization}%` }}
                                />
                              )}
                              <div
                                className={cn(
                                  "h-2 rounded-full transition-all relative",
                                  venue.utilization >= 80
                                    ? "bg-green-500"
                                    : venue.utilization >= 60
                                      ? "bg-yellow-500"
                                      : "bg-red-500",
                                )}
                                style={{ width: `${venue.utilization}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Customers Tab */}
            <TabsContent value="customers" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Total Customers</CardDescription>
                    <CardTitle className="text-2xl">234</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600">
                      {currentPeriod.activeCustomers} active this period
                      {showComparison && <span className="text-slate-500"> (vs {previousPeriod.activeCustomers})</span>}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>New Customers</CardDescription>
                    <CardTitle className="text-2xl">28</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TrendIndicator change={15.2} value={showComparison ? "24" : undefined} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardDescription>Returning Rate</CardDescription>
                    <CardTitle className="text-2xl">67%</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {showComparison ? (
                      <TrendIndicator change={3.1} value="65%" />
                    ) : (
                      <p className="text-sm text-slate-600">Strong retention</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Top Customers</CardTitle>
                  <CardDescription>Customers sorted by total revenue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-slate-200">
                        <tr>
                          <th className="text-left p-3 text-sm font-medium text-slate-700">Rank</th>
                          <th className="text-left p-3 text-sm font-medium text-slate-700">Customer</th>
                          <th className="text-left p-3 text-sm font-medium text-slate-700">Bookings</th>
                          <th className="text-left p-3 text-sm font-medium text-slate-700">Revenue</th>
                          <th className="text-left p-3 text-sm font-medium text-slate-700">Avg Booking</th>
                          {showComparison && (
                            <th className="text-left p-3 text-sm font-medium text-slate-700">Change</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {currentPeriod.topCustomers.map((customer, index) => {
                          const prevCustomer = previousPeriod.topCustomers[index]
                          const revenueChange = calculateChange(customer.revenue, prevCustomer.revenue)

                          return (
                            <tr key={index} className="border-b border-slate-100">
                              <td className="p-3">
                                <Badge variant={index === 0 ? "default" : "outline"}>#{index + 1}</Badge>
                              </td>
                              <td className="p-3 font-medium text-slate-900">{customer.name}</td>
                              <td className="p-3 text-slate-700">
                                {customer.bookings}
                                {showComparison && (
                                  <span className="text-xs text-slate-500 ml-1">({prevCustomer.bookings})</span>
                                )}
                              </td>
                              <td className="p-3 font-medium text-slate-900">£{customer.revenue.toLocaleString()}</td>
                              <td className="p-3 text-slate-700">£{customer.avgBooking}</td>
                              {showComparison && (
                                <td className="p-3">
                                  {revenueChange !== 0 && (
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "text-xs",
                                        revenueChange > 0
                                          ? "bg-green-50 text-green-700 border-green-200"
                                          : "bg-red-50 text-red-700 border-red-200",
                                      )}
                                    >
                                      {revenueChange > 0 ? "+" : ""}
                                      {revenueChange.toFixed(0)}%
                                    </Badge>
                                  )}
                                </td>
                              )}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
