"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  ExternalLink, Share2, Eye, Globe, Instagram, Twitter, 
  Youtube, Github, Linkedin, Star, Verified, MapPin,
  Clock, TrendingUp, Users, Heart, MessageCircle, 
  Calendar, Mail, Phone, Link as LinkIcon, Sparkles
} from "lucide-react"
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
  verified?: boolean
  location?: string
  website?: string
  links: Array<{
    id: string
    title: string
    url: string
    description?: string
    icon?: string
    active: boolean
    clicks: number
    featured?: boolean
    category?: string
  }>
  socialLinks: {
    instagram?: string
    twitter?: string
    youtube?: string
    github?: string
    linkedin?: string
    website?: string
    email?: string
    phone?: string
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
    followers?: number
    engagement?: number
  }
}

const themes = {
  gradient: {
    name: "Gradient",
    background: "bg-gradient-to-br from-purple-400 via-pink-400 to-red-400",
    overlay: "bg-black/20",
    card: "bg-white/95 backdrop-blur-xl border-0 shadow-2xl",
    button: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl",
    text: "text-gray-900",
    accent: "text-purple-600",
    featured: "bg-gradient-to-r from-yellow-400 to-orange-500",
  },
  glassmorphism: {
    name: "Glass",
    background: "bg-gradient-to-br from-blue-50 via-white to-purple-50",
    overlay: "bg-gradient-to-br from-blue-500/10 to-purple-500/10",
    card: "bg-white/40 backdrop-blur-2xl border border-white/50 shadow-2xl",
    button: "bg-white/80 hover:bg-white/90 text-gray-900 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-xl",
    text: "text-gray-900",
    accent: "text-blue-600",
    featured: "bg-gradient-to-r from-blue-400 to-purple-500",
  },
  neon: {
    name: "Neon",
    background: "bg-gray-900",
    overlay: "bg-gradient-to-br from-cyan-500/20 to-purple-500/20",
    card: "bg-gray-800/80 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20",
    button: "bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 text-white shadow-lg shadow-cyan-500/30",
    text: "text-white",
    accent: "text-cyan-400",
    featured: "bg-gradient-to-r from-yellow-400 to-pink-500 shadow-lg shadow-pink-500/30",
  },
  minimal: {
    name: "Minimal",
    background: "bg-white",
    overlay: "bg-gradient-to-br from-gray-50 to-gray-100",
    card: "bg-white border border-gray-200 shadow-xl",
    button: "bg-gray-900 hover:bg-gray-800 text-white shadow-lg",
    text: "text-gray-900",
    accent: "text-gray-600",
    featured: "bg-gray-900",
  },
  sunset: {
    name: "Sunset",
    background: "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600",
    overlay: "bg-black/10",
    card: "bg-white/90 backdrop-blur-xl border-0 shadow-2xl",
    button: "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg",
    text: "text-gray-900",
    accent: "text-orange-600",
    featured: "bg-gradient-to-r from-yellow-400 to-orange-500",
  }
}

const socialIcons = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  github: Github,
  linkedin: Linkedin,
  website: Globe,
  email: Mail,
  phone: Phone,
}

const categoryIcons = {
  social: Users,
  work: LinkIcon,
  creative: Sparkles,
  contact: Mail,
  default: ExternalLink
}

