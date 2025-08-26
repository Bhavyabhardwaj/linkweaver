"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import {
  ArrowRight,
  BarChart3,
  Users,
  QrCode,
  Shield,
  Globe,
  Zap,
  Star,
  LinkIcon,
  Play,
  CheckCircle,
  Copy,
  MessageCircle,
  ExternalLink,
  Activity,
  TrendingUp,
  Check,
  Sparkles,
  MousePointer,
  Target,
  Layers,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Background Components
const StarField = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(100)].map((_, i) => (
        <div
          key={i}
          className="absolute w-px h-px bg-white animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

const GridPattern = () => {
  return (
    <div className="absolute inset-0 opacity-10">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  )
}

const FloatingOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500" />
    </div>
  )
}

// Enhanced Navigation
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "backdrop-blur-xl bg-black/80 border-b border-white/10"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link href="/" className="flex items-center space-x-3 group">
          <motion.div 
            className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <LinkIcon className="w-5 h-5 text-white" />
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-20 blur-lg" />
          </motion.div>
          <span className="font-bold text-xl text-white">LinkWeaver</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {["Features", "Pricing", "Docs", "Changelog"].map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              <Link
                href={`/${item.toLowerCase()}`}
                className="relative text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium group"
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" asChild className="text-sm text-gray-400 hover:text-white">
              <Link href="/auth/signin">Sign in</Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
              <Link href="/auth/signup">
                Get Started
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}

