"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react"
import { useRouter } from "next/navigation"

interface AdminLoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, any email/password combination works
    if (loginForm.email && loginForm.password) {
      console.log("Admin login successful:", loginForm.email)
      onClose()
      router.push("/admin")
    } else {
      alert("Please enter both email and password")
    }

    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setLoginForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-800">Admin Portal Login</span>
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Access the admin dashboard to manage venues and bookings
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-slate-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="admin-email"
                type="email"
                placeholder="admin@example.com"
                value={loginForm.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-10 border-slate-200 focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-password" className="text-slate-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-10 pr-10 border-slate-200 focus:border-primary-500 focus:ring-primary-500"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-slate-400" />
                ) : (
                  <Eye className="h-4 w-4 text-slate-400" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="admin-remember"
              checked={loginForm.rememberMe}
              onCheckedChange={(checked) => handleInputChange("rememberMe", checked as boolean)}
            />
            <Label htmlFor="admin-remember" className="text-sm font-normal text-slate-600">
              Keep me signed in
            </Label>
          </div>

          <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 text-sm text-primary-800">
            <p className="font-medium mb-1">Demo Mode</p>
            <p>Any email and password combination will work for demonstration purposes.</p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary-500 hover:bg-primary-600 text-white">
              {isLoading ? "Signing in..." : "Sign In to Admin Portal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
