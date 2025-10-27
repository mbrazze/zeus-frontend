"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MapPin, Users, PoundSterling, Plus, Pencil, Trash2, CalendarIcon, X, Save, AlertCircle } from "lucide-react"
import { format } from "date-fns"

interface Space {
  id: number
  name: string
  capacity: number | null
  pricePerHour: number
  amenities: string[]
  status: "available" | "unavailable" | "maintenance"
}

interface UnavailableDate {
  id: number
  date: string
  type: "bank_holiday" | "internal_booking" | "maintenance" | "other"
  reason: string
}

interface Venue {
  id: string
  name: string
  location: string
  type: string
  capacity: number
  status: string
  bookings: number
  revenue: number
  rating: number
  image: string
}

interface EditVenueModalProps {
  venue: Venue | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock data for spaces and unavailable dates
const getMockSpaces = (): Space[] => [
  {
    id: 1,
    name: "Main Hall",
    capacity: 150,
    pricePerHour: 200,
    amenities: ["Projector", "Sound System", "WiFi"],
    status: "available",
  },
  {
    id: 2,
    name: "Meeting Room A",
    capacity: 20,
    pricePerHour: 50,
    amenities: ["Whiteboard", "WiFi", "Video Conference"],
    status: "available",
  },
  {
    id: 3,
    name: "Conference Room",
    capacity: 50,
    pricePerHour: 100,
    amenities: ["Projector", "WiFi", "Catering"],
    status: "maintenance",
  },
]

const getMockUnavailableDates = (): UnavailableDate[] => [
  {
    id: 1,
    date: "2025-12-25",
    type: "bank_holiday",
    reason: "Christmas Day",
  },
  {
    id: 2,
    date: "2025-12-26",
    type: "bank_holiday",
    reason: "Boxing Day",
  },
  {
    id: 3,
    date: "2025-11-15",
    type: "maintenance",
    reason: "Annual Maintenance",
  },
]

export function EditVenueModal({ venue, open, onOpenChange }: EditVenueModalProps) {
  const [activeTab, setActiveTab] = useState("spaces")
  const [spaces, setSpaces] = useState<Space[]>([])
  const [unavailableDates, setUnavailableDates] = useState<UnavailableDate[]>([])

  // Space management states
  const [showAddSpace, setShowAddSpace] = useState(false)
  const [editingSpace, setEditingSpace] = useState<Space | null>(null)
  const [newSpaceName, setNewSpaceName] = useState("")
  const [newSpaceCapacity, setNewSpaceCapacity] = useState("")
  const [newSpacePrice, setNewSpacePrice] = useState("")
  const [newSpaceAmenities, setNewSpaceAmenities] = useState("")
  const [newSpaceStatus, setNewSpaceStatus] = useState<"available" | "unavailable" | "maintenance">("available")

  // Unavailable dates states
  const [showAddDate, setShowAddDate] = useState(false)
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [dateType, setDateType] = useState<"bank_holiday" | "internal_booking" | "maintenance" | "other">(
    "bank_holiday",
  )
  const [dateReason, setDateReason] = useState("")

  // Venue details states
  const [venueName, setVenueName] = useState("")
  const [venueLocation, setVenueLocation] = useState("")
  const [venueType, setVenueType] = useState("")
  const [venueCapacity, setVenueCapacity] = useState("")
  const [venueStatus, setVenueStatus] = useState("")
  const [venueDescription, setVenueDescription] = useState("")

  // Initialize data when venue changes
  useEffect(() => {
    if (venue && open) {
      setVenueName(venue.name)
      setVenueLocation(venue.location)
      setVenueType(venue.type)
      setVenueCapacity(venue.capacity.toString())
      setVenueStatus(venue.status)
      setVenueDescription("")
      setSpaces(getMockSpaces())
      setUnavailableDates(getMockUnavailableDates())
    }
  }, [venue, open])

  // Don't render if venue is null
  if (!venue) {
    return null
  }

  // Space Management Functions
  const handleAddSpace = () => {
    if (!newSpaceName || !newSpacePrice) return

    const newSpace: Space = {
      id: Date.now(),
      name: newSpaceName,
      capacity: newSpaceCapacity ? Number.parseInt(newSpaceCapacity) : null,
      pricePerHour: Number.parseFloat(newSpacePrice),
      amenities: newSpaceAmenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      status: newSpaceStatus,
    }

    setSpaces((prev) => [...prev, newSpace])

    // Reset form
    setNewSpaceName("")
    setNewSpaceCapacity("")
    setNewSpacePrice("")
    setNewSpaceAmenities("")
    setNewSpaceStatus("available")
    setShowAddSpace(false)
  }

  const handleEditSpace = (space: Space) => {
    setEditingSpace(space)
    setNewSpaceName(space.name)
    setNewSpaceCapacity(space.capacity ? space.capacity.toString() : "")
    setNewSpacePrice(space.pricePerHour.toString())
    setNewSpaceAmenities(space.amenities.join(", "))
    setNewSpaceStatus(space.status)
    setShowAddSpace(false)
  }

  const handleSaveEditSpace = () => {
    if (!editingSpace || !newSpaceName || !newSpacePrice) return

    setSpaces((prev) =>
      prev.map((space) =>
        space.id === editingSpace.id
          ? {
              ...space,
              name: newSpaceName,
              capacity: newSpaceCapacity ? Number.parseInt(newSpaceCapacity) : null,
              pricePerHour: Number.parseFloat(newSpacePrice),
              amenities: newSpaceAmenities
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean),
              status: newSpaceStatus,
            }
          : space,
      ),
    )

    // Reset form
    setEditingSpace(null)
    setNewSpaceName("")
    setNewSpaceCapacity("")
    setNewSpacePrice("")
    setNewSpaceAmenities("")
    setNewSpaceStatus("available")
  }

