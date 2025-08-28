"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  ExternalLink, Share2, Instagram, Twitter, 
  Youtube, Github, Linkedin, Globe, Mail, Phone
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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
    email?: string
    phone?: string
  }
  analytics: {
    totalViews: number
    totalClicks: number
  }
}

const themes = {
  light: {
    name: "Light",
    background: "bg-white",
    text: "text-gray-900",
    subtext: "text-gray-600",
    button: "bg-gray-900 hover:bg-gray-700 text-white border border-gray-900",
    socialButton: "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200",
  },
  dark: {
    name: "Dark", 
    background: "bg-gray-900",
    text: "text-white",
    subtext: "text-gray-300",
    button: "bg-white hover:bg-gray-100 text-gray-900 border border-white",
    socialButton: "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700",
  },
  gradient: {
    name: "Gradient",
    background: "bg-gradient-to-br from-purple-400 via-pink-400 to-red-400",
    text: "text-white",
    subtext: "text-white/80",
    button: "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30",
    socialButton: "bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20",
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

export default function PublicBioPage({ params }: { params: { username: string } }) {
  const [bioData, setBioData] = useState<BioPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTheme, setSelectedTheme] = useState<string>('light')
  const { toast } = useToast()

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
    }
  }, [username]);

  useEffect(() => {
    if (bioData && bioData.theme && themes[bioData.theme as keyof typeof themes]) {
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
      theme: data.theme || 'light',
      isActive: data.isActive !== undefined ? data.isActive : true,
      links: (data.links || []).map((link: any) => ({
        id: link.id,
        title: link.title,
        url: link.url,
        active: link.active !== undefined ? link.active : true,
        clicks: link.clickCount || link.clicks || 0,
      })),
      socialLinks: data.socialLinks || {},
      analytics: {
        totalViews: data.totalViews || 0,
        totalClicks: (data.links || []).reduce((sum: number, l: any) => sum + (l.clickCount || l.clicks || 0), 0) || 0,
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
          title: `${bioData?.displayName}'s links`,
          text: bioData?.bio,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied!",
          description: "Profile URL copied to clipboard",
        })
      }
    } catch (error) {
      console.error("Failed to share:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-sm mx-auto px-6 py-12">
          <div className="animate-pulse space-y-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto" />
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-full mx-auto" />
            <div className="space-y-3">
              <div className="h-12 bg-gray-200 rounded-full" />
              <div className="h-12 bg-gray-200 rounded-full" />
              <div className="h-12 bg-gray-200 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !bioData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Page not found</h1>
          <p className="text-gray-600 mb-6">{error || "This profile doesn't exist"}</p>
          <Button onClick={() => window.history.back()}>
            Go back
          </Button>
        </div>
      </div>
    )
  }

  const currentTheme = themes[selectedTheme as keyof typeof themes] || themes.light
  const activeLinks = bioData.links.filter(link => link.active)

  return (
    <>
      <Head>
        <title>{bioData.displayName} - LinkWeaver</title>
        <meta name="description" content={bioData.bio} />
        <meta property="og:title" content={`${bioData.displayName} - LinkWeaver`} />
        <meta property="og:description" content={bioData.bio} />
        <meta property="og:type" content="profile" />
        {bioData.avatar && <meta property="og:image" content={bioData.avatar} />}
      </Head>

      <div className={`min-h-screen ${currentTheme.background}`}>
        {/* Theme selector - only show if you want users to change themes */}
        <div className="absolute top-4 right-4 flex gap-2">
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => setSelectedTheme(key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                selectedTheme === key 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {theme.name}
            </button>
          ))}
        </div>

        <div className="max-w-sm mx-auto px-6 py-12">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <Avatar className="w-20 h-20 mx-auto mb-4">
              <AvatarImage src={bioData.avatar || "/placeholder.svg"} alt={bioData.displayName} />
              <AvatarFallback className="text-2xl font-bold bg-gray-200 text-gray-700">
                {bioData.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <h1 className={`text-xl font-bold mb-2 ${currentTheme.text}`}>
              {bioData.displayName}
            </h1>

            {bioData.bio && (
              <p className={`${currentTheme.subtext} text-sm mb-4`}>
                {bioData.bio}
              </p>
            )}

            {/* Social Links */}
            {Object.keys(bioData.socialLinks).length > 0 && (
              <div className="flex justify-center gap-3 mb-6">
                {Object.entries(bioData.socialLinks).map(([platform, url]) => {
                  if (!url) return null
                  const Icon = socialIcons[platform as keyof typeof socialIcons]
                  return (
                    <motion.button
                      key={platform}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open(url, "_blank")}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${currentTheme.socialButton}`}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.button>
                  )
                })}
              </div>
            )}
          </motion.div>

          {/* Links */}
          <div className="space-y-4 mb-8">
            {activeLinks.map((link, index) => (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLinkClick(link)}
                className={`w-full py-4 px-6 rounded-full font-medium text-center transition-all ${currentTheme.button}`}
              >
                {link.title}
              </motion.button>
            ))}
          </div>

          {/* Stats (only show if there are actual clicks/views) */}
          {(bioData.analytics.totalViews > 0 || bioData.analytics.totalClicks > 0) && (
            <div className="flex justify-center gap-6 mb-6">
              {bioData.analytics.totalViews > 0 && (
                <div className="text-center">
                  <div className={`text-lg font-bold ${currentTheme.text}`}>
                    {bioData.analytics.totalViews.toLocaleString()}
                  </div>
                  <div className={`text-xs ${currentTheme.subtext}`}>views</div>
                </div>
              )}
              {bioData.analytics.totalClicks > 0 && (
                <div className="text-center">
                  <div className={`text-lg font-bold ${currentTheme.text}`}>
                    {bioData.analytics.totalClicks.toLocaleString()}
                  </div>
                  <div className={`text-xs ${currentTheme.subtext}`}>clicks</div>
                </div>
              )}
            </div>
          )}

          {/* Share Button */}
          <div className="text-center">
            <Button
              onClick={handleShare}
              variant="ghost"
              size="sm"
              className={`${currentTheme.subtext} hover:${currentTheme.text}`}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className={`text-xs ${currentTheme.subtext}`}>
              Create your own with LinkWeaver
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
