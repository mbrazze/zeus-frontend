"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Star,
  Wifi,
  Car,
  Accessibility,
  Users,
  Phone,
  Mail,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import Image from "next/image"
import { AdminLoginModal } from "@/components/admin-login-modal"

const venueData = {
  id: 1,
  name: "Premier Sports Complex",
  location: "123 Sports Avenue, Downtown District, London SW1A 1AA",
  rating: 4.8,
  reviews: 124,
  description:
    "A state-of-the-art sports complex featuring multiple pitches and conference facilities. Perfect for corporate events, team building, and sports activities.",
  images: [
    "/placeholder.svg?height=400&width=600&text=Premier+Sports+Complex+Main+View",
    "/placeholder.svg?height=400&width=600&text=Premier+Sports+Complex+3G+Pitch",
    "/placeholder.svg?height=400&width=600&text=Premier+Sports+Complex+Conference+Room",
  ],
  amenities: ["Wi-Fi", "Parking", "Accessible", "Changing Rooms", "Catering", "Security"],
  contact: {
    phone: "+44 20 1234 5678",
    email: "bookings@premiersports.com",
  },
  status: "ACTIVE", // ACTIVE, INACTIVE, MAINTENANCE
  spaces: [
    {
      id: 1,
      name: "3G Pitch",
      type: "Sports Pitch",
      capacity: 22,
      size: "100m x 60m",
      hourlyRate: 45,
      status: "available", // available, unavailable, maintenance
      segments: [
        { id: 1, name: "Full Pitch", rate: 45 },
        { id: 2, name: "Half Pitch", rate: 25 },
        { id: 3, name: "Quarter Pitch", rate: 15 },
      ],
      features: ["Floodlights", "Goal Posts", "Corner Flags"],
    },
    {
      id: 2,
      name: "Conference Room A",
      type: "Meeting Room",
      capacity: 50,
      size: "12m x 8m",
      hourlyRate: 75,
      status: "available",
      segments: [],
      features: ["Projector", "Whiteboard", "Air Conditioning", "Sound System"],
    },
    {
      id: 3,
      name: "Grass Pitch",
      type: "Sports Pitch",
      capacity: 22,
      size: "105m x 68m",
      hourlyRate: 35,
      status: "maintenance", // This space is in maintenance
      segments: [
        { id: 1, name: "Full Pitch", rate: 35 },
        { id: 2, name: "Half Pitch", rate: 20 },
      ],
      features: ["Natural Grass", "Goal Posts", "Dugouts"],
    },
  ],
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

export default function VenueDetailPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedSpace, setSelectedSpace] = useState(
    venueData.spaces.filter((s) => s.status === "available")[0] || venueData.spaces[0],
  )
  const [selectedSegment, setSelectedSegment] = useState(selectedSpace.segments[0] || null)
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)

  // Filter only active/available spaces
  const availableSpaces = venueData.spaces.filter((space) => space.status === "available")
  const isVenueActive = venueData.status === "ACTIVE"

  const toggleTimeSlot = (time: string) => {
    setSelectedTimeSlots((prev) => (prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time].sort()))
  }

  const calculateTotal = () => {
    const rate = selectedSegment ? selectedSegment.rate : selectedSpace.hourlyRate
    return rate * selectedTimeSlots.length
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % venueData.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + venueData.images.length) % venueData.images.length)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "unavailable":
        return "bg-red-100 text-red-800 border-red-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 zeus-gradient rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <span className="text-2xl font-bold text-slate-800">Zeus</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdminModalOpen(true)}
                className="border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Admin Portal
              </Button>
              <Link href="/login">
                <Button size="sm" className="bg-primary-500 hover:bg-primary-600 text-white">
                  Customer Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-primary-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/browse" className="hover:text-primary-600">
            Browse Venues
          </Link>
          <span>/</span>
          <span className="text-gray-900">{venueData.name}</span>
        </div>

        {/* Venue Inactive Alert */}
        {!isVenueActive && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Venue Currently Unavailable</AlertTitle>
            <AlertDescription>
              This venue is currently not accepting bookings. Status: {venueData.status}. Please check back later or
              contact us for more information.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="zeus-card overflow-hidden">
              <div className="relative">
                <Image
                  src={venueData.images[currentImageIndex] || "/placeholder.svg"}
                  alt={venueData.name}
                  width={600}
                  height={400}
                  className="w-full h-96 object-cover"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border-slate-200"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white border-slate-200"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {venueData.images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>

                {/* Image thumbnails */}
                <div className="absolute bottom-4 right-4 flex space-x-2">
                  {venueData.images.map((image, index) => (
                    <button
                      key={index}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? "border-white" : "border-white/50"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${venueData.name} view ${index + 1}`}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Venue Info */}
            <Card className="zeus-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl text-slate-800">{venueData.name}</CardTitle>
                    <CardDescription className="flex items-center mt-2 text-slate-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {venueData.location}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{venueData.rating}</span>
                      <span className="text-gray-500 ml-1">({venueData.reviews} reviews)</span>
                    </div>
                    <Badge variant="outline" className={getStatusBadgeColor(venueData.status.toLowerCase())}>
                      {venueData.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6">{venueData.description}</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2 text-slate-800">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {venueData.amenities.map((amenity) => (
                        <Badge
                          key={amenity}
                          variant="secondary"
                          className="flex items-center gap-1 bg-slate-100 text-slate-700"
                        >
                          {amenity === "Wi-Fi" && <Wifi className="w-3 h-3" />}
                          {amenity === "Parking" && <Car className="w-3 h-3" />}
                          {amenity === "Accessible" && <Accessibility className="w-3 h-3" />}
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2 text-slate-800">Contact Information</h4>
                    <div className="flex flex-col space-y-1 text-sm text-slate-600">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {venueData.contact.phone}
                      </div>
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {venueData.contact.email}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Spaces */}
            <Card className="zeus-card">
              <CardHeader>
                <CardTitle className="text-slate-800">Available Spaces</CardTitle>
                {availableSpaces.length === 0 && (
                  <CardDescription className="text-red-600">
                    No spaces are currently available for booking at this venue.
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {venueData.spaces.map((space) => {
                    const isSpaceAvailable = space.status === "available"

                    return (
                      <div
                        key={space.id}
                        className={`border rounded-lg p-4 ${!isSpaceAvailable ? "opacity-60 bg-slate-50" : "border-slate-200"}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-slate-800">{space.name}</h4>
                              <Badge variant="outline" className={getStatusBadgeColor(space.status)}>
                                {space.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600">{space.type}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-slate-800">£{space.hourlyRate}/hr</p>
                            <p className="text-sm text-slate-600">from</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <p className="text-slate-500">Capacity</p>
                            <p className="font-medium flex items-center text-slate-700">
                              <Users className="w-4 h-4 mr-1" />
                              {space.capacity} people
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500">Size</p>
                            <p className="font-medium text-slate-700">{space.size}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-slate-500">Features</p>
                            <p className="font-medium text-slate-700">{space.features.join(", ")}</p>
                          </div>
                        </div>

                        {space.segments.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm text-slate-500 mb-2">Booking Options:</p>
                            <div className="flex flex-wrap gap-2">
                              {space.segments.map((segment) => (
                                <Badge key={segment.id} variant="outline" className="border-slate-200 text-slate-600">
                                  {segment.name} - £{segment.rate}/hr
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {!isSpaceAvailable && (
                          <Alert className="mb-3">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              This space is currently not available for booking ({space.status}).
                            </AlertDescription>
                          </Alert>
                        )}

                        <Button
                          className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                          onClick={() => {
                            setSelectedSpace(space)
                            setSelectedSegment(space.segments[0] || null)
                            setIsBookingOpen(true)
                          }}
                          disabled={!isVenueActive || !isSpaceAvailable}
                        >
                          {!isVenueActive
                            ? "Venue Unavailable"
                            : !isSpaceAvailable
                              ? "Space Unavailable"
                              : "Book This Space"}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card className="zeus-card sticky top-6">
              <CardHeader>
                <CardTitle className="text-slate-800">Quick Book</CardTitle>
                <CardDescription>Select a date to see availability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border border-slate-200"
                />

                <div className="space-y-2">
                  <Label className="text-slate-700">Select Space</Label>
                  <Select
                    value={selectedSpace.id.toString()}
                    onValueChange={(value) => {
                      const space = venueData.spaces.find((s) => s.id === Number.parseInt(value))
                      if (space) {
                        setSelectedSpace(space)
                        setSelectedSegment(space.segments[0] || null)
                      }
                    }}
                    disabled={!isVenueActive || availableSpaces.length === 0}
                  >
                    <SelectTrigger className="border-slate-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {venueData.spaces.map((space) => (
                        <SelectItem key={space.id} value={space.id.toString()} disabled={space.status !== "available"}>
                          {space.name} - £{space.hourlyRate}/hr {space.status !== "available" && `(${space.status})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedSpace.segments.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-slate-700">Booking Option</Label>
                    <Select
                      value={selectedSegment?.id.toString() || ""}
                      onValueChange={(value) => {
                        const segment = selectedSpace.segments.find((s) => s.id === Number.parseInt(value))
                        setSelectedSegment(segment || null)
                      }}
                      disabled={!isVenueActive || selectedSpace.status !== "available"}
                    >
                      <SelectTrigger className="border-slate-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedSpace.segments.map((segment) => (
                          <SelectItem key={segment.id} value={segment.id.toString()}>
                            {segment.name} - £{segment.rate}/hr
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full bg-primary-500 hover:bg-primary-600 text-white"
                      size="lg"
                      disabled={!isVenueActive || selectedSpace.status !== "available"}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {!isVenueActive
                        ? "Venue Unavailable"
                        : selectedSpace.status !== "available"
                          ? "Space Unavailable"
                          : "Book Now"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-slate-800">Book {selectedSpace.name}</DialogTitle>
                      <DialogDescription className="text-slate-600">
                        Complete your booking for {selectedDate?.toLocaleDateString()}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Status Warning */}
                      {(!isVenueActive || selectedSpace.status !== "available") && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Booking Not Available</AlertTitle>
                          <AlertDescription>
                            {!isVenueActive
                              ? `This venue is currently ${venueData.status.toLowerCase()} and not accepting bookings.`
                              : `This space is currently ${selectedSpace.status} and not available for booking.`}
                          </AlertDescription>
                        </Alert>
                      )}

                      {/* Time Selection */}
                      <div>
                        <Label className="text-base font-medium text-slate-700">
                          Select Time Slots (minimum 1 hour)
                        </Label>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTimeSlots.includes(time) ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleTimeSlot(time)}
                              disabled={!isVenueActive || selectedSpace.status !== "available"}
                              className={`text-xs ${
                                selectedTimeSlots.includes(time)
                                  ? "bg-primary-500 hover:bg-primary-600 text-white"
                                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="customer-name" className="text-slate-700">
                            Full Name
                          </Label>
                          <Input
                            id="customer-name"
                            placeholder="Enter your name"
                            className="border-slate-200"
                            disabled={!isVenueActive || selectedSpace.status !== "available"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="customer-email" className="text-slate-700">
                            Email
                          </Label>
                          <Input
                            id="customer-email"
                            type="email"
                            placeholder="your@email.com"
                            className="border-slate-200"
                            disabled={!isVenueActive || selectedSpace.status !== "available"}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customer-phone" className="text-slate-700">
                          Phone Number
                        </Label>
                        <Input
                          id="customer-phone"
                          placeholder="+44 123 456 7890"
                          className="border-slate-200"
                          disabled={!isVenueActive || selectedSpace.status !== "available"}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="special-requirements" className="text-slate-700">
                          Special Requirements (Optional)
                        </Label>
                        <Textarea
                          id="special-requirements"
                          placeholder="Any special requirements or notes..."
                          rows={3}
                          className="border-slate-200"
                          disabled={!isVenueActive || selectedSpace.status !== "available"}
                        />
                      </div>

                      {/* Booking Summary */}
                      {selectedTimeSlots.length > 0 && isVenueActive && selectedSpace.status === "available" && (
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <h4 className="font-medium mb-2 text-slate-800">Booking Summary</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Space:</span>
                              <span className="text-slate-800">
                                {selectedSpace.name} {selectedSegment ? `(${selectedSegment.name})` : ""}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Date:</span>
                              <span className="text-slate-800">{selectedDate?.toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Time:</span>
                              <span className="text-slate-800">
                                {selectedTimeSlots[0]} - {selectedTimeSlots[selectedTimeSlots.length - 1]}:00
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Duration:</span>
                              <span className="text-slate-800">
                                {selectedTimeSlots.length} hour{selectedTimeSlots.length > 1 ? "s" : ""}
                              </span>
                            </div>
                            <div className="flex justify-between font-medium text-lg border-t border-slate-200 pt-2">
                              <span className="text-slate-800">Total:</span>
                              <span className="text-slate-800">£{calculateTotal()}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsBookingOpen(false)}
                          className="border-slate-200 text-slate-600 hover:bg-slate-50"
                        >
                          Cancel
                        </Button>
                        <Button
                          disabled={
                            selectedTimeSlots.length === 0 || !isVenueActive || selectedSpace.status !== "available"
                          }
                          onClick={() => {
                            // Handle booking submission
                            setIsBookingOpen(false)
                            // Show success message
                          }}
                          className="bg-primary-500 hover:bg-primary-600 text-white"
                        >
                          Confirm Booking - £{calculateTotal()}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
    </div>
  )
}
