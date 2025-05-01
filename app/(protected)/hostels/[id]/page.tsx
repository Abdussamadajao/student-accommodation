"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Bed, Check, Info, MapPin, Maximize2, Minimize2, Users } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RoomFloorPlan } from "@/components/room-floor-plan"

// Import the hostels data
import { hostels } from "@/data/hostels"

export default function HostelDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [hostel, setHostel] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [isFloorPlanExpanded, setIsFloorPlanExpanded] = useState(false)
  const [filter, setFilter] = useState({
    roomType: "all",
    availability: "all",
    priceRange: "all",
    floor: "all",
  })
  const [requestData, setRequestData] = useState({
    hostelId: "",
    roomId: "",
    roomType: "",
    duration: "full_year",
  })

  useEffect(() => {
    // Find the hostel with the matching ID
    const foundHostel = hostels.find((h) => h.id === params.id)
    if (foundHostel) {
      setHostel(foundHostel)
      setRequestData((prev) => ({
        ...prev,
        hostelId: foundHostel.id,
      }))
    } else {
      // Redirect to hostels page if hostel not found
      router.push("/hostels")
    }
  }, [params.id, router])

  const handleViewRoom = (room) => {
    setSelectedRoom(room)
    setIsRoomDialogOpen(true)
    setIsFloorPlanExpanded(false)
    setRequestData((prev) => ({
      ...prev,
      roomId: room.id,
      roomType: room.type,
    }))
  }

  const handleSelectRoom = () => {
    setIsRoomDialogOpen(false)
    setIsConfirmationOpen(true)
  }

  const handleRequestHostel = () => {
    // Store request in localStorage
    const requests = JSON.parse(localStorage.getItem("accommodationRequests") || "[]")
    const newRequest = {
      id: Date.now().toString(),
      hostelId: hostel.id,
      hostelName: hostel.name,
      roomId: selectedRoom?.id || "",
      roomType: selectedRoom?.type || "",
      duration: requestData.duration,
      price: selectedRoom?.price || hostel.price,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    requests.push(newRequest)
    localStorage.setItem("accommodationRequests", JSON.stringify(requests))

    // Close dialog and redirect to dashboard
    setIsConfirmationOpen(false)
    router.push("/dashboard")
  }

  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }))
  }

  const toggleFloorPlanSize = () => {
    setIsFloorPlanExpanded(!isFloorPlanExpanded)
  }

  // Get unique floor values for filter
  const getUniqueFloors = () => {
    if (!hostel) return []
    const floors = new Set(hostel.rooms.map((room) => room.floor))
    return Array.from(floors)
  }

  // Filter rooms based on selected filters
  const filteredRooms = hostel
    ? hostel.rooms.filter((room) => {
        // Filter by room type
        if (filter.roomType !== "all" && room.type !== filter.roomType) {
          return false
        }

        // Filter by availability
        if (filter.availability !== "all") {
          if (filter.availability === "available" && !room.available) {
            return false
          } else if (filter.availability === "occupied" && room.available) {
            return false
          }
        }

        // Filter by price range
        if (filter.priceRange !== "all") {
          if (filter.priceRange === "below_100k" && room.price >= 100000) {
            return false
          } else if (filter.priceRange === "above_100k" && room.price < 100000) {
            return false
          }
        }

        // Filter by floor
        if (filter.floor !== "all" && room.floor !== filter.floor) {
          return false
        }

        return true
      })
    : []

  // Group rooms by type for display
  const roomsByType = filteredRooms.reduce((acc, room) => {
    if (!acc[room.type]) acc[room.type] = []
    acc[room.type].push(room)
    return acc
  }, {})

  if (!hostel) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading hostel details...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-[#006400] px-4 py-3 text-white">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Alhikmah University Housing</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user?.name}</span>
            <Link href="/dashboard">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#006400]">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/hostels")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Hostels
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{hostel.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{hostel.location}</span>
            <Badge className="ml-2">
              {hostel.type === "male" ? "Male Only" : hostel.type === "female" ? "Female Only" : "Mixed"}
            </Badge>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-0">
                <div className="relative h-48 w-full">
                  <Image src={hostel.image || "/placeholder.svg"} alt={hostel.name} fill className="object-cover" />
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-medium">Description</h3>
                    <p className="text-sm text-muted-foreground">{hostel.description}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Price Range</h3>
                    <p className="text-sm">
                      ₦{Math.min(...hostel.rooms.map((r) => r.price)).toLocaleString()} - ₦
                      {Math.max(...hostel.rooms.map((r) => r.price)).toLocaleString()} per year
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Capacity</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>
                        {hostel.capacity} total beds ({hostel.available} available)
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">Features</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {hostel.features.map((feature, index) => (
                        <span key={index} className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 rounded-lg border p-6">
              <h3 className="mb-4 font-medium">Filter Rooms</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="room-type-filter">Room Type</Label>
                  <Select
                    defaultValue="all"
                    value={filter.roomType}
                    onValueChange={(value) => handleFilterChange("roomType", value)}
                  >
                    <SelectTrigger id="room-type-filter">
                      <SelectValue placeholder="All Room Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Room Types</SelectItem>
                      <SelectItem value="1-person">Single Room (1-person)</SelectItem>
                      <SelectItem value="2-person">Double Room (2-person)</SelectItem>
                      <SelectItem value="4-person">Quad Room (4-person)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability-filter">Availability</Label>
                  <Select
                    defaultValue="all"
                    value={filter.availability}
                    onValueChange={(value) => handleFilterChange("availability", value)}
                  >
                    <SelectTrigger id="availability-filter">
                      <SelectValue placeholder="All Rooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rooms</SelectItem>
                      <SelectItem value="available">Available Only</SelectItem>
                      <SelectItem value="occupied">Occupied Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price-filter">Price Range</Label>
                  <Select
                    defaultValue="all"
                    value={filter.priceRange}
                    onValueChange={(value) => handleFilterChange("priceRange", value)}
                  >
                    <SelectTrigger id="price-filter">
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="below_100k">Below ₦100,000</SelectItem>
                      <SelectItem value="above_100k">Above ₦100,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floor-filter">Floor</Label>
                  <Select
                    defaultValue="all"
                    value={filter.floor}
                    onValueChange={(value) => handleFilterChange("floor", value)}
                  >
                    <SelectTrigger id="floor-filter">
                      <SelectValue placeholder="All Floors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Floors</SelectItem>
                      {getUniqueFloors().map((floor) => (
                        <SelectItem key={floor} value={floor}>
                          {floor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  onClick={() =>
                    setFilter({
                      roomType: "all",
                      availability: "all",
                      priceRange: "all",
                      floor: "all",
                    })
                  }
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold">Available Rooms</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-800">
                  <Bed className="mr-1 h-3 w-3" />
                  {filteredRooms.filter((r) => r.available).length} Available
                </Badge>
              </div>
            </div>

            {filteredRooms.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <h3 className="mb-1 text-lg font-medium">No rooms found</h3>
                <p className="mb-4 text-sm text-muted-foreground">No rooms match your current filter criteria.</p>
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilter({
                      roomType: "all",
                      availability: "all",
                      priceRange: "all",
                      floor: "all",
                    })
                  }
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(roomsByType).map(([type, rooms]) => (
                  <div key={type} className="rounded-lg border">
                    <div className="bg-muted/50 px-6 py-3 font-medium">
                      {type === "1-person"
                        ? "Single Room"
                        : type === "2-person"
                          ? "Double Room"
                          : type === "4-person"
                            ? "Quad Room"
                            : type}{" "}
                      ({rooms.length})
                    </div>
                    <div className="p-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        {/* Room type description and sample floor plan */}
                        <div className="rounded-lg border p-4">
                          <h3 className="mb-2 font-medium">Room Layout</h3>
                          <div className="h-48">
                            <RoomFloorPlan roomType={type} dimensions={rooms[0].dimensions} expanded={false} />
                          </div>
                          <div className="mt-4 text-sm text-muted-foreground">
                            <p>
                              <span className="font-medium">Typical Size:</span> {rooms[0].dimensions}
                            </p>
                            <p className="mt-1">
                              <span className="font-medium">Amenities:</span>{" "}
                              {rooms[0].amenities.slice(0, 4).join(", ")}
                              {rooms[0].amenities.length > 4 && "..."}
                            </p>
                          </div>
                        </div>

                        {/* Room list */}
                        <div className="rounded-lg border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Room</TableHead>
                                <TableHead>Floor</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {rooms.slice(0, 4).map((room) => (
                                <TableRow key={room.id} className={room.available ? "" : "opacity-60"}>
                                  <TableCell className="font-medium">{room.id}</TableCell>
                                  <TableCell>{room.floor}</TableCell>
                                  <TableCell>₦{room.price.toLocaleString()}</TableCell>
                                  <TableCell>
                                    <span
                                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                        room.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {room.available ? "Available" : "Occupied"}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <Button
                                      size="sm"
                                      onClick={() => handleViewRoom(room)}
                                      disabled={!room.available}
                                      className={`${
                                        room.available
                                          ? "bg-[#006400] hover:bg-[#004d00]"
                                          : "bg-muted text-muted-foreground"
                                      }`}
                                    >
                                      {room.available ? "Select Room" : "Unavailable"}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                          {rooms.length > 4 && (
                            <div className="flex justify-center p-2">
                              <Button variant="link" onClick={() => setFilter({ ...filter, roomType: type })}>
                                View all {rooms.length} rooms
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Full room list when filtered to a specific type */}
                {filter.roomType !== "all" && (
                  <div className="rounded-lg border">
                    <div className="bg-muted/50 px-6 py-3 font-medium">All {filter.roomType} Rooms</div>
                    <div className="overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Room</TableHead>
                            <TableHead>Floor</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Orientation</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredRooms.map((room) => (
                            <TableRow key={room.id} className={room.available ? "" : "opacity-60"}>
                              <TableCell className="font-medium">{room.id}</TableCell>
                              <TableCell>{room.floor}</TableCell>
                              <TableCell>₦{room.price.toLocaleString()}</TableCell>
                              <TableCell>{room.orientation}</TableCell>
                              <TableCell>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    room.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {room.available ? "Available" : "Occupied"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  onClick={() => handleViewRoom(room)}
                                  disabled={!room.available}
                                  className={`${
                                    room.available
                                      ? "bg-[#006400] hover:bg-[#004d00]"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {room.available ? "Select Room" : "Unavailable"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedRoom && (
        <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                Room {selectedRoom.id}
                <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">
                  Available
                </Badge>
              </DialogTitle>
              <DialogDescription>{hostel?.name}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="rounded-lg border p-4">
                <div className="mb-4 grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-medium">Room Details</h3>
                    <p className="text-sm text-muted-foreground">{selectedRoom.description}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Type:</span>{" "}
                        {selectedRoom.type === "1-person"
                          ? "Single Room"
                          : selectedRoom.type === "2-person"
                            ? "Double Room"
                            : "Quad Room"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Floor:</span> {selectedRoom.floor}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Price:</span> ₦{selectedRoom.price.toLocaleString()} per year
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Dimensions:</span> {selectedRoom.dimensions}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Orientation:</span> {selectedRoom.orientation}
                      </p>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-medium">Amenities</h3>
                      <ul className="mt-2 space-y-1 text-sm">
                        {selectedRoom.amenities.map((amenity, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="h-4 w-4 text-green-600" />
                            {amenity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Floor Plan</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleFloorPlanSize}>
                              {isFloorPlanExpanded ? (
                                <Minimize2 className="h-4 w-4" />
                              ) : (
                                <Maximize2 className="h-4 w-4" />
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isFloorPlanExpanded ? "Minimize" : "Maximize"} floor plan</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div
                      className={`mt-2 rounded-md border p-2 ${
                        isFloorPlanExpanded ? "fixed inset-10 z-50 bg-white p-4" : ""
                      }`}
                    >
                      <RoomFloorPlan
                        roomType={selectedRoom.type}
                        dimensions={selectedRoom.dimensions}
                        expanded={isFloorPlanExpanded}
                      />
                    </div>
                    {isFloorPlanExpanded && (
                      <div className="fixed bottom-4 right-4 z-50">
                        <Button onClick={toggleFloorPlanSize} className="bg-[#006400] hover:bg-[#004d00]">
                          Close Floor Plan
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div className="rounded-lg bg-green-50 p-4 border border-green-100">
                    <h3 className="font-medium text-green-800 flex items-center gap-2">
                      <Check className="h-5 w-5" />
                      Room Selection
                    </h3>
                    <p className="text-sm text-green-700 mt-1">
                      You are about to select Room {selectedRoom.id} in {hostel?.name}.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select
                      defaultValue="full_year"
                      onValueChange={(value) => setRequestData((prev) => ({ ...prev, duration: value }))}
                    >
                      <SelectTrigger id="duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semester">One Semester</SelectItem>
                        <SelectItem value="full_year">Full Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">Important Information</p>
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <li>• Payment is required to confirm your accommodation</li>
                      <li>• Room allocation is on a first-come, first-served basis</li>
                      <li>• University rules and regulations apply to all residents</li>
                      <li>• Cancellation policy applies as per university guidelines</li>
                    </ul>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsRoomDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSelectRoom} className="bg-[#006400] hover:bg-[#004d00]">
                      Select This Room
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Room Selection</DialogTitle>
            <DialogDescription>Please review your room selection before proceeding</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-green-800">Room Selected</h3>
                  <p className="text-sm text-green-700">Your room has been reserved for 15 minutes</p>
                </div>
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Hostel:</span>
                <span className="font-medium">{hostel?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Room Number:</span>
                <span className="font-medium">{selectedRoom?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Room Type:</span>
                <span className="font-medium">
                  {selectedRoom?.type === "1-person"
                    ? "Single Room"
                    : selectedRoom?.type === "2-person"
                      ? "Double Room"
                      : "Quad Room"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Dimensions:</span>
                <span className="font-medium">{selectedRoom?.dimensions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Duration:</span>
                <span className="font-medium">
                  {requestData.duration === "full_year" ? "Full Year" : "One Semester"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Price:</span>
                <span className="font-medium">₦{selectedRoom?.price.toLocaleString()}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                By confirming, you agree to the terms and conditions of Alhikmah University Housing.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsConfirmationOpen(false)}>
                  Go Back
                </Button>
                <Button onClick={handleRequestHostel} className="bg-[#006400] hover:bg-[#004d00]">
                  Confirm Selection
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