// Hero Section
function HeroSection() {
  const [stats, setStats] = useState({ links: 0, clicks: 0, users: 0 })
  const heroRef = useRef(null)
  const isInView = useInView(heroRef)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])

  useEffect(() => {
    if (!isInView) return
    
    const animateStats = () => {
      const duration = 2000
      const increment = 50
      const targetStats = { links: 2847, clicks: 156789, users: 1249 }

      const current = { links: 0, clicks: 0, users: 0 }
      const timer = setInterval(() => {
        current.links = Math.min(
          current.links + Math.ceil(targetStats.links / (duration / increment)),
          targetStats.links,
        )
        current.clicks = Math.min(
          current.clicks + Math.ceil(targetStats.clicks / (duration / increment)),
          targetStats.clicks,
        )
        current.users = Math.min(
          current.users + Math.ceil(targetStats.users / (duration / increment)),
          targetStats.users,
        )

        setStats({ ...current })

        if (
          current.links === targetStats.links &&
          current.clicks === targetStats.clicks &&
          current.users === targetStats.users
        ) {
          clearInterval(timer)
        }
      }, increment)
    }

    const timer = setTimeout(animateStats, 1000)
    return () => clearTimeout(timer)
  }, [isInView])

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 bg-black overflow-hidden">
      <StarField />
      <GridPattern />
      <FloatingOrbs />
      
      <motion.div style={{ y }} className="relative max-w-6xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Badge
            variant="secondary"
            className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10 text-gray-300 px-6 py-3 rounded-full text-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mr-3"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            Trusted by 50,000+ creators worldwide
          </Badge>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          The{" "}
          <motion.span
            className="bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            style={{
              backgroundSize: "200% 200%"
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            modern way
          </motion.span>
          <br />
          to manage links
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Create, customize, and track your links with{" "}
          <motion.span 
            className="text-white font-semibold"
            whileHover={{ scale: 1.05 }}
          >
            powerful analytics
          </motion.span>
          . Build beautiful bio pages that convert visitors into customers.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" asChild className="text-lg px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 rounded-2xl">
              <Link href="/auth/signup">
                <motion.span
                  animate={{ x: [0, 2, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  Start for free
                </motion.span>
                <motion.div
                  className="ml-3"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/20 text-white hover:bg-white/10 transition-all duration-500 rounded-2xl">
              <Link href="#demo">
                <Play className="mr-3 w-5 h-5" />
                See demo
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Enhanced Stats */}
        <motion.div
          className="grid grid-cols-3 gap-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            { label: "Links created", value: stats.links, suffix: "+", icon: LinkIcon },
            { label: "Total clicks", value: stats.clicks, suffix: "+", icon: MousePointer },
            { label: "Active users", value: stats.users, suffix: "+", icon: Users },
          ].map((stat, index) => (
            <motion.div 
              key={stat.label}
              className="relative text-center group"
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <div className="relative p-6">
                <motion.div
                  className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </motion.div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  <motion.span
                    key={stat.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {stat.value.toLocaleString()}
                  </motion.span>
                  {stat.suffix}
                </div>
                <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

// Completely Redesigned Features Section
function FeaturesSection() {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Track clicks, conversions, and user behavior with detailed insights and reports that help you understand your audience better.",
      stats: "99.9% accuracy",
      gradient: "from-blue-500 via-blue-600 to-cyan-500",
      size: "lg:col-span-2",
      highlight: true,
    },
    {
      icon: <QrCode className="w-7 h-7" />,
      title: "Dynamic QR Codes",
      description: "Generate QR codes that update automatically and provide detailed scan analytics.",
      stats: "50M+ scans",
      gradient: "from-purple-500 via-purple-600 to-pink-500",
      size: "lg:col-span-1",
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Bio Link Pages",
      description: "Create beautiful landing pages to showcase all your important links with custom themes.",
      stats: "4.2x higher CTR",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      size: "lg:col-span-1",
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Enterprise Security",
      description: "SOC 2 compliant with advanced security features and access controls for teams.",
      stats: "Bank-grade security",
      gradient: "from-red-500 via-orange-500 to-yellow-500",
      size: "lg:col-span-1",
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: "Global Network",
      description: "Lightning-fast redirects from 200+ locations worldwide with 99.99% uptime guarantee.",
      stats: "<50ms latency",
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      size: "lg:col-span-2",
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Developer API",
      description: "Integrate with our REST API and webhooks for custom workflows and automation.",
      stats: "99.99% SLA",
      gradient: "from-yellow-500 via-orange-500 to-red-500",
      size: "lg:col-span-1",
    },
  ]

  return (
    <section className="py-32 px-6 bg-black relative overflow-hidden">
      <StarField />
      <GridPattern />
      <FloatingOrbs />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-6 py-3 rounded-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Powerful Features
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
            Everything you need to
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              manage links
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Powerful features designed to help you create, track, and optimize your links with enterprise-grade reliability.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={cn(
                "group relative overflow-hidden rounded-3xl p-8 transition-all duration-500",
                feature.size,
                feature.highlight ? "lg:row-span-2" : ""
              )}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl" />
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-all duration-500 rounded-3xl",
                feature.gradient
              )} />
              
              {/* Animated Border */}
              <div className={cn(
                "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500",
                "bg-gradient-to-r p-px",
                feature.gradient
              )}>
                <div className="w-full h-full bg-black rounded-3xl" />
              </div>

              <div className="relative z-10">
                {/* Icon with Gradient Background */}
                <motion.div
                  className={cn(
                    "mb-6 p-4 bg-gradient-to-br rounded-3xl w-fit shadow-2xl",
                    feature.gradient
                  )}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-white">{feature.icon}</div>
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300" style={{backgroundImage: `linear-gradient(135deg, ${feature.gradient.replace('from-', '').replace(' via-', ', ').replace(' to-', ', ')})`}}>
                  {feature.title}
                </h3>
                
                <p className={cn(
                  "text-gray-400 mb-6 leading-relaxed",
                  feature.highlight ? "text-lg" : "text-base"
                )}>
                  {feature.description}
                </p>
                
                {/* Stats Badge */}
                <div className="flex items-center justify-between">
                  <Badge
                    className={cn(
                      "bg-gradient-to-r text-white border-0 px-4 py-2 rounded-xl font-semibold",
                      feature.gradient
                    )}
                  >
                    {feature.stats}
                  </Badge>
                  
                  {/* Hover Arrow */}
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                    whileHover={{ x: 4 }}
                  >
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </div>

                {/* Feature Highlight for Large Card */}
                {feature.highlight && (
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {["Real-time tracking", "Custom domains", "Team collaboration", "Advanced filtering"].map((item, i) => (
                      <motion.div
                        key={item}
                        className="flex items-center space-x-2 text-sm text-gray-400"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + 0.5 }}
                      >
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Interactive Demo Section
function InteractiveDemoSection() {
  const [inputUrl, setInputUrl] = useState("https://example.com/very-long-url")
  const [shortUrl, setShortUrl] = useState("lw.co/abc123")
  const [isAnimating, setIsAnimating] = useState(false)

  const handleShorten = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 1000)
  }

  return (
    <section id="demo" className="py-32 px-6 bg-black relative overflow-hidden">
      <StarField />
      <GridPattern />
      <FloatingOrbs />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-6 bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 px-6 py-3 rounded-full">
            <Play className="w-4 h-4 mr-2" />
            Interactive Demo
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            See it in action
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Try our link shortener and see real-time analytics in action
          </p>
        </motion.div>

        <motion.div
          className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* URL Shortener Interface */}
            <div className="space-y-8">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Original URL
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:shadow-lg"
                    placeholder="Enter your long URL"
                  />
                  <ExternalLink className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
              </motion.div>

              <motion.div 
                className="flex justify-center py-6"
                animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Button 
                  className="rounded-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300"
                  onClick={handleShorten}
                >
                  <motion.div
                    animate={isAnimating ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Button>
              </motion.div>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Shortened URL
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1 group">
                    <input
                      type="text"
                      value={shortUrl}
                      readOnly
                      className="w-full px-6 py-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-white backdrop-blur-xl"
                    />
                    <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="outline" size="lg" className="px-4 py-4 bg-white/5 backdrop-blur-xl border border-white/20 text-white hover:bg-white/10 transition-all duration-300 rounded-2xl">
                      <Copy className="w-5 h-5" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Analytics Dashboard */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:shadow-xl transition-all duration-300">
                <h4 className="text-lg font-bold text-white mb-6 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  Real-time Analytics
                </h4>
                <div className="space-y-4">
                  {[
                    { label: "Total Clicks", value: "1,247", trend: "+23", color: "text-blue-400" },
                    { label: "Today", value: "47", trend: "+12%", color: "text-green-400" },
                    { label: "CTR", value: "4.2%", trend: "+0.8%", color: "text-purple-400" },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="flex justify-between items-center p-3 rounded-xl hover:bg-white/5 transition-all duration-200"
                      whileHover={{ x: 4 }}
                    >
                      <span className="text-gray-400 font-medium">{stat.label}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-white">{stat.value}</span>
                        <span className={cn("text-sm font-semibold flex items-center", stat.color)}>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {stat.trend}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:shadow-xl transition-all duration-300">
                <h4 className="text-lg font-bold text-white mb-6 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-3">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  Top Countries
                </h4>
                <div className="space-y-3">
                  {[
                    { country: "United States", percentage: 45, flag: "🇺🇸" },
                    { country: "United Kingdom", percentage: 23, flag: "🇬🇧" },
                    { country: "Canada", percentage: 18, flag: "🇨🇦" },
                  ].map((item, index) => (
                    <motion.div 
                      key={item.country} 
                      className="flex items-center space-x-4 p-2 rounded-xl hover:bg-white/5 transition-all duration-200"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.6 }}
                      whileHover={{ x: 4 }}
                    >
                      <span className="text-2xl">{item.flag}</span>
                      <span className="text-sm text-gray-400 font-medium flex-1">{item.country}</span>
                      <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.2 + 0.8 }}
                        />
                      </div>
                      <span className="text-sm font-bold text-white w-12 text-right">
                        {item.percentage}%
                      </span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Head of Growth at TechFlow",
      avatar: "/placeholder-user.jpg",
      content: "LinkWeaver helped us increase our conversion rates by 340%. The analytics are incredibly detailed and actionable.",
      rating: 5,
      gradient: "from-blue-500 to-purple-600",
    },
    {
      name: "Marcus Rodriguez",
      role: "Marketing Director at StartupX",
      avatar: "/placeholder-user.jpg",
      content: "The QR code feature is perfect for our offline campaigns. Real-time tracking is a game changer for our team.",
      rating: 5,
      gradient: "from-green-500 to-blue-500",
    },
    {
      name: "Emily Watson",
      role: "Content Creator",
      avatar: "/placeholder-user.jpg",
      content: "The bio link page is exactly what I needed. Clean, customizable, and great analytics. Highly recommended!",
      rating: 5,
      gradient: "from-pink-500 to-purple-500",
    },
  ]

  return (
    <section className="py-32 px-6 bg-black relative overflow-hidden">
      <StarField />
      <GridPattern />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 px-6 py-3 rounded-full">
            <Users className="w-4 h-4 mr-2" />
            Customer Stories
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            Trusted by creators
            <br />
            <span className="bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
              worldwide
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            See what our customers have to say about LinkWeaver
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group"
            >
              <Card className="p-8 h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                {/* Gradient Background on Hover */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-all duration-500",
                  testimonial.gradient
                )} />
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className={cn(
                        "w-16 h-16 bg-gradient-to-br rounded-2xl flex items-center justify-center p-0.5",
                        testimonial.gradient
                      )}>
                        <img
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-full h-full rounded-2xl object-cover bg-gray-800"
                        />
                      </div>
                    </motion.div>
                    <div>
                      <h4 className="font-bold text-lg text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400 font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed text-base">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.2 + i * 0.1 + 0.5 }}
                        whileHover={{ scale: 1.2 }}
                      >
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
function CTASection() {
  return (
    <section className="py-32 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 relative overflow-hidden">
      <StarField />
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-8 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-3 rounded-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Get Started Today
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-white tracking-tight">
            Ready to get started?
          </h2>
          
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of creators and businesses who trust LinkWeaver to manage their links and grow their audience.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" asChild className="text-lg px-10 py-5 bg-white text-black hover:bg-gray-100 rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-500">
                <Link href="/auth/signup">
                  Start for free
                  <motion.div
                    className="ml-3"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" asChild className="text-lg px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 rounded-2xl transition-all duration-500">
                <Link href="/contact">
                  <MessageCircle className="mr-3 w-5 h-5" />
                  Contact sales
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div 
            className="flex flex-wrap items-center justify-center gap-8 text-white/70"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {[
              { icon: Check, text: "Free 14-day trial" },
              { icon: Check, text: "No credit card required" },
              { icon: Check, text: "Cancel anytime" },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                className="flex items-center space-x-2 text-sm font-medium"
                whileHover={{ scale: 1.05, color: "#ffffff" }}
                transition={{ duration: 0.2 }}
              >
                <item.icon className="w-5 h-5 text-green-300" />
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Footer
function Footer() {
  const footerLinks = {
    Product: ["Features", "Pricing", "API", "Changelog"],
    Company: ["About", "Blog", "Careers", "Contact"],
    Resources: ["Documentation", "Help Center", "Status"],
    Legal: ["Privacy", "Terms", "Security"],
  }

  return (
    <footer className="border-t border-white/10 bg-black relative overflow-hidden">
      <GridPattern />
      
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-12 mb-12">
          <motion.div 
            className="col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center space-x-4 mb-6 group">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <LinkIcon className="w-6 h-6 text-white" />
              </motion.div>
              <span className="font-bold text-2xl text-white">LinkWeaver</span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
              The modern link management platform for creators and businesses. Trusted by thousands worldwide.
            </p>
          </motion.div>

          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div 
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 + 0.2 }}
            >
              <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <motion.li 
                    key={link}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: categoryIndex * 0.1 + linkIndex * 0.05 + 0.4 }}
                  >
                    <Link
                      href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 inline-block"
                    >
                      {link}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-gray-400 text-sm">
            © 2025 LinkWeaver. All rights reserved. Made with ❤️ for creators.
          </p>
          <div className="flex items-center space-x-8 text-sm text-gray-400">
            {["Privacy", "Terms", "Cookies"].map((item, index) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.05, color: "#ffffff" }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.6 }}
              >
                <Link href={`/${item.toLowerCase()}`} className="hover:text-white transition-colors font-medium">
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

// Main Component
export default function LinkWeaverLanding() {
  return (
    <div className="min-h-screen bg-black antialiased">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <InteractiveDemoSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  )
}
