import type { Metadata } from "next";
import { Star, Search } from "lucide-react";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Review & RATE",
  description: "Review and rate companies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 py-3 shadow-sm">
          <div className="container mx-auto px-6 max-w-6xl flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-[#401ed4] via-[#6b13e6] to-[#af06f0] rounded-full p-1.5 flex items-center justify-center">
                <Star className="h-5 w-5 text-white fill-white" />
              </div>
              <span className="text-xl text-gray-800 tracking-tight">
                Review
                <span className="bg-gradient-to-r from-[#401ed4] via-[#6b13e6] to-[#af06f0] bg-clip-text text-transparent">
                  &
                </span>
                <span className="text-gray-900 font-bold">RATE</span>
              </span>
            </Link>

            <div className="flex gap-5">

              {/* Search Bar */}
              <div className="hidden md:flex items-center w-72 relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-3 pr-9 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#7B2CBF]"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search className="h-3.5 w-3.5 text-[#7B2CBF]" />
                </button>
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center gap-6">
                <button className="text-sm font-medium text-gray-800 hover:text-gray-600">SignUp</button>
                <button className="text-sm font-medium text-gray-800 hover:text-gray-600">Login</button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 w-full container mx-auto px-4 md:px-8 py-8 max-w-6xl">
          {children}
        </main>
      </body>
    </html>
  );
}
