"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { signup } from "@/actions/auth"
import { toast } from "sonner"

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (formData: FormData) => {
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    const result = await signup(formData)
    if (result?.error) {
      toast.error(result.error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">Sign up</h1>
      </div>

      <form className="space-y-4" action={handleSubmit}>
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>
          <Input
            id="name"
            type="text"
            name="fullName"
            placeholder="Name"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            className="w-full"
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <Input
            id="email"
            type="email"
            name="email"
            placeholder="abcd@gmail.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full"
            required
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="sduejdigs52435"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="w-full pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="sduejdigs52435"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className="w-full pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="text-sm text-gray-600">
          By creating an account, you agree to our{" "}
          <Link
            href="#service-policy"
            className="text-aqua-mist hover:text-aqua-depth"
          >
            Service Policy
          </Link>
          .
        </div>

        {/* Sign up Button */}
        <Button
          type="submit"
          className="w-full bg-aqua-mist hover:bg-aqua-depth text-white py-3 max-md:text-sm"
        >
          Sign up
        </Button>
      </form>

      <div className="text-center max-md:text-sm">
        <span className="text-gray-600">Have an account? </span>
        <Link href="/login" className="text-aqua-mist hover:text-aqua-depth font-medium">
          Log in
        </Link>
      </div>
    </div>
  )
}