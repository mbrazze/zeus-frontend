"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  Search,
  MapPin,
  Star,
  Users,
  Wifi,
  Car,
  Accessibility,
  Filter,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import Image from "next/image"
import { AdminLoginModal } from "@/components/admin-login-modal"

const venues = [
  {
    id: 1,
    name: "Premier Sports Complex",
    location: "Downtown District",
    rating: 4.8,
    reviews: 124,
    images: [
      "/placeholder.svg?height=200&width=300&text=Premier+Sports+Complex+Main",
      "/placeholder.svg?height=200&width=300&text=Premier+Sports+Complex+Pitch",
      "/placeholder.svg?height=200&width=300&text=Premier+Sports+Complex+Interior",
    ],
    spaces: ["3G Pitch", "Conference Room", "Grass Pitch"],
    amenities: ["Wi-Fi", "Parking", "Accessible"],
    priceFrom: 45,
    type: "Sports Facility",
    capacity: 50,
  },
  {
    id: 2,
    name: "Elite Conference Center",
    location: "Business Park",
    rating: 4.9,
    reviews: 89,
    images: [
      "/placeholder.svg?height=200&width=300&text=Elite+Conference+Center+Main",
      "/placeholder.svg?height=200&width=300&text=Elite+Conference+Center+Hall",
      "/placeholder.svg?height=200&width=300&text=Elite+Conference+Center+Meeting+Room",
    ],
    spaces: ["Meeting Rooms", "Auditorium", "Exhibition Hall"],
    amenities: ["Wi-Fi", "Parking", "Catering"],
    priceFrom: 75,
    type: "Conference Center",
    capacity: 200,
  },
  {
    id: 3,
    name: "Community Sports Hub",
    location: "Riverside",
    rating: 4.7,
    reviews: 156,
    images: [
      "/placeholder.svg?height=200&width=300&text=Community+Sports+Hub+Main",
      "/placeholder.svg?height=200&width=300&text=Community+Sports+Hub+Courts",
      "/placeholder.svg?height=200&width=300&text=Community+Sports+Hub+Training",
    ],
    spaces: ["Indoor Courts", "Outdoor Pitches", "Training Rooms"],
    amenities: ["Wi-Fi", "Parking", "Accessible", "Changing Rooms"],
    priceFrom: 35,
    type: "Sports Facility",
    capacity: 30,
  },
  {
    id: 4,
    name: "Executive Meeting Suites",
    location: "Financial District",
    rating: 4.6,
    reviews: 67,
    images: [
      "/placeholder.svg?height=200&width=300&text=Executive+Meeting+Suites+Main",
      "/placeholder.svg?height=200&width=300&text=Executive+Meeting+Suites+Boardroom",
      "/placeholder.svg?height=200&width=300&text=Executive+Meeting+Suites+Office",
    ],
    spaces: ["Boardrooms", "Private Offices", "Video Conference"],
    amenities: ["Wi-Fi", "Parking", "Catering", "Security"],
    priceFrom: 95,
    type: "Conference Center",
    capacity: 25,
  },
  {
    id: 5,
    name: "Urban Sports Arena",
    location: "City Center",
    rating: 4.5,
    reviews: 203,
    images: [
      "/placeholder.svg?height=200&width=300&text=Urban+Sports+Arena+Main",
      "/placeholder.svg?height=200&width=300&text=Urban+Sports+Arena+Basketball",
      "/placeholder.svg?height=200&width=300&text=Urban+Sports+Arena+Fitness",
    ],
    spaces: ["Basketball Courts", "Fitness Studios", "Multi-purpose Hall"],
    amenities: ["Wi-Fi", "Parking", "Accessible", "Changing Rooms", "Equipment"],
    priceFrom: 40,
    type: "Sports Facility",
    capacity: 100,
  },
  {
    id: 6,
    name: "Heritage Event Hall",
    location: "Historic Quarter",
    rating: 4.4,
    reviews: 91,
    images: [
      "/placeholder.svg?height=200&width=300&text=Heritage+Event+Hall+Main",
      "/placeholder.svg?height=200&width=300&text=Heritage+Event+Hall+Garden",
      "/placeholder.svg?height=200&width=300&text=Heritage+Event+Hall+Dining",
    ],
    spaces: ["Grand Hall", "Garden Terrace", "Private Dining"],
    amenities: ["Wi-Fi", "Parking", "Catering", "Historic Features"],
    priceFrom: 120,
    type: "Event Space",
    capacity: 150,
  },
]

