"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion"
import {
  ArrowRight,
  BarChart3,
  Users,
  QrCode,
  Shield,
  Globe,
  Zap,
  Star,
  Eye,
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
  ChevronRight,
  Clock,
  User,
  Palette,
  Code,
  Layers,
  Link as LinkIcon,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

// Aceternity UI Components
const BackgroundBeams = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
      >
        <defs>
          <linearGradient id="beam1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d="M0,200 Q250,100 500,200 T1000,200"
          stroke="url(#beam1)"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        >
          <animate
            attributeName="d"
            values="M0,200 Q250,100 500,200 T1000,200;M0,250 Q250,150 500,250 T1000,250;M0,200 Q250,100 500,200 T1000,200"
            dur="8s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  )
}

const ShootingStars = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-px h-px bg-white rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: -10,
            opacity: 0,
          }}
          animate={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: (typeof window !== 'undefined' ? window.innerHeight : 1000) + 10,
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
          style={{
            boxShadow: "0 0 6px 2px rgba(255, 255, 255, 0.8)",
          }}
        />
      ))}
    </div>
  )
}

const GridPattern = () => {
  return (
    <div className="absolute inset-0 opacity-5">
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

// Magic UI Text Animate Component
const TextAnimate = ({ children, className, delay = 0 }: { children: string; className?: string; delay?: number }) => {
  const words = children.split(" ")
  
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.1, delayChildren: delay }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-2"
          variants={{
            hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Enhanced Navigation - MOBILE RESPONSIVE
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollY } = useScroll()
  const backgroundOpacity = useTransform(scrollY, [0, 100], [0, 0.8])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.div
      className="fixed w-full top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
    >
      <motion.div
        className="absolute inset-0 backdrop-blur-xl border-b border-white/10"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${backgroundOpacity.get()})`,
        }}
      />
      <nav className="relative max-w-7xl mx-auto flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
          <motion.div 
            className="relative w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl flex items-center justify-center shadow-lg overflow-hidden border border-gray-200"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 400 }}
          >
            <img 
              src="/logo.png" 
              alt="LinkWeaver Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg hidden">
              LW
            </div>
            <motion.div
              className="absolute inset-0 bg-emerald-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            />
          </motion.div>
          <span className="font-bold text-lg sm:text-xl text-white tracking-tight">LinkWeaver</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          {[
            { name: "Features", href: "#features" },
            { name: "Demo", href: "#demo" },
            { name: "Pricing", href: "#pricing" }
          ].map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              whileHover={{ y: -2 }}
            >
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.querySelector(item.href)
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="relative text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium group cursor-pointer"
              >
                {item.name}
                <motion.span
                  className="absolute -bottom-2 left-0 h-0.5 bg-white"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </a>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" asChild className="text-xs sm:text-sm text-gray-400 hover:text-white px-2 sm:px-4">
              <Link href="/auth/signin">Sign in</Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild className="text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 border-0 shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 relative overflow-hidden px-3 sm:px-4">
              <Link href="/auth/signup">
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10">Get Started</span>
                <motion.div
                  className="ml-1 sm:ml-2 relative z-10"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </motion.div>
              </Link>
            </Button>
          </motion.div>
        </div>
      </nav>
    </motion.div>
  )
}

// Enhanced Hero - MOBILE RESPONSIVE
function HeroSection() {
  const heroRef = useRef(null)
  const isInView = useInView(heroRef)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener("mousemove", handleMouseMove)
      return () => window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [mouseX, mouseY])

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden">
      {/* Premium black-based background */}
      <div className="absolute inset-0 bg-black"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/30"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-teal-600/5 rounded-full filter blur-3xl"></div>
      <BackgroundBeams />
      <ShootingStars />
      <GridPattern />
      
      <motion.div
        className="absolute w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      
      <motion.div style={{ y }} className="relative max-w-6xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Badge
            variant="secondary"
            className="mb-6 sm:mb-8 bg-white/5 backdrop-blur-xl border border-white/10 text-gray-300 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mr-2 sm:mr-3 relative z-10"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.div>
            <span className="relative z-10 font-medium font-work-sans">Trusted by creators worldwide</span>
          </Badge>
        </motion.div>

        <TextAnimate
          className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 sm:mb-8 text-white tracking-tight leading-tight font-inter"
          delay={0.3}
        >
          The modern way to manage links
        </TextAnimate>

        <motion.p
          className="text-base sm:text-xl md:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed font-light font-dm-sans px-4 sm:px-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Create, customize, and track your links with{" "}
          <motion.span 
            className="font-semibold text-emerald-400"
            whileHover={{ scale: 1.05 }}
          >
            powerful analytics
          </motion.span>
          . Build beautiful bio pages that convert visitors into customers.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-16 sm:mb-20 px-4 sm:px-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group w-full sm:w-auto"
          >
            <Button size="lg" asChild className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-white text-black hover:bg-gray-100 border-0 shadow-xl transition-all duration-300 rounded-xl font-medium font-work-sans w-full sm:w-auto">
              <Link href="/auth/signup">
                <motion.span
                  className="flex items-center justify-center"
                >
                  Start for free
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </motion.span>
              </Link>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group w-full sm:w-auto"
          >
            <Button size="lg" variant="outline" asChild className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-transparent backdrop-blur-sm border border-gray-600 text-white hover:bg-white/5 hover:border-gray-500 transition-all duration-300 rounded-xl font-medium font-work-sans w-full sm:w-auto">
              <a 
                href="#features"
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                <span>View Features</span>
                <Eye className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

// ENHANCED Features Section - MOBILE RESPONSIVE
function FeaturesSection() {
  const features = [
    {
      icon: <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Bio Links",
      description: "Create beautiful, customizable landing pages with all your important links in one place. Perfect for social media profiles.",
      gradient: "from-emerald-500 to-emerald-600",
      details: ["Custom themes", "Drag & drop reordering", "Click analytics", "Mobile optimized"]
    },
    {
      icon: <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Advanced Analytics",
      description: "Comprehensive tracking with real-time insights, geographic data, device information, and referrer analytics.",
      gradient: "from-green-500 to-green-600",
      details: ["Real-time tracking", "Geographic insights", "Device analytics", "Referrer tracking"]
    },
    {
      icon: <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "QR Code Generator",
      description: "Instantly generate QR codes for any link with customizable designs and high-resolution downloads.",
      gradient: "from-teal-500 to-teal-600",
      details: ["Custom designs", "High-res downloads", "Batch generation", "Brand colors"]
    },
    {
      icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Advanced Security",
      description: "Enterprise-grade security with SSL encryption, password protection, and advanced access controls.",
      gradient: "from-red-500 to-red-600",
      details: ["SSL encryption", "Password protection", "Access controls", "Audit logs"]
    },
    {
      icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Global CDN",
      description: "Lightning-fast link redirects powered by our global content delivery network for optimal performance.",
      gradient: "from-cyan-500 to-cyan-600",
      details: ["99.9% uptime", "Global servers", "Fast redirects", "Edge caching"]
    },
    {
      icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "URL Shortener",
      description: "Create memorable short links with custom domains, branded URLs, and advanced link management features.",
      gradient: "from-yellow-500 to-orange-500",
      details: ["Custom domains", "Password protection", "Expiration dates", "Bulk creation"]
    },
    {
      icon: <Palette className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Custom Themes",
      description: "Personalize your bio pages with beautiful themes, custom colors, and advanced styling options.",
      gradient: "from-pink-500 to-rose-500",
      details: ["Pre-made themes", "Custom colors", "Font options", "Background effects"]
    },
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Team Collaboration",
      description: "Collaborate with your team, share workspaces, assign roles, and manage links together efficiently.",
      gradient: "from-teal-500 to-emerald-500",
      details: ["Team workspaces", "Role management", "Shared analytics", "Permission controls"]
    },
    {
      icon: <Code className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Developer API",
      description: "Robust REST API for developers with comprehensive documentation and SDK support for popular frameworks.",
      gradient: "from-slate-500 to-gray-600",
      details: ["REST API", "SDK support", "Webhooks", "Rate limiting"]
    }
  ]

  return (
    <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Premium black background */}
      <div className="absolute inset-0 bg-black"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-black to-gray-900/20"></div>
      <BackgroundBeams />
      <GridPattern />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 sm:mb-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              <span className="font-medium">Powerful Features</span>
            </Badge>
          </motion.div>
          
          <TextAnimate
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white tracking-tight leading-tight"
            delay={0.2}
          >
            Complete Link Management Platform
          </TextAnimate>
          
          <motion.p
            className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            From URL shortening to bio pages, QR codes to analytics - everything you need to create, manage, and optimize your digital presence in one powerful platform.
          </motion.p>
        </motion.div>

        {/* Enhanced Grid for All Features - MOBILE RESPONSIVE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl p-4 sm:p-6 transition-all duration-500"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 rounded-2xl" />
              
              {/* Hover Gradient */}
              <motion.div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-all duration-500 rounded-2xl",
                  feature.gradient
                )}
                whileHover={{ opacity: 0.2 }}
              />
              
              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  className={cn(
                    "mb-3 sm:mb-4 p-2 sm:p-3 bg-gradient-to-br rounded-xl w-fit shadow-xl",
                    feature.gradient
                  )}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-white">{feature.icon}</div>
                </motion.div>

                <motion.h3
                  className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${feature.gradient.replace('from-', '').replace(' to-', ', ')})`,
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  {feature.title}
                </motion.h3>
                
                <motion.p
                  className="text-gray-400 text-sm leading-relaxed mb-3 sm:mb-4 font-light"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  {feature.description}
                </motion.p>
                
                {/* Feature Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {feature.details.map((detail, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center text-xs text-gray-500"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + idx * 0.05 }}
                    >
                      <div className={cn("w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full mr-1 sm:mr-2 bg-gradient-to-r", feature.gradient)} />
                      {detail}
                    </motion.div>
                  ))}
                </div>
                
                {/* Learn More Button */}
                <div className="flex items-center justify-between">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost" 
                      size="sm"
                      className="text-white hover:text-white border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium relative overflow-hidden transition-all duration-300 px-2 sm:px-3 py-1 sm:py-2"
                    >
                      <motion.div
                        className={cn("absolute inset-0 bg-gradient-to-r opacity-0 hover:opacity-20", feature.gradient)}
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                      <span className="relative z-10">Learn more</span>
                    </Button>
                  </motion.div>
                  
                  {/* Arrow */}
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                    whileHover={{ x: 4, scale: 1.1 }}
                    animate={{ x: [0, 2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  </motion.div>
                </div>

                {/* Floating Elements */}
                {[...Array(2)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/20 rounded-full"
                    style={{
                      top: `${30 + i * 30}%`,
                      right: `${10 + i * 15}%`,
                    }}
                    animate={{
                      y: [0, -8, 0],
                      opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                      duration: 2 + i,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Call to Action */}
        <motion.div
          className="text-center mt-16 sm:mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto inline-block"
          >
            <Button 
              asChild
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 border-0 w-full sm:w-auto"
            >
              <Link href="/auth/signup">
                <motion.div
                  className="flex items-center gap-2 justify-center"
                  whileHover={{ x: 2 }}
                >
                  Get Started for Free
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                </motion.div>
              </Link>
            </Button>
          </motion.div>
          
          <motion.p
            className="text-gray-400 text-sm mt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            No credit card required • Free forever plan available
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

// Enhanced Interactive Demo - MOBILE RESPONSIVE
function InteractiveDemoSection() {
  const [inputUrl, setInputUrl] = useState("https://example.com/very-long-url")
  const [shortUrl, setShortUrl] = useState("lw.co/abc123")
  const [isAnimating, setIsAnimating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleShorten = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsAnimating(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    }, 1000)
  }

  return (
    <section id="demo" className="py-16 sm:py-20 px-4 sm:px-6 bg-black relative overflow-hidden">
      <BackgroundBeams />
      <ShootingStars />
      <GridPattern />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-4 sm:mb-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full relative overflow-hidden group text-xs sm:text-sm">
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-2 relative z-10" />
            <span className="relative z-10">Interactive Demo</span>
          </Badge>
          
          <TextAnimate
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white tracking-tight"
            delay={0.2}
          >
            See it in action
          </TextAnimate>
          
          <motion.p
            className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Try our link shortener and see real-time analytics
          </motion.p>
        </motion.div>

        <motion.div
          className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center relative z-10">
            {/* URL Shortener Interface */}
            <div className="space-y-4 sm:space-y-6">
              <motion.div 
                className="space-y-2 sm:space-y-3"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <label className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
                  <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Original URL
                </label>
                <div className="relative group">
                  <motion.input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 text-sm sm:text-base"
                    placeholder="Enter your long URL"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <ExternalLink className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                </div>
              </motion.div>

              <motion.div className="flex justify-center py-3 sm:py-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button 
                    className="rounded-full p-3 sm:p-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 border-0 shadow-xl transition-all duration-300"
                    onClick={handleShorten}
                  >
                    <motion.div
                      animate={isAnimating ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.5 }}
                      className="relative z-10"
                    >
                      {isAnimating ? (
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </motion.div>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div 
                className="space-y-2 sm:space-y-3"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <label className="text-sm font-semibold text-gray-300 mb-2 flex items-center">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Shortened URL
                </label>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="relative flex-1 group">
                    <motion.input
                      type="text"
                      value={shortUrl}
                      readOnly
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-green-500/10 border border-green-500/30 rounded-xl text-white backdrop-blur-xl relative z-10 text-sm sm:text-base"
                      animate={showSuccess ? { scale: [1, 1.02, 1] } : {}}
                    />
                    <CheckCircle className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="sm" className="px-2 sm:px-3 py-2 sm:py-3 bg-white/5 backdrop-blur-xl border border-white/20 text-white hover:bg-white/10 transition-all duration-300 rounded-xl">
                      <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Compact Analytics Dashboard */}
            <motion.div 
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-3 sm:p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                <h4 className="text-sm sm:text-base font-bold text-white mb-3 sm:mb-4 flex items-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                    <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  Analytics
                </h4>
                
                <div className="space-y-2 sm:space-y-3">
                  {[
                    { label: "Performance", color: "text-blue-400" },
                    { label: "Sources", color: "text-green-400" },
                    { label: "Conversion", color: "text-purple-400" },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      className="flex justify-between items-center text-xs sm:text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <span className="text-gray-400">{item.label}</span>
                      <div className="flex items-center space-x-1 sm:space-x-2">
                        <div className="h-1 w-8 sm:w-12 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className={cn("h-full rounded-full", `bg-${item.color.replace('text-', '')}`)}
                            initial={{ width: 0 }}
                            animate={{ width: `${60 + Math.random() * 40}%` }}
                            transition={{ duration: 1.5, delay: index * 0.3 + 1 }}
                          />
                        </div>
                        <TrendingUp className={cn("w-2 h-2 sm:w-3 sm:h-3", item.color)} />
                      </div>
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

// Enhanced CTA Section - MOBILE RESPONSIVE
function CTASection() {
  return (
    <section id="pricing" className="py-20 sm:py-24 px-4 sm:px-6 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-72 h-72 bg-white/5 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-gray-800/30 rounded-full filter blur-3xl"></div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-4 sm:mb-6 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            <span className="font-medium">Get Started Today</span>
          </Badge>
          
          <TextAnimate
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white tracking-tight leading-tight"
            delay={0.2}
          >
            Ready to get started?
          </TextAnimate>
          
          <motion.p
            className="text-base sm:text-lg text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed font-light px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join thousands of creators and businesses who trust LinkWeaver to manage their links and grow their audience.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button size="lg" asChild className="text-sm sm:text-base px-6 sm:px-8 py-3 bg-white text-black hover:bg-gray-100 rounded-xl shadow-xl transition-all duration-500 relative overflow-hidden w-full sm:w-auto">
                <Link href="/auth/signup">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-pink-500/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 font-inter">Start for free</span>
                  <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button size="lg" variant="outline" asChild className="text-sm sm:text-base px-6 sm:px-8 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 rounded-xl transition-all duration-500 font-inter w-full sm:w-auto">
                <Link href="/contact">
                  <MessageCircle className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                  Contact sales
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-4 sm:gap-6 text-white/70 px-4 sm:px-0"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
          >
            {[
              { icon: Check, text: "Free 14-day trial" },
              { icon: Check, text: "No credit card required" },
              { icon: Check, text: "Cancel anytime" },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                className="flex items-center space-x-2 text-xs sm:text-sm font-medium"
                whileHover={{ scale: 1.05, color: "#ffffff" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 + 0.9 }}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon className="w-3 h-3 sm:w-4 sm:h-4 text-green-300" />
                </motion.div>
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Enhanced Footer - MOBILE RESPONSIVE
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
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <motion.div 
            className="col-span-2 sm:col-span-3 md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4 group">
              <motion.div 
                className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center shadow-xl overflow-hidden border border-gray-200"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <img 
                  src="/logo.png" 
                  alt="LinkWeaver Logo" 
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                />
              </motion.div>
              <span className="font-bold text-lg sm:text-xl text-white">LinkWeaver</span>
            </Link>
            <motion.p
              className="text-gray-400 leading-relaxed mb-3 sm:mb-4 max-w-sm text-xs sm:text-sm"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              The modern link management platform for creators and businesses.
            </motion.p>
            
            <div className="flex space-x-2 sm:space-x-3">
              {["twitter", "github", "linkedin"].map((social, index) => (
                <motion.div
                  key={social}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <Button variant="ghost" size="sm" className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 p-0">
                    <span className="sr-only">{social}</span>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gray-400 rounded" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div 
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 + 0.2 }}
            >
              <h3 className="font-bold text-white mb-2 sm:mb-3 text-xs sm:text-sm uppercase tracking-wider">
                {category}
              </h3>
              <ul className="space-y-1 sm:space-y-2">
                {links.map((link, linkIndex) => (
                  <motion.li 
                    key={link}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: categoryIndex * 0.1 + linkIndex * 0.05 + 0.4 }}
                  >
                    <Link
                      href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-gray-400 hover:text-white transition-all duration-300 text-xs sm:text-sm font-medium hover:translate-x-1 inline-block"
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
          className="border-t border-white/10 pt-4 sm:pt-6 flex flex-col md:flex-row justify-between items-center space-y-2 sm:space-y-3 md:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-gray-400 text-xs sm:text-sm">
            © 2025 LinkWeaver. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm text-gray-400">
            {["Privacy", "Terms", "Cookies"].map((item, index) => (
              <motion.div
                key={item}
                whileHover={{ scale: 1.05, color: "#ffffff" }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
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
    <div className="min-h-screen bg-black font-sans antialiased selection:bg-blue-500/20 text-white">
      {/* Sophisticated black-based gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="fixed inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.1),rgba(0,0,0,0.8))]"></div>
      
      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <FeaturesSection />
        <InteractiveDemoSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  )
}
