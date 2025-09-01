"use client"
import React, { useState, useEffect } from "react";
import apiClient from "@/lib/api-client";
import { useAuth } from "@/hooks/use-auth-fixed";
// Placeholder components for all missing icons/components (accept props)
const Instagram = (props: any) => <></>;
const Twitter = (props: any) => <></>;
const Youtube = (props: any) => <></>;
const Github = (props: any) => <></>;
const Linkedin = (props: any) => <></>;
const Globe = (props: any) => <></>;
const Mail = (props: any) => <></>;
const Phone = (props: any) => <></>;
const Palette = (props: any) => <></>;
const Save = (props: any) => <></>;
const Download = (props: any) => <></>;
const Layout = (props: any) => <></>;
const Type = (props: any) => <></>;
const Settings = (props: any) => <></>;
const ImageIcon = (props: any) => <></>;
const Sliders = (props: any) => <></>;
const Crown = (props: any) => <></>;
const Star = (props: any) => <></>;
const MapPin = (props: any) => <></>;
const AvatarImage = (props: any) => <></>;
const AvatarFallback = (props: any) => <></>;
const AnimatePresence = (props: any) => <>{props.children}</>;
const ExternalLink = (props: any) => <></>;
const Share2 = (props: any) => <></>;
const Sparkles = (props: any) => <></>;
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SafeIcon } from "@/components/safe-icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { useTheme } from "next-themes";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckIcon, CopyIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/aceternity/aurora-background";
import { BackgroundBeams } from "@/components/aceternity/background-beams";
import { BioLinkCard } from "@/components/bio-link-card";
interface PremiumBioData {
  username: string;
  displayName: string;
  bio: string;
  avatar?: string;
  theme: string;
  isActive: boolean;
  isPro?: boolean;
  verified?: boolean;
  location?: string;
  website?: string;
  links: any[];
  socialLinks: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
    github?: string;
    linkedin?: string;
    website?: string;
    email?: string;
    phone?: string;
  };
  analytics: {
    totalViews: number;
    totalClicks: number;
  };
}

const premiumThemes = {
  aurora: {
    name: "Aurora",
    background: "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900",
    overlay: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
    card: "bg-white/10 backdrop-blur-2xl border border-white/20",
    button: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
    text: "text-white",
    accent: "text-purple-300",
    glow: "shadow-lg shadow-purple-500/25",
  },
  neon: {
    name: "Neon City",
    background: "bg-gray-900",
    overlay: "bg-gradient-to-br from-cyan-500/10 to-pink-500/10",
    card: "bg-gray-800/80 backdrop-blur-xl border border-cyan-400/30",
    button: "bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400",
    text: "text-white",
    accent: "text-cyan-400",
    glow: "shadow-lg shadow-cyan-400/25",
  },
  black: {
    name: "Pure Black",
    background: "bg-black",
    overlay: "bg-gradient-to-br from-gray-800/20 to-gray-900/20",
    card: "bg-gray-900/90 backdrop-blur-xl border border-gray-700/50",
    button: "bg-white hover:bg-gray-100 text-black",
    text: "text-white",
    accent: "text-gray-400",
    glow: "shadow-lg shadow-black/50",
  },
  midnight: {
    name: "Midnight",
    background: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
    overlay: "bg-gradient-to-br from-violet-500/10 to-purple-500/10",
    card: "bg-slate-800/50 backdrop-blur-2xl border border-slate-700/50",
    button: "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500",
    text: "text-white",
    accent: "text-violet-400",
    glow: "shadow-lg shadow-violet-500/25",
  },
  glassmorphism: {
    name: "Glass",
    background: "bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100",
    overlay: "bg-white/10",
    card: "bg-white/30 backdrop-blur-2xl border border-white/40",
    button: "bg-white/20 hover:bg-white/30 text-gray-900 backdrop-blur-xl border border-white/40",
    text: "text-gray-900",
    accent: "text-indigo-600",
    glow: "shadow-xl shadow-indigo-500/20",
  },
  sunset: {
    name: "Sunset",
    background: "bg-gradient-to-br from-orange-400 via-red-500 to-pink-500",
    overlay: "bg-gradient-to-br from-yellow-400/20 to-red-500/20",
    card: "bg-white/15 backdrop-blur-2xl border border-white/25",
    button: "bg-white/20 hover:bg-white/30 text-white backdrop-blur-xl",
    text: "text-white",
    accent: "text-yellow-200",
    glow: "shadow-lg shadow-orange-500/30",
  },
  forest: {
    name: "Forest",
    background: "bg-gradient-to-br from-green-800 via-emerald-700 to-teal-600",
    overlay: "bg-gradient-to-br from-green-400/20 to-teal-400/20",
    card: "bg-white/15 backdrop-blur-2xl border border-white/25",
    button: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400",
    text: "text-white",
    accent: "text-emerald-300",
    glow: "shadow-lg shadow-emerald-500/25",
  },
  ocean: {
    name: "Ocean",
    background: "bg-gradient-to-br from-blue-800 via-cyan-700 to-teal-800",
    overlay: "bg-gradient-to-br from-blue-400/20 to-cyan-400/20",
    card: "bg-white/15 backdrop-blur-2xl border border-white/25",
    button: "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400",
    text: "text-white",
    accent: "text-cyan-300",
    glow: "shadow-lg shadow-cyan-500/25",
  }
}

