"use client"

import { useState } from "react"
import Link from "next/link"
import { AdminLoginModal } from "@/components/admin-login-modal"

export default function Home() {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)

  return (
    <div className="bg-slate-50 min-h-screen">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo / Home Link */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 zeus-gradient rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">Z</span>
            </div>
            <span className="text-2xl font-bold text-slate-800">Zeus</span>
          </Link>

          {/* Navigation */}
          <nav>
            <ul className="flex space-x-6">
              <li>
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="text-slate-600 hover:text-primary-600 font-medium transition-colors"
                >
                  Admin Portal Login
                </button>
              </li>
              <li>
                <Link
                  href="/login"
                  className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm"
                >
                  Customer Sign In
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Welcome to <span className="zeus-text-primary">Zeus</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            Find and book the perfect venue for your next event with our comprehensive platform.
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center zeus-gradient text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Explore Venues
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="zeus-card rounded-xl p-8 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Wide Selection</h3>
            <p className="text-slate-600">
              Discover a diverse range of venues to suit any occasion, from sports facilities to conference centers.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="zeus-card rounded-xl p-8 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Easy Booking</h3>
            <p className="text-slate-600">
              Book your venue quickly and easily with our streamlined process and real-time availability.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="zeus-card rounded-xl p-8 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Secure Payments</h3>
            <p className="text-slate-600">
              Enjoy secure and reliable payment options with industry-standard encryption and protection.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-slate-100 border-t border-slate-200 py-12">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 zeus-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <span className="text-lg font-semibold text-slate-800">Zeus</span>
          </div>
          <p className="text-slate-600">&copy; 2025 Zeus. All rights reserved.</p>
        </div>
      </footer>

      {/* Admin Login Modal */}
      <AdminLoginModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />
    </div>
  )
}