export default function BrowseVenues() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 200])
  const [capacityRange, setCapacityRange] = useState([0, 200])
  const [sortBy, setSortBy] = useState("rating")
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({})

  const amenityOptions = ["Wi-Fi", "Parking", "Accessible", "Catering", "Changing Rooms", "Security", "Equipment"]
  const venueTypes = ["Sports Facility", "Conference Center", "Event Space"]

  const filteredVenues = venues
    .filter((venue) => {
      const matchesSearch =
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = selectedType === "all" || venue.type === selectedType
      const matchesAmenities =
        selectedAmenities.length === 0 || selectedAmenities.every((amenity) => venue.amenities.includes(amenity))
      const matchesPrice = venue.priceFrom >= priceRange[0] && venue.priceFrom <= priceRange[1]
      const matchesCapacity = venue.capacity >= capacityRange[0] && venue.capacity <= capacityRange[1]

      return matchesSearch && matchesType && matchesAmenities && matchesPrice && matchesCapacity
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "price-low":
          return a.priceFrom - b.priceFrom
        case "price-high":
          return b.priceFrom - a.priceFrom
        case "reviews":
          return b.reviews - a.reviews
        default:
          return 0
      }
    })

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  const nextImage = (venueId: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [venueId]: ((prev[venueId] || 0) + 1) % 3,
    }))
  }

  const prevImage = (venueId: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [venueId]: ((prev[venueId] || 0) - 1 + 3) % 3,
    }))
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-medium">Venue Type</Label>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {venueTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-base font-medium">Price Range (£ per hour)</Label>
        <div className="mt-4 px-2">
          <Slider value={priceRange} onValueChange={setPriceRange} max={200} min={0} step={5} className="w-full" />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>£{priceRange[0]}</span>
            <span>£{priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Capacity</Label>
        <div className="mt-4 px-2">
          <Slider
            value={capacityRange}
            onValueChange={setCapacityRange}
            max={200}
            min={0}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{capacityRange[0]} people</span>
            <span>{capacityRange[1]} people</span>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Amenities</Label>
        <div className="mt-3 space-y-3">
          {amenityOptions.map((amenity) => (
            <div key={amenity} className="flex items-center space-x-2">
              <Checkbox
                id={amenity}
                checked={selectedAmenities.includes(amenity)}
                onCheckedChange={() => toggleAmenity(amenity)}
              />
              <Label htmlFor={amenity} className="text-sm font-normal">
                {amenity}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setSelectedType("all")
          setSelectedAmenities([])
          setPriceRange([0, 200])
          setCapacityRange([0, 200])
        }}
      >
        Clear All Filters
      </Button>
    </div>
  )

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
        {/* Search and Sort Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search venues by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-slate-200 focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 h-12 border-slate-200">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="reviews">Most Reviewed</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden h-12 w-12 border-slate-200">
                  <Filter className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filter Venues</SheetTitle>
                  <SheetDescription>Refine your search to find the perfect venue</SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block">
            <Card className="zeus-card">
              <CardHeader>
                <CardTitle className="text-slate-800">Filters</CardTitle>
                <CardDescription>Refine your search results</CardDescription>
              </CardHeader>
              <CardContent>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* Venues Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-slate-800">
                {filteredVenues.length} venue{filteredVenues.length !== 1 ? "s" : ""} found
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredVenues.map((venue) => {
                const currentIndex = currentImageIndex[venue.id] || 0
                return (
                  <Card
                    key={venue.id}
                    className="zeus-card overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
                  >
                    <div className="relative overflow-hidden">
                      <Image
                        src={venue.images[currentIndex] || "/placeholder.svg"}
                        alt={venue.name}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Image Navigation */}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault()
                          prevImage(venue.id)
                        }}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.preventDefault()
                          nextImage(venue.id)
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>

                      {/* Image Indicators */}
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {venue.images.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentIndex ? "bg-white" : "bg-white/50"
                            }`}
                            onClick={(e) => {
                              e.preventDefault()
                              setCurrentImageIndex((prev) => ({
                                ...prev,
                                [venue.id]: index,
                              }))
                            }}
                          />
                        ))}
                      </div>

                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white text-gray-900">From £{venue.priceFrom}/hr</Badge>
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary" className="bg-secondary-100 text-secondary-800">
                          {venue.type}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg text-slate-800">{venue.name}</CardTitle>
                          <CardDescription className="flex items-center mt-1 text-slate-600">
                            <MapPin className="w-4 h-4 mr-1" />
                            {venue.location}
                          </CardDescription>
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">{venue.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({venue.reviews})</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-1" />
                          Up to {venue.capacity} people
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-2">Available Spaces:</p>
                          <div className="flex flex-wrap gap-1">
                            {venue.spaces.slice(0, 2).map((space) => (
                              <Badge key={space} variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                                {space}
                              </Badge>
                            ))}
                            {venue.spaces.length > 2 && (
                              <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                                +{venue.spaces.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-gray-600 mb-2">Amenities:</p>
                          <div className="flex items-center gap-3">
                            {venue.amenities.includes("Wi-Fi") && <Wifi className="w-4 h-4 text-gray-500" />}
                            {venue.amenities.includes("Parking") && <Car className="w-4 h-4 text-gray-500" />}
                            {venue.amenities.includes("Accessible") && (
                              <Accessibility className="w-4 h-4 text-gray-500" />
                            )}
                            {venue.amenities.length > 3 && (
                              <span className="text-xs text-gray-500">+{venue.amenities.length - 3} more</span>
                            )}
                          </div>
                        </div>

                        <Link href={`/venue/${venue.id}`}>
                          <Button className="w-full mt-4 bg-primary-500 hover:bg-primary-600 text-white">
                            View Details & Book
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {filteredVenues.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No venues found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms to find more venues.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedType("all")
                    setSelectedAmenities([])
                    setPriceRange([0, 200])
                    setCapacityRange([0, 200])
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      <AdminLoginModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
    </div>
  )
}
