import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-[#006400] px-4 py-3 text-white">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">Alhikmah University Housing</h1>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline">Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="container mx-auto flex-1 px-4 py-8">
        <section className="mx-auto max-w-5xl py-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Alhikmah University Student Accommodation
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Find, request, and manage your student housing at Alhikmah
            University. Simple payments, easy applications, and a dashboard to
            track everything.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/login">
              <Button
                size="lg"
                className="w-full bg-[#006400] hover:bg-[#004d00] sm:w-auto">
                Login to Browse Hostels
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Register Now
              </Button>
            </Link>
          </div>
        </section>

        <section className="my-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border p-6 shadow-sm">
            <h3 className="mb-2 text-xl font-semibold">
              Quality Accommodation
            </h3>
            <p className="text-muted-foreground">
              Alhikmah University offers comfortable and secure hostels for all
              students.
            </p>
          </div>
          <div className="rounded-lg border p-6 shadow-sm">
            <h3 className="mb-2 text-xl font-semibold">Simple Application</h3>
            <p className="text-muted-foreground">
              Apply for accommodation with our streamlined request process.
            </p>
          </div>
          <div className="rounded-lg border p-6 shadow-sm">
            <h3 className="mb-2 text-xl font-semibold">Secure Payments</h3>
            <p className="text-muted-foreground">
              Pay securely online and track all your transactions in one place.
            </p>
          </div>
        </section>
      </main>
      <footer className="border-t bg-muted px-4 py-6">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Alhikmah University. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
