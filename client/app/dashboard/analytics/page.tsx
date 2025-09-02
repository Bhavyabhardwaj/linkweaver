"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Globe, Smartphone, Users, Clock, ExternalLink, RefreshCw, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import DashboardLayout from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast } from "@/hooks/use-toast"
import apiClient from "@/lib/api-client"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

interface AnalyticsOverview {
  totalClicks: number
  totalLinks: number
  totalQRScans: number
  totalBioViews: number
  clicksToday: number
  avgClicksPerDay: number
  topPerformingLink: string
  conversionRate: number
}

interface CountryData {
  name: string
  code: string
  clicks: number
  flag: string
  percentage: number
}

interface DeviceData {
  name: string
  value: number
  color: string
}

interface ReferrerData {
  name: string
  clicks: number
  percentage: number
}

interface ClickData {
  date: string
  clicks: number
}

interface AnalyticsData {
  overview: AnalyticsOverview
  countries: CountryData[]
  devices: DeviceData[]
  referrers: ReferrerData[]
  clicks: ClickData[]
  hourlyDistribution: Array<{ hour: string; clicks: number }>
}

// Empty initial data - will be populated from backend
const emptyAnalyticsData: AnalyticsData = {
  overview: {
    totalClicks: 0,
    totalLinks: 0,
    totalQRScans: 0,
    totalBioViews: 0,
    clicksToday: 0,
    avgClicksPerDay: 0,
    topPerformingLink: "",
    conversionRate: 0,
  },
  countries: [],
  devices: [],
  referrers: [],
  clicks: [],
  hourlyDistribution: [],
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData>(emptyAnalyticsData)
  const [timeRange, setTimeRange] = useState("7d")
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      const [overview, countries, devices, referrers, clicks] = await Promise.all([
        apiClient.getAnalyticsOverview(),
        apiClient.getCountryAnalytics(),
        apiClient.getDeviceAnalytics(),
        apiClient.getReferrerAnalytics(),
        apiClient.getClickAnalytics({
          startDate: new Date(
            Date.now() - (timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90) * 24 * 60 * 60 * 1000,
          ).toISOString(),
          endDate: new Date().toISOString(),
        }),
      ])

      // Safely merge API data with defaults
      const safeAnalytics: AnalyticsData = {
        overview: {
          totalClicks: overview?.totalClicks || 0,
          totalLinks: overview?.totalLinks || 0,
          totalQRScans: overview?.totalQRScans || 0,
          totalBioViews: overview?.totalBioViews || 0,
          clicksToday: overview?.clicksToday || 0,
          avgClicksPerDay: overview?.avgClicksPerDay || 0,
          topPerformingLink: overview?.topPerformingLink || "",
          conversionRate: overview?.conversionRate || 0,
        },
        countries: (countries?.data || countries || []).map((country: any) => ({
          name: country.name || "Unknown",
          code: country.code || "XX",
          clicks: country.clicks || 0,
          flag: country.flag || "🌍",
          percentage: country.percentage || 0,
        })),
        devices: (devices?.data || devices || []).map((device: any) => ({
          name: device.name || "Unknown",
          value: device.value || 0,
          color: device.color || "#8884d8",
        })),
        referrers: (referrers?.data || referrers || []).map((referrer: any) => ({
          name: referrer.name || "Unknown",
          clicks: referrer.clicks || 0,
          percentage: referrer.percentage || 0,
        })),
        clicks: (clicks?.data || clicks || []).map((click: any) => ({
          date: click.date || new Date().toISOString(),
          clicks: click.clicks || 0,
        })),
        hourlyDistribution: [],
      }

      setAnalytics(safeAnalytics)
    } catch (error) {
      console.error("Failed to load analytics:", error)
      // Show empty state on error instead of fake data
      setAnalytics(emptyAnalyticsData)
      toast({
        title: "Failed to Load Analytics",
        description: "Could not connect to the server. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await loadAnalytics()
    setRefreshing(false)
    toast({
      title: "Data refreshed",
      description: "Analytics data has been updated.",
    })
  }

  const exportData = () => {
    const dataStr = JSON.stringify(analytics, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `analytics-${timeRange}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Export started",
      description: "Your analytics data is being downloaded.",
    })
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-8">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  const stats = [
    {
      title: "Total Clicks",
      value: analytics.overview.totalClicks,
      icon: BarChart3,
      color: "text-blue-500",
    },
    {
      title: "Active Links",
      value: analytics.overview.totalLinks,
      icon: ExternalLink,
      color: "text-green-500",
    },
    {
      title: "Bio Views",
      value: analytics.overview.totalBioViews,
      icon: Users,
      color: "text-purple-500",
    },
    {
      title: "Avg Daily Clicks",
      value: analytics.overview.avgClicksPerDay,
      icon: TrendingUp,
      color: "text-orange-500",
    },
  ]

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-inter">Analytics Dashboard</h1>
              <p className="text-muted-foreground font-dm-sans">Comprehensive insights into your link performance</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={refreshData} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-2xl font-bold">{(stat.value || 0).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-primary/10">
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Analytics */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="geographic">Geographic</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="traffic">Traffic</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Click Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Click Trends
                  </CardTitle>
                  <CardDescription>Daily clicks over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.clicks}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                        <YAxis />
                        <Tooltip
                          labelFormatter={(value) => new Date(value).toLocaleDateString()}
                          formatter={(value, name) => [value, "Clicks"]}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="clicks"
                          stroke="#3B82F6"
                          fill="#3B82F6"
                          fillOpacity={0.6}
                          name="Clicks"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Hourly Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Hourly Distribution
                  </CardTitle>
                  <CardDescription>When your audience is most active</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.hourlyDistribution}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="clicks" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="geographic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Geographic Distribution
                  </CardTitle>
                  <CardDescription>Where your clicks are coming from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.countries.map((country, index) => (
                      <motion.div
                        key={country.code}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{country.flag}</span>
                          <div>
                            <p className="font-medium">{country.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(country.clicks || 0).toLocaleString()} clicks
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24">
                            <Progress value={country.percentage || 0} className="h-2" />
                          </div>
                          <Badge variant="outline">{country.percentage || 0}%</Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="devices" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5" />
                      Device Breakdown
                    </CardTitle>
                    <CardDescription>How users access your links</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.devices}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name} ${value}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {analytics.devices.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Device Details</CardTitle>
                    <CardDescription>Detailed device statistics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analytics.devices.map((device, index) => (
                        <motion.div
                          key={device.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: device.color }} />
                            <div>
                              <p className="font-medium">{device.name}</p>
                              <p className="text-sm text-muted-foreground">{device.value}% of traffic</p>
                            </div>
                          </div>
                          <Badge variant="outline">{device.value}%</Badge>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="traffic" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Traffic Sources
                  </CardTitle>
                  <CardDescription>Where your traffic is coming from</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.referrers.map((referrer, index) => (
                      <motion.div
                        key={referrer.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <div>
                            <p className="font-medium">{referrer.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {(referrer.clicks || 0).toLocaleString()} clicks
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24">
                            <Progress value={referrer.percentage || 0} className="h-2" />
                          </div>
                          <Badge variant="outline">{referrer.percentage || 0}%</Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Conversion Rate</CardTitle>
                    <CardDescription>Click-through performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-500 mb-2">
                        {(analytics.overview.conversionRate || 0).toFixed(1)}%
                      </div>
                      <p className="text-sm text-muted-foreground">Average conversion rate</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Link</CardTitle>
                    <CardDescription>Your best content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-lg font-semibold mb-2">{analytics.overview.topPerformingLink || "N/A"}</div>
                      <p className="text-sm text-muted-foreground mb-2">Most clicked link</p>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Today's Performance</CardTitle>
                    <CardDescription>Real-time metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-500 mb-2">
                        {(analytics.overview.clicksToday || 0).toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground">Clicks today</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
