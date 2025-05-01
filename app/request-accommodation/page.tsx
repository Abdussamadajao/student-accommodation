"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export default function RequestAccommodationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState()
  const [formData, setFormData] = useState({
    accommodationType: "",
    roomType: "",
    mealPlan: "none",
    specialRequirements: "",
    moveInDate: null,
    duration: "",
    budget: "",
  })

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
    }
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRadioChange = (value) => {
    setFormData((prev) => ({ ...prev, mealPlan: value }))
  }

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate)
    setFormData((prev) => ({ ...prev, moveInDate: selectedDate }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Store request in localStorage for demo purposes
      const requests = JSON.parse(localStorage.getItem("accommodationRequests") || "[]")
      const newRequest = {
        id: Date.now().toString(),
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      requests.push(newRequest)
      localStorage.setItem("accommodationRequests", JSON.stringify(requests))

      setIsLoading(false)
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Request Accommodation</CardTitle>
          <CardDescription>Fill out this form to request student accommodation</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="accommodationType">Accommodation Type</Label>
                <Select onValueChange={(value) => handleSelectChange("accommodationType", value)} required>
                  <SelectTrigger id="accommodationType">
                    <SelectValue placeholder="Select accommodation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="university_hall">University Hall</SelectItem>
                    <SelectItem value="private_dorm">Private Dormitory</SelectItem>
                    <SelectItem value="shared_apartment">Shared Apartment</SelectItem>
                    <SelectItem value="studio">Studio Apartment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type</Label>
                <Select onValueChange={(value) => handleSelectChange("roomType", value)} required>
                  <SelectTrigger id="roomType">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Room</SelectItem>
                    <SelectItem value="double">Double Room (Shared)</SelectItem>
                    <SelectItem value="ensuite">En-suite Room</SelectItem>
                    <SelectItem value="studio">Studio Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Meal Plan</Label>
              <RadioGroup
                defaultValue="none"
                onValueChange={handleRadioChange}
                className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="meal-none" />
                  <Label htmlFor="meal-none">No Meal Plan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="breakfast" id="meal-breakfast" />
                  <Label htmlFor="meal-breakfast">Breakfast Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="half_board" id="meal-half" />
                  <Label htmlFor="meal-half">Half Board</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="full_board" id="meal-full" />
                  <Label htmlFor="meal-full">Full Board</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="moveInDate">Preferred Move-in Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? date.toDateString() : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateSelect}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration of Stay</Label>
                <Select onValueChange={(value) => handleSelectChange("duration", value)} required>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semester">One Semester</SelectItem>
                    <SelectItem value="academic_year">Academic Year</SelectItem>
                    <SelectItem value="summer">Summer Term</SelectItem>
                    <SelectItem value="full_year">Full Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Monthly Budget (in $)</Label>
              <Input
                id="budget"
                name="budget"
                type="number"
                placeholder="e.g., 800"
                required
                value={formData.budget}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="specialRequirements">Special Requirements</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Info className="h-4 w-4" />
                      <span className="sr-only">More info</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <p className="text-sm">
                      Please mention any accessibility needs, preferences, or other special requirements you may have.
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
              <Textarea
                id="specialRequirements"
                name="specialRequirements"
                placeholder="Any special requirements or preferences..."
                className="min-h-[100px]"
                value={formData.specialRequirements}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-1">
                  Processing <span className="animate-pulse">...</span>
                </span>
              ) : (
                "Submit Request"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