export default function PublicBioPage({ params }: { params: { username: string } }) {
  const [bioData, setBioData] = useState<BioPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTheme, setSelectedTheme] = useState<string>('gradient')
  const [viewCount, setViewCount] = useState(0)
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
    if (username) {
      loadBioData(username);
      // Simulate view tracking
      setViewCount(prev => prev + 1);
    }
  }, [username]);

  useEffect(() => {
    if (bioData && bioData.theme && themes[bioData.theme]) {
      setSelectedTheme(bioData.theme)
    }
  }, [bioData])

  const mapBackendToBioData = (data: any): BioPageData => {
    return {
      id: data.id,
      username: data.username,
      displayName: data.name || data.displayName || data.username,
      bio: data.bio || '',
      avatar: data.image || data.avatar || '',
      theme: data.theme || 'gradient',
      isActive: data.isActive !== undefined ? data.isActive : true,
      verified: data.verified || false,
      location: data.location,
      website: data.website,
      links: (data.links || []).map((link: any, index: number) => ({
        id: link.id,
        title: link.title,
        url: link.url,
        description: link.description || '',
        icon: link.icon || '',
        active: link.active !== undefined ? link.active : true,
        clicks: link.clickCount || link.clicks || Math.floor(Math.random() * 100),
        featured: index < 2, // First two links are featured
        category: link.category || 'default',
      })),
      socialLinks: data.socialLinks || {},
      customization: data.customization || {
        backgroundColor: '',
        textColor: '',
        buttonStyle: '',
        fontFamily: '',
      },
      analytics: {
        totalViews: data.totalViews || 1247,
        totalClicks: (data.links || []).reduce((sum: number, l: any) => sum + (l.clickCount || l.clicks || 0), 0) || 856,
        followers: data.followers || 2341,
        engagement: data.engagement || 89.5,
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
      window.open(link.url, "_blank")
      // Simulate click tracking
      setBioData(prev => prev ? {
        ...prev,
        links: prev.links.map(l => 
          l.id === link.id ? { ...l, clicks: l.clicks + 1 } : l
        ),
        analytics: {
          ...prev.analytics,
          totalClicks: prev.analytics.totalClicks + 1
        }
      } : null)
      
      toast({
        title: "Link opened!",
        description: `Opening ${link.title}`,
      })
    } catch (error) {
      console.error("Failed to track click:", error)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${bioData?.displayName}'s LinkWeaver`,
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
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center p-4">
        <div className="w-full max-w-sm space-y-6">
          <Skeleton className="h-32 w-32 rounded-full mx-auto" />
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !bioData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <div className="text-6xl mb-4">🔍</div>
              <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
              <p className="text-gray-600 mb-6">{error || "This bio page doesn't exist"}</p>
              <Button onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  const currentTheme = themes[selectedTheme as keyof typeof themes] || themes.gradient
  const featuredLinks = bioData.links.filter(link => link.active && link.featured)
  const regularLinks = bioData.links.filter(link => link.active && !link.featured)

  return (
    <>
      <Head>
        <title>{bioData.displayName} - LinkWeaver Bio</title>
        <meta name="description" content={bioData.bio} />
        <meta property="og:title" content={`${bioData.displayName} - LinkWeaver Bio`} />
        <meta property="og:description" content={bioData.bio} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`${typeof window !== 'undefined' ? window.location.origin : ''}/u/${bioData.username}`} />
        {bioData.avatar && <meta property="og:image" content={bioData.avatar} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${bioData.displayName} - LinkWeaver Bio`} />
        <meta name="twitter:description" content={bioData.bio} />
      </Head>

      <div className={`min-h-screen ${currentTheme.background} relative`}>
        {/* Background overlay */}
        <div className={`absolute inset-0 ${currentTheme.overlay}`} />
        
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8 max-w-md">
          {/* Header with theme selector */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <div className="flex gap-2 p-2 bg-white/20 backdrop-blur-lg rounded-full">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                    selectedTheme === key 
                      ? 'bg-white text-gray-900 shadow-lg scale-105' 
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedTheme(key)}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className={`${currentTheme.card} rounded-3xl p-8 mb-8 text-center relative overflow-hidden`}
          >
            {/* Profile Image with Status */}
            <div className="relative mb-6">
              <Avatar className="w-28 h-28 mx-auto ring-4 ring-white/50 shadow-xl">
                <AvatarImage src={bioData.avatar || "/placeholder.svg"} alt={bioData.displayName} />
                <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                  {bioData.displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {bioData.verified && (
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                  <Verified className="w-5 h-5 text-white fill-current" />
                </div>
              )}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
                🟢 Online
              </div>
            </div>

            {/* Name and Bio */}
            <h1 className={`text-3xl font-bold mb-2 ${currentTheme.text}`}>
              {bioData.displayName}
            </h1>
            
            {bioData.location && (
              <div className={`flex items-center justify-center gap-1 mb-3 ${currentTheme.accent}`}>
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{bioData.location}</span>
              </div>
            )}

            <p className={`${currentTheme.text} text-lg mb-6 leading-relaxed opacity-90`}>
              {bioData.bio}
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className={`text-2xl font-bold ${currentTheme.text}`}>
                  {bioData.analytics.totalViews.toLocaleString()}
                </div>
                <div className={`text-sm ${currentTheme.accent}`}>Views</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${currentTheme.text}`}>
                  {bioData.analytics.followers?.toLocaleString() || '2.3K'}
                </div>
                <div className={`text-sm ${currentTheme.accent}`}>Followers</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${currentTheme.text}`}>
                  {bioData.analytics.engagement?.toFixed(1) || '89.5'}%
                </div>
                <div className={`text-sm ${currentTheme.accent}`}>Engagement</div>
              </div>
            </div>

            {/* Social Links */}
            {Object.keys(bioData.socialLinks).length > 0 && (
              <div className="flex justify-center gap-3 mb-4">
                {Object.entries(bioData.socialLinks).map(([platform, url]) => {
                  if (!url) return null
                  const Icon = socialIcons[platform as keyof typeof socialIcons]
                  return (
                    <motion.button
                      key={platform}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${currentTheme.button} transition-all`}
                      onClick={() => window.open(url, "_blank")}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.button>
                  )
                })}
              </div>
            )}
          </motion.div>

          {/* Featured Links */}
          {featuredLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-white/90 font-semibold mb-4 px-2">✨ Featured</h2>
              <div className="space-y-4">
                {featuredLinks.map((link, index) => {
                  const CategoryIcon = categoryIcons[link.category as keyof typeof categoryIcons] || ExternalLink
                  return (
                    <motion.button
                      key={link.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleLinkClick(link)}
                      className={`w-full ${currentTheme.featured} text-white p-6 rounded-2xl shadow-xl transition-all group relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex items-center gap-4 relative">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          {link.icon ? <span className="text-2xl">{link.icon}</span> : <CategoryIcon className="w-6 h-6" />}
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-bold text-lg mb-1">{link.title}</div>
                          {link.description && (
                            <div className="text-white/80 text-sm">{link.description}</div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium mb-1">
                            {link.clicks}
                          </div>
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Regular Links */}
          {regularLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4 mb-8"
            >
              {regularLinks.map((link, index) => {
                const CategoryIcon = categoryIcons[link.category as keyof typeof categoryIcons] || ExternalLink
                return (
                  <motion.button
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLinkClick(link)}
                    className={`w-full ${currentTheme.button} p-5 rounded-2xl transition-all group relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-4 relative">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        {link.icon ? <span className="text-xl">{link.icon}</span> : <CategoryIcon className="w-5 h-5" />}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-base">{link.title}</div>
                        {link.description && (
                          <div className="text-sm opacity-80">{link.description}</div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
                          {link.clicks}
                        </span>
                        <ExternalLink className="w-4 h-4 opacity-60" />
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          )}

          {/* Share Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mb-8"
          >
            <Button
              onClick={handleShare}
              className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-lg border border-white/30 rounded-2xl px-8 py-3"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Profile
            </Button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-center"
          >
            <p className="text-white/60 text-sm">
              Create your own with{" "}
              <span className="font-semibold text-white">LinkWeaver</span> ✨
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
