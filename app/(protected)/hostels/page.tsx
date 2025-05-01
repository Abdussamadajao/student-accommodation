"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bed, MapPin } from "lucide-react"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter } from "lucide-react"

// Import the hostels data
import { hostels } from "@/data/hostels"

export default function HostelsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [filter, setFilter] = useState({
    type: "all",
    priceRange: "all",
    roomType: "all",
  })

  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }))
  }

  const filteredHostels = hostels.filter((hostel) => {
    // Filter by type
    if (filter.type !== "all" && hostel.type !== filter.type) {
      return false
    }

    // Filter by price range
    if (filter.priceRange !== "all") {
      if (filter.priceRange === "below_100k" && hostel.price >= 100000) {
        return false
      } else if (filter.priceRange === "above_100k" && hostel.price < 100000) {
        return false
      }
    }

    // Filter by room type
    if (filter.roomType !== "all") {
      const hasRoomType = hostel.rooms.some((room) => room.type === filter.roomType)
      if (!hasRoomType) {
        return false
      }
    }

    return true
  })

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
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Alhikmah University Hostels</h1>
          <p className="text-muted-foreground">Browse and select your preferred room in our university hostels</p>
        </div>

        <div className="mb-8 flex justify-end">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter Options
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Hostels</SheetTitle>
                <SheetDescription>Customize your hostel search</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="type-filter">Hostel Type</Label>
                  <Select defaultValue={filter.type} onValueChange={(value) => handleFilterChange("type", value)}>
                    <SelectTrigger id="type-filter">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="mixed">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price-filter">Price Range</Label>
                  <Select
                    defaultValue={filter.priceRange}
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
                  <Label htmlFor="room-type-filter">Room Type</Label>
                  <Select
                    defaultValue={filter.roomType}
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

                <Button
                  variant="outline"
                  onClick={() => setFilter({ type: "all", priceRange: "all", roomType: "all" })}
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {filteredHostels.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mb-1 text-lg font-medium">No hostels found</h3>
            <p className="mb-4 text-sm text-muted-foreground">No hostels match your current filter criteria.</p>
            <Button variant="outline" onClick={() => setFilter({ type: "all", priceRange: "all", roomType: "all" })}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredHostels.map((hostel) => (
              <Card key={hostel.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image src={hostel.image || "/placeholder.svg"} alt={hostel.name} fill className="object-cover" />
                  <div className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-xs font-medium">
                    {hostel.type === "male" ? "Male Only" : hostel.type === "female" ? "Female Only" : "Mixed"}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>{hostel.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {hostel.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 space-y-2">
                    <p className="text-sm">{hostel.description}</p>
                    <p className="text-lg font-bold">
                      From ₦{Math.min(...hostel.rooms.map((r) => r.price)).toLocaleString()} / year
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {hostel.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                        {feature}
                      </span>
                    ))}
                    {hostel.features.length > 3 && (
                      <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium">
                        +{hostel.features.length - 3} more
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                  <div className="flex items-center gap-1 text-sm">
                    <Bed className="h-4 w-4" />
                    <span>{hostel.rooms.filter((r) => r.available).length} rooms available</span>
                  </div>
                  <Button asChild className="bg-[#006400] hover:bg-[#004d00]">
                    <Link href={`/hostels/${hostel.id}`}>View Rooms</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
