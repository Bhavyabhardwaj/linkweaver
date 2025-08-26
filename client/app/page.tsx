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

// Aceternity UI Components (Same as before)
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

// Enhanced Navigation (Same as before)
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

// Enhanced Hero (Same as before)
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
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 bg-black overflow-hidden">
      <BackgroundBeams />
      <ShootingStars />
      <GridPattern />
      
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

// MUCH MORE COMPACT Features Section
function FeaturesSection() {
  const features = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Advanced Analytics",
      description: "Get deep insights into your link performance with real-time tracking and detailed reports.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: <QrCode className="w-6 h-6" />,
      title: "Dynamic QR Codes",
      description: "Generate beautiful QR codes that automatically update and provide detailed scan analytics.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Bio Link Pages",
      description: "Create stunning, mobile-optimized landing pages that showcase all your important links.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Bank-grade security with SOC 2 compliance and advanced access controls.",
      gradient: "from-red-500 to-orange-500",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Network",
      description: "Lightning-fast redirects from our global CDN with intelligent routing.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Developer API",
      description: "Powerful REST API with webhooks for seamless integration into your workflows.",
      gradient: "from-yellow-500 to-orange-500",
    },
  ]

  return (
    <section className="py-20 px-6 bg-black relative overflow-hidden">
      <BackgroundBeams />
      <GridPattern />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
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
            <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 px-4 py-2 rounded-full relative overflow-hidden">
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
            className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-tight"
            delay={0.2}
          >
            Everything you need to manage links
          </TextAnimate>
          
          <motion.p
            className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Powerful features designed to help you create, track, and optimize your links.
          </motion.p>
        </motion.div>

        {/* Compact 3x2 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500"
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
                    "mb-4 p-3 bg-gradient-to-br rounded-xl w-fit shadow-xl",
                    feature.gradient
                  )}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-white">{feature.icon}</div>
                </motion.div>

                <motion.h3
                  className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${feature.gradient.replace('from-', '').replace(' to-', ', ')})`,
                  }}
                  whileHover={{ scale: 1.02 }}
                >
                  {feature.title}
                </motion.h3>
                
                <motion.p
                  className="text-gray-400 text-sm leading-relaxed mb-4"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  {feature.description}
                </motion.p>
                
                {/* Learn More Button */}
                <div className="flex items-center justify-between">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost" 
                      size="sm"
                      className="text-white hover:text-white border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium relative overflow-hidden transition-all duration-300"
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
                    <ChevronRight className="w-4 h-4 text-gray-400" />
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
      </div>
    </section>
  )
}

