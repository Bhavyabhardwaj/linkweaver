"use client"

import { useState, useEffect } from "react"
import {
  Plus,
  ExternalLink,
  Copy,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  Shield,
  Clock,
  QrCode,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import DashboardLayout from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import apiClient from "@/lib/api-client"

const shortLinkSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  slug: z.string().optional(),
  title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
  description: z.string().optional(),
  password: z.string().optional(),
  expiresAt: z.string().optional(),
  clickLimit: z.number().optional(),
  generateQR: z.boolean().default(false),
})

type ShortLinkForm = z.infer<typeof shortLinkSchema>

interface ShortLink {
  id: string
  title?: string
  url: string
  shortUrl: string
  slug: string
  clicks: number
  clickLimit?: number
  active: boolean
  hasPassword: boolean
  expiresAt?: string
  createdAt: string
  qrCodeUrl?: string
  status: "active" | "expired" | "limit_reached" | "inactive"
}

const expirationPresets = [
  { label: "1 Hour", value: "1h" },
  { label: "1 Day", value: "1d" },
  { label: "1 Week", value: "1w" },
  { label: "1 Month", value: "1m" },
  { label: "Custom", value: "custom" },
]

export default function ShortLinksPage() {
  const [links, setLinks] = useState<ShortLink[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLinks, setSelectedLinks] = useState<string[]>([])
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<ShortLink | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [checkingSlug, setCheckingSlug] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [expirationPreset, setExpirationPreset] = useState("1w")

  const { user } = useAuth()
  const { toast } = useToast()

  const form = useForm<ShortLinkForm>({
    resolver: zodResolver(shortLinkSchema),
    defaultValues: {
      url: "",
      slug: "",
      title: "", // This will be required by validation
      description: "",
      password: "",
      expiresAt: "",
      clickLimit: undefined,
      generateQR: false,
    },
  })

  const editForm = useForm<ShortLinkForm>({
    resolver: zodResolver(shortLinkSchema),
  })

  useEffect(() => {
    loadShortLinks()
  }, [])

  const loadShortLinks = async () => {
    try {
      const response = await apiClient.getShortLinks()
      // Ensure response.data is an array
      const linksData = Array.isArray(response.data) ? response.data : []
      setLinks(linksData)
    } catch (error) {
      console.error('Failed to load short links:', error)
      // Set empty array on error to prevent filter issues
      setLinks([])
      toast({
        title: "Failed to load short links",
        description: "There was an error loading your short links.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const checkSlugAvailability = async (slug: string) => {
    if (!slug || slug.length < 3) {
      setSlugAvailable(null)
      return
    }

    setCheckingSlug(true)
    try {
      // Simulate API call for demo
      await new Promise((resolve) => setTimeout(resolve, 500))
      const isAvailable = !links.some((link) => link.slug === slug)
      setSlugAvailable(isAvailable)
    } catch (error) {
      setSlugAvailable(null)
    } finally {
      setCheckingSlug(false)
    }
  }

  const generateExpirationDate = (preset: string) => {
    const now = new Date()
    switch (preset) {
      case "1h":
        return new Date(now.getTime() + 60 * 60 * 1000).toISOString()
      case "1d":
        return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
      case "1w":
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
      case "1m":
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
      default:
        return ""
    }
  }

  const createShortLink = async (data: ShortLinkForm) => {
    setIsCreating(true)
    try {
      // Prepare the link data
      const linkData: any = {
        url: data.url,
        title: data.title, // Required field
      }

      // Only add optional fields if they have values
      if (data.slug && data.slug.trim()) {
        linkData.slug = data.slug.trim()
      }
      
      if (data.description && data.description.trim()) {
        linkData.description = data.description.trim()
      }
      
      if (data.password && data.password.trim()) {
        linkData.password = data.password.trim()
      }
      
      if (data.clickLimit && data.clickLimit > 0) {
        linkData.clickLimit = data.clickLimit
      }

      // Handle expiration
      if (expirationPreset !== "custom" && expirationPreset !== "never") {
        const expirationDate = generateExpirationDate(expirationPreset)
        if (expirationDate) {
          linkData.expiresAt = new Date(expirationDate)
        }
      } else if (data.expiresAt && data.expiresAt.trim()) {
        linkData.expiresAt = new Date(data.expiresAt)
      }

      console.log('Sending link data:', linkData)

      await apiClient.createShortLink(linkData)
      await loadShortLinks()

      form.reset()
      setCreateDialogOpen(false)
      toast({
        title: "Short link created!",
        description: "Your short link has been created successfully.",
      })
    } catch (error) {
      console.error('Error creating short link:', error)
      toast({
        title: "Failed to create short link",
        description: error instanceof Error ? error.message : "There was an error creating your short link.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const updateShortLink = async (data: ShortLinkForm) => {
    if (!editingLink) return

    setIsUpdating(true)
    try {
      await apiClient.updateShortLink(editingLink.id, data)
      await loadShortLinks()

      setEditingLink(null)
      toast({
        title: "Short link updated!",
        description: "Your short link has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to update short link",
        description: "There was an error updating your short link.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const toggleLinkStatus = async (id: string) => {
    try {
      const link = links.find((l) => l.id === id)
      if (!link) return

      await apiClient.updateShortLink(id, { active: !link.active })
      await loadShortLinks()

      toast({
        title: link.active ? "Link deactivated" : "Link activated",
        description: `Your short link has been ${link.active ? "deactivated" : "activated"}.`,
      })
    } catch (error) {
      toast({
        title: "Failed to update link",
        description: "There was an error updating your link.",
        variant: "destructive",
      })
    }
  }

  const deleteShortLink = async () => {
    if (!linkToDelete) return

    try {
      await apiClient.deleteShortLink(linkToDelete)
      await loadShortLinks()

      toast({
        title: "Short link deleted",
        description: "Your short link has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to delete link",
        description: "There was an error deleting your link.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setLinkToDelete(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The short link has been copied to your clipboard.",
    })
  }

  const extendExpiration = async (id: string) => {
    try {
      await apiClient.request(`/api/links/${id}/extend-expiration`, { method: "PUT" })
      await loadShortLinks()

      toast({
        title: "Expiration extended",
        description: "Link expiration has been extended by 7 days.",
      })
    } catch (error) {
      toast({
        title: "Failed to extend expiration",
        description: "There was an error extending the link expiration.",
        variant: "destructive",
      })
    }
  }

  const generateQRCode = async (id: string) => {
    try {
      const response = await apiClient.request(`/api/links/generate-qr-code/${id}`)
      setLinks(links.map((l) => (l.id === id ? { ...l, qrCodeUrl: response.qrCodeUrl } : l)))

      toast({
        title: "QR code generated",
        description: "QR code has been generated for your link.",
      })
    } catch (error) {
      toast({
        title: "Failed to generate QR code",
        description: "There was an error generating the QR code.",
        variant: "destructive",
      })
    }
  }

  const startEdit = (link: ShortLink) => {
    setEditingLink(link)
    editForm.reset({
      title: link.title || "",
      url: link.url,
      description: "",
      clickLimit: link.clickLimit,
      expiresAt: link.expiresAt,
    })
  }

  const getStatusBadge = (link: ShortLink) => {
    switch (link.status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
      case "expired":
        return <Badge variant="destructive">Expired</Badge>
      case "limit_reached":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Limit Reached</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getClickProgress = (link: ShortLink) => {
    if (!link.clickLimit) return 0
    return (link.clicks / link.clickLimit) * 100
  }

  const filteredLinks = Array.isArray(links) ? links.filter(
    (link) =>
      link.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  ) : []

  const totalClicks = Array.isArray(links) ? links.reduce((sum, link) => sum + link.clicks, 0) : 0
  const activeLinks = Array.isArray(links) ? links.filter((link) => link.active && link.status === "active").length : 0

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-64 w-full" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Short Links</h1>
              <p className="text-muted-foreground">Create and manage your shortened URLs with advanced features</p>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Short Link
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Short Link</DialogTitle>
                  <DialogDescription>
                    Create a shortened URL with advanced features like password protection and expiration
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(createShortLink)} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="url">Destination URL *</Label>
                      <Input id="url" placeholder="https://example.com/very-long-url" {...form.register("url")} />
                      {form.formState.errors.url && (
                        <p className="text-sm text-destructive">{form.formState.errors.url.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">Custom Slug (optional)</Label>
                      <div className="relative">
                        <Input
                          id="slug"
                          placeholder="my-awesome-link"
                          {...form.register("slug")}
                          onChange={(e) => {
                            form.setValue("slug", e.target.value)
                            checkSlugAvailability(e.target.value)
                          }}
                        />
                        {checkingSlug && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
                          </div>
                        )}
                        {slugAvailable === true && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                        )}
                        {slugAvailable === false && (
                          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
                        )}
                      </div>
                      {slugAvailable === false && (
                        <p className="text-sm text-destructive">This slug is already taken</p>
                      )}
                      {slugAvailable === true && <p className="text-sm text-green-600">This slug is available</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" placeholder="My Awesome Link" {...form.register("title")} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clickLimit">Click Limit</Label>
                        <Input
                          id="clickLimit"
                          type="number"
                          placeholder="Unlimited"
                          {...form.register("clickLimit", { valueAsNumber: true })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Description of your link..."
                        {...form.register("description")}
                      />
                    </div>
                  </div>

                  {/* Security & Expiration */}
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Security & Expiration
                    </h4>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password Protection</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Optional password"
                          {...form.register("password")}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Expiration</Label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {expirationPresets.map((preset) => (
                          <Button
                            key={preset.value}
                            type="button"
                            variant={expirationPreset === preset.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setExpirationPreset(preset.value)}
                          >
                            {preset.label}
                          </Button>
                        ))}
                      </div>
                      {expirationPreset === "custom" && (
                        <Input type="datetime-local" {...form.register("expiresAt")} className="mt-2" />
                      )}
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div className="space-y-4 border-t pt-4">
                    <h4 className="font-medium">Additional Options</h4>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="generateQR" {...form.register("generateQR")} />
                      <Label htmlFor="generateQR" className="flex items-center gap-2">
                        <QrCode className="w-4 h-4" />
                        Generate QR Code
                      </Label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isCreating || slugAvailable === false}>
                      {isCreating ? "Creating..." : "Create Short Link"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                    <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Links</p>
                    <p className="text-2xl font-bold">{activeLinks}</p>
                  </div>
                  <ExternalLink className="w-8 h-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Links</p>
                    <p className="text-2xl font-bold">{links.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Protected</p>
                    <p className="text-2xl font-bold">{links.filter((l) => l.hasPassword).length}</p>
                  </div>
                  <Shield className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            {selectedLinks.length > 0 && (
              <Button variant="outline" className="text-destructive bg-transparent">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected ({selectedLinks.length})
              </Button>
            )}
          </div>

          {/* Links Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Short Links</CardTitle>
              <CardDescription>Manage and track your shortened URLs with advanced features</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredLinks.length === 0 ? (
                <div className="text-center py-12">
                  <ExternalLink className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No short links yet</h3>
                  <p className="text-muted-foreground">Create your first short link to get started</p>
                  <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Short Link
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={selectedLinks.length === filteredLinks.length}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedLinks(filteredLinks.map((l) => l.id))
                              } else {
                                setSelectedLinks([])
                              }
                            }}
                          />
                        </TableHead>
                        <TableHead>Link</TableHead>
                        <TableHead>Original URL</TableHead>
                        <TableHead>Clicks</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Security</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLinks.map((link) => (
                        <TableRow key={link.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedLinks.includes(link.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedLinks([...selectedLinks, link.id])
                                } else {
                                  setSelectedLinks(selectedLinks.filter((id) => id !== link.id))
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{link.title || "Untitled"}</div>
                              <div className="text-sm text-muted-foreground font-mono flex items-center gap-2">
                                {link.shortUrl}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(`https://${link.shortUrl}`)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                              </div>
                              {link.clickLimit && (
                                <div className="space-y-1">
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>
                                      {link.clicks} / {link.clickLimit} clicks
                                    </span>
                                    <span>{Math.round(getClickProgress(link))}%</span>
                                  </div>
                                  <Progress value={getClickProgress(link)} className="h-1" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs truncate text-muted-foreground">{link.url}</div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{link.clicks.toLocaleString()}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch checked={link.active} onCheckedChange={() => toggleLinkStatus(link.id)} />
                              {getStatusBadge(link)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {link.hasPassword && (
                                <Badge variant="outline" className="text-xs">
                                  <Shield className="w-3 h-3 mr-1" />
                                  Protected
                                </Badge>
                              )}
                              {link.expiresAt && (
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {link.status === "expired" ? "Expired" : "Expires"}
                                </Badge>
                              )}
                              {link.qrCodeUrl && (
                                <Badge variant="outline" className="text-xs">
                                  <QrCode className="w-3 h-3 mr-1" />
                                  QR
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground">
                              {new Date(link.createdAt).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => copyToClipboard(`https://${link.shortUrl}`)}>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copy Link
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.open(link.url, "_blank")}>
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Visit Original
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => startEdit(link)}>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {!link.qrCodeUrl && (
                                  <DropdownMenuItem onClick={() => generateQRCode(link.id)}>
                                    <QrCode className="w-4 h-4 mr-2" />
                                    Generate QR
                                  </DropdownMenuItem>
                                )}
                                {link.status === "expired" && (
                                  <DropdownMenuItem onClick={() => extendExpiration(link.id)}>
                                    <Clock className="w-4 h-4 mr-2" />
                                    Extend Expiration
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setLinkToDelete(link.id)
                                    setDeleteDialogOpen(true)
                                  }}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={!!editingLink} onOpenChange={() => setEditingLink(null)}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Short Link</DialogTitle>
                <DialogDescription>Update your short link information and settings</DialogDescription>
              </DialogHeader>
              {editingLink && (
                <form onSubmit={editForm.handleSubmit(updateShortLink)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input id="edit-title" {...editForm.register("title")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-url">URL *</Label>
                    <Input id="edit-url" {...editForm.register("url")} />
                    {editForm.formState.errors.url && (
                      <p className="text-sm text-destructive">{editForm.formState.errors.url.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-clickLimit">Click Limit</Label>
                    <Input
                      id="edit-clickLimit"
                      type="number"
                      placeholder="Unlimited"
                      {...editForm.register("clickLimit", { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-expiresAt">Expiration Date</Label>
                    <Input id="edit-expiresAt" type="datetime-local" {...editForm.register("expiresAt")} />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setEditingLink(null)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Update Link"}
                    </Button>
                  </div>
                </form>
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your short link and all associated
                  analytics data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteShortLink} className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