  const handleCancelEditSpace = () => {
    setEditingSpace(null)
    setNewSpaceName("")
    setNewSpaceCapacity("")
    setNewSpacePrice("")
    setNewSpaceAmenities("")
    setNewSpaceStatus("available")
  }

  const handleDeleteSpace = (spaceId: number) => {
    if (confirm("Are you sure you want to delete this space?")) {
      setSpaces((prev) => prev.filter((space) => space.id !== spaceId))
    }
  }

  // Unavailable Dates Functions
  const handleAddUnavailableDates = () => {
    if (selectedDates.length === 0 || !dateReason.trim()) return

    const newDates: UnavailableDate[] = selectedDates.map((date) => ({
      id: Date.now() + Math.random(),
      date: format(date, "yyyy-MM-dd"),
      type: dateType,
      reason: dateReason,
    }))

    setUnavailableDates((prev) =>
      [...prev, ...newDates].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    )

    // Reset form
    setSelectedDates([])
    setDateType("bank_holiday")
    setDateReason("")
    setShowAddDate(false)
  }

  const handleDeleteUnavailableDate = (dateId: number) => {
    setUnavailableDates((prev) => prev.filter((date) => date.id !== dateId))
  }

  const handleRemoveSelectedDate = (dateToRemove: Date) => {
    setSelectedDates((prev) => prev.filter((date) => date.getTime() !== dateToRemove.getTime()))
  }

