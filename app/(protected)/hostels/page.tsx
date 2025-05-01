"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bed, MapPin, Filter } from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { hostels } from "@/data/hostels";
import { Badge } from "@/components/ui/badge";

export default function HostelsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [filter, setFilter] = useState({
    type: "all",
    priceRange: "all",
    roomType: "all",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const filteredHostels = hostels.filter((hostel) => {
    const matchesType = filter.type === "all" || hostel.type === filter.type;
    const matchesRoomType =
      filter.roomType === "all" ||
      hostel.rooms.some((room) => room.type === filter.roomType);

    const minPrice = Math.min(...hostel.rooms.map((r) => r.price));
    const matchesPrice =
      filter.priceRange === "all" ||
      (filter.priceRange === "below_100k" && minPrice < 100000) ||
      (filter.priceRange === "above_100k" && minPrice >= 100000);

    return matchesType && matchesPrice && matchesRoomType;
  });

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="bg-[#006400] px-4 py-3 text-white">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-bold sm:text-xl md:text-2xl">
            Alhikmah University Housing
          </h1>
          <div className="flex items-center gap-2">
            <span className="truncate max-w-[120px] sm:max-w-none text-sm">
              {user?.name}
            </span>
            <Link href="/dashboard" className="flex-shrink-0">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white/10 hover:text-white">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Page Header */}
        <div className="mb-6 space-y-2 md:mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Alhikmah University Hostels
          </h1>
          <p className="text-muted-foreground md:text-lg">
            Browse and select your preferred room in our university hostels
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex justify-end md:mb-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4" />
                Filter Options
              </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-lg md:text-xl">
                  Filter Hostels
                </SheetTitle>
                <SheetDescription className="md:text-sm">
                  Customize your hostel search
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                {/* Hostel Type Filter */}
                <div className="space-y-2">
                  <Label htmlFor="type-filter">Hostel Type</Label>
                  <Select
                    value={filter.type}
                    onValueChange={(v) => handleFilterChange("type", v)}>
                    <SelectTrigger id="type-filter">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-2">
                  <Label htmlFor="price-filter">Price Range</Label>
                  <Select
                    value={filter.priceRange}
                    onValueChange={(v) => handleFilterChange("priceRange", v)}>
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

                {/* Room Type Filter */}
                <div className="space-y-2">
                  <Label htmlFor="room-type-filter">Room Type</Label>
                  <Select
                    value={filter.roomType}
                    onValueChange={(v) => handleFilterChange("roomType", v)}>
                    <SelectTrigger id="room-type-filter">
                      <SelectValue placeholder="All Room Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Room Types</SelectItem>
                      <SelectItem value="1-person">
                        Single Room (1-person)
                      </SelectItem>
                      <SelectItem value="2-person">
                        Double Room (2-person)
                      </SelectItem>
                      <SelectItem value="4-person">
                        Quad Room (4-person)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reset Button */}
                <Button
                  variant="outline"
                  onClick={() =>
                    setFilter({
                      type: "all",
                      priceRange: "all",
                      roomType: "all",
                    })
                  }
                  className="w-full">
                  Reset Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Hostels Grid */}
        {filteredHostels.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mb-2 text-lg font-medium md:text-xl">
              No hostels found
            </h3>
            <p className="mb-4 text-muted-foreground md:text-base">
              No hostels match your current filter criteria.
            </p>
            <Button
              variant="outline"
              onClick={() =>
                setFilter({ type: "all", priceRange: "all", roomType: "all" })
              }>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredHostels.map((hostel) => (
              <Card key={hostel.id} className="flex flex-col overflow-hidden">
                {/* Image Section */}
                <div className="relative aspect-video">
                  <Image
                    src={hostel.image || "/placeholder.svg"}
                    alt={hostel.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <Badge
                    variant="secondary"
                    className="absolute right-2 top-2 bg-white/90 backdrop-blur-sm">
                    {hostel.type === "male"
                      ? "Male Only"
                      : hostel.type === "female"
                      ? "Female Only"
                      : "Mixed"}
                  </Badge>
                </div>

                {/* Card Content */}
                <CardHeader className="pb-3">
                  <CardTitle className="truncate text-lg md:text-xl">
                    {hostel.name}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{hostel.location}</span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 pb-4">
                  <div className="mb-4 space-y-2">
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {hostel.description}
                    </p>
                    <p className="text-lg font-bold md:text-xl">
                      From ₦
                      {Math.min(
                        ...hostel.rooms.map((r) => r.price)
                      ).toLocaleString()}
                      <span className="text-sm font-normal">/year</span>
                    </p>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {hostel.features.slice(0, 3).map((feature, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs font-medium">
                        {feature}
                      </Badge>
                    ))}
                    {hostel.features.length > 3 && (
                      <Badge variant="outline" className="text-xs font-medium">
                        +{hostel.features.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>

                {/* Card Footer */}
                <CardFooter className="flex flex-col gap-3 border-t bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <Bed className="h-4 w-4" />
                    <span>
                      {hostel.rooms.filter((r) => r.available).length} rooms
                      available
                    </span>
                  </div>
                  <Button
                    asChild
                    className="w-full bg-[#006400] hover:bg-[#004d00] sm:w-auto">
                    <Link href={`/hostels/${hostel.id}`}>View Rooms</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
