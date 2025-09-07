"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Shield, Eye, EyeOff, ExternalLink, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/lib/api-client"

interface ShortLinkData {
  id: string
  title?: string
  url: string
  slug: string
  hasPassword: boolean
  isExpired: boolean
  isLimitReached: boolean
  expiresAt?: string
  clickLimit?: number
  clicks: number
  isActive: boolean
}

export default function ShortLinkRedirectPage({ params }: { params: { slug: string } }) {
  const [linkData, setLinkData] = useState<ShortLinkData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params
      loadLinkData(resolvedParams.slug)
    }
    loadData()
  }, [params])

  const loadLinkData = async (slug: string) => {
    try {
      setLoading(true)
      const response = await apiClient.getPublicLink(slug)
      const data = response.data || response

      // Check if link is active and not expired/limited
      if (data && !data.isActive) {
        setError("This link has been deactivated")
        return
      }

      if (data && data.isExpired) {
        setError("This link has expired")
        return
      }

      if (data && data.isLimitReached) {
        setError("This link has reached its click limit")
        return
      }

      setLinkData(data)

      // If no password required, redirect immediately
      if (data && !data.hasPassword) {
        await redirectToDestination(data.url)
      }
    } catch (error: any) {
      console.error("Failed to load link:", error)
      setError("Link not found or unavailable")
    } finally {
      setLoading(false)
    }
  }

  const redirectToDestination = async (url: string) => {
    try {
      // Show redirect message
      toast({
        title: "Redirecting...",
        description: "Taking you to your destination",
      })

      // Simulate redirect delay
      setTimeout(() => {
        window.location.href = url
      }, 1500)
    } catch (error) {
      console.error("Redirect failed:", error)
      toast({
        title: "Redirect failed",
        description: "Unable to redirect to the destination URL.",
        variant: "destructive",
      })
    }
  }

  const verifyPassword = async () => {
    if (!linkData || !password) return

    setVerifying(true)
    setPasswordError("")

    try {
      const result = await apiClient.verifyPassword(linkData.slug, password)
      
      toast({
        title: "Password verified!",
        description: "Redirecting to destination...",
      })
      
      await redirectToDestination(result.data.redirectUrl)
    } catch (error: any) {
      setPasswordError("Incorrect password. Please try again.")
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
      verifyPassword()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-16 w-16 rounded-full mx-auto" />
              <Skeleton className="h-8 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mx-auto" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🔗</div>
              <h1 className="text-2xl font-bold mb-2">Link Not Available</h1>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="space-y-2">
                <Button onClick={() => window.history.back()} variant="outline" className="w-full">
                  Go Back
                </Button>
                <Button onClick={() => (window.location.href = "/")} className="w-full">
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (!linkData) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Protected Link</CardTitle>
            <CardDescription>
              {linkData.title ? `Accessing: ${linkData.title}` : "This link is password protected"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Link Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Destination:</span>
                <span className="font-mono text-xs truncate max-w-48" title={linkData.url}>
                  {linkData.url}
                </span>
              </div>

              {linkData.expiresAt && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Expires:</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">{new Date(linkData.expiresAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}

              {linkData.clickLimit && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Clicks:</span>
                  <Badge variant="outline" className="text-xs">
                    {linkData.clicks} / {linkData.clickLimit}
                  </Badge>
                </div>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Enter Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Try 'demo', 'password', or '123456'"
                    className="pr-10"
                    disabled={verifying}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={verifying}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {passwordError && (
                  <div className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    {passwordError}
                  </div>
                )}
              </div>

              <Button
                onClick={verifyPassword}
                disabled={!password || verifying}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                {verifying ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Continue to Link
                  </div>
                )}
              </Button>
            </div>

            {/* Demo Notice */}
            <div className="text-center text-xs text-muted-foreground border-t pt-4">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Shield className="w-3 h-3" />
                <span>Demo Mode - LinkWeaver</span>
              </div>
              <p className="mb-1">This is a demonstration of password-protected links</p>
              <p className="text-primary">Try passwords: demo, password, or 123456</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}