// FIXED: Proper button style definitions
const buttonStyles = {
  rounded: { class: "rounded-full", name: "Rounded" },
  square: { class: "rounded-lg", name: "Square" },
  modern: { class: "rounded-2xl", name: "Modern" },
  pill: { class: "rounded-full", name: "Pill" },
  minimal: { class: "rounded-md", name: "Minimal" },
  sharp: { class: "rounded-none", name: "Sharp" },
};

// FIXED: Proper font family definitions with actual CSS classes
const fontFamilies = {
  inter: { class: "font-sans", name: "Inter" },
  mono: { class: "font-mono", name: "Monospace" },
  serif: { class: "font-serif", name: "Serif" },
  system: { class: "font-system-ui", name: "System UI" },
};

const socialIcons = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  github: Github,
  linkedin: Linkedin,
  website: Globe,
  email: Mail,
  phone: Phone,
};

export default function PremiumBioPage({ params }: { params: { username: string } }) {
  // Authentication hook
  const { user, isAuthenticated } = useAuth()
  
  // Existing state
  const [bioData, setBioData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTheme, setSelectedTheme] = useState<string>('aurora')
  const [showCustomizer, setShowCustomizer] = useState(false)

  // FIXED: Advanced customization state with proper defaults
  const [fontSize, setFontSize] = useState(16)
  const [backgroundImage, setBackgroundImage] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#8B5CF6')
  const [secondaryColor, setSecondaryColor] = useState('#EC4899')
  const [fontFamily, setFontFamily] = useState('inter')
  const [buttonStyle, setButtonStyle] = useState('modern')
  const [buttonOpacity, setButtonOpacity] = useState(100)
  const [cardOpacity, setCardOpacity] = useState(90)
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [borderRadius, setBorderRadius] = useState(16)
  const [particlesEnabled, setParticlesEnabled] = useState(true)
  const [blurIntensity, setBlurIntensity] = useState(20)
  const [glowIntensity, setGlowIntensity] = useState(25)
  const [profileViews, setProfileViews] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)

  const [username, setUsername] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      let uname = params.username;
      setUsername(uname);
    })();
  }, [params.username]);

  useEffect(() => {
    if (username) {
      loadBioData(username);
    }
  }, [username]);

  useEffect(() => {
    if (bioData && bioData.theme && premiumThemes[bioData.theme as keyof typeof premiumThemes]) {
      setSelectedTheme(bioData.theme)
    }
  }, [bioData])

  // Scroll tracking for enhanced UX
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min((window.scrollY / totalHeight) * 100, 100)
      
      setIsScrolled(scrolled)
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const mapBackendToBioData = (data: any) => {
    return {
      id: data.id,
      username: data.username,
      displayName: data.name || data.displayName || data.username,
      bio: data.bio || '',
      avatar: data.image || data.avatar || '',
      theme: data.theme || 'aurora',
      isActive: data.isActive !== undefined ? data.isActive : true,
      isPro: data.isPro || false,
      verified: data.verified || false,
      location: data.location,
      website: data.website,
      links: (data.links || []).map((link: any) => ({
        id: link.id,
        title: link.title,
        url: link.url,
        description: link.description || '',
        icon: link.icon || '',
        active: link.active !== undefined ? link.active : true,
        clicks: link.clickCount || link.clicks || 0,
        style: link.style || 'default',
        thumbnail: link.thumbnail,
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
        setError("This profile is not available")
        return
      }
      setBioData(mapped)
      
      // Show welcome message for profile owners
      setTimeout(() => {
        if (isAuthenticated && user && (user.username === mapped.username || user.username === uname)) {
          toast({
            title: "Welcome to your profile! 👋",
            description: "Click the settings icon to customize your page",
            className: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0"
          })
        }
      }, 1500) // Delay to let page load first
      
      // Track profile view (only count unique views)
      const viewKey = `profile_viewed_${uname}`
      if (!sessionStorage.getItem(viewKey)) {
        setProfileViews(prev => prev + 1)
        sessionStorage.setItem(viewKey, 'true')
        // You could also send this to your analytics API
        try {
          // await apiClient.trackProfileView?.(uname) // Optional future feature
        } catch (e) {
          // Silent fail for analytics
        }
      }
    } catch (error: any) {
      console.error("Failed to load bio page:", error)
      setError("Profile not found")
    } finally {
      setLoading(false)
    }
  }

  const handleLinkClick = async (link: any) => {
    try {
      // Enhanced click tracking with analytics
      const clickData = {
        linkId: link.id,
        timestamp: Date.now(),
        referrer: document.referrer,
        userAgent: navigator.userAgent
      }
      
      // Haptic feedback (if supported)
      if ('vibrate' in navigator) {
        navigator.vibrate(50)
      }
      
      // Store click locally for immediate feedback
      localStorage.setItem(`click_${link.id}_${Date.now()}`, JSON.stringify(clickData))
      
      // Show enhanced visual feedback
      toast({
        title: "🚀 Opening link",
        description: `Redirecting to ${link.title}`,
        className: "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-xl"
      })
      
      // Track click analytics (non-blocking)
      try {
        // await apiClient.trackLinkClick?.(link.id, clickData) // Optional future feature
      } catch (e) {
        // Silent fail for analytics
      }
      
      // Add a small delay for better UX and visual feedback
      setTimeout(() => {
        window.open(link.url, "_blank")
      }, 200)
      
    } catch (error) {
      console.error("Failed to track click:", error)
      // Still open the link even if tracking fails
      window.open(link.url, "_blank")
    }
  }

  // Check if current user is the profile owner
  const isProfileOwner = () => {
    return isAuthenticated && 
           user && 
           bioData && 
           (user.username === bioData.username || user.username === params.username)
  }

  const handleShare = async () => {
    try {
      const url = window.location.href
      
      if (navigator.share) {
        await navigator.share({
          title: `${bioData?.displayName}'s links`,
          text: bioData?.bio,
          url: url,
        })
        
        toast({
          title: "Shared successfully! 🎉",
          description: "Thanks for sharing this profile",
          className: "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0"
        })
      } else {
        await navigator.clipboard.writeText(url)
        
        toast({
          title: "Link copied! 📋",
          description: "Profile URL copied to clipboard",
          className: "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0"
        })
      }
      
      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate([50, 100, 50])
      }
      
    } catch (error) {
      console.error("Failed to share:", error)
      toast({
        title: "Oops! 😅",
        description: "Couldn't share the link. Please try again.",
        variant: "destructive"
      })
    }
  }

  const saveCustomizations = () => {
    const customizations = {
      theme: selectedTheme,
      fontSize,
      backgroundImage,
      primaryColor,
      secondaryColor,
      fontFamily,
      buttonStyle,
      buttonOpacity,
      cardOpacity,
      animationSpeed,
      borderRadius
    }
    localStorage.setItem(`linkweaver-${username}-customizations`, JSON.stringify(customizations))
    toast({
      title: "Customizations saved!",
      description: "Your style preferences have been saved locally",
    })
  }

  const loadCustomizations = () => {
    try {
      const saved = localStorage.getItem(`linkweaver-${username}-customizations`)
      if (saved) {
        const customizations = JSON.parse(saved)
        setSelectedTheme(customizations.theme || 'aurora')
        setFontSize(customizations.fontSize || 16)
        setBackgroundImage(customizations.backgroundImage || '')
        setPrimaryColor(customizations.primaryColor || '#8B5CF6')
        setSecondaryColor(customizations.secondaryColor || '#EC4899')
        setFontFamily(customizations.fontFamily || 'inter')
        setButtonStyle(customizations.buttonStyle || 'modern')
        setButtonOpacity(customizations.buttonOpacity || 100)
        setCardOpacity(customizations.cardOpacity || 90)
        setAnimationSpeed(customizations.animationSpeed || 1)
        setBorderRadius(customizations.borderRadius || 16)
        toast({
          title: "Customizations loaded!",
          description: "Your saved preferences have been applied",
        })
      }
    } catch (error) {
      console.error("Failed to load customizations:", error)
    }
  }

  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
          {/* Animated background particles */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-20, 20],
                  x: [-10, 10],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center relative z-10"
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center"
              animate={{ 
                rotate: 360,
                boxShadow: [
                  "0 0 20px #8B5CF6",
                  "0 0 40px #EC4899", 
                  "0 0 20px #8B5CF6"
                ]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                boxShadow: { duration: 3, repeat: Infinity }
              }}
            >
              <motion.div
                className="w-8 h-8 border-3 border-white/50 border-t-white rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
            
            <motion.h2 
              className="text-white text-2xl font-bold mb-3"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Loading Profile...
            </motion.h2>
            
            <motion.p 
              className="text-white/60 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Preparing your amazing link page
            </motion.p>
            
            <div className="flex justify-center gap-2">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-white/60 rounded-full"
                  animate={{ 
                    scale: [1, 1.5, 1], 
                    opacity: [0.3, 1, 0.3],
                    y: [0, -10, 0]
                  }}
                  transition={{ 
                    duration: 1.2, 
                    repeat: Infinity,
                    delay: i * 0.15 
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </ThemeProvider>
    )
  }

  if (error || !bioData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white"
        >
          <div className="text-8xl mb-4">🚫</div>
          <h1 className="text-3xl font-bold mb-2">Profile Not Found</h1>
          <p className="text-white/80 mb-6">{error || "This profile doesn't exist"}</p>
          <Button onClick={() => window.history.back()} className="bg-white/20 hover:bg-white/30">
            Go Back
          </Button>
        </motion.div>
      </div>
    )
  }

  const currentTheme = premiumThemes[selectedTheme as keyof typeof premiumThemes] || premiumThemes.aurora
  const activeLinks = bioData?.links?.filter((link: any) => link.active) || []

  // FIXED: Dynamic styles that actually work
  const containerStyle = {
    fontSize: `${fontSize}px`,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    '--primary-color': primaryColor,
    '--secondary-color': secondaryColor,
    '--border-radius': `${borderRadius}px`,
    '--animation-duration': `${animationSpeed}s`,
  } as React.CSSProperties

  // FIXED: Get actual font and button classes
  const currentFontClass = fontFamilies[fontFamily as keyof typeof fontFamilies]?.class || 'font-sans'
  const currentButtonClass = buttonStyles[buttonStyle as keyof typeof buttonStyles]?.class || 'rounded-2xl'
