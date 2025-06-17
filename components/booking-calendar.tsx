"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react"

interface BookingCalendarProps {
  spaceId: number
  spaceName: string
  onTimeSlotSelect: (date: Date, timeSlot: string) => void
}

const timeSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
]

// Mock booking data - in real app this would come from API
const mockBookings = {
  "2025-01-15": {
    "09:00": "booked",
    "10:00": "booked",
    "14:00": "pending",
    "15:00": "pending",
  },
  "2025-01-16": {
    "11:00": "booked",
    "12:00": "booked",
    "16:00": "pending",
  },
}

export function BookingCalendar({ spaceId, spaceName, onTimeSlotSelect }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [currentWeek, setCurrentWeek] = useState(new Date())

  const getWeekDates = (startDate: Date) => {
    const dates = []
    const start = new Date(startDate)
    // Get Monday of the week
    const day = start.getDay()
    const diff = start.getDate() - day + (day === 0 ? -6 : 1)
    start.setDate(diff)

    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      dates.push(date)
    }
    return dates
  }

  const weekDates = getWeekDates(currentWeek)

  const getSlotStatus = (date: Date, timeSlot: string) => {
    const dateKey = date.toISOString().split("T")[0]
    const bookings = mockBookings[dateKey as keyof typeof mockBookings]
    return bookings?.[timeSlot as keyof typeof bookings] || "available"
  }

  const getSlotColor = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-red-100 border-red-200 text-red-800"
      case "pending":
        return "bg-blue-100 border-blue-200 text-blue-800"
      default:
        return "bg-green-100 border-green-200 text-green-800 hover:bg-green-200"
    }
  }

  const nextWeek = () => {
    const next = new Date(currentWeek)
    next.setDate(next.getDate() + 7)
    setCurrentWeek(next)
  }

  const prevWeek = () => {
    const prev = new Date(currentWeek)
    prev.setDate(prev.getDate() - 7)
    setCurrentWeek(prev)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  const formatWeekRange = () => {
    const start = weekDates[0]
    const end = weekDates[6]
    return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()}`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Select Week</span>
            <Badge variant="outline">{spaceName}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date)
              if (date) setCurrentWeek(date)
            }}
            disabled={(date) => date < new Date()}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Week of {formatWeekRange()}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={prevWeek}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextWeek}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Week View Header - Monday to Sunday */}
            <div className="grid grid-cols-8 gap-2 text-sm font-medium text-gray-600 border-b pb-2">
              <div className="text-right pr-2">Time</div>
              {weekDates.map((date, index) => (
                <div key={index} className="text-center">
                  <div className="font-semibold">{date.toLocaleDateString("en-GB", { weekday: "short" })}</div>
                  <div className="text-xs text-gray-500">
                    {date.getDate()}/{date.getMonth() + 1}
                  </div>
                </div>
              ))}
            </div>

            {/* Time Slots Grid */}
            <div className="space-y-1 max-h-80 overflow-y-auto">
              {timeSlots.map((timeSlot) => (
                <div key={timeSlot} className="grid grid-cols-8 gap-2 items-center">
                  <div className="text-sm font-medium text-gray-600 text-right pr-2 py-1">{timeSlot}</div>
                  {weekDates.map((date, dateIndex) => {
                    const status = getSlotStatus(date, timeSlot)
                    const isToday = date.toDateString() === new Date().toDateString()
                    const isPast =
                      date < new Date() || (isToday && Number.parseInt(timeSlot.split(":")[0]) <= new Date().getHours())

                    return (
                      <Button
                        key={dateIndex}
                        variant="outline"
                        size="sm"
                        disabled={status !== "available" || isPast}
                        className={`h-8 text-xs ${getSlotColor(status)} ${
                          isPast ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => onTimeSlotSelect(date, timeSlot)}
                      >
                        {status === "available" ? "Book" : status === "pending" ? "Pending" : "Booked"}
                      </Button>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center space-x-6 text-sm pt-4 border-t">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                <span>Pending Approval</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                <span>Booked</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
