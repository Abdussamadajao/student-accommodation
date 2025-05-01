"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  room: any;
  hostel: any;
  duration: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  room,
  hostel,
  duration,
}: ConfirmationModalProps) {
  const details = [
    { label: "Hostel", value: hostel?.name },
    { label: "Room Number", value: room?.id },
    {
      label: "Room Type",
      value:
        room?.type === "1-person"
          ? "Single"
          : room?.type === "2-person"
          ? "Double"
          : "Quad",
    },
    { label: "Dimensions", value: room?.dimensions },
    {
      label: "Duration",
      value: duration === "full_year" ? "Full Year" : "One Semester",
    },
    { label: "Price", value: `₦${room?.price.toLocaleString()}` },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Room Selection</DialogTitle>
          <DialogDescription>
            Please review your room selection before proceeding
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-green-50 p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-green-800">Room Selected</h3>
                <p className="text-sm text-green-700">
                  Your room has been reserved for 15 minutes
                </p>
              </div>
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>

          <div className="space-y-3">
            {details.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {item.label}:
                </span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              By confirming, you agree to the terms and conditions of Alhikmah
              University Housing.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Go Back
              </Button>
              <Button
                onClick={onConfirm}
                className="bg-[#006400] hover:bg-[#004d00]">
                Confirm Selection
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