return (
  <ThemeProvider>
    <>
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 z-50"
        style={{ width: `${scrollProgress}%` }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.2 }}
      />
      
      <div
        className={`min-h-screen relative overflow-hidden ${currentTheme.background} ${currentFontClass} ${
          isProfileOwner() && showCustomizer ? 'border-l-4 border-emerald-400/50' : ''
        }`}
        style={containerStyle}
      >
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute inset-0 ${currentTheme.overlay}`} style={{ backdropFilter: `blur(${blurIntensity}px)` }} />
          
          {/* Animated gradient orbs */}
          <motion.div
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-white/5 to-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 50 / animationSpeed, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute -bottom-1/2 -right-1/2 w-3/4 h-3/4 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 60 / animationSpeed, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Floating particles */}
          {particlesEnabled && (
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [-20, 20],
                    x: [-10, 10],
                    opacity: [0.2, 0.8, 0.2],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Glow effects */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${primaryColor}${Math.round(glowIntensity * 2.55).toString(16).padStart(2, '0')} 0%, transparent 70%)`
            }}
          />
        </div>

        {/* Enhanced Customization Panel - Only show for profile owner */}
        {isProfileOwner() && (
          <motion.div
            initial={{ x: -100 }}
            animate={{ x: showCustomizer ? 0 : -400 }}
            className="fixed top-0 left-0 h-full w-96 bg-black/90 backdrop-blur-xl border-r border-white/10 z-50 overflow-y-auto"
          >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-xl flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Customize
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={saveCustomizations}
                  className="text-white hover:bg-white/10"
                  title="Save customizations"
                >
                  <Save className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadCustomizations}
                  className="text-white hover:bg-white/10"
                  title="Load saved customizations"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCustomizer(false)}
                  className="text-white hover:bg-white/10"
                >
                  ✕
                </Button>
              </div>
            </div>

            <div className="space-y-8">
              {/* Themes */}
              <div>
                <label className="text-white/90 text-sm font-semibold mb-4 flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  Themes
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(premiumThemes).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedTheme(key)}
                      className={`p-3 rounded-xl text-xs font-semibold transition-all ${selectedTheme === key
                        ? 'bg-white text-gray-900 scale-105 shadow-lg'
                        : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105'
                        }`}
                    >
                      {theme.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography - FIXED */}
              <div>
                <label className="text-white/90 text-sm font-semibold mb-4 flex items-center gap-2">
                  <Type className="w-4 h-4" />
                  Typography
                </label>
                <div className="space-y-4">
                  <div>
                    <label className="text-white/70 text-xs mb-2 block">Font Size: {fontSize}px</label>
                    <input
                      type="range"
                      min="12"
                      max="24"
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-xs mb-2 block">Font Family</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(fontFamilies).map(([key, font]) => (
                        <button
                          key={key}
                          onClick={() => setFontFamily(key)}
                          className={`p-2 rounded-lg text-xs font-medium transition-all ${fontFamily === key
                            ? 'bg-white text-gray-900'
                            : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                        >
                          {font.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Colors - FIXED */}
              <div>
                <label className="text-white/90 text-sm font-semibold mb-4 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Colors
                </label>
                <div className="space-y-4">
                  <div>
                    <label className="text-white/70 text-xs mb-2 block">Primary Color</label>
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-full h-10 rounded-lg border-2 border-white/20 bg-transparent cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-white/70 text-xs mb-2 block">Secondary Color</label>
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-full h-10 rounded-lg border-2 border-white/20 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Button Styles - FIXED */}
              <div>
                <label className="text-white/90 text-sm font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Button Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(buttonStyles).map(([key, style]) => (
                    <button
                      key={key}
                      onClick={() => setButtonStyle(key)}
                      className={`p-2 text-xs font-medium transition-all ${style.class} ${buttonStyle === key
                        ? 'bg-white text-gray-900'
                        : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Image - FIXED */}
              <div>
                <label className="text-white/90 text-sm font-semibold mb-4 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Background
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={backgroundImage}
                    onChange={(e) => setBackgroundImage(e.target.value)}
                    placeholder="Enter background image URL"
                    className="w-full p-3 rounded-lg bg-white/10 text-white placeholder-white/50 border border-white/20 text-sm focus:border-white/40 focus:outline-none"
                  />
                  {backgroundImage && (
                    <button
                      onClick={() => setBackgroundImage('')}
                      className="text-xs text-white/70 hover:text-white transition-colors"
                    >
                      Clear background image
                    </button>
                  )}
                </div>
              </div>

              {/* Advanced Settings - FIXED with working sliders */}
              <div>
                <label className="text-white/90 text-sm font-semibold mb-4 flex items-center gap-2">
                  <Sliders className="w-4 h-4" />
                  Advanced
                </label>
                <div className="space-y-6">
                  <div>
                    <label className="text-white/70 text-xs mb-2 block">Button Opacity: {buttonOpacity}%</label>
                    <div className="relative">
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={buttonOpacity}
                        onChange={(e) => setButtonOpacity(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(buttonOpacity - 20) / 0.8}%, #374151 ${(buttonOpacity - 20) / 0.8}%, #374151 100%)`
                        }}
                      />
                      <style jsx>{`
                        .slider::-webkit-slider-thumb {
                          appearance: none;
                          height: 16px;
                          width: 16px;
                          border-radius: 50%;
                          background: #3b82f6;
                          cursor: pointer;
                          border: 2px solid #ffffff;
                          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                        }
                        .slider::-moz-range-thumb {
                          height: 16px;
                          width: 16px;
                          border-radius: 50%;
                          background: #3b82f6;
                          cursor: pointer;
                          border: 2px solid #ffffff;
                          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                        }
                      `}</style>
                    </div>
                  </div>

                  <div>
                    <label className="text-white/70 text-xs mb-2 block">Card Opacity: {cardOpacity}%</label>
                    <div className="relative">
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={cardOpacity}
                        onChange={(e) => setCardOpacity(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #10b981 0%, #10b981 ${(cardOpacity - 20) / 0.8}%, #374151 ${(cardOpacity - 20) / 0.8}%, #374151 100%)`
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/70 text-xs mb-2 block">Animation Speed: {animationSpeed}x</label>
                    <div className="relative">
                      <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.1"
                        value={animationSpeed}
                        onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #f59e0b 0%, #f59e0b ${((animationSpeed - 0.5) / 2.5) * 100}%, #374151 ${((animationSpeed - 0.5) / 2.5) * 100}%, #374151 100%)`
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/70 text-xs mb-2 block">Border Radius: {borderRadius}px</label>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="32"
                        value={borderRadius}
                        onChange={(e) => setBorderRadius(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(borderRadius / 32) * 100}%, #374151 ${(borderRadius / 32) * 100}%, #374151 100%)`
                        }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-white/70 text-xs mb-2 block">Effects</label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/60 text-xs">Particles</span>
                        <button
                          onClick={() => setParticlesEnabled(!particlesEnabled)}
                          className={`w-12 h-6 rounded-full transition-all ${particlesEnabled ? 'bg-blue-500' : 'bg-gray-600'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${particlesEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                        </button>
                      </div>
                      
                      <div>
                        <label className="text-white/70 text-xs mb-2 block">Blur: {blurIntensity}px</label>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          value={blurIntensity}
                          onChange={(e) => setBlurIntensity(Number(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                      
                      <div>
                        <label className="text-white/70 text-xs mb-2 block">Glow: {glowIntensity}%</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={glowIntensity}
                          onChange={(e) => setGlowIntensity(Number(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Preview Badge */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-3 text-white text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-xs font-semibold">LIVE PREVIEW</span>
                </div>
                <p className="text-xs opacity-80">Changes apply instantly</p>
              </div>
            </div>
          </div>
        </motion.div>
        )}

        {/* Customizer Toggle - Only show for profile owner */}
        {isProfileOwner() && (
          <>
            <button
              onClick={() => setShowCustomizer(!showCustomizer)}
              className={`fixed top-6 left-6 z-40 p-3 rounded-full ${currentTheme.card} ${currentTheme.glow} transition-all hover:scale-110`}
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
            
            {/* Customization hint */}
            {!showCustomizer && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 }}
                className="fixed top-6 left-20 z-40 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10"
              >
                <p className="text-white text-xs whitespace-nowrap">
                  👈 Click to customize your page
                </p>
              </motion.div>
            )}
          </>
        )}

        <div className="relative z-10 max-w-md mx-auto px-6 py-12">
          {/* Profile Card - FIXED: Apply customizations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: animationSpeed }}
            className={`${currentTheme.card} ${currentTheme.glow} p-8 mb-8 text-center relative overflow-hidden`}
            style={{
              opacity: cardOpacity / 100,
              borderRadius: `${borderRadius}px`
            }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16" />

            <div className="relative mb-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Avatar className="w-32 h-32 mx-auto ring-4 ring-white/30 shadow-2xl">
                  <AvatarImage src={bioData.avatar || "/placeholder.svg"} alt={bioData.displayName} />
                  <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    {bioData.displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {bioData.verified && (
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                )}
                {bioData.isPro && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      PRO
                    </Badge>
                  </div>
                )}
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 * animationSpeed }}
              className={`text-3xl font-bold mb-2 ${currentTheme.text}`}
            >
              {bioData.displayName}
            </motion.h1>

            {bioData.location && (
              <div className={`flex items-center justify-center gap-1 mb-3 ${currentTheme.accent}`}>
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{bioData.location}</span>
              </div>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 * animationSpeed }}
              className={`${currentTheme.text} text-lg mb-6 leading-relaxed opacity-90`}
            >
              {bioData.bio}
            </motion.p>

            {/* Analytics - only show if there's real data */}
            {(bioData.analytics.totalViews > 0 || bioData.analytics.totalClicks > 0) && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {bioData.analytics.totalViews > 0 && (
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${currentTheme.text}`}>
                      {bioData.analytics.totalViews.toLocaleString()}
                    </div>
                    <div className={`text-sm ${currentTheme.accent}`}>Views</div>
                  </div>
                )}
                {bioData.analytics.totalClicks > 0 && (
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${currentTheme.text}`}>
                      {bioData.analytics.totalClicks.toLocaleString()}
                    </div>
                    <div className={`text-sm ${currentTheme.accent}`}>Clicks</div>
                  </div>
                )}
              </div>
            )}

            {/* Social Links */}
            {Object.keys(bioData.socialLinks).length > 0 && (
              <div className="flex justify-center gap-3 mb-4">
                {Object.entries(bioData.socialLinks).map(([platform, url]) => {
                  if (!url) return null
                  const Icon = socialIcons[platform as keyof typeof socialIcons]
                  return (
                    <motion.button
                      key={platform}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-12 h-12 flex items-center justify-center ${currentTheme.button} ${currentTheme.glow} transition-all`}
                      style={{
                        opacity: buttonOpacity / 100,
                        borderRadius: `${borderRadius * 0.75}px`
                      }}
                      onClick={() => url && window.open(url as string, "_blank")}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.button>
                  )
                })}
              </div>
            )}
          </motion.div>

          {/* Links - Enhanced with better animations and effects */}
          <div className="space-y-4 mb-8">
            <AnimatePresence>
              {activeLinks.map((link: any, index: number) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.9 }}
                  transition={{ 
                    delay: (0.1 + index * 0.05) * animationSpeed,
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -2,
                    boxShadow: `0 20px 25px -5px ${primaryColor}40, 0 10px 10px -5px ${primaryColor}20`
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleLinkClick(link)}
                  className={`w-full ${currentTheme.button} ${currentButtonClass} p-5 ${currentTheme.glow} transition-all group relative overflow-hidden backdrop-blur-xl`}
                  style={{
                    opacity: buttonOpacity / 100,
                    borderRadius: borderRadius !== 16 ? `${borderRadius}px` : undefined,
                    boxShadow: `0 4px 15px ${primaryColor}${Math.round(glowIntensity * 0.5).toString(16).padStart(2, '0')}`
                  }}
                >
                  {/* Enhanced hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  <div className="flex items-center gap-4 relative z-10">
                    {link.thumbnail && (
                      <motion.img
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        src={link.thumbnail}
                        alt=""
                        className="w-10 h-10 object-cover ring-2 ring-white/20"
                        style={{ borderRadius: `${borderRadius * 0.5}px` }}
                      />
                    )}
                    {link.icon && !link.thumbnail && (
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="w-10 h-10 bg-white/20 flex items-center justify-center ring-2 ring-white/10"
                        style={{ borderRadius: `${borderRadius * 0.5}px` }}
                      >
                        <span className="text-xl">{link.icon}</span>
                      </motion.div>
                    )}

                    <div className="flex-1 text-left">
                      <motion.div 
                        className="font-semibold text-base"
                        initial={{ opacity: 0.8 }}
                        whileHover={{ opacity: 1 }}
                      >
                        {link.title}
                      </motion.div>
                      {link.description && (
                        <motion.div 
                          className="text-sm opacity-80"
                          initial={{ opacity: 0.6 }}
                          whileHover={{ opacity: 0.9 }}
                        >
                          {link.description}
                        </motion.div>
                      )}
                    </div>

                    {link.clicks > 0 && (
                      <motion.div 
                        className="text-right"
                        whileHover={{ scale: 1.05 }}
                      >
                        <div
                          className="bg-white/20 px-2 py-1 text-xs font-medium backdrop-blur-sm"
                          style={{ borderRadius: `${Math.min(borderRadius * 0.25, 12)}px` }}
                        >
                          {link.clicks}
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 15 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <ExternalLink className="w-4 h-4 opacity-60" />
                    </motion.div>
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {/* Share Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 * animationSpeed }}
            className="text-center mb-8"
          >
            <Button
              onClick={handleShare}
              className={`${currentTheme.card} hover:bg-white/20 ${currentTheme.text} px-8 py-3 ${currentButtonClass}`}
              style={{
                borderRadius: borderRadius !== 16 ? `${borderRadius}px` : undefined
              }}
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Profile
            </Button>
          </motion.div>

          {/* Profile Ownership Indicator */}
          {isProfileOwner() ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 * animationSpeed }}
              className="text-center mb-6"
            >
              <div className={`inline-flex items-center gap-2 ${currentTheme.card} px-4 py-2 rounded-full border border-emerald-400/30 bg-emerald-500/10`}>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Crown className="w-4 h-4 text-emerald-400" />
                </motion.div>
                <span className="text-emerald-300 text-sm font-medium">This is your profile</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-2 h-2 bg-emerald-400 rounded-full"
                />
              </div>
            </motion.div>
          ) : bioData && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 * animationSpeed }}
              className="text-center mb-6"
            >
              <div className={`inline-flex items-center gap-2 ${currentTheme.card} px-3 py-1 rounded-full border border-purple-400/20 bg-purple-500/5`}>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  👋
                </motion.div>
                <span className="text-purple-300 text-xs">Visiting {bioData.displayName}'s profile</span>
              </div>
            </motion.div>
          )}

          {/* Enhanced Footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 * animationSpeed }}
            className="text-center space-y-4"
          >
            {/* Engagement Stats */}
            <motion.div 
              className="flex justify-center items-center space-x-6 text-sm"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.4 * animationSpeed }}
            >
              <div className={`${currentTheme.accent} opacity-70 flex items-center`}>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="mr-1"
                >
                  👀
                </motion.div>
                <span>{profileViews.toLocaleString()} views</span>
              </div>
              <div className={`${currentTheme.accent} opacity-70 flex items-center`}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="mr-1"
                >
                  ⚡
                </motion.div>
                <span>{bioData?.links?.length || 0} links</span>
              </div>
              <div className={`${currentTheme.accent} opacity-70 flex items-center`}>
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="mr-1"
                >
                  🎯
                </motion.div>
                <span>Active profile</span>
              </div>
            </motion.div>

            {/* Powered by section */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer"
            >
              <p className={`text-sm ${currentTheme.accent} opacity-60 hover:opacity-80 transition-opacity`}>
                Crafted with{" "}
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="inline-block text-red-500"
                >
                  💖
                </motion.span>{" "}
                by{" "}
                <span className={`font-semibold ${currentTheme.text} bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}>
                  LinkWeaver
                </span>{" "}
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                  className="inline-block"
                >
                  <Sparkles className="inline w-4 h-4 ml-1 text-yellow-400" />
                </motion.span>
              </p>
            </motion.div>

            {/* Subtle CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 * animationSpeed }}
              className={`text-xs ${currentTheme.accent} opacity-40 hover:opacity-60 transition-opacity cursor-pointer`}
            >
              <motion.p
                whileHover={{ scale: 1.02 }}
                className="select-none"
              >
                ✨ Create your own beautiful link page ✨
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  </ThemeProvider>
)}
