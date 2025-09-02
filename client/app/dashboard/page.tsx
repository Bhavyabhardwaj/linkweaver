"use client"
import { useState, useEffect } from "react"
import {
  BarChart3,
  Link2,
  QrCode,
  Users,
  Plus,
  ExternalLink,
  Copy,
  MoreHorizontal,
  Sparkles,
  Zap,
  ArrowUpRight,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import DashboardLayout from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { CreateLinkDialog } from "@/components/create-link-dialog"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/lib/api-client"


const AnimatedCounter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0)


  useEffect(() => {
    let startTime: number
    let animationFrame: number


    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }


    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])


  return <span>{count.toLocaleString()}</span>
}


export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<any>(null)
  const [createLinkOpen, setCreateLinkOpen] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()


  useEffect(() => {
    loadAnalytics()
  }, [])


  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getAnalyticsOverview()
      setAnalytics(response)
    } catch (error) {
      console.error("Failed to load analytics:", error)
      toast({
        title: "Failed to load analytics",
        description: "There was an error loading your analytics data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }


  const stats = analytics
    ? [
        {
          title: "Total Clicks",
          value: analytics.totalClicks || 0,
          icon: BarChart3,
          iconColor: "text-white dark:text-black",
          iconBg: "bg-black dark:bg-white",
        },
        {
          title: "Active Links",
          value: analytics.totalLinks || 0,
          icon: Link2,
          iconColor: "text-white",
          iconBg: "bg-emerald-500",
        },
        {
          title: "QR Scans",
          value: analytics.totalQRScans || 0,
          icon: QrCode,
          iconColor: "text-white",
          iconBg: "bg-orange-500",
        },
        {
          title: "Bio Views",
          value: analytics.totalBioViews || 0,
          icon: Users,
          iconColor: "text-white",
          iconBg: "bg-emerald-500",
        },
      ]
    : []


  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6 px-2 sm:px-4 lg:px-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <Skeleton className="h-6 sm:h-8 w-64 sm:w-80" />
                <Skeleton className="h-4 sm:h-5 w-80 sm:w-96" />
              </div>
              <Skeleton className="h-10 w-full sm:w-32" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 sm:h-32 w-full" />
              ))}
            </div>
            <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
              <Skeleton className="h-64 sm:h-80 w-full lg:col-span-2" />
              <Skeleton className="h-64 sm:h-80 w-full" />
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }


  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 sm:space-y-8 px-2 sm:px-4 lg:px-0 pb-6 sm:pb-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground font-inter leading-tight">
                  Welcome back, {user?.name?.split(" ")[0] || "there"}!
                </h1>
                <div className="flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full w-fit">
                  <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300 font-work-sans">Pro</span>
                </div>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground font-dm-sans">Here's what's happening with your links today.</p>
            </div>
            <Button 
              className="bg-black hover:bg-black/90 dark:bg-white dark:hover:bg-white/90 dark:text-black text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl group font-work-sans font-medium w-full sm:w-auto h-11 sm:h-10"
              onClick={() => setCreateLinkOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-200" />
              Create Link
            </Button>
          </div>


          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, index) => (
              <Card
                key={stat.title}
                className="border border-border shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 bg-card"
              >
                <CardContent className="p-3 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div
                      className={`p-2 sm:p-3 rounded-xl ${stat.iconBg} shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110`}
                    >
                      <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.iconColor}`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1 font-work-sans">
                      {stat.title}
                    </p>
                    <div className="text-lg sm:text-2xl font-bold text-foreground font-inter">
                      <AnimatedCounter end={stat.value} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>


          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Recent Activity */}
            <Card className="lg:col-span-2 border border-border shadow-lg bg-card">
              <CardHeader className="border-b border-border p-4 sm:p-6">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 font-inter">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500 shadow-sm">
                      <Activity className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base sm:text-lg">Recent Activity</span>
                  </div>
                  <Badge variant="outline" className="ml-0 sm:ml-auto font-work-sans w-fit">Live</Badge>
                </CardTitle>
                <CardDescription className="font-dm-sans text-sm">
                  Real-time updates from your links
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {analytics?.recentActivity?.map((activity: any, index: number) => (
                    <div
                      key={activity.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-xl border border-border hover:bg-muted/50 transition-all duration-200 group hover:shadow-md"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground font-work-sans text-sm sm:text-base truncate">{activity.action}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground font-dm-sans truncate">{activity.link}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground ml-5 sm:ml-0">
                        <Badge variant="secondary" className="text-xs">{activity.country}</Badge>
                        <span className="whitespace-nowrap">{activity.time}</span>
                      </div>
                    </div>
                  )) || (
                    <div className="text-center py-8 sm:py-12 text-muted-foreground">
                      <div className="p-4 rounded-full bg-muted w-fit mx-auto mb-4">
                        <Activity className="w-6 sm:w-8 h-6 sm:h-8" />
                      </div>
                      <p className="font-medium font-work-sans">No recent activity</p>
                      <p className="text-sm mt-1 font-dm-sans">Your link activity will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>


            {/* Top Countries */}
            <Card className="border border-border shadow-lg bg-card">
              <CardHeader className="border-b border-border p-4 sm:p-6">
                <CardTitle className="flex items-center gap-3 font-inter">
                  <div className="p-2 rounded-xl bg-orange-500 shadow-sm">
                    <BarChart3 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-foreground text-base sm:text-lg">Top Countries</span>
                </CardTitle>
                <CardDescription className="text-muted-foreground font-dm-sans text-sm">Your best performing regions</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                  {analytics?.topCountries?.slice(0, 4).map((country: any, index: number) => (
                    <div
                      key={country.code}
                      className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-border hover:bg-muted/50 transition-all duration-200 group hover:shadow-md"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 sm:gap-3 mb-2">
                          <span className="text-base sm:text-lg">{country.flag}</span>
                          <p className="font-medium truncate text-foreground font-work-sans text-sm sm:text-base">{country.name}</p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-xs sm:text-sm font-medium text-foreground font-inter">
                            {country.clicks.toLocaleString()} clicks
                          </span>
                          <Badge variant="outline" className="font-work-sans text-xs">#{index + 1}</Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity rounded-lg p-2"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="font-work-sans">
                            <ExternalLink className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="font-work-sans">
                            <Copy className="w-4 h-4 mr-2" />
                            Export Data
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )) || (
                    <div className="text-center py-6 sm:py-8 text-muted-foreground">
                      <div className="p-4 rounded-full bg-muted w-fit mx-auto mb-4">
                        <BarChart3 className="w-6 sm:w-8 h-6 sm:h-8" />
                      </div>
                      <p className="font-work-sans">No data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>


          {/* Quick Actions */}
          <Card className="border border-border shadow-lg bg-card">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-3 font-inter">
                    <div className="p-2 rounded-xl bg-black dark:bg-white shadow-sm">
                      <Zap className="w-4 h-4 text-white dark:text-black" />
                    </div>
                    <span className="text-foreground text-base sm:text-lg">Quick Actions</span>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground font-dm-sans text-sm">
                    Get started with these common tasks
                  </CardDescription>
                </div>
                <Badge className="bg-purple-500 text-white text-xs px-3 py-1 border-0 font-work-sans w-fit">Popular</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-4 hover:bg-muted/50 bg-transparent border-border rounded-xl group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  onClick={() => (window.location.href = "/dashboard/short-links")}
                >
                  <div className="p-3 sm:p-4 rounded-xl bg-black dark:bg-white shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                    <Link2 className="w-5 sm:w-6 h-5 sm:h-6 text-white dark:text-black" />
                  </div>
                  <div className="text-center">
                    <span className="font-semibold text-foreground font-work-sans text-sm sm:text-base">Create Short Link</span>
                    <p className="text-xs text-muted-foreground mt-1 font-dm-sans">Generate shortened URLs</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-4 hover:bg-muted/50 bg-transparent border-border rounded-xl group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  onClick={() => (window.location.href = "/dashboard/bio-links")}
                >
                  <div className="p-3 sm:p-4 rounded-xl bg-emerald-500 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                    <Users className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <span className="font-semibold text-foreground font-work-sans text-sm sm:text-base">Edit Bio Page</span>
                    <p className="text-xs text-muted-foreground mt-1 font-dm-sans">Customize your profile</p>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 sm:p-6 flex flex-col items-center gap-3 sm:gap-4 hover:bg-muted/50 bg-transparent border-border rounded-xl group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 sm:col-span-2 lg:col-span-1"
                  onClick={() => (window.location.href = "/dashboard/qr-codes")}
                >
                  <div className="p-3 sm:p-4 rounded-xl bg-orange-500 shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-110">
                    <QrCode className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <span className="font-semibold text-foreground font-work-sans text-sm sm:text-base">Generate QR Code</span>
                    <p className="text-xs text-muted-foreground mt-1 font-dm-sans">Create scannable codes</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>


        <CreateLinkDialog 
          open={createLinkOpen} 
          onOpenChange={setCreateLinkOpen}
          onSuccess={loadAnalytics}
        />
      </DashboardLayout>
    </ProtectedRoute>
  )
}
