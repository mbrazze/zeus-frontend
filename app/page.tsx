"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"

type TabType = "admin" | "customer" | "forgot"

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>("customer")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Admin login state
  const [adminForm, setAdminForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  // Customer login/register state
  const [customerView, setCustomerView] = useState<"login" | "register">("login")
  const [customerLoginForm, setCustomerLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  // Forgot password state
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [resetEmailSent, setResetEmailSent] = useState(false)

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Admin login:", adminForm.email)
    router.push("/admin")
    setIsLoading(false)
  }

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Customer login:", customerLoginForm.email)
    router.push("/dashboard")
    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Passwords don't match!")
      setIsLoading(false)
      return
    }

    if (!registerForm.agreeToTerms) {
      alert("Please agree to the terms and conditions")
      setIsLoading(false)
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Registration:", registerForm.email)
    router.push("/dashboard")
    setIsLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setResetEmailSent(true)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563eb] to-[#1e40af] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 shadow-2xl">
        {/* Left Card - Hero with Logo */}
        <div className="hidden lg:flex relative bg-gradient-to-br from-blue-500/50 via-blue-600/40 to-blue-700/50 backdrop-blur-xl rounded-l-[2rem] border border-white/30 p-12 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
          {/* Subtle overlay gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-400/10 to-blue-800/20 rounded-l-[2rem]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.1),transparent_50%)] rounded-l-[2rem]" />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-between text-white w-full">
            {/* Top Label */}
            <div className="w-full flex justify-center mb-16">
            </div>

            {/* Zeus Logo and Content */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
              {/* Zeus Logo */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
              <p className= "text-7xl font-bold tracking-tight drop-shadow-lg">Z</p>
              </div>

              {/* Zeus Text */}
              <h1 className="text-7xl font-bold tracking-tight drop-shadow-lg">Zeus</h1>

              {/* Feature List */}
              <div className="space-y-4 text-left w-full max-w-md">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full shadow-lg" />
                  <span className="text-xl font-light drop-shadow-md">Manage your venues</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full shadow-lg" />
                  <span className="text-xl font-light drop-shadow-md">Streamline bookings</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full shadow-lg" />
                  <span className="text-xl font-light drop-shadow-md">Track analytics</span>
                </div>
              </div>
            </div>

            {/* Bottom Copyright */}
            <div className="w-full flex justify-center">
              <p className="text-sm text-white/90 drop-shadow-md">© Zeus 2025</p>
            </div>
          </div>
        </div>

        {/* Right Card - Login Forms */}
        <div className="relative bg-gradient-to-br from-blue-50/95 via-blue-100/90 to-blue-200/80 backdrop-blur-xl rounded-r-[2rem] lg:rounded-l-none rounded-[2rem] border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] flex items-center justify-center p-8 md:p-12">
          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-blue-100/40 rounded-r-[2rem] lg:rounded-l-none rounded-[2rem]" />

          <div className="relative z-10 w-full max-w-md">
            {/* Logo (Mobile) */}
            <div className="lg:hidden flex flex-col items-center mb-8 space-y-4">
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-lg">
                <Image src="/zeus-logo-large.png" alt="Zeus Logo" width={80} height={80} className="drop-shadow-lg" />
              </div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">Zeus</h1>
              <p className="text-sm text-white/90 text-center drop-shadow-md">Event Management Platform</p>
            </div>

            {/* Tab Headers */}
            <div className="flex justify-center gap-2 mb-12">
              <button
                onClick={() => setActiveTab("admin")}
                className={`px-8 py-3 text-base font-medium transition-all rounded-xl ${
                  activeTab === "admin"
                    ? "bg-white text-gray-900 shadow-lg border border-white/50"
                    : "text-gray-700 hover:bg-white/50 border border-transparent"
                }`}
              >
                Admin
              </button>

              <button
                onClick={() => setActiveTab("customer")}
                className={`px-8 py-3 text-base font-medium transition-all rounded-xl ${
                  activeTab === "customer"
                    ? "bg-white text-gray-900 shadow-lg border border-white/50"
                    : "text-gray-700 hover:bg-white/50 border border-transparent"
                }`}
              >
                Customer
              </button>

              <button
                onClick={() => setActiveTab("forgot")}
                className={`px-8 py-3 text-base font-medium transition-all rounded-xl ${
                  activeTab === "forgot"
                    ? "bg-white text-gray-900 shadow-lg border border-white/50"
                    : "text-gray-700 hover:bg-white/50 border border-transparent"
                }`}
              >
                Reset
              </button>
            </div>

            {/* Content Area */}
            <div>
              {/* Admin Tab */}
              {activeTab === "admin" && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-base text-gray-700">Enter your email and password</p>
                  </div>

                  <form onSubmit={handleAdminLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="admin-email" className="text-base font-medium text-gray-900">
                        Email
                      </Label>
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="Enter your email"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                        className="h-14 bg-white/60 border-white/60 focus:bg-white focus:border-white rounded-xl text-base shadow-sm"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="admin-password" className="text-base font-medium text-gray-900">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="admin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={adminForm.password}
                          onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                          className="h-14 bg-white/60 border-white/60 focus:bg-white focus:border-white pr-12 rounded-xl text-base shadow-sm"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-600" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-600" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="admin-remember"
                          checked={adminForm.rememberMe}
                          onCheckedChange={(checked) => setAdminForm({ ...adminForm, rememberMe: checked as boolean })}
                          className="border-gray-400"
                        />
                        <Label htmlFor="admin-remember" className="text-base font-normal cursor-pointer text-gray-900">
                          Remember me
                        </Label>
                      </div>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setActiveTab("forgot")}
                        className="text-gray-900 text-base px-0 h-auto font-normal hover:no-underline"
                      >
                        Forgot password?
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-base font-semibold mt-6 shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </div>
              )}

              {/* Customer Tab */}
              {activeTab === "customer" && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                      {customerView === "login" ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="text-base text-gray-700">
                      {customerView === "login"
                        ? "Enter your email and password"
                        : "Fill in your details to create a new account"}
                    </p>
                  </div>

                  {customerView === "login" ? (
                    <form onSubmit={handleCustomerLogin} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="customer-email" className="text-base font-medium text-gray-900">
                          Email
                        </Label>
                        <Input
                          id="customer-email"
                          type="email"
                          placeholder="Enter your email"
                          value={customerLoginForm.email}
                          onChange={(e) => setCustomerLoginForm({ ...customerLoginForm, email: e.target.value })}
                          className="h-14 bg-white/60 border-white/60 focus:bg-white focus:border-white rounded-xl text-base shadow-sm"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customer-password" className="text-base font-medium text-gray-900">
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="customer-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={customerLoginForm.password}
                            onChange={(e) => setCustomerLoginForm({ ...customerLoginForm, password: e.target.value })}
                            className="h-14 bg-white/60 border-white/60 focus:bg-white focus:border-white pr-12 rounded-xl text-base shadow-sm"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-600" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-600" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="customer-remember"
                            checked={customerLoginForm.rememberMe}
                            onCheckedChange={(checked) =>
                              setCustomerLoginForm({ ...customerLoginForm, rememberMe: checked as boolean })
                            }
                            className="border-gray-400"
                          />
                          <Label
                            htmlFor="customer-remember"
                            className="text-base font-normal cursor-pointer text-gray-900"
                          >
                            Remember me
                          </Label>
                        </div>
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => setActiveTab("forgot")}
                          className="text-gray-900 text-base px-0 h-auto font-normal hover:no-underline"
                        >
                          Forgot password?
                        </Button>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-base font-semibold mt-6 shadow-lg"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>

                      <div className="text-center pt-4">
                        <span className="text-gray-900 text-base">Don't have an account? </span>
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => setCustomerView("register")}
                          className="text-gray-900 text-base px-1 h-auto font-semibold hover:no-underline underline"
                        >
                          Sign Up
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleRegister} className="space-y-5">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="first-name" className="text-sm font-medium text-gray-900">
                            First Name
                          </Label>
                          <Input
                            id="first-name"
                            placeholder="First name"
                            value={registerForm.firstName}
                            onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                            className="h-12 bg-white/60 border-white/60 focus:bg-white focus:border-white rounded-xl shadow-sm"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name" className="text-sm font-medium text-gray-900">
                            Last Name
                          </Label>
                          <Input
                            id="last-name"
                            placeholder="Last name"
                            value={registerForm.lastName}
                            onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                            className="h-12 bg-white/60 border-white/60 focus:bg-white focus:border-white rounded-xl shadow-sm"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-email" className="text-sm font-medium text-gray-900">
                          Email Address
                        </Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                          className="h-12 bg-white/60 border-white/60 focus:bg-white focus:border-white rounded-xl shadow-sm"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium text-gray-900">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+44 123 456 7890"
                          value={registerForm.phone}
                          onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                          className="h-12 bg-white/60 border-white/60 focus:bg-white focus:border-white rounded-xl shadow-sm"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password" className="text-sm font-medium text-gray-900">
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                            className="h-12 bg-white/60 border-white/60 focus:bg-white focus:border-white pr-10 rounded-xl shadow-sm"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-600" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-600" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-900">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={registerForm.confirmPassword}
                            onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                            className="h-12 bg-white/60 border-white/60 focus:bg-white focus:border-white pr-10 rounded-xl shadow-sm"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-600" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-600" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2 pt-1">
                        <Checkbox
                          id="agree-terms"
                          checked={registerForm.agreeToTerms}
                          onCheckedChange={(checked) =>
                            setRegisterForm({ ...registerForm, agreeToTerms: checked as boolean })
                          }
                          required
                          className="mt-1 border-gray-400"
                        />
                        <Label htmlFor="agree-terms" className="text-xs font-normal leading-relaxed cursor-pointer">
                          I agree to the{" "}
                          <span className="text-gray-900 font-semibold hover:underline cursor-pointer">
                            Terms of Service
                          </span>{" "}
                          and{" "}
                          <span className="text-gray-900 font-semibold hover:underline cursor-pointer">
                            Privacy Policy
                          </span>
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-base font-semibold shadow-lg"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating account..." : "Create Account"}
                      </Button>

                      <div className="text-center pt-4">
                        <span className="text-gray-900 text-base">Already have an account? </span>
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => setCustomerView("login")}
                          className="text-gray-900 text-base px-1 h-auto font-semibold hover:no-underline underline"
                        >
                          Sign In
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Forgot Password Tab */}
              {activeTab === "forgot" && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Reset Password</h2>
                    <p className="text-base text-gray-700">
                      Enter your email and we'll send you a link to reset your password
                    </p>
                  </div>

                  {!resetEmailSent ? (
                    <form onSubmit={handleForgotPassword} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email" className="text-base font-medium text-gray-900">
                          Email
                        </Label>
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="Enter your email"
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          className="h-14 bg-white/60 border-white/60 focus:bg-white focus:border-white rounded-xl text-base shadow-sm"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-base font-semibold mt-6 shadow-lg"
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                      </Button>

                      <div className="text-center pt-4">
                        <span className="text-gray-900 text-base">Back to </span>
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => setActiveTab("customer")}
                          className="text-gray-900 text-base px-1 h-auto font-semibold hover:no-underline underline"
                        >
                          Sign In
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="text-center space-y-6">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h3>
                        <p className="text-base text-gray-700 mb-1">
                          We've sent a password reset link to{" "}
                          <span className="font-semibold text-gray-900">{forgotPasswordEmail}</span>
                        </p>
                        <p className="text-sm text-gray-600">If you don't see the email, check your spam folder.</p>
                      </div>
                      <div className="space-y-3">
                        <Button
                          onClick={() => {
                            setResetEmailSent(false)
                            setForgotPasswordEmail("")
                          }}
                          variant="outline"
                          className="w-full h-12 rounded-xl border-gray-300 shadow-sm"
                        >
                          Try Again
                        </Button>
                        <div className="text-center">
                          <span className="text-gray-900 text-base">Back to </span>
                          <Button
                            variant="link"
                            onClick={() => setActiveTab("customer")}
                            className="text-gray-900 text-base px-1 h-auto font-semibold hover:no-underline underline"
                          >
                            Sign In
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
