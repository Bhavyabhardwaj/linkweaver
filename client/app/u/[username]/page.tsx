"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ExternalLink, Share2, Eye, Globe, Instagram, Twitter, Youtube, Github, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/lib/api-client"
import Head from "next/head"

interface BioPageData {
  id: string
  username: string
  displayName: string
  bio: string
  avatar?: string
  theme: string
  isActive: boolean
  links: Array<{
    id: string
    title: string
    url: string
    description?: string
    icon?: string
    active: boolean
    clicks: number
  }>
  socialLinks: {
    instagram?: string
    twitter?: string
    youtube?: string
    github?: string
    linkedin?: string
    website?: string
  }
  customization: {
    backgroundColor: string
    textColor: string
    buttonStyle: string
    fontFamily: string
  }
  analytics: {
    totalViews: number
    totalClicks: number
  }
}

const themes = {
  linktree: {
    background: "bg-gradient-to-br from-green-50 to-emerald-100",
    card: "bg-white/80 backdrop-blur-sm",
    button: "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200",
    text: "text-gray-900",
  },
  minimal: {
    background: "bg-white",
    card: "bg-white",
    button: "bg-gray-100 hover:bg-gray-200 text-gray-900",
    text: "text-gray-900",
  },
  dark: {
    background: "bg-gradient-to-br from-gray-900 to-black",
    card: "bg-gray-800/80 backdrop-blur-sm",
    button: "bg-gray-700 hover:bg-gray-600 text-white",
    text: "text-white",
  },
  neon: {
    background: "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900",
    card: "bg-black/50 backdrop-blur-sm border border-purple-500/20",
    button: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white",
    text: "text-white",
  },
  nature: {
    background: "bg-gradient-to-br from-green-100 to-emerald-200",
    card: "bg-white/90 backdrop-blur-sm",
    button: "bg-green-500 hover:bg-green-600 text-white",
    text: "text-green-900",
  },
}

const socialIcons = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  github: Github,
  linkedin: Linkedin,
  website: Globe,
}

