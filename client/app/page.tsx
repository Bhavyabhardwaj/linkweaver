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
  ChevronRight,
  Eye,
  Clock,
  Award,
  Palette,
  Code,
  BarChart,
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
        <path
          d="M0,400 Q250,300 500,400 T1000,400"
          stroke="url(#beam1)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.4"
        >
          <animate
            attributeName="d"
            values="M0,400 Q250,300 500,400 T1000,400;M0,450 Q250,350 500,450 T1000,450;M0,400 Q250,300 500,400 T1000,400"
            dur="6s"
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

// Aceternity UI Spotlight Effect
const Spotlight = ({ className }: { className?: string }) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-purple-500/10 to-transparent"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 100%)`,
        }}
      />
    </div>
  )
}

// Enhanced Navigation with Aceternity UI Style
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
      <nav className="relative max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <Link href="/" className="flex items-center space-x-3 group">
          <motion.div 
            className="relative w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <LinkIcon className="w-5 h-5 text-white" />
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-20 blur-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
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
              whileHover={{ y: -2 }}
            >
              <Link
                href={`/${item.toLowerCase()}`}
                className="relative text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium group"
              >
                {item}
                <motion.span
                  className="absolute -bottom-2 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
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
            <Button asChild className="text-sm bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 relative overflow-hidden">
              <Link href="/auth/signup">
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
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
      </nav>
    </motion.div>
  )
}

