"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Shield, Eye, EyeOff, ExternalLink, Clock, MousePointer, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/lib/api-client"

interface LinkData {
  id: string
  title: string
  url: string
  slug: string
  hasPassword: boolean
  isExpired: boolean
  isLimitReached: boolean
  expiresAt: string | null
  clickLimit: number | null
  clicks: number
  isActive: boolean
}

export default function ProtectedLinkPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [linkData, setLinkData] = useState<LinkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState("")

  const slug = params.slug as string

  useEffect(() => {
    if (slug) {
      loadLinkData()
    }
  }, [slug])

  const loadLinkData = async () => {
    try {
      const response = await apiClient.getPublicLink(slug)
      const data = response.data || response

      if (!data) {
        setError("Link not found")
        return
      }

      setLinkData({
        id: data.id || "demo-1",
        title: data.title || "Demo Protected Link",
        url: data.url || "https://example.com",
        slug: data.slug || slug,
        hasPassword: data.hasPassword !== undefined ? data.hasPassword : true,
        isExpired: data.isExpired || false,
        isLimitReached: data.isLimitReached || false,
        expiresAt: data.expiresAt || null,
        clickLimit: data.clickLimit || null,
        clicks: data.clicks || 0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      })
    } catch (error) {
      console.error("Failed to load link data:", error)
      setError("Failed to load link data")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password.trim() || !linkData) return

    setVerifying(true)
    setError("")

    try {
      const result = await apiClient.verifyPassword(slug, password)

      // Show success message
      toast({
        title: "Access granted!",
        description: "Redirecting to destination...",
      })

      // Redirect to the destination URL
      setTimeout(() => {
        window.location.href = result.data.redirectUrl
      }, 1500)
    } catch (error) {
      setError("Invalid password. Please try again.")
      toast({
        title: "Invalid password",
        description: "Please check your password and try again.",
        variant: "destructive",
      })
    } finally {
      setVerifying(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handlePasswordSubmit(e as any)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-4">
              <Skeleton className="w-16 h-16 rounded-full mx-auto" />
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !linkData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Link Not Found</h1>
                <p className="text-gray-300">
                  {error || "The link you're looking for doesn't exist or has been removed."}
                </p>
              </div>
              <Button onClick={() => router.push("/")} className="w-full bg-blue-600 hover:bg-blue-700">
                Go Home
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (!linkData.isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-orange-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Link Inactive</h1>
                <p className="text-gray-300">This link has been deactivated by the owner.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (linkData.isExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 text-red-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Link Expired</h1>
                <p className="text-gray-300">This link has expired and is no longer accessible.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (linkData.isLimitReached) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto">
                <MousePointer className="w-8 h-8 text-orange-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Click Limit Reached</h1>
                <p className="text-gray-300">This link has reached its maximum number of clicks.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (!linkData.hasPassword) {
    // Redirect immediately if no password required
    window.location.href = linkData.url
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">Protected Link</CardTitle>
            <CardDescription className="text-gray-300">Accessing: {linkData.title}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Link Information */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Destination:</span>
                <span className="text-white font-mono text-xs bg-white/10 px-2 py-1 rounded">{linkData.url}</span>
              </div>

              {linkData.expiresAt && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Expires:</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-white">{new Date(linkData.expiresAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              {linkData.clickLimit && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Clicks:</span>
                  <span className="text-white">
                    {linkData.clicks} / {linkData.clickLimit}
                  </span>
                </div>
              )}
            </div>

            {/* Password Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Enter Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter password to continue"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
                    disabled={verifying}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Try 'demo', 'password', or '123456'</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={!password.trim() || verifying}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifying ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Continue to Link
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Notice */}
            <div className="text-center pt-4 border-t border-white/10">
              <Badge variant="secondary" className="bg-white/10 text-gray-300 border-white/20">
                <Shield className="w-3 h-3 mr-1" />
                Demo Mode - LinkWeaver
              </Badge>
              <p className="text-xs text-gray-400 mt-2">
                This is a demonstration of password-protected links
                <br />
                Try passwords: demo, password, or 123456
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
