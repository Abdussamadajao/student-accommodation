"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building, CreditCard, Home, LogOut, Plus, User } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [accommodationRequests, setAccommodationRequests] = useState<any>([]);
  const [payments, setPayments] = useState<any>([]);
  const router = useRouter();

  useEffect(() => {
    const requests = JSON.parse(
      localStorage.getItem("accommodationRequests") || "[]"
    );
    setAccommodationRequests(requests);
    const paymentData = JSON.parse(localStorage.getItem("payments") || "[]");
    setPayments(paymentData);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-muted/40">
      {/* Header */}
      <header className="bg-[#006400] px-4 py-3 text-white">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-lg font-bold sm:text-xl md:text-2xl">
            Alhikmah University Housing
          </h1>
          <div className="flex items-center gap-2">
            <span className="truncate text-sm max-w-[120px] sm:max-w-none">
              {user?.name}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="border-white text-white hover:bg-white/10"
              onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:py-8">
        {/* Dashboard Header */}
        <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Student Dashboard
            </h1>
            <p className="text-muted-foreground md:text-lg">
              Manage your accommodation and payments
            </p>
          </div>
          <Button
            asChild
            className="w-full bg-[#006400] hover:bg-[#004d00] md:w-auto">
            <Link href="/hostels">
              <Plus className="mr-2 h-4 w-4" />
              Browse Hostels
            </Link>
          </Button>
        </div>

        {/* Student Info Section */}
        <div className="mb-6 rounded-lg border p-4 md:mb-8 md:p-6">
          <h2 className="mb-4 text-lg font-semibold md:text-xl">
            Student Information
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[
              { label: "Full Name", value: user?.name },
              { label: "Matric Number", value: user?.matricNumber },
              { label: "Email", value: user?.email },
              { label: "Faculty", value: user?.faculty?.replace("_", " ") },
              {
                label: "Department",
                value: user?.department?.replace("_", " "),
              },
              {
                label: "Level",
                value: user?.level ? `${user.level} Level` : null,
              },
            ].map(
              (item) =>
                item.value && (
                  <div key={item.label} className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="truncate capitalize">{item.value}</p>
                  </div>
                )
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Accommodation Requests
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold md:text-3xl">
                {accommodationRequests.length}
              </div>
              <p className="text-xs text-muted-foreground md:text-sm">
                Total accommodation requests
              </p>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Payments Made
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold md:text-3xl">
                ₦
                {payments
                  .reduce((t: number, p: any) => t + Number(p.amount), 0)
                  .toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground md:text-sm">
                Total amount paid
              </p>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Profile Completion
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold md:text-3xl">100%</div>
              <p className="text-xs text-muted-foreground md:text-sm">
                Your profile is complete
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="accommodations" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 md:w-auto">
            <TabsTrigger value="accommodations" className="py-2 md:px-6">
              Accommodations
            </TabsTrigger>
            <TabsTrigger value="payments" className="py-2 md:px-6">
              Payments
            </TabsTrigger>
          </TabsList>

          {/* Accommodations Tab */}
          <TabsContent value="accommodations" className="mt-4 md:mt-6">
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">
                  Your Accommodation Requests
                </CardTitle>
                <CardDescription className="md:text-sm">
                  View and manage your accommodation requests
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {accommodationRequests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-6 text-center">
                    <Home className="h-8 w-8 text-muted-foreground md:h-10 md:w-10" />
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium md:text-xl">
                        No accommodation requests
                      </h3>
                      <p className="text-sm text-muted-foreground md:text-base">
                        You haven't made any accommodation requests yet.
                      </p>
                    </div>
                    <Button asChild className="bg-[#006400] hover:bg-[#004d00]">
                      <Link href="/hostels">
                        <Plus className="mr-2 h-4 w-4" />
                        Browse Hostels
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {accommodationRequests.map((request: any) => (
                      <div key={request.id} className="rounded-lg border p-4">
                        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                          <div className="space-y-1">
                            <h3 className="font-medium md:text-lg">
                              {request.hostelName || "Hostel Accommodation"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Requested on {formatDate(request.createdAt)}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {request.roomId && (
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-800 border-blue-200 text-xs md:text-sm">
                                Room {request.roomId}
                              </Badge>
                            )}
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(
                                request.status
                              )} md:text-sm`}>
                              {request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <Separator className="my-3" />

                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                          {/* Room Type */}
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground md:text-sm">
                              Room Type
                            </p>
                            <p className="text-sm md:text-base">
                              {(
                                {
                                  "1-person": "Single Room",
                                  "2-person": "Double Room",
                                  "4-person": "Quad Room",
                                } as Record<string, string>
                              )[request.roomType] || "Standard"}
                            </p>
                          </div>

                          {/* Duration */}
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground md:text-sm">
                              Duration
                            </p>
                            <p className="text-sm capitalize md:text-base">
                              {(request.duration || "full_year").replace(
                                "_",
                                " "
                              )}
                            </p>
                          </div>

                          {/* Price */}
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground md:text-sm">
                              Price
                            </p>
                            <p className="text-sm md:text-base">
                              ₦{(request.price || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {request.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full sm:w-auto"
                              onClick={() =>
                                router.push(
                                  `/payment?id=${request.id}&amount=${
                                    request.price || 80000
                                  }`
                                )
                              }>
                              <CreditCard className="mr-2 h-4 w-4" />
                              Pay Now
                            </Button>
                          )}
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full sm:w-auto">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="mt-4 md:mt-6">
            <Card>
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg md:text-xl">
                  Payment History
                </CardTitle>
                <CardDescription className="md:text-sm">
                  View your payment history and receipts
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                {payments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-dashed p-6 text-center">
                    <CreditCard className="h-8 w-8 text-muted-foreground md:h-10 md:w-10" />
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium md:text-xl">
                        No payments yet
                      </h3>
                      <p className="text-sm text-muted-foreground md:text-base">
                        You haven't made any payments yet.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payments.map((payment: any) => (
                      <div key={payment.id} className="rounded-lg border p-4">
                        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                          <div className="space-y-1">
                            <h3 className="font-medium md:text-lg">
                              Payment #{payment.id.slice(-4)}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(payment.date)}
                            </p>
                          </div>
                          <div className="text-lg font-bold md:text-xl">
                            ₦{Number(payment.amount).toLocaleString()}
                          </div>
                        </div>

                        <Separator className="my-3" />

                        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                          {/* Payment Method */}
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground md:text-sm">
                              Payment Method
                            </p>
                            <p className="text-sm capitalize md:text-base">
                              {payment.paymentMethod.replace("_", " ")}
                            </p>
                          </div>

                          {/* Status */}
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground md:text-sm">
                              Status
                            </p>
                            <p className="text-sm text-green-600 md:text-base">
                              Completed
                            </p>
                          </div>

                          {/* Reference */}
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground md:text-sm">
                              Reference
                            </p>
                            <p className="text-sm md:text-base">
                              ACC-{payment.accommodationId}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm">
                            Download Receipt
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-4 md:p-6">
                <p className="text-xs text-muted-foreground md:text-sm">
                  Payments are processed securely. Contact support if you have
                  any questions.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
