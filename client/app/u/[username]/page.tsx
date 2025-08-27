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
  classic: {
    name: "Classic",
    background: "bg-gradient-to-br from-[#f8fafc] via-[#e0e7ef] to-[#c7d2fe] dark:from-[#18181b] dark:via-[#23272f] dark:to-[#1e293b]",
    card: "bg-white/80 dark:bg-[#23272f]/80 backdrop-blur-xl border border-white/30 dark:border-[#23272f]/40 shadow-2xl",
    button: "bg-gradient-to-r from-[#6366f1] to-[#ec4899] text-white font-semibold hover:from-[#818cf8] hover:to-[#f472b6]",
    text: "text-gray-900 dark:text-white",
    accent: "from-[#6366f1] to-[#ec4899]",
  },
  ocean: {
    name: "Ocean",
    background: "bg-gradient-to-br from-[#a7f3d0] via-[#38bdf8] to-[#6366f1]",
    card: "bg-white/80 backdrop-blur-xl border border-blue-200 shadow-2xl",
    button: "bg-gradient-to-r from-[#38bdf8] to-[#6366f1] text-white font-semibold hover:from-[#0ea5e9] hover:to-[#818cf8]",
    text: "text-blue-900",
    accent: "from-[#38bdf8] to-[#6366f1]",
  },
  sunset: {
    name: "Sunset",
    background: "bg-gradient-to-br from-[#fbc2eb] via-[#fcd34d] to-[#fda4af]",
    card: "bg-white/80 backdrop-blur-xl border border-pink-200 shadow-2xl",
    button: "bg-gradient-to-r from-[#f472b6] to-[#fcd34d] text-white font-semibold hover:from-[#f9a8d4] hover:to-[#fde68a]",
    text: "text-pink-900",
    accent: "from-[#f472b6] to-[#fcd34d]",
  },
  dark: {
    name: "Dark",
    background: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700",
    card: "bg-gray-800/90 backdrop-blur-xl border border-gray-700 shadow-2xl",
    button: "bg-gradient-to-r from-[#6366f1] to-[#ec4899] text-white font-semibold hover:from-[#818cf8] hover:to-[#f472b6]",
    text: "text-white",
    accent: "from-[#6366f1] to-[#ec4899]",
  },
  forest: {
    name: "Forest",
    background: "bg-gradient-to-br from-[#d1fae5] via-[#6ee7b7] to-[#065f46]",
    card: "bg-white/80 backdrop-blur-xl border border-green-200 shadow-2xl",
    button: "bg-gradient-to-r from-[#34d399] to-[#065f46] text-white font-semibold hover:from-[#6ee7b7] hover:to-[#10b981]",
    text: "text-green-900",
    accent: "from-[#34d399] to-[#065f46]",
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
  const [selectedTheme, setSelectedTheme] = useState<string>('classic')
  const { toast } = useToast()

  // Unwrap params if it's a Promise (Next.js App Router dynamic route)
  const [username, setUsername] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      let uname = params.username;
      if (typeof uname?.then === 'function') {
        uname = await uname;
      }
      setUsername(uname);
    })();
  }, [params.username]);

  useEffect(() => {
    if (username) loadBioData(username);
  }, [username]);

  // Set theme from user data if available
  useEffect(() => {
    if (bioData && bioData.theme && themes[bioData.theme]) {
      setSelectedTheme(bioData.theme)
    }
  }, [bioData])

  // Save theme selection (simulate API call)
  const handleThemeChange = async (themeKey: string) => {
    setSelectedTheme(themeKey)
    // TODO: Call API to persist theme for user (if authenticated/owner)
    // await apiClient.updateUserTheme(username, themeKey)
  }

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

  const loadBioData = async (uname: string) => {
    try {
      const response = await apiClient.getPublicBioPage(uname)
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

  const currentTheme = themes[selectedTheme as keyof typeof themes] || themes.classic

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

      <div className={`min-h-screen ${currentTheme.background} py-10 px-4 flex flex-col items-center relative`}>
        {/* Theme Picker (show only if user is owner, here always for demo) */}
        <div className="flex gap-2 mb-8 mt-2 flex-wrap justify-center">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              className={`rounded-full px-4 py-1 text-xs font-semibold border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedTheme === key ? 'border-pink-500 bg-gradient-to-r ' + theme.accent + ' text-white shadow-lg scale-105' : 'border-transparent bg-white/30 text-gray-700 hover:scale-105'}`}
              onClick={() => handleThemeChange(key)}
            >
              {theme.name}
            </button>
          ))}
        </div>
        {/* Blurred background accent */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-[#6366f1]/30 to-[#ec4899]/30 rounded-full blur-3xl opacity-60" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`${currentTheme.card} rounded-2xl p-8 mb-8 text-center shadow-2xl border border-white/30 relative overflow-hidden max-w-md mx-auto`}
            style={{ backdropFilter: 'blur(16px)' }}
          >
            <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-white/40 shadow-lg">
              <AvatarImage src={bioData.avatar || "/placeholder.svg"} alt={bioData.displayName} />
              <AvatarFallback className="text-3xl font-bold">
                {bioData.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <h1 className={`text-3xl font-extrabold mb-2 tracking-tight ${currentTheme.text}`}>{bioData.displayName}</h1>

            <p className={`${currentTheme.text} opacity-80 mb-4 leading-relaxed text-base`}>{bioData.bio}</p>

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
                      className={`w-10 h-10 p-0 rounded-full ${currentTheme.text} hover:bg-white/20 border border-white/30 shadow-md bg-white/10`}
                      onClick={() => window.open(url, "_blank")}
                    >
                      <Icon className="w-5 h-5" />
                    </Button>
                  )
                })}
              </div>
            )}

            {/* Stats */}
            <div className="flex justify-center gap-8 text-base mt-4">
              <div className={`${currentTheme.text} opacity-80 flex items-center gap-2`}>
                <Eye className="w-5 h-5" />
                <span>{bioData.analytics.totalViews.toLocaleString()} views</span>
              </div>
              <div className={`${currentTheme.text} opacity-80 flex items-center gap-2`}>
                <ExternalLink className="w-5 h-5" />
                <span>{bioData.analytics.totalClicks.toLocaleString()} clicks</span>
              </div>
            </div>
          </motion.div>

          {/* Links Section */}
          <div className="space-y-5 w-full max-w-md mx-auto">
            {bioData.links
              .filter((link) => link.active)
              .map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                >
                  <button
                    onClick={() => handleLinkClick(link)}
                    className={`w-full h-auto p-0 group rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] ${currentTheme.button} relative overflow-hidden border border-white/30 backdrop-blur-xl`}
                    style={{ minHeight: 60 }}
                  >
                    <div className="flex items-center gap-4 w-full px-6 py-4">
                      {link.icon && <div className="text-2xl flex-shrink-0">{link.icon}</div>}
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-lg mb-1 text-white drop-shadow-lg">{link.title}</div>
                        {link.description && <div className="text-sm text-white/80">{link.description}</div>}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="bg-black/40 text-white text-xs rounded-full px-3 py-1 font-semibold shadow">{link.clicks}</span>
                        <ExternalLink className="w-4 h-4 opacity-80 text-white" />
                      </div>
                    </div>
                    <span className="absolute inset-0 opacity-0 group-hover:opacity-10 transition bg-black" />
                  </button>
                </motion.div>
              ))}
          </div>

          {/* Share Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-10 text-center"
          >
            <Button onClick={handleShare} variant="ghost" className={`text-lg px-6 py-3 rounded-full font-semibold shadow-lg bg-white/30 hover:bg-white/40 text-gray-900 dark:text-white backdrop-blur border border-white/30`}>
              <Share2 className="w-5 h-5 mr-2" />
              Share this page
            </Button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-10 text-center"
          >
            <p className={`text-xs text-gray-700 dark:text-white/60 opacity-80`}>Made with <span className="text-pink-500">♥</span> by LinkWeaver</p>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}
