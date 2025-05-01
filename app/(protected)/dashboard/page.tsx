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
    // Get accommodation requests
    const requests = JSON.parse(
      localStorage.getItem("accommodationRequests") || "[]"
    );
    setAccommodationRequests(requests);

    // Get payments
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
      <header className="bg-[#006400] px-4 py-3 text-white">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Alhikmah University Housing</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user?.name}</span>
            <Button
              variant="outline"
              size="sm"
              className="border-white text-white"
              onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Student Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your accommodation and payments
            </p>
          </div>
          <Button asChild className="bg-[#006400] hover:bg-[#004d00]">
            <Link href="/hostels">
              <Plus className="mr-2 h-4 w-4" />
              Browse Hostels
            </Link>
          </Button>
        </div>

        <div className="mb-8 rounded-lg border p-6">
          <h2 className="mb-4 text-xl font-semibold">Student Information</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Full Name
              </p>
              <p>{user?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Matric Number
              </p>
              <p>{user?.matricNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{user?.email}</p>
            </div>
            {user?.faculty && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Faculty
                </p>
                <p className="capitalize">{user.faculty.replace("_", " ")}</p>
              </div>
            )}
            {user?.department && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Department
                </p>
                <p className="capitalize">
                  {user.department.replace("_", " ")}
                </p>
              </div>
            )}
            {user?.level && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Level
                </p>
                <p>{user.level} Level</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Accommodation Requests
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {accommodationRequests.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Total accommodation requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Payments Made
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₦
                {payments
                  .reduce(
                    (total: any, payment: any) =>
                      total + Number(payment.amount),
                    0
                  )
                  .toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Total amount paid</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Profile Completion
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100%</div>
              <p className="text-xs text-muted-foreground">
                Your profile is complete
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="accommodations" className="mt-6">
          <TabsList>
            <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
          <TabsContent value="accommodations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Accommodation Requests</CardTitle>
                <CardDescription>
                  View and manage your accommodation requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                {accommodationRequests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <Home className="mb-2 h-10 w-10 text-muted-foreground" />
                    <h3 className="mb-1 text-lg font-medium">
                      No accommodation requests
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      You haven't made any accommodation requests yet.
                    </p>
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
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                          <div>
                            <h3 className="font-medium">
                              {request.hostelName || "Hostel Accommodation"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Requested on {formatDate(request.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {request.roomId && (
                              <Badge
                                variant="outline"
                                className="bg-blue-50 text-blue-800 border-blue-200">
                                Room {request.roomId}
                              </Badge>
                            )}
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                                request.status
                              )}`}>
                              {request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <Separator className="my-3" />

                        <div className="grid gap-2 sm:grid-cols-3">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">
                              Room Type
                            </p>
                            <p className="text-sm">
                              {request.roomType === "1-person"
                                ? "Single Room"
                                : request.roomType === "2-person"
                                ? "Double Room"
                                : request.roomType === "4-person"
                                ? "Quad Room"
                                : request.roomType || "Standard"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">
                              Duration
                            </p>
                            <p className="text-sm capitalize">
                              {(request.duration || "full_year").replace(
                                "_",
                                " "
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">
                              Price
                            </p>
                            <p className="text-sm">
                              ₦{(request.price || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                          {request.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
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
                          <Button variant="secondary" size="sm">
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

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>
                  View your payment history and receipts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <CreditCard className="mb-2 h-10 w-10 text-muted-foreground" />
                    <h3 className="mb-1 text-lg font-medium">
                      No payments yet
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      You haven't made any payments yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payments.map((payment: any) => (
                      <div key={payment.id} className="rounded-lg border p-4">
                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                          <div>
                            <h3 className="font-medium">
                              Payment #{payment.id.slice(-4)}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(payment.date)}
                            </p>
                          </div>
                          <div className="text-xl font-bold">
                            ₦{Number(payment.amount).toLocaleString()}
                          </div>
                        </div>

                        <Separator className="my-3" />

                        <div className="grid gap-2 sm:grid-cols-3">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">
                              Payment Method
                            </p>
                            <p className="text-sm capitalize">
                              {payment.paymentMethod.replace("_", " ")}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">
                              Status
                            </p>
                            <p className="text-sm text-green-600">Completed</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">
                              Reference
                            </p>
                            <p className="text-sm">
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
              <CardFooter>
                <p className="text-xs text-muted-foreground">
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