// Enhanced Hero with Aceternity UI Effects (No Stats)
function HeroSection() {
  const heroRef = useRef(null)
  const isInView = useInView(heroRef)
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  
  // Mouse tracking for spotlight effect
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
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 bg-black overflow-hidden">
      <BackgroundBeams />
      <ShootingStars />
      <GridPattern />
      <Spotlight />
      
      {/* Dynamic Spotlight Effect */}
      <motion.div
        className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
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
            className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10 text-gray-300 px-6 py-3 rounded-full text-sm relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "loop" }}
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mr-3 relative z-10"
            >
              <Sparkles className="w-4 h-4" />
            </motion.div>
            <span className="relative z-10">Trusted by creators worldwide</span>
          </Badge>
        </motion.div>

        <TextAnimate
          className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-tight"
          delay={0.3}
        >
          The modern way to manage links
        </TextAnimate>

        <motion.p
          className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Create, customize, and track your links with{" "}
          <motion.span 
            className="text-white font-semibold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
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
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group"
          >
            <Button size="lg" asChild className="text-lg px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 rounded-2xl relative overflow-hidden">
              <Link href="/auth/signup">
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <motion.span
                  animate={{ x: [0, 2, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="relative z-10"
                >
                  Start for free
                </motion.span>
                <motion.div
                  className="ml-3 relative z-10"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group"
          >
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/20 text-white hover:bg-white/10 transition-all duration-500 rounded-2xl relative overflow-hidden">
              <Link href="#demo">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <Play className="mr-3 w-5 h-5 relative z-10" />
                <span className="relative z-10">See demo</span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

// Completely Redesigned Features Section - More Visual and Interactive
function FeaturesSection() {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Get deep insights into your link performance with real-time tracking, detailed reports, and audience behavior analysis.",
      gradient: "from-blue-500 via-blue-600 to-cyan-500",
      size: "lg:col-span-2 lg:row-span-2",
      highlight: true,
      features: ["Real-time tracking", "Custom domains", "Team collaboration", "Advanced filtering"],
      preview: (
        <div className="absolute bottom-4 right-4 w-32 h-20 bg-blue-500/10 rounded-lg border border-blue-500/20 p-2">
          <div className="grid grid-cols-7 gap-1 h-full">
            {[...Array(21)].map((_, i) => (
              <motion.div
                key={i}
                className="bg-blue-500/40 rounded-sm"
                initial={{ height: "20%" }}
                animate={{ height: `${Math.random() * 80 + 20}%` }}
                transition={{ duration: 0.5, delay: i * 0.05, repeat: Infinity, repeatType: "reverse" }}
              />
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <QrCode className="w-7 h-7" />,
      title: "Dynamic QR Codes",
      description: "Generate beautiful QR codes that automatically update and provide detailed scan analytics with location data.",
      gradient: "from-purple-500 via-purple-600 to-pink-500",
      size: "lg:col-span-1",
      preview: (
        <motion.div
          className="absolute bottom-4 right-4 w-16 h-16 bg-purple-500/20 rounded-lg border border-purple-500/30 flex items-center justify-center"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="grid grid-cols-4 gap-1">
            {[...Array(16)].map((_, i) => (
              <div key={i} className={`w-1 h-1 rounded-sm ${Math.random() > 0.5 ? 'bg-purple-400' : 'bg-transparent'}`} />
            ))}
          </div>
        </motion.div>
      ),
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Bio Link Pages",
      description: "Create stunning, mobile-optimized landing pages that showcase all your important links with custom themes.",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      size: "lg:col-span-1",
      preview: (
        <div className="absolute bottom-4 right-4 w-20 h-24 bg-green-500/10 rounded-lg border border-green-500/20 p-2">
          <div className="space-y-1">
            <div className="h-2 bg-green-500/60 rounded-full w-full" />
            <div className="h-1 bg-green-500/40 rounded-full w-3/4" />
            <div className="h-1 bg-green-500/40 rounded-full w-1/2" />
            <div className="space-y-0.5 mt-2">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1 bg-green-500/30 rounded-full"
                  initial={{ width: "100%" }}
                  animate={{ width: `${70 + Math.random() * 30}%` }}
                  transition={{ duration: 1, delay: i * 0.2, repeat: Infinity, repeatType: "reverse" }}
                />
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Enterprise Security",
      description: "Bank-grade security with SOC 2 compliance, advanced access controls, and comprehensive audit logs.",
      gradient: "from-red-500 via-orange-500 to-yellow-500",
      size: "lg:col-span-1",
      preview: (
        <motion.div
          className="absolute bottom-4 right-4 w-12 h-12 border-2 border-red-500/30 rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Shield className="w-6 h-6 text-red-400" />
        </motion.div>
      ),
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: "Global Network",
      description: "Lightning-fast redirects from our global CDN with intelligent routing and 99.99% uptime guarantee.",
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      size: "lg:col-span-2",
      preview: (
        <div className="absolute bottom-4 right-4 w-32 h-16 bg-indigo-500/10 rounded-lg border border-indigo-500/20 relative overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-indigo-400 rounded-full"
              style={{
                left: `${10 + i * 15}%`,
                top: "50%",
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
              }}
            />
          ))}
        </div>
      ),
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Developer API",
      description: "Powerful REST API with webhooks for seamless integration into your existing workflows and applications.",
      gradient: "from-yellow-500 via-orange-500 to-red-500",
      size: "lg:col-span-1",
      preview: (
        <div className="absolute bottom-4 right-4 w-20 h-12 bg-yellow-500/10 rounded-lg border border-yellow-500/20 p-1">
          <div className="space-y-0.5">
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-yellow-400 rounded-full" />
              <div className="w-8 h-1 bg-yellow-400/60 rounded-full" />
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-1 bg-yellow-400/40 rounded-full" />
              <div className="w-6 h-1 bg-yellow-400/60 rounded-full" />
            </div>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-yellow-400 rounded-full" />
              <div className="w-10 h-1 bg-yellow-400/60 rounded-full" />
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <section className="py-32 px-6 bg-black relative overflow-hidden">
      <BackgroundBeams />
      <GridPattern />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-20"
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
            <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-6 py-3 rounded-full relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-white/20"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
              <Sparkles className="w-4 h-4 mr-2 relative z-10" />
              <span className="relative z-10">Powerful Features</span>
            </Badge>
          </motion.div>
          
          <TextAnimate
            className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight"
            delay={0.2}
          >
            Everything you need to manage links
          </TextAnimate>
          
          <motion.p
            className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Powerful features designed to help you create, track, and optimize your links with enterprise-grade reliability.
          </motion.p>
        </motion.div>

        {/* Enhanced Bento Grid with Better Animations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-fr">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className={cn(
                "group relative overflow-hidden rounded-3xl p-8 transition-all duration-500",
                feature.size
              )}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              {/* Enhanced Background with Better Glassmorphism */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/10 rounded-3xl" />
              
              {/* Animated Gradient Overlay */}
              <motion.div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-all duration-500 rounded-3xl",
                  feature.gradient
                )}
                whileHover={{ opacity: 0.2 }}
              />
              
              {/* Interactive Animated Border */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.div
                  className={cn("absolute inset-0 rounded-3xl bg-gradient-to-r p-px", feature.gradient)}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-full h-full bg-black rounded-3xl" />
                </motion.div>
              </motion.div>

              <div className="relative z-10">
                {/* Enhanced Icon with Multiple Layers */}
                <motion.div
                  className={cn(
                    "mb-6 p-4 bg-gradient-to-br rounded-3xl w-fit shadow-2xl relative overflow-hidden",
                    feature.gradient
                  )}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-3xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="text-white relative z-10">{feature.icon}</div>
                  
                  {/* Multiple Pulsing Ring Effects */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      background: `linear-gradient(135deg, ${feature.gradient.replace('from-', '').replace(' via-', ', ').replace(' to-', ', ')})`,
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    style={{
                      background: `linear-gradient(135deg, ${feature.gradient.replace('from-', '').replace(' via-', ', ').replace(' to-', ', ')})`,
                    }}
                  />
                </motion.div>

                <motion.h3
                  className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300"
                  style={{
                    backgroundImage: feature.highlight
                      ? `linear-gradient(135deg, ${feature.gradient.replace('from-', '').replace(' via-', ', ').replace(' to-', ', ')})`
                      : undefined,
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  {feature.title}
                </motion.h3>
                
                <motion.p
                  className={cn(
                    "text-gray-400 mb-6 leading-relaxed",
                    feature.highlight ? "text-lg" : "text-base"
                  )}
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  {feature.description}
                </motion.p>
                
                {/* Enhanced Interactive Elements */}
                <div className="flex items-center justify-between">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost" 
                      size="sm"
                      className={cn(
                        "text-white hover:text-white border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 rounded-xl font-medium relative overflow-hidden transition-all duration-300",
                      )}
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
                  
                  {/* Enhanced Animated Arrow */}
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                    whileHover={{ x: 4, scale: 1.1 }}
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </div>

                {/* Feature Highlights for Large Cards */}
                {feature.highlight && feature.features && (
                  <motion.div
                    className="mt-8 grid grid-cols-2 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                  >
                    {feature.features.map((item, i) => (
                      <motion.div
                        key={item}
                        className="flex items-center space-x-3 text-sm text-gray-400 group/item hover:text-white transition-colors duration-200"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + 0.5 }}
                        whileHover={{ x: 4 }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </motion.div>
                        <span className="group-hover/item:text-white transition-colors">{item}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Interactive Preview Element */}
                {feature.preview && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {feature.preview}
                  </motion.div>
                )}

                {/* Enhanced Floating Elements */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/20 rounded-full"
                    style={{
                      top: `${20 + i * 20}%`,
                      right: `${5 + i * 8}%`,
                    }}
                    animate={{
                      y: [0, -15, 0],
                      opacity: [0.2, 0.8, 0.2],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.4,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Call to Action */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center space-x-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4"
            whileHover={{ scale: 1.05, y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <Eye className="w-5 h-5 text-gray-400" />
            <span className="text-gray-300 font-medium">Ready to experience these features?</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight className="w-5 h-5 text-blue-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Rest of components remain the same but with stats removed...
// [Continue with InteractiveDemoSection, TestimonialsSection, CTASection, Footer]

// Enhanced Interactive Demo with Magic UI Elements (No Stats)
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
    <section id="demo" className="py-32 px-6 bg-black relative overflow-hidden">
      <BackgroundBeams />
      <ShootingStars />
      <GridPattern />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-6 bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 px-6 py-3 rounded-full relative overflow-hidden group">
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <Play className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10">Interactive Demo</span>
          </Badge>
          
          <TextAnimate
            className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight"
            delay={0.2}
          >
            See it in action
          </TextAnimate>
          
          <motion.p
            className="text-xl text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Try our link shortener and see real-time analytics in action
          </motion.p>
        </motion.div>

        <motion.div
          className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div
            className="absolute inset-0 opacity-5"
            animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            style={{
              backgroundImage: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            {/* URL Shortener Interface */}
            <div className="space-y-8">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Original URL
                </label>
                <div className="relative group">
                  <motion.input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/10"
                    placeholder="Enter your long URL"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <motion.div
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ExternalLink className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  </motion.div>
                </div>
              </motion.div>

              <motion.div 
                className="flex justify-center py-6"
                animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button 
                    className="rounded-full p-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 relative overflow-hidden group"
                    onClick={handleShorten}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      animate={isAnimating ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.5 }}
                      className="relative z-10"
                    >
                      {isAnimating ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Clock className="w-6 h-6" />
                        </motion.div>
                      ) : (
                        <ArrowRight className="w-6 h-6" />
                      )}
                    </motion.div>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Shortened URL
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1 group">
                    <motion.input
                      type="text"
                      value={shortUrl}
                      readOnly
                      className="w-full px-6 py-4 bg-green-500/10 border border-green-500/30 rounded-2xl text-white backdrop-blur-xl relative z-10"
                      animate={showSuccess ? { scale: [1, 1.02, 1] } : {}}
                    />
                    <motion.div
                      className="absolute right-4 top-1/2 transform -translate-y-1/2"
                      animate={showSuccess ? { scale: [1, 1.3, 1], rotate: [0, 360] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </motion.div>
                    
                    {showSuccess && (
                      <motion.div
                        className="absolute inset-0 bg-green-500/20 rounded-2xl"
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 1.1, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                      />
                    )}
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="lg" className="px-4 py-4 bg-white/5 backdrop-blur-xl border border-white/20 text-white hover:bg-white/10 transition-all duration-300 rounded-2xl group relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                      <Copy className="w-5 h-5 relative z-10" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Analytics Dashboard (No Numbers) */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    whileHover={{ opacity: 1 }}
                  />
                  
                  <h4 className="text-lg font-bold text-white mb-6 flex items-center relative z-10">
                    <motion.div
                      className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <Activity className="w-5 h-5 text-white" />
                    </motion.div>
                    Real-time Analytics
                  </h4>
                  
                  <div className="space-y-4 relative z-10">
                    {[
                      { label: "Click Performance", icon: MousePointer, color: "text-blue-400" },
                      { label: "Traffic Sources", icon: Clock, color: "text-green-400" },
                      { label: "Conversion Rate", icon: Target, color: "text-purple-400" },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        className="flex justify-between items-center p-3 rounded-xl hover:bg-white/5 transition-all duration-200 group/stat relative overflow-hidden"
                        whileHover={{ x: 4 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.5 }}
                      >
                        <div className="flex items-center space-x-3">
                          <motion.div
                            whileHover={{ rotate: 360, scale: 1.2 }}
                            transition={{ duration: 0.3 }}
                          >
                            <item.icon className="w-4 h-4 text-gray-400" />
                          </motion.div>
                          <span className="text-gray-400 font-medium">{item.label}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <motion.div
                            className="h-2 w-16 bg-gray-700 rounded-full overflow-hidden"
                          >
                            <motion.div
                              className={cn("h-full bg-gradient-to-r rounded-full", `from-${item.color.replace('text-', '')}-400 to-${item.color.replace('text-', '')}-600`)}
                              initial={{ width: 0 }}
                              animate={{ width: `${60 + Math.random() * 40}%` }}
                              transition={{ duration: 1.5, delay: index * 0.3 + 1 }}
                            />
                          </motion.div>
                          <motion.span
                            className={cn("text-sm font-semibold flex items-center", item.color)}
                            animate={{ y: [0, -2, 0] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                          >
                            <TrendingUp className="w-3 h-3 mr-1" />
                          </motion.span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300"
                    whileHover={{ opacity: 1 }}
                  />
                  
                  <h4 className="text-lg font-bold text-white mb-6 flex items-center relative z-10">
                    <motion.div
                      className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-3"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Globe className="w-5 h-5 text-white" />
                    </motion.div>
                    Geographic Data
                  </h4>
                  
                  <div className="space-y-3 relative z-10">
                    {[
                      { country: "North America", flag: "🌍", color: "from-blue-500 to-cyan-500" },
                      { country: "Europe", flag: "🌍", color: "from-purple-500 to-pink-500" },
                      { country: "Asia Pacific", flag: "🌏", color: "from-green-500 to-emerald-500" },
                    ].map((item, index) => (
                      <motion.div 
                        key={item.country} 
                        className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-200 group/country relative overflow-hidden"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.6 }}
                        whileHover={{ x: 4 }}
                      >
                        <motion.span
                          className="text-2xl"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                        >
                          {item.flag}
                        </motion.span>
                        
                        <span className="text-sm text-gray-400 font-medium flex-1 group-hover/country:text-white transition-colors">
                          {item.country}
                        </span>
                        
                        <div className="flex-1 bg-gray-700/50 rounded-full h-2 overflow-hidden relative">
                          <motion.div
                            className={cn("h-2 rounded-full bg-gradient-to-r", item.color)}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${40 + Math.random() * 50}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: index * 0.2 + 0.8 }}
                          />
                          
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 + 1 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Enhanced Testimonials (No Stats)
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Head of Growth",
      company: "TechFlow",
      avatar: "/placeholder-user.jpg",
      content: "LinkWeaver transformed our link management strategy. The analytics insights help us make data-driven decisions and the interface is incredibly intuitive.",
      rating: 5,
      gradient: "from-blue-500 to-purple-600",
    },
    {
      name: "Marcus Rodriguez",
      role: "Marketing Director",
      company: "StartupX",
      avatar: "/placeholder-user.jpg",
      content: "The QR code feature is perfect for our offline campaigns. Real-time tracking gives us insights we never had before. Highly recommend for any business.",
      rating: 5,
      gradient: "from-green-500 to-blue-500",
    },
    {
      name: "Emily Watson",
      role: "Content Creator",
      company: "Independent",
      avatar: "/placeholder-user.jpg",
      content: "The bio link page is exactly what I needed. Clean, customizable, and great analytics. My audience engagement has significantly improved since switching.",
      rating: 5,
      gradient: "from-pink-500 to-purple-500",
    },
  ]

  return (
    <section className="py-32 px-6 bg-black relative overflow-hidden">
      <BackgroundBeams />
      <GridPattern />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 px-6 py-3 rounded-full relative overflow-hidden group">
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <Users className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10">Customer Stories</span>
          </Badge>
          
          <TextAnimate
            className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight"
            delay={0.2}
          >
            Trusted by creators worldwide
          </TextAnimate>
          
          <motion.p
            className="text-xl text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            See what our customers have to say about LinkWeaver
          </motion.p>
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
                <motion.div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-all duration-500",
                    testimonial.gradient
                  )}
                  whileHover={{ opacity: 0.1 }}
                />
                
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <motion.div
                    className={cn("absolute inset-0 rounded-3xl bg-gradient-to-r p-px", testimonial.gradient)}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="w-full h-full bg-black rounded-3xl" />
                  </motion.div>
                </motion.div>
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <div className={cn(
                        "w-16 h-16 bg-gradient-to-br rounded-2xl flex items-center justify-center p-0.5 shadow-2xl",
                        testimonial.gradient
                      )}>
                        <img
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-full h-full rounded-2xl object-cover bg-gray-800"
                        />
                      </div>
                      
                      <motion.div
                        className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-black flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <CheckCircle className="w-2 h-2 text-white" />
                      </motion.div>
                    </motion.div>
                    
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300"
                          style={{backgroundImage: `linear-gradient(135deg, ${testimonial.gradient.replace('from-', '').replace(' to-', ', ')})`}}>
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-400 font-medium">{testimonial.role}</p>
                      <p className="text-xs text-gray-500">{testimonial.company}</p>
                    </div>
                    
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="px-3 py-1 bg-white/10 rounded-full text-xs text-gray-300 border border-white/20"
                    >
                      Verified
                    </motion.div>
                  </div>
                  
                  <motion.p
                    className="text-gray-300 mb-6 leading-relaxed text-base relative"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.span
                      className="absolute -top-2 -left-2 text-4xl text-gray-600"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      "
                    </motion.span>
                    {testimonial.content}
                    <motion.span
                      className="absolute -bottom-4 -right-2 text-4xl text-gray-600"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                    >
                      "
                    </motion.span>
                  </motion.p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.2 + i * 0.1 + 0.5 }}
                          whileHover={{ scale: 1.3, rotate: 360 }}
                        >
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        </motion.div>
                      ))}
                    </div>
                    
                    <motion.div
                      className="flex items-center space-x-2 text-xs text-gray-400"
                      whileHover={{ scale: 1.05 }}
                    >
                      <CheckCircle className="w-3 h-3 text-green-400" />
                      <span>Verified review</span>
                    </motion.div>
                  </div>
                </div>
                
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/20 rounded-full"
                    style={{
                      top: `${20 + i * 25}%`,
                      right: `${5 + i * 5}%`,
                    }}
                    animate={{
                      y: [0, -8, 0],
                      opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      delay: i * 0.7,
                    }}
                  />
                ))}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Enhanced CTA Section
function CTASection() {
  return (
    <section className="py-32 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 relative overflow-hidden">
      <ShootingStars />
      <BackgroundBeams />
      
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, #8b5cf6 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, #06b6d4 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>
      
      <div className="absolute inset-0 bg-black/20" />
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-8 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-3 rounded-full relative overflow-hidden group">
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <Sparkles className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10">Get Started Today</span>
          </Badge>
          
          <TextAnimate
            className="text-5xl md:text-6xl font-bold mb-8 text-white tracking-tight"
            delay={0.2}
          >
            Ready to get started?
          </TextAnimate>
          
          <motion.p
            className="text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join thousands of creators and businesses who trust LinkWeaver to manage their links and grow their audience.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group"
            >
              <Button size="lg" asChild className="text-lg px-10 py-5 bg-white text-black hover:bg-gray-100 rounded-2xl shadow-2xl hover:shadow-white/25 transition-all duration-500 relative overflow-hidden">
                <Link href="/auth/signup">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">Start for free</span>
                  <motion.div
                    className="ml-3 relative z-10"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group"
            >
              <Button size="lg" variant="outline" asChild className="text-lg px-10 py-5 bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 rounded-2xl transition-all duration-500 relative overflow-hidden">
                <Link href="/contact">
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <MessageCircle className="mr-3 w-5 h-5 relative z-10" />
                  <span className="relative z-10">Contact sales</span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex flex-wrap items-center justify-center gap-8 text-white/70"
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
                className="flex items-center space-x-2 text-sm font-medium group"
                whileHover={{ scale: 1.05, color: "#ffffff" }}
                transition={{ duration: 0.2 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.9 }}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon className="w-5 h-5 text-green-300" />
                </motion.div>
                <span className="group-hover:text-white transition-colors">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Enhanced Footer
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
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center space-x-4 mb-6 group">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl relative overflow-hidden"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <LinkIcon className="w-6 h-6 text-white relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              <span className="font-bold text-2xl text-white">LinkWeaver</span>
            </Link>
            <motion.p
              className="text-gray-400 leading-relaxed mb-6 max-w-sm"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              The modern link management platform for creators and businesses. Trusted by thousands worldwide.
            </motion.p>
            
            <div className="flex space-x-4">
              {["twitter", "github", "linkedin", "discord"].map((social, index) => (
                <motion.div
                  key={social}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <Button variant="ghost" size="sm" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 group">
                    <span className="sr-only">{social}</span>
                    <div className="w-4 h-4 bg-gray-400 group-hover:bg-white rounded transition-colors duration-300" />
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
              <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-wider">
                {category}
              </h3>
              <ul className="space-y-3">
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
                      className="text-gray-400 hover:text-white transition-all duration-300 text-sm font-medium hover:translate-x-1 inline-block relative group"
                    >
                      {link}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
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
          viewport={{ once: true }}
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
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.6 }}
              >
                <Link href={`/${item.toLowerCase()}`} className="hover:text-white transition-colors font-medium relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
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
    <div className="min-h-screen bg-black antialiased selection:bg-blue-500/20">
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