export default function PublicBioPage({ params }: { params: { username: string } }) {
  const [bioData, setBioData] = useState<BioPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadBioData()
  }, [params.username])

  const mapBackendToBioData = (data: any): BioPageData => {
    // Map backend fields to frontend expected fields
    return {
      id: data.id,
      username: data.username,
      displayName: data.name || data.displayName || data.username,
      bio: data.bio || '',
      avatar: data.image || data.avatar || '',
      theme: data.theme || 'neon',
      isActive: data.isActive !== undefined ? data.isActive : true,
      links: (data.links || []).map((link: any) => ({
        id: link.id,
        title: link.title,
        url: link.url,
        description: link.description || '',
        icon: link.icon || '',
        active: link.active !== undefined ? link.active : true,
        clicks: link.clickCount || link.clicks || 0,
      })),
      socialLinks: data.socialLinks || {},
      customization: data.customization || {
        backgroundColor: '',
        textColor: '',
        buttonStyle: '',
        fontFamily: '',
      },
      analytics: data.analytics || {
        totalViews: data.totalViews || 0,
        totalClicks: (data.links || []).reduce((sum: number, l: any) => sum + (l.clickCount || l.clicks || 0), 0),
      },
    }
  }

  const loadBioData = async () => {
    try {
      const response = await apiClient.getPublicBioPage(params.username)
      const raw = response.data || response
      const mapped = mapBackendToBioData(raw)
      if (!mapped.isActive) {
        setError("This bio page is not available")
        return
      }
      setBioData(mapped)
    } catch (error: any) {
      console.error("Failed to load bio page:", error)
      setError("Bio page not found")
    } finally {
      setLoading(false)
    }
  }

  const handleLinkClick = async (link: any) => {
    try {
      // Track click
      window.open(link.url, "_blank")
      toast({
        title: "Opening link",
        description: `Redirecting to ${link.title}`,
      })
    } catch (error) {
      console.error("Failed to track click:", error)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${bioData?.displayName}'s Links`,
          text: bioData?.bio,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied!",
          description: "Bio page URL copied to clipboard",
        })
      }
    } catch (error) {
      console.error("Failed to share:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-24 w-24 rounded-full mx-auto" />
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !bioData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">👤</div>
              <h1 className="text-2xl font-bold mb-2">Bio Page Not Found</h1>
              <p className="text-muted-foreground mb-6">{error || "This bio page doesn't exist"}</p>
              <Button onClick={() => window.history.back()} variant="outline">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  const currentTheme = themes[bioData.theme as keyof typeof themes] || themes.neon

  return (
    <>
      <Head>
        <title>{bioData.displayName} - LinkWeaver Bio</title>
        <meta name="description" content={bioData.bio} />
        <meta property="og:title" content={`${bioData.displayName} - LinkWeaver Bio`} />
        <meta property="og:description" content={bioData.bio} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`${window.location.origin}/u/${bioData.username}`} />
        {bioData.avatar && <meta property="og:image" content={bioData.avatar} />}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${bioData.displayName} - LinkWeaver Bio`} />
        <meta name="twitter:description" content={bioData.bio} />
      </Head>

      <div className={`min-h-screen ${currentTheme.background} py-8 px-4`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`${currentTheme.card} rounded-2xl p-6 mb-6 text-center`}
          >
            <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-white/20">
              <AvatarImage src={bioData.avatar || "/placeholder.svg"} alt={bioData.displayName} />
              <AvatarFallback className="text-2xl font-bold">
                {bioData.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <h1 className={`text-2xl font-bold mb-2 ${currentTheme.text}`}>{bioData.displayName}</h1>

            <p className={`${currentTheme.text} opacity-80 mb-4 leading-relaxed`}>{bioData.bio}</p>

            {/* Social Links */}
            {Object.keys(bioData.socialLinks).length > 0 && (
              <div className="flex justify-center gap-3 mb-4">
                {Object.entries(bioData.socialLinks).map(([platform, url]) => {
                  if (!url) return null
                  const Icon = socialIcons[platform as keyof typeof socialIcons]
                  return (
                    <Button
                      key={platform}
                      variant="ghost"
                      size="sm"
                      className={`w-10 h-10 p-0 rounded-full ${currentTheme.text} hover:bg-white/10`}
                      onClick={() => window.open(url, "_blank")}
                    >
                      <Icon className="w-5 h-5" />
                    </Button>
                  )
                })}
              </div>
            )}

            {/* Stats */}
            <div className="flex justify-center gap-6 text-sm">
              <div className={`${currentTheme.text} opacity-70`}>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{bioData.analytics.totalViews.toLocaleString()} views</span>
                </div>
              </div>
              <div className={`${currentTheme.text} opacity-70`}>
                <div className="flex items-center gap-1">
                  <ExternalLink className="w-4 h-4" />
                  <span>{bioData.analytics.totalClicks.toLocaleString()} clicks</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Links Section */}
          <div className="space-y-4">
            {bioData.links
              .filter((link) => link.active)
              .map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                >
                  <Button
                    onClick={() => handleLinkClick(link)}
                    className={`w-full h-auto p-4 ${currentTheme.button} rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
                    variant="ghost"
                  >
                    <div className="flex items-center gap-4 w-full">
                      {link.icon && <div className="text-2xl flex-shrink-0">{link.icon}</div>}
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-base mb-1">{link.title}</div>
                        {link.description && <div className="text-sm opacity-70">{link.description}</div>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant="secondary" className="text-xs">
                          {link.clicks}
                        </Badge>
                        <ExternalLink className="w-4 h-4 opacity-50" />
                      </div>
                    </div>
                  </Button>
                </motion.div>
              ))}
          </div>

          {/* Share Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8 text-center"
          >
            <Button onClick={handleShare} variant="ghost" className={`${currentTheme.text} hover:bg-white/10`}>
              <Share2 className="w-4 h-4 mr-2" />
              Share this page
            </Button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8 text-center"
          >
            <p className={`text-xs ${currentTheme.text} opacity-50`}>Powered by LinkWeaver</p>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}
