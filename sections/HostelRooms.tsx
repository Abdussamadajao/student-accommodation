"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bed,
  Check,
  Info,
  MapPin,
  Maximize2,
  Minimize2,
  Users,
} from "lucide-react";

import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RoomFloorPlan } from "@/components/room-floor-plan";

// Import the hostels data
import { hostels } from "@/data/hostels";
import { ConfirmationModal, RoomDetailsModal } from "@/sections";

interface Hostel {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  price: number;
  capacity: number;
  available: number;
  features: string[];
  image: string;
  rooms: {
    id: string;
    type: string;
    floor: string;
    price: number;
    available: boolean;
    dimensions: string;
    amenities: string[];
    orientation: string;
  }[];
}

export default function HostelDetailsPage({ id }: { id: string }) {
  const router = useRouter();
  const { user } = useAuth();

  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Hostel["rooms"][0] | null>(
    null
  );
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isFloorPlanExpanded, setIsFloorPlanExpanded] = useState(false);
  const [filter, setFilter] = useState({
    roomType: "all",
    availability: "all",
    priceRange: "all",
    floor: "all",
  });
  const [requestData, setRequestData] = useState({
    hostelId: "",
    roomId: "",
    roomType: "",
    duration: "full_year",
  });

  useEffect(() => {
    const foundHostel = hostels.find((h) => h.id === id);
    if (foundHostel) {
      setHostel(foundHostel);
      setRequestData((prev) => ({
        ...prev,
        hostelId: foundHostel.id,
      }));
    } else {
      router.push("/hostels");
    }
  }, [id, router]);

  const handleViewRoom = (room: Hostel["rooms"][0]) => {
    setSelectedRoom(room);
    setIsRoomDialogOpen(true);
    setIsFloorPlanExpanded(false);
    setRequestData((prev) => ({
      ...prev,
      roomId: room.id,
      roomType: room.type,
    }));
  };

  const handleSelectRoom = () => {
    setIsRoomDialogOpen(false);
    setIsConfirmationOpen(true);
  };

  const handleRequestHostel = () => {
    // Store request in localStorage
    const requests = JSON.parse(
      localStorage.getItem("accommodationRequests") || "[]"
    );
    const newRequest = {
      id: Date.now().toString(),
      hostelId: hostel?.id,
      hostelName: hostel?.name,
      roomId: selectedRoom?.id || "",
      roomType: selectedRoom?.type || "",
      duration: requestData.duration,
      price: selectedRoom?.price || hostel?.price,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    requests.push(newRequest);
    localStorage.setItem("accommodationRequests", JSON.stringify(requests));

    // Close dialog and redirect to dashboard
    setIsConfirmationOpen(false);
    router.push("/dashboard");
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFloorPlanSize = () => {
    setIsFloorPlanExpanded(!isFloorPlanExpanded);
  };

  // Get unique floor values for filter
  const getUniqueFloors = () => {
    if (!hostel) return [];
    const floors = new Set(hostel.rooms.map((room) => room.floor));
    return Array.from(floors);
  };

  // Filter rooms based on selected filters
  const filteredRooms = hostel
    ? hostel.rooms.filter((room) => {
        // Filter by room type
        if (filter.roomType !== "all" && room.type !== filter.roomType) {
          return false;
        }

        // Filter by availability
        if (filter.availability !== "all") {
          if (filter.availability === "available" && !room.available) {
            return false;
          } else if (filter.availability === "occupied" && room.available) {
            return false;
          }
        }

        // Filter by price range
        if (filter.priceRange !== "all") {
          if (filter.priceRange === "below_100k" && room.price >= 100000) {
            return false;
          } else if (
            filter.priceRange === "above_100k" &&
            room.price < 100000
          ) {
            return false;
          }
        }

        // Filter by floor
        if (filter.floor !== "all" && room.floor !== filter.floor) {
          return false;
        }

        return true;
      })
    : [];

  // Group rooms by type for display
  const roomsByType = filteredRooms.reduce<Record<string, Hostel["rooms"]>>(
    (acc, room) => {
      if (!acc[room.type]) acc[room.type] = [];
      acc[room.type].push(room);
      return acc;
    },
    {}
  );

  if (!hostel) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading hostel details...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="bg-[#006400] px-4 py-3 text-white">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Alhikmah University Housing</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user?.name}</span>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#006400]">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="">
        {/* Page Header */}
        <div className="mb-6 space-y-2 md:mb-8">
          <Button
            variant="outline"
            onClick={() => router.push("/hostels")}
            className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Hostels
          </Button>

          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {hostel.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span>{hostel.location}</span>
              <Badge className="ml-0 sm:ml-2">
                {hostel.type === "male"
                  ? "Male Only"
                  : hostel.type === "female"
                  ? "Female Only"
                  : "Mixed"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column - Hostel Info & Filters */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="overflow-hidden">
              <div className="relative aspect-video">
                <Image
                  src={hostel.image || "/placeholder.svg"}
                  alt={hostel.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <CardContent className="p-4 md:p-6 space-y-4">
                <div>
                  <h3 className="font-medium">Description</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {hostel.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Price Range</h3>
                    <p className="text-sm">
                      ₦
                      {Math.min(
                        ...hostel.rooms.map((r) => r.price)
                      ).toLocaleString()}{" "}
                      - ₦
                      {Math.max(
                        ...hostel.rooms.map((r) => r.price)
                      ).toLocaleString()}
                      <span className="text-muted-foreground">/year</span>
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium">Capacity</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {hostel.available} of {hostel.capacity} available
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium">Features</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {hostel.features.map((feature: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs font-medium">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filters */}
            <Card>
              <CardContent className="p-4 md:p-6 space-y-4">
                <h3 className="font-medium">Filter Rooms</h3>

                <div className="space-y-4">
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
                        <SelectItem value="1-person">Single Room</SelectItem>
                        <SelectItem value="2-person">Double Room</SelectItem>
                        <SelectItem value="4-person">Quad Room</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability-filter">Availability</Label>
                    <Select
                      value={filter.availability}
                      onValueChange={(v) =>
                        handleFilterChange("availability", v)
                      }>
                      <SelectTrigger id="availability-filter">
                        <SelectValue placeholder="All Rooms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Rooms</SelectItem>
                        <SelectItem value="available">
                          Available Only
                        </SelectItem>
                        <SelectItem value="occupied">Occupied Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price-filter">Price Range</Label>
                    <Select
                      value={filter.priceRange}
                      onValueChange={(v) =>
                        handleFilterChange("priceRange", v)
                      }>
                      <SelectTrigger id="price-filter">
                        <SelectValue placeholder="All Prices" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Prices</SelectItem>
                        <SelectItem value="below_100k">
                          Below ₦100,000
                        </SelectItem>
                        <SelectItem value="above_100k">
                          Above ₦100,000
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="floor-filter">Floor</Label>
                    <Select
                      value={filter.floor}
                      onValueChange={(v) => handleFilterChange("floor", v)}>
                      <SelectTrigger id="floor-filter">
                        <SelectValue placeholder="All Floors" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Floors</SelectItem>
                        {getUniqueFloors().map((floor) => (
                          <SelectItem key={floor} value={floor}>
                            Floor {floor}
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
                    className="w-full">
                    Reset Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Rooms List */}
          <div className="lg:col-span-7">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-xl font-bold md:text-2xl">Available Rooms</h2>
              <Badge variant="outline" className="bg-green-50 text-green-800">
                <Bed className="mr-1 h-3 w-3" />
                {filteredRooms.filter((r) => r.available).length} Available
              </Badge>
            </div>

            {filteredRooms.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <h3 className="mb-2 text-lg font-medium md:text-xl">
                    No rooms found
                  </h3>
                  <p className="mb-4 text-muted-foreground md:text-base">
                    No rooms match your current filter criteria.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilter({
                        roomType: "all",
                        availability: "all",
                        priceRange: "all",
                        floor: "all",
                      })
                    }>
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {Object.entries(roomsByType).map(([type, rooms]) => (
                  <Card key={type}>
                    <CardContent className="p-0">
                      <div className="bg-muted/50 px-4 py-3 font-medium md:px-6">
                        {type === "1-person"
                          ? "Single Room"
                          : type === "2-person"
                          ? "Double Room"
                          : "Quad Room"}{" "}
                        ({rooms.length})
                      </div>

                      <div className="p-4 md:p-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          {/* Room Layout */}
                          <Card className="overflow-hidden">
                            <CardContent className="p-4 space-y-4">
                              <h3 className="font-medium">Room Layout</h3>
                              <div className="h-48">
                                <RoomFloorPlan
                                  roomType={type}
                                  dimensions={rooms[0].dimensions}
                                  expanded={false}
                                />
                              </div>
                              <div className="text-sm space-y-1">
                                <p>
                                  <span className="font-medium">Size:</span>{" "}
                                  {rooms[0].dimensions}
                                </p>
                                <p>
                                  <span className="font-medium">
                                    Amenities:
                                  </span>{" "}
                                  {rooms[0].amenities.slice(0, 3).join(", ")}
                                  {rooms[0].amenities.length > 3 && "..."}
                                </p>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Rooms Table */}
                          <div className="overflow-hidden rounded-lg border">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Room</TableHead>
                                  <TableHead>Floor</TableHead>
                                  <TableHead>Price</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="text-right">
                                    Action
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {rooms.slice(0, 3).map((room) => (
                                  <TableRow
                                    key={room.id}
                                    className={
                                      !room.available ? "opacity-60" : ""
                                    }>
                                    <TableCell className="font-medium">
                                      {room.id}
                                    </TableCell>
                                    <TableCell>{room.floor}</TableCell>
                                    <TableCell>
                                      ₦{room.price.toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                      <Badge
                                        variant={
                                          room.available
                                            ? "secondary"
                                            : "destructive"
                                        }
                                        className="text-xs">
                                        {room.available
                                          ? "Available"
                                          : "Occupied"}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <Button
                                        size="sm"
                                        onClick={() => handleViewRoom(room)}
                                        disabled={!room.available}
                                        className={`${
                                          room.available
                                            ? "bg-[#006400] hover:bg-[#004d00]"
                                            : "bg-muted text-muted-foreground"
                                        }`}>
                                        {room.available
                                          ? "Select"
                                          : "Unavailable"}
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                            {rooms.length > 3 && (
                              <div className="flex justify-center p-2 border-t">
                                <Button
                                  variant="link"
                                  onClick={() =>
                                    setFilter({ ...filter, roomType: type })
                                  }
                                  className="text-sm">
                                  View all {rooms.length} rooms
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Full room list when filtered to a specific type */}
                {filter.roomType !== "all" && (
                  <Card>
                    <CardContent className="p-0">
                      <div className="bg-muted/50 px-4 py-3 font-medium md:px-6">
                        All{" "}
                        {filter.roomType === "1-person"
                          ? "Single"
                          : filter.roomType === "2-person"
                          ? "Double"
                          : "Quad"}{" "}
                        Rooms
                      </div>
                      <div className="overflow-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Room</TableHead>
                              <TableHead>Floor</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Orientation</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">
                                Action
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredRooms.map((room) => (
                              <TableRow
                                key={room.id}
                                className={!room.available ? "opacity-60" : ""}>
                                <TableCell className="font-medium">
                                  {room.id}
                                </TableCell>
                                <TableCell>{room.floor}</TableCell>
                                <TableCell>
                                  ₦{room.price.toLocaleString()}
                                </TableCell>
                                <TableCell>{room.orientation}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      room.available
                                        ? "secondary"
                                        : "destructive"
                                    }
                                    className="text-xs">
                                    {room.available ? "Available" : "Occupied"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="sm"
                                    onClick={() => handleViewRoom(room)}
                                    disabled={!room.available}
                                    className={`${
                                      room.available
                                        ? "bg-[#006400] hover:bg-[#004d00]"
                                        : "bg-muted text-muted-foreground"
                                    }`}>
                                    {room.available ? "Select" : "Unavailable"}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <RoomDetailsModal
        isOpen={isRoomDialogOpen}
        onClose={() => setIsRoomDialogOpen(false)}
        onSelect={handleSelectRoom}
        room={selectedRoom}
        hostel={hostel}
        duration={requestData.duration}
        onDurationChange={(value) =>
          setRequestData((prev) => ({ ...prev, duration: value }))
        }
        isFloorPlanExpanded={isFloorPlanExpanded}
        onToggleFloorPlan={toggleFloorPlanSize}
      />

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleRequestHostel}
        room={selectedRoom}
        hostel={hostel}
        duration={requestData.duration}
      />
    </div>
  );
}
