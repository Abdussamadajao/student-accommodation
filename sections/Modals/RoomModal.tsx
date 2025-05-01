"use client";

import { Check, Info, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RoomFloorPlan } from "@/components/room-floor-plan";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RoomDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: () => void;
  room: any;
  hostel: any;
  duration: string;
  onDurationChange: (value: string) => void;
  isFloorPlanExpanded: boolean;
  onToggleFloorPlan: () => void;
}

export function RoomDetailsModal({
  isOpen,
  onClose,
  onSelect,
  room,
  hostel,
  duration,
  onDurationChange,
  isFloorPlanExpanded,
  onToggleFloorPlan,
}: RoomDetailsModalProps) {
  const calculatedPrice = room?.price
    ? duration === "semester"
      ? room.price / 2
      : room.price
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-full h-[90dvh] md:h-[80vh] overflow-y-auto p-0 sm:rounded-lg">
        {/* Sticky Header */}
        <DialogHeader className="sticky top-0 bg-background z-10 p-3 md:p-4 border-b">
          <div className="flex flex-wrap items-center gap-2">
            <DialogTitle className="text-base md:text-lg">
              Room {room?.id}
            </DialogTitle>
            <Badge variant="secondary" className="text-xs md:text-sm">
              Available
            </Badge>
          </div>
          <DialogDescription className="text-xs md:text-sm">
            {hostel?.name}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="p-3 md:p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {/* Left Column - Room Details */}
            <div className="space-y-3 md:space-y-4">
              <section>
                <h3 className="font-medium text-sm md:text-base">
                  Room Details
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  {room?.description}
                </p>
              </section>

              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <DetailItem
                  label="Type"
                  value={
                    room?.type === "1-person"
                      ? "Single"
                      : room?.type === "2-person"
                      ? "Double"
                      : "Quad"
                  }
                />
                <DetailItem label="Floor" value={room?.floor} />
                <DetailItem
                  label="Price"
                  value={`₦${calculatedPrice.toLocaleString()}/${
                    duration === "semester" ? "semester" : "year"
                  }`}
                />
                <DetailItem label="Dimensions" value={room?.dimensions} />
              </div>

              <section className="space-y-2">
                <h3 className="font-medium text-sm md:text-base">Amenities</h3>
                <ul className="space-y-1.5">
                  {room?.amenities.map((amenity: string, index: number) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-xs md:text-sm">
                      <Check className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600 flex-shrink-0" />
                      <span className="leading-tight">{amenity}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Right Column - Floor Plan (Hidden on mobile) */}
            <div className="hidden md:block space-y-3 md:space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm md:text-base">Floor Plan</h3>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={onToggleFloorPlan}
                      aria-label={
                        isFloorPlanExpanded
                          ? "Minimize floor plan"
                          : "Maximize floor plan"
                      }>
                      {isFloorPlanExpanded ? (
                        <Minimize2 className="h-4 w-4" />
                      ) : (
                        <Maximize2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    {isFloorPlanExpanded ? "Minimize" : "Maximize"}
                  </TooltipContent>
                </Tooltip>
              </div>

              <div
                className={cn(
                  "relative rounded-md border bg-white",
                  isFloorPlanExpanded ? "fixed inset-0 z-50 m-0" : "h-64"
                )}>
                <RoomFloorPlan
                  roomType={room?.type}
                  dimensions={room?.dimensions}
                  expanded={isFloorPlanExpanded}
                />
                {isFloorPlanExpanded && (
                  <div className="absolute top-4 right-4">
                    <Button
                      onClick={onToggleFloorPlan}
                      size="sm"
                      className="bg-[#006400] hover:bg-[#004d00] shadow-md">
                      Close Fullscreen
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-3 md:my-4" />

          {/* Action Section */}
          <div className="space-y-3 md:space-y-4">
            <div className="rounded-lg bg-green-50 p-3 md:p-4 border border-green-100">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                <h3 className="font-medium text-green-800 text-sm md:text-base">
                  Room Selection
                </h3>
              </div>
              <p className="text-green-700 mt-1 text-xs md:text-sm">
                You are about to select Room {room?.id} in {hostel?.name}.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs md:text-sm" htmlFor="duration">
                Duration
              </Label>
              <Select value={duration} onValueChange={onDurationChange}>
                <SelectTrigger id="duration" className="w-full">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semester" className="text-xs md:text-sm">
                    One Semester
                  </SelectItem>
                  <SelectItem value="full_year" className="text-xs md:text-sm">
                    Full Year
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-lg bg-muted p-3 md:p-4">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium text-xs md:text-sm">
                  Important Information
                </p>
              </div>
              <ul className="mt-1.5 space-y-1.5 text-xs md:text-sm text-muted-foreground">
                <li>• Payment is required to confirm your accommodation</li>
                <li>• Room allocation is first-come, first-served</li>
                <li>• University rules apply to all residents</li>
              </ul>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button
                onClick={onSelect}
                className="w-full sm:w-auto bg-[#006400] hover:bg-[#004d00]">
                Select This Room
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs md:text-sm font-medium text-muted-foreground">
        {label}
      </p>
      <p className="text-xs md:text-sm">{value}</p>
    </div>
  );
}
