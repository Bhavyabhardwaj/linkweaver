// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, DM_Sans, Work_Sans } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"  // Import from mono, not sans!
import localFont from "next/font/local"
import "./globals.css"
import { ThemeProvider } from "@/contexts/theme-context"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/toaster"

// Optimized premium font loading with proper fallbacks
const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"]
})

// DM Sans for secondary content and body text
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  fallback: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"]
})

// Work Sans for versatile UI elements (recommended by experts)
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap", 
  fallback: ["Inter", "DM Sans", "system-ui", "sans-serif"]
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono", 
  display: "swap",
  fallback: ["Menlo", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"]
})

// Geist fonts from NPM package with proper variable configuration
const geistSans = GeistSans
const geistMono = GeistMono

// Cal Sans font (optional - only if you have the file)
const calSans = localFont({
  src: [
    {
      path: "./fonts/CalSans-SemiBold.woff2",
      weight: "600",
      style: "normal"
    }
  ],
  variable: "--font-cal-sans",
  display: "swap",
  fallback: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"]
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://linkweaver.bhavya.live'),
  title: {
    default: "LinkWeaver ",
    template: "%s | LinkWeaver"
  },
  description: "Create stunning bio pages, track analytics with precision, and manage your digital presence. The most advanced link management platform for creators, marketers, and businesses.",
  keywords: [
    "link management",
    "bio pages", 
    "url shortener",
    "link analytics",
    "creator tools",
    "digital marketing",
    "custom domains",
    "QR codes",
    "link tracking",
    "social media tools"
  ],
  authors: [
    { name: "Bhavya", url: "https://bhavya.live" },
    { name: "LinkWeaver Team" }
  ],
  creator: "Bhavya",
  publisher: "LinkWeaver",
  category: "Technology",
  classification: "SaaS Platform",
  
  // Enhanced icons with multiple formats
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/logo.png", type: "image/png", sizes: "32x32" },
      { url: "/logo.png", type: "image/png", sizes: "16x16" },
      { url: "/logo.png", type: "image/png", sizes: "48x48" }
    ],
    shortcut: "/icon.svg",
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" }
    ]
  },

  // Enhanced Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://linkweaver.bhavya.live',
    siteName: "LinkWeaver",
    title: "LinkWeaver ",
    description: "Create stunning bio pages, track analytics with precision, and manage your digital presence. The most advanced link management platform built for modern creators.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LinkWeaver ",
        type: "image/png"
      },
      {
        url: "/og-image-square.png",
        width: 1200,
        height: 1200,
        alt: "LinkWeaver Logo",
        type: "image/png"
      }
    ]
  },

  // Enhanced Twitter/X metadata
  twitter: {
    card: "summary_large_image",
    site: "@linkweaver",
    creator: "@bhavyabuilds",
    title: "LinkWeaver",
    description: "Create stunning bio pages, track analytics with precision, and manage your digital presence like never before.",
    images: {
      url: "/twitter-image.png",
      alt: "LinkWeaver - Link Management Platform"
    }
  },

  // Enhanced robots configuration
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },

  // Verification codes for search engines
  verification: {
    google: process.env.GOOGLE_VERIFICATION || "your-google-verification-code",
    yandex: process.env.YANDEX_VERIFICATION,
    yahoo: process.env.YAHOO_VERIFICATION,
    other: {
      "msvalidate.01": process.env.BING_VERIFICATION || ""
    }
  },

  // Additional metadata for better SEO
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL || 'https://linkweaver.bhavya.live',
    languages: {
      "en-US": "/",
      "en-GB": "/en-gb"
    }
  },

  // App configuration
  applicationName: "LinkWeaver",
  referrer: "origin-when-cross-origin",
  
  // PWA manifest
  manifest: "/manifest.json",

  // Additional structured data hints
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml"
  }
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${jetbrainsMono.variable} ${geistSans.variable} ${geistMono.variable} ${calSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://linkweaver.bhavya.live" />
        
        {/* DNS prefetch for faster resource loading */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Structured data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "LinkWeaver",
              "description": "Advanced link management and analytics platform for creators and businesses",
              "url": process.env.NEXT_PUBLIC_APP_URL || 'https://linkweaver.bhavya.live',
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "publisher": {
                "@type": "Person", 
                "name": "Bhavya",
                "url": "https://bhavya.live"
              }
            })
          }}
        />
      </head>
      <body 
        className={`${inter.className} ${inter.variable} ${dmSans.variable} ${workSans.variable} ${jetbrainsMono.variable} ${geistSans.variable} ${geistMono.variable} ${calSans.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider 
          defaultTheme="system" 
          storageKey="linkweaver-theme"
        >
          <AuthProvider>
            <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 antialiased selection:bg-zinc-200 dark:selection:bg-zinc-800">
              {children}
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>

        {/* Analytics and performance monitoring */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `
              }}
            />
          </>
        )}
      </body>
    </html>
  )
}