// Enhanced Interactive Demo (Same as before but more compact)
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
    <section id="demo" className="py-20 px-6 bg-black relative overflow-hidden">
      <BackgroundBeams />
      <ShootingStars />
      <GridPattern />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-6 bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 px-4 py-2 rounded-full relative overflow-hidden group">
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
            <Play className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10">Interactive Demo</span>
          </Badge>
          
          <TextAnimate
            className="text-3xl md:text-4xl font-bold mb-4 text-white tracking-tight"
            delay={0.2}
          >
            See it in action
          </TextAnimate>
          
          <motion.p
            className="text-lg text-gray-400 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Try our link shortener and see real-time analytics
          </motion.p>
        </motion.div>

        <motion.div
          className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center relative z-10">
            {/* URL Shortener Interface */}
            <div className="space-y-6">
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Original URL
                </label>
                <div className="relative group">
                  <motion.input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter your long URL"
                    whileFocus={{ scale: 1.02 }}
                  />
                  <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </motion.div>

              <motion.div className="flex justify-center py-4">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button 
                    className="rounded-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-xl transition-all duration-300"
                    onClick={handleShorten}
                  >
                    <motion.div
                      animate={isAnimating ? { rotate: 360 } : { rotate: 0 }}
                      transition={{ duration: 0.5 }}
                      className="relative z-10"
                    >
                      {isAnimating ? (
                        <Clock className="w-5 h-5" />
                      ) : (
                        <ArrowRight className="w-5 h-5" />
                      )}
                    </motion.div>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Shortened URL
                </label>
                <div className="flex items-center space-x-3">
                  <div className="relative flex-1 group">
                    <motion.input
                      type="text"
                      value={shortUrl}
                      readOnly
                      className="w-full px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-xl text-white backdrop-blur-xl relative z-10"
                      animate={showSuccess ? { scale: [1, 1.02, 1] } : {}}
                    />
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button variant="outline" size="sm" className="px-3 py-3 bg-white/5 backdrop-blur-xl border border-white/20 text-white hover:bg-white/10 transition-all duration-300 rounded-xl">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Compact Analytics Dashboard */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                <h4 className="text-base font-bold text-white mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  Analytics
                </h4>
                
                <div className="space-y-3">
                  {[
                    { label: "Performance", color: "text-blue-400" },
                    { label: "Sources", color: "text-green-400" },
                    { label: "Conversion", color: "text-purple-400" },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      className="flex justify-between items-center text-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                    >
                      <span className="text-gray-400">{item.label}</span>
                      <div className="flex items-center space-x-2">
                        <div className="h-1 w-12 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className={cn("h-full rounded-full", `bg-${item.color.replace('text-', '')}`)}
                            initial={{ width: 0 }}
                            animate={{ width: `${60 + Math.random() * 40}%` }}
                            transition={{ duration: 1.5, delay: index * 0.3 + 1 }}
                          />
                        </div>
                        <TrendingUp className={cn("w-3 h-3", item.color)} />
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

// Enhanced CTA Section (Same as before)
function CTASection() {
  return (
    <section className="py-24 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-600 relative overflow-hidden">
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
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Badge className="mb-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-2 rounded-full relative overflow-hidden group">
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
            <Sparkles className="w-4 h-4 mr-2 relative z-10" />
            <span className="relative z-10">Get Started Today</span>
          </Badge>
          
          <TextAnimate
            className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight"
            delay={0.2}
          >
            Ready to get started?
          </TextAnimate>
          
          <motion.p
            className="text-lg text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Join thousands of creators and businesses who trust LinkWeaver to manage their links and grow their audience.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" asChild className="text-base px-8 py-3 bg-white text-black hover:bg-gray-100 rounded-xl shadow-xl transition-all duration-500 relative overflow-hidden">
                <Link href="/auth/signup">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">Start for free</span>
                  <ArrowRight className="ml-2 w-4 h-4 relative z-10" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button size="lg" variant="outline" asChild className="text-base px-8 py-3 bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 rounded-xl transition-all duration-500">
                <Link href="/contact">
                  <MessageCircle className="mr-2 w-4 h-4" />
                  Contact sales
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="flex flex-wrap items-center justify-center gap-6 text-white/70"
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
                className="flex items-center space-x-2 text-sm font-medium"
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
                  <item.icon className="w-4 h-4 text-green-300" />
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

// Enhanced Footer (Same as before)
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
      
      <div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-8">
          <motion.div 
            className="col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="flex items-center space-x-3 mb-4 group">
              <motion.div 
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-xl"
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <LinkIcon className="w-5 h-5 text-white" />
              </motion.div>
              <span className="font-bold text-xl text-white">LinkWeaver</span>
            </Link>
            <motion.p
              className="text-gray-400 leading-relaxed mb-4 max-w-sm text-sm"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              The modern link management platform for creators and businesses.
            </motion.p>
            
            <div className="flex space-x-3">
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
                  <Button variant="ghost" size="sm" className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300">
                    <span className="sr-only">{social}</span>
                    <div className="w-3 h-3 bg-gray-400 rounded" />
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
              <h3 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">
                {category}
              </h3>
              <ul className="space-y-2">
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
          className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <p className="text-gray-400 text-sm">
            © 2025 LinkWeaver. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
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
    <div className="min-h-screen bg-black antialiased selection:bg-blue-500/20">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <InteractiveDemoSection />
      {/* Removed TestimonialsSection */}
      <CTASection />
      <Footer />
    </div>
  )
}
