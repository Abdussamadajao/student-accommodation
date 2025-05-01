import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="bg-[#006400] px-4 py-3 text-white">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-lg font-bold sm:text-xl md:text-2xl">
            Alhikmah University Housing
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <Link href="/login" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full sm:w-auto">
                Login
              </Button>
            </Link>
            <Link href="/register" className="flex-1 sm:flex-none">
              <Button variant="outline" className="w-full sm:w-auto">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="mb-6 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Alhikmah University Student Accommodation
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Find, request, and manage your student housing at Alhikmah
              University. Simple payments, easy applications, and a dashboard to
              track everything.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full bg-[#006400] hover:bg-[#004d00] sm:px-8 sm:py-4">
                  <span className="truncate">Login to Browse Hostels</span>
                  <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
                </Button>
              </Link>
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:px-8 sm:py-4">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            <div className="rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <h3 className="mb-3 text-xl font-semibold md:text-2xl">
                Quality Accommodation
              </h3>
              <p className="text-muted-foreground md:text-lg">
                Alhikmah University offers comfortable and secure hostels for
                all students.
              </p>
            </div>
            <div className="rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <h3 className="mb-3 text-xl font-semibold md:text-2xl">
                Simple Application
              </h3>
              <p className="text-muted-foreground md:text-lg">
                Apply for accommodation with our streamlined request process.
              </p>
            </div>
            <div className="rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
              <h3 className="mb-3 text-xl font-semibold md:text-2xl">
                Secure Payments
              </h3>
              <p className="text-muted-foreground md:text-lg">
                Pay securely online and track all your transactions in one
                place.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground md:text-base">
            &copy; {new Date().getFullYear()} Alhikmah University. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
