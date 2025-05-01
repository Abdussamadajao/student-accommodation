"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Check, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit_card")
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const amount = searchParams.get("amount") || "80000"
  const accommodationId = searchParams.get("id") || "default"

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      // Store payment in localStorage for demo purposes
      const payments = JSON.parse(localStorage.getItem("payments") || "[]")
      const newPayment = {
        id: Date.now().toString(),
        amount,
        accommodationId,
        paymentMethod,
        status: "completed",
        date: new Date().toISOString(),
      }

      payments.push(newPayment)
      localStorage.setItem("payments", JSON.stringify(payments))

      // Update accommodation request status if applicable
      const requests = JSON.parse(localStorage.getItem("accommodationRequests") || "[]")
      const updatedRequests = requests.map((req) => {
        if (req.id === accommodationId) {
          return { ...req, status: "approved", paymentId: newPayment.id }
        }
        return req
      })
      localStorage.setItem("accommodationRequests", JSON.stringify(updatedRequests))

      setIsLoading(false)
      router.push("/payment/success")
    }, 2000)
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Payment</CardTitle>
          <CardDescription>Complete your payment for accommodation at Alhikmah University</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-muted p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Payment Summary</h3>
                  <p className="text-sm text-muted-foreground">Hostel Accommodation Fee</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">₦{Number(amount).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Due today</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup
                defaultValue="credit_card"
                onValueChange={setPaymentMethod}
                className="grid grid-cols-1 gap-4 md:grid-cols-3"
              >
                <div className="relative rounded-md border p-4 hover:bg-accent">
                  <RadioGroupItem
                    value="credit_card"
                    id="payment-credit-card"
                    className="absolute right-4 top-4 sr-only"
                  />
                  <Label htmlFor="payment-credit-card" className="flex cursor-pointer flex-col gap-2">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-medium">Credit Card</span>
                    <span className="text-xs text-muted-foreground">Visa, Mastercard, Verve</span>
                  </Label>
                  {paymentMethod === "credit_card" && <Check className="absolute right-4 top-4 h-5 w-5 text-primary" />}
                </div>

                <div className="relative rounded-md border p-4 hover:bg-accent">
                  <RadioGroupItem value="bank_transfer" id="payment-bank" className="absolute right-4 top-4 sr-only" />
                  <Label htmlFor="payment-bank" className="flex cursor-pointer flex-col gap-2">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-medium">Bank Transfer</span>
                    <span className="text-xs text-muted-foreground">Direct bank payment</span>
                  </Label>
                  {paymentMethod === "bank_transfer" && (
                    <Check className="absolute right-4 top-4 h-5 w-5 text-primary" />
                  )}
                </div>

                <div className="relative rounded-md border p-4 hover:bg-accent">
                  <RadioGroupItem value="ussd" id="payment-ussd" className="absolute right-4 top-4 sr-only" />
                  <Label htmlFor="payment-ussd" className="flex cursor-pointer flex-col gap-2">
                    <CreditCard className="h-5 w-5" />
                    <span className="font-medium">USSD</span>
                    <span className="text-xs text-muted-foreground">Pay with USSD code</span>
                  </Label>
                  {paymentMethod === "ussd" && <Check className="absolute right-4 top-4 h-5 w-5 text-primary" />}
                </div>
              </RadioGroup>
            </div>

            {paymentMethod === "credit_card" && (
              <div className="space-y-4">
                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    placeholder="Name as it appears on card"
                    required
                    value={formData.cardName}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    required
                    value={formData.cardNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/YY"
                      required
                      value={formData.expiryDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      type="password"
                      placeholder="123"
                      required
                      value={formData.cvv}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "bank_transfer" && (
              <div className="space-y-4">
                <Separator />
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="mb-2 font-medium">Bank Transfer Instructions</h3>
                  <p className="text-sm text-muted-foreground">
                    Please use the following details to make your bank transfer:
                  </p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Bank Name:</span> Alhikmah University Bank
                    </p>
                    <p>
                      <span className="font-medium">Account Name:</span> Alhikmah University Housing
                    </p>
                    <p>
                      <span className="font-medium">Account Number:</span> 0123456789
                    </p>
                    <p>
                      <span className="font-medium">Reference:</span> ALU-{accommodationId}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "ussd" && (
              <div className="space-y-4">
                <Separator />
                <div className="rounded-lg bg-muted p-4 text-center">
                  <h3 className="mb-2 font-medium">USSD Payment Instructions</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Dial the USSD code below on your mobile phone to complete payment:
                  </p>
                  <p className="text-xl font-bold">*737*8*{amount}#</p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    After completing the USSD payment, click the "Confirm Payment" button below.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#006400] hover:bg-[#004d00]">
              {isLoading ? (
                <span className="flex items-center gap-1">
                  Processing <span className="animate-pulse">...</span>
                </span>
              ) : (
                `Pay ₦${Number(amount).toLocaleString()} Now`
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
