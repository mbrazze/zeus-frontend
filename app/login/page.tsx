"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, Shield, UserCircle, User, Phone, KeyRound } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

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

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
              <span className="text-white font-bold text-xl">Z</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Zeus
            </span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tab Headers */}
          <div className="grid grid-cols-3">
            <button
              onClick={() => setActiveTab("admin")}
              className={`py-8 px-6 flex flex-col items-center justify-center gap-3 transition-all ${
                activeTab === "admin"
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                  : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 hover:from-gray-100 hover:to-gray-200"
              }`}
            >
              <Shield className="w-8 h-8" />
              <span className="font-semibold text-lg">Admin Portal</span>
            </button>

            <button
              onClick={() => setActiveTab("customer")}
              className={`py-8 px-6 flex flex-col items-center justify-center gap-3 transition-all ${
                activeTab === "customer"
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                  : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 hover:from-gray-100 hover:to-gray-200"
              }`}
            >
              <UserCircle className="w-8 h-8" />
              <span className="font-semibold text-lg">Customer</span>
            </button>

            <button
              onClick={() => setActiveTab("forgot")}
              className={`py-8 px-6 flex flex-col items-center justify-center gap-3 transition-all ${
                activeTab === "forgot"
                  ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white"
                  : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 hover:from-gray-100 hover:to-gray-200"
              }`}
            >
              <KeyRound className="w-8 h-8" />
              <span className="font-semibold text-lg">Forgot Password</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="p-12">
            {/* Admin Tab */}
            {activeTab === "admin" && (
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal Login</h2>
                  <p className="text-gray-600">Access the admin dashboard to manage venues and bookings</p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email" className="text-base font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <Input
                        id="admin-email"
                        type="email"
                        placeholder="admin@example.com"
                        value={adminForm.email}
                        onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                        className="pl-12 h-14 text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-password" className="text-base font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <Input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={adminForm.password}
                        onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                        className="pl-12 pr-12 h-14 text-base"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-2 h-10 px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="admin-remember"
                      checked={adminForm.rememberMe}
                      onCheckedChange={(checked) => setAdminForm({ ...adminForm, rememberMe: checked as boolean })}
                    />
                    <Label htmlFor="admin-remember" className="text-base font-normal">
                      Keep me signed in
                    </Label>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                    <p className="font-semibold text-blue-900 mb-1">Demo Mode</p>
                    <p className="text-sm text-blue-700">
                      Any email and password combination will work for demonstration purposes.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In to Admin Portal"}
                  </Button>
                </form>
              </div>
            )}

            {/* Customer Tab */}
            {activeTab === "customer" && (
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {customerView === "login" ? "Customer Sign In" : "Create Account"}
                  </h2>
                  <p className="text-gray-600">
                    {customerView === "login"
                      ? "Sign in to your account to manage bookings"
                      : "Create a new account to start booking venues"}
                  </p>
                </div>

                {customerView === "login" ? (
                  <>
                    <div className="space-y-4 mb-6">
                      <Button
                        variant="outline"
                        className="w-full h-14 text-base bg-transparent border-2"
                        onClick={() => handleSocialLogin("Google")}
                      >
                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Continue with Google
                      </Button>
                    </div>

                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-sm uppercase">
                        <span className="bg-white px-3 text-gray-500">Or continue with email</span>
                      </div>
                    </div>

                    <form onSubmit={handleCustomerLogin} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="customer-email" className="text-base font-medium">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="customer-email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={customerLoginForm.email}
                            onChange={(e) => setCustomerLoginForm({ ...customerLoginForm, email: e.target.value })}
                            className="pl-12 h-14 text-base"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="customer-password" className="text-base font-medium">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="customer-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            value={customerLoginForm.password}
                            onChange={(e) => setCustomerLoginForm({ ...customerLoginForm, password: e.target.value })}
                            className="pl-12 pr-12 h-14 text-base"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2 h-10 px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="customer-remember"
                          checked={customerLoginForm.rememberMe}
                          onCheckedChange={(checked) =>
                            setCustomerLoginForm({ ...customerLoginForm, rememberMe: checked as boolean })
                          }
                        />
                        <Label htmlFor="customer-remember" className="text-base font-normal">
                          Remember me
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>

                      <div className="text-center">
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => setCustomerView("register")}
                          className="text-blue-600 text-base"
                        >
                          Don't have an account? Create one
                        </Button>
                      </div>
                    </form>
                  </>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      <Button
                        variant="outline"
                        className="w-full h-14 text-base bg-transparent border-2"
                        onClick={() => handleSocialLogin("Google")}
                      >
                        <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Sign up with Google
                      </Button>
                    </div>

                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-sm uppercase">
                        <span className="bg-white px-3 text-gray-500">Or register with email</span>
                      </div>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name" className="text-base font-medium">
                            First Name
                          </Label>
                          <div className="relative">
                            <User className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                            <Input
                              id="first-name"
                              placeholder="First name"
                              value={registerForm.firstName}
                              onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                              className="pl-12 h-14 text-base"
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name" className="text-base font-medium">
                            Last Name
                          </Label>
                          <Input
                            id="last-name"
                            placeholder="Last name"
                            value={registerForm.lastName}
                            onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                            className="h-14 text-base"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-email" className="text-base font-medium">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="register-email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                            className="pl-12 h-14 text-base"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-base font-medium">
                          Phone Number
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+44 123 456 7890"
                            value={registerForm.phone}
                            onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                            className="pl-12 h-14 text-base"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="register-password" className="text-base font-medium">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="register-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            value={registerForm.password}
                            onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                            className="pl-12 pr-12 h-14 text-base"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2 h-10 px-3 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirm-password" className="text-base font-medium">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={registerForm.confirmPassword}
                            onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                            className="pl-12 pr-12 h-14 text-base"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-2 h-10 px-3 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                              <Eye className="h-5 w-5 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="agree-terms"
                          checked={registerForm.agreeToTerms}
                          onCheckedChange={(checked) =>
                            setRegisterForm({ ...registerForm, agreeToTerms: checked as boolean })
                          }
                          required
                        />
                        <Label htmlFor="agree-terms" className="text-sm font-normal">
                          I agree to the{" "}
                          <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
                            Terms of Service
                          </Button>{" "}
                          and{" "}
                          <Button variant="link" className="text-blue-600 p-0 h-auto text-sm">
                            Privacy Policy
                          </Button>
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating account..." : "Create Account"}
                      </Button>

                      <div className="text-center">
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => setCustomerView("login")}
                          className="text-blue-600 text-base"
                        >
                          Already have an account? Sign in
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            )}

            {/* Forgot Password Tab */}
            {activeTab === "forgot" && (
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
                  <p className="text-gray-600">
                    Enter your email address and we'll send you a link to reset your password
                  </p>
                </div>

                {!resetEmailSent ? (
                  <form onSubmit={handleForgotPassword} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email" className="text-base font-medium">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={forgotPasswordEmail}
                          onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          className="pl-12 h-14 text-base"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>

                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setActiveTab("customer")}
                        className="text-blue-600 text-base"
                      >
                        Back to Sign In
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h3>
                      <p className="text-gray-600 mb-1">
                        We've sent a password reset link to{" "}
                        <span className="font-semibold text-gray-900">{forgotPasswordEmail}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        If you don't see the email, check your spam folder or try again.
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setResetEmailSent(false)
                        setForgotPasswordEmail("")
                      }}
                      variant="outline"
                      className="w-full h-12 text-base border-2"
                    >
                      Try Again
                    </Button>
                    <Button variant="link" onClick={() => setActiveTab("customer")} className="text-blue-600 text-base">
                      Back to Sign In
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors text-base font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