  const handleSave = () => {
    // Here you would typically save all changes to the backend
    console.log("Saving venue:", {
      name: venueName,
      location: venueLocation,
      type: venueType,
      capacity: venueCapacity,
      status: venueStatus,
      description: venueDescription,
      spaces,
      unavailableDates,
    })
    onOpenChange(false)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "unavailable":
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "bank_holiday":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "internal_booking":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "other":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDateType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-slate-800">{venue.name}</DialogTitle>
              <div className="flex items-center text-slate-600 mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {venue.location}
              </div>
            </div>
            <Badge variant="outline" className={getStatusBadgeColor(venue.status)}>
              {venue.status.toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-6 mt-4">
            <TabsTrigger value="spaces">Spaces</TabsTrigger>
            <TabsTrigger value="unavailable">Unavailable Dates</TabsTrigger>
            <TabsTrigger value="details">Venue Details</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Spaces Tab */}
            <TabsContent value="spaces" className="mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Venue Spaces</h3>
                  <p className="text-sm text-slate-600">Manage individual spaces within this venue</p>
                </div>
                <Button
                  onClick={() => {
                    setShowAddSpace(true)
                    setEditingSpace(null)
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Space
                </Button>
              </div>

              {/* Add/Edit Space Form */}
              {(showAddSpace || editingSpace) && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-800">{editingSpace ? "Edit Space" : "Add New Space"}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowAddSpace(false)
                        handleCancelEditSpace()
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Space Name *</Label>
                      <Input
                        value={newSpaceName}
                        onChange={(e) => setNewSpaceName(e.target.value)}
                        placeholder="e.g., Main Hall"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Capacity</Label>
                      <Input
                        type="number"
                        value={newSpaceCapacity}
                        onChange={(e) => setNewSpaceCapacity(e.target.value)}
                        placeholder="e.g., 150"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price per Hour (£) *</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newSpacePrice}
                        onChange={(e) => setNewSpacePrice(e.target.value)}
                        placeholder="e.g., 200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status *</Label>
                      <Select value={newSpaceStatus} onValueChange={(value: any) => setNewSpaceStatus(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="unavailable">Unavailable</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Amenities (comma-separated)</Label>
                      <Input
                        value={newSpaceAmenities}
                        onChange={(e) => setNewSpaceAmenities(e.target.value)}
                        placeholder="e.g., Projector, WiFi, Sound System"
                      />
                    </div>
                  </div>

                  {newSpaceStatus !== "available" && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-yellow-800">
                        This space will not be available for customer bookings when status is not "Available".
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddSpace(false)
                        handleCancelEditSpace()
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={editingSpace ? handleSaveEditSpace : handleAddSpace}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={!newSpaceName || !newSpacePrice}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingSpace ? "Save Changes" : "Add Space"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Spaces Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>Space Name</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Price/Hour</TableHead>
                      <TableHead>Amenities</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {spaces.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                          No spaces added yet. Click "Add Space" to get started.
                        </TableCell>
                      </TableRow>
                    ) : (
                      spaces.map((space) => (
                        <TableRow key={space.id}>
                          <TableCell className="font-medium">{space.name}</TableCell>
                          <TableCell>
                            {space.capacity ? (
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1 text-slate-500" />
                                {space.capacity}
                              </div>
                            ) : (
                              <span className="text-slate-400 text-sm">Not set</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <PoundSterling className="w-4 h-4 mr-1 text-slate-500" />
                              {space.pricePerHour}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {space.amenities.length > 0 ? (
                                <>
                                  {space.amenities.slice(0, 2).map((amenity, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {amenity}
                                    </Badge>
                                  ))}
                                  {space.amenities.length > 2 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{space.amenities.length - 2}
                                    </Badge>
                                  )}
                                </>
                              ) : (
                                <span className="text-slate-400 text-sm">None</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusBadgeColor(space.status)}>
                              {space.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditSpace(space)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSpace(space.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Unavailable Dates Tab */}
            <TabsContent value="unavailable" className="mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Unavailable Dates</h3>
                  <p className="text-sm text-slate-600">Mark dates as unavailable for bookings</p>
                </div>
                <Button onClick={() => setShowAddDate(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Date
                </Button>
              </div>

              {/* Add Unavailable Date Form */}
              {showAddDate && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-800">Add Unavailable Date</h4>
                    <Button variant="ghost" size="sm" onClick={() => setShowAddDate(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-sm text-slate-600">
                    Mark dates as unavailable for bank holidays, maintenance, or internal bookings
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Select Dates *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal bg-white">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDates.length > 0 ? `${selectedDates.length} dates selected` : "Pick dates"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="multiple"
                            selected={selectedDates}
                            onSelect={(dates) => setSelectedDates(dates || [])}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {selectedDates.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedDates
                            .sort((a, b) => a.getTime() - b.getTime())
                            .map((date) => (
                              <Badge key={date.getTime()} variant="outline" className="text-xs">
                                {format(date, "MMM d, yyyy")}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSelectedDate(date)}
                                  className="ml-1 hover:text-red-600"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            ))}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Type *</Label>
                      <Select value={dateType} onValueChange={(value: any) => setDateType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bank_holiday">Bank Holiday</SelectItem>
                          <SelectItem value="internal_booking">Internal Booking</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Reason *</Label>
                      <Textarea
                        value={dateReason}
                        onChange={(e) => setDateReason(e.target.value)}
                        placeholder="e.g., Christmas Day, Annual Maintenance..."
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowAddDate(false)
                        setSelectedDates([])
                        setDateReason("")
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddUnavailableDates}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      disabled={selectedDates.length === 0 || !dateReason.trim()}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save {selectedDates.length > 0 ? `${selectedDates.length} ` : ""}Date
                      {selectedDates.length !== 1 ? "s" : ""}
                    </Button>
                  </div>
                </div>
              )}

              {/* Unavailable Dates Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {unavailableDates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                          No unavailable dates set. All dates are available for booking.
                        </TableCell>
                      </TableRow>
                    ) : (
                      unavailableDates.map((date) => (
                        <TableRow key={date.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <CalendarIcon className="w-4 h-4 mr-2 text-slate-500" />
                              {format(new Date(date.date), "MMMM d, yyyy")}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getTypeBadgeColor(date.type)}>
                              {formatDateType(date.type)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600">{date.reason}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUnavailableDate(date.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Venue Details Tab */}
            <TabsContent value="details" className="mt-0 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Venue Information</h3>
                <p className="text-sm text-slate-600">Update basic venue details</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Venue Name *</Label>
                    <Input value={venueName} onChange={(e) => setVenueName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Location *</Label>
                    <Input value={venueLocation} onChange={(e) => setVenueLocation(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Type *</Label>
                    <Select value={venueType} onValueChange={setVenueType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sports">Sports</SelectItem>
                        <SelectItem value="Conference">Conference</SelectItem>
                        <SelectItem value="Event">Event</SelectItem>
                        <SelectItem value="Meeting">Meeting</SelectItem>
                        <SelectItem value="Workshop">Workshop</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Total Capacity *</Label>
                    <Input type="number" value={venueCapacity} onChange={(e) => setVenueCapacity(e.target.value)} />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Status *</Label>
                    <Select value={venueStatus} onValueChange={(value: any) => setVenueStatus(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    {venueStatus !== "active" && venueStatus !== "" && (
                      <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md mt-2">
                        <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-yellow-800">
                          This venue will not be available for customer bookings when status is not Active.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Description</Label>
                    <Textarea
                      value={venueDescription}
                      onChange={(e) => setVenueDescription(e.target.value)}
                      rows={4}
                      placeholder="Describe your venue..."
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="px-6 py-4 border-t bg-white flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            Save All Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
