"use client"

import { useState, useEffect } from "react"
import { motion, Reorder } from "framer-motion"
import {
  Plus,
  GripVertical,
  ExternalLink,
  Copy,
  Edit,
  Trash2,
  Eye,
  Smartphone,
  Monitor,
  Palette,
  MoreHorizontal,
  BarChart3,
  Globe,
  Calendar,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Skeleton } from "@/components/ui/skeleton"
import DashboardLayout from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import apiClient from "@/lib/api-client"

const bioLinkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Please enter a valid URL"),
  description: z.string().optional(),
  icon: z.string().optional(),
})

type BioLinkForm = z.infer<typeof bioLinkSchema>

interface BioLink {
  id: string
  title: string
  url: string
  description?: string
  active: boolean
  clicks: number
  icon?: string
  order: number
  createdAt: string
}

interface BioTheme {
  id: string
  name: string
  preview: string
  background: string
  textColor: string
  buttonStyle: string
  cardStyle: string
}

const themes: BioTheme[] = [
  {
    id: "minimal-white",
    name: "Minimal White",
    preview: "bg-white text-gray-900",
    background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
    textColor: "#1f2937",
    buttonStyle: "rounded-lg bg-gray-900 text-white hover:bg-gray-800",
    cardStyle: "bg-white border border-gray-200 shadow-sm",
  },
  {
    id: "dark-professional",
    name: "Dark Professional",
    preview: "bg-gray-900 text-white",
    background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
    textColor: "#ffffff",
    buttonStyle: "rounded-lg bg-white text-gray-900 hover:bg-gray-100",
    cardStyle: "bg-gray-800 border border-gray-700",
  },
  {
    id: "gradient-sunset",
    name: "Gradient Sunset",
    preview: "bg-gradient-to-br from-orange-400 to-pink-600 text-white",
    background: "linear-gradient(135deg, #fb7185 0%, #f97316 50%, #eab308 100%)",
    textColor: "#ffffff",
    buttonStyle: "rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30",
    cardStyle: "bg-white/10 backdrop-blur border border-white/20",
  },
  {
    id: "neon-cyber",
    name: "Neon Cyber",
    preview: "bg-black text-cyan-400",
    background: "linear-gradient(135deg, #000000 0%, #0f172a 100%)",
    textColor: "#22d3ee",
    buttonStyle: "rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 shadow-lg shadow-cyan-500/25",
    cardStyle: "bg-slate-900 border border-cyan-500/50 shadow-lg shadow-cyan-500/10",
  },
  {
    id: "nature-green",
    name: "Nature Green",
    preview: "bg-green-50 text-green-900",
    background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
    textColor: "#14532d",
    buttonStyle: "rounded-lg bg-green-600 text-white hover:bg-green-700",
    cardStyle: "bg-white border border-green-200 shadow-sm",
  },
  {
    id: "corporate-blue",
    name: "Corporate Blue",
    preview: "bg-blue-50 text-blue-900",
    background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
    textColor: "#1e3a8a",
    buttonStyle: "rounded-lg bg-blue-600 text-white hover:bg-blue-700",
    cardStyle: "bg-white border border-blue-200 shadow-sm",
  },
  {
    id: "creative-purple",
    name: "Creative Purple",
    preview: "bg-purple-50 text-purple-900",
    background: "linear-gradient(135deg, #faf5ff 0%, #e9d5ff 100%)",
    textColor: "#581c87",
    buttonStyle: "rounded-lg bg-purple-600 text-white hover:bg-purple-700",
    cardStyle: "bg-white border border-purple-200 shadow-sm",
  },
  {
    id: "retro-vibes",
    name: "Retro Vibes",
    preview: "bg-yellow-50 text-orange-900",
    background: "linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)",
    textColor: "#9a3412",
    buttonStyle: "rounded-full bg-orange-500 text-white hover:bg-orange-600",
    cardStyle: "bg-white border border-orange-200 shadow-sm",
  },
  {
    id: "modern-glass",
    name: "Modern Glass",
    preview: "bg-gray-100 text-gray-900",
    background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
    textColor: "#1e293b",
    buttonStyle: "rounded-lg bg-white/60 backdrop-blur text-gray-900 hover:bg-white/80 border border-white/20",
    cardStyle: "bg-white/40 backdrop-blur border border-white/20",
  },
  {
    id: "brutalist-black",
    name: "Brutalist Black",
    preview: "bg-black text-white",
    background: "#000000",
    textColor: "#ffffff",
    buttonStyle: "rounded-none bg-white text-black hover:bg-gray-200 border-2 border-white",
    cardStyle: "bg-black border-2 border-white",
  },
]

export default function BioLinksPage() {
  const [links, setLinks] = useState<BioLink[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTheme, setSelectedTheme] = useState("minimal-white")
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<BioLink | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [profileSettings, setProfileSettings] = useState({
    name: "John Doe",
    bio: "Full-stack developer passionate about creating amazing user experiences",
    avatar: "/placeholder.svg?height=80&width=80",
    username: "johndoe",
  })
  const [totalViews, setTotalViews] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const { user } = useAuth()
  const { toast } = useToast()

  // Update profileSettings with real user data when loaded
  useEffect(() => {
    if (user) {
      setProfileSettings((prev) => ({
        ...prev,
        name: user.name || prev.name,
        username: user.username || prev.username,
        avatar: user.avatar || prev.avatar,
        // Optionally, set bio if you store it in user object
      }))
    }
  }, [user])

  const form = useForm<BioLinkForm>({
    resolver: zodResolver(bioLinkSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
      icon: "",
    },
  })

  const editForm = useForm<BioLinkForm>({
    resolver: zodResolver(bioLinkSchema),
  })

  useEffect(() => {
    loadBioLinks()
  }, [])

  useEffect(() => {
    async function fetchTotalViews() {
      try {
        const response = await apiClient.getTotalBioLinkViews();
        setTotalViews(response?.data?.totalViews || 0);
      } catch (error) {
        setTotalViews(0);
      }
    }
    fetchTotalViews();
  }, []);

  const loadBioLinks = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getBioLinks() as any
      
      if (response.data) {
        const formattedLinks = response.data.map((link: any) => ({
          id: link.id,
          title: link.title,
          url: link.url,
          description: link.description || '',
          active: link.active,
          clicks: link._count?.linkClicks || 0,
          icon: link.icon || '🔗',
          order: link.order || 0,
          createdAt: link.createdAt,
        }))
        setLinks(formattedLinks)
      } else {
        setLinks([])
      }
    } catch (error) {
      console.error('Failed to load bio links:', error)
      toast({
        title: "Error",
        description: "Failed to load bio links. Please try again.",
        variant: "destructive",
      })
      setLinks([])
    } finally {
      setLoading(false)
    }
  }

  const createBioLink = async (data: BioLinkForm) => {
    setIsCreating(true)
    try {
      await apiClient.createBioLink(data)
      await loadBioLinks()

      form.reset()
      setCreateDialogOpen(false)
      toast({
        title: "Bio link created!",
        description: "Your bio link has been added successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to create bio link",
        description: "There was an error creating your bio link.",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const updateBioLink = async (data: BioLinkForm) => {
    if (!editingLink) return

    setIsUpdating(true)
    try {
      await apiClient.updateBioLink(editingLink.id, data)
      await loadBioLinks()

      setEditingLink(null)
      toast({
        title: "Bio link updated!",
        description: "Your bio link has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to update bio link",
        description: "There was an error updating your bio link.",
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

      await apiClient.updateBioLink(id, { active: !link.active })
      await loadBioLinks()

      toast({
        title: link.active ? "Link deactivated" : "Link activated",
        description: `Your bio link has been ${link.active ? "deactivated" : "activated"}.`,
      })
    } catch (error) {
      toast({
        title: "Failed to update link",
        description: "There was an error updating your link.",
        variant: "destructive",
      })
    }
  }

  const deleteBioLink = async () => {
    if (!linkToDelete) return

    try {
      await apiClient.deleteBioLink(linkToDelete)
      await loadBioLinks()

      toast({
        title: "Bio link deleted",
        description: "Your bio link has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to delete link",
        description: "There was an error deleting your bio link.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setLinkToDelete(null)
    }
  }

  const reorderLinks = async (newOrder: BioLink[]) => {
    setLinks(newOrder)

    try {
      const linkIds = newOrder.map((link) => link.id)
      await apiClient.reorderBioLinks(linkIds)
    } catch (error) {
      toast({
        title: "Failed to reorder links",
        description: "There was an error reordering your links.",
        variant: "destructive",
      })
      // Revert on error
      await loadBioLinks()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The link has been copied to your clipboard.",
    })
  }

  const openPreview = () => {
    const previewUrl = `/u/${profileSettings.username}`
    window.open(previewUrl, "_blank")
  }

  const startEdit = (link: BioLink) => {
    setEditingLink(link)
    editForm.reset({
      title: link.title,
      url: link.url,
      description: link.description || "",
      icon: link.icon || "",
    })
  }

  const handleCopy = async () => {
    const bioLinkUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://linkweaver.bhavya.live'}/u/${profileSettings.username}`;
    await navigator.clipboard.writeText(bioLinkUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const BioPreview = () => {
    const currentTheme = themes.find((t) => t.id === selectedTheme) || themes[0]

    return (
      <div
        className={`mx-auto bg-background border border-border rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${
          previewMode === "mobile" ? "w-80 h-[600px]" : "w-full max-w-md h-[700px]"
        }`}
        style={{
          background: currentTheme.background,
          color: currentTheme.textColor,
        }}
      >
        {/* Phone header */}
        {previewMode === "mobile" && (
          <div className="h-6 bg-black/10 flex items-center justify-center">
            <div className="w-16 h-1 bg-white/50 rounded-full" />
          </div>
        )}

        <div className="p-6 text-center h-full overflow-y-auto">
          <Avatar className="w-20 h-20 mx-auto mb-4">
            <AvatarImage src={profileSettings.avatar || "/placeholder.svg"} />
            <AvatarFallback>{profileSettings.name[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold mb-2">{profileSettings.name}</h2>
          <p className="text-sm mb-6 opacity-80">{profileSettings.bio}</p>

          <div className="space-y-3">
            {links
              .sort((a, b) => a.order - b.order)
              .map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg hover:scale-105 transition-all duration-200 cursor-pointer group"
                  style={{
                    background: currentTheme.cardStyle.includes("bg-white")
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{link.icon}</span>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{link.title}</p>
                      {link.description && <p className="text-sm opacity-70">{link.description}</p>}
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
              <Skeleton className="h-96 w-full" />
            </div>
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
              <h1 className="text-3xl font-bold">Bio Links</h1>
              <p className="text-muted-foreground">Manage your bio page and links</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={openPreview}>
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Bio Link</DialogTitle>
                    <DialogDescription>Create a new link for your bio page</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={form.handleSubmit(createBioLink)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input id="title" placeholder="My Portfolio" {...form.register("title")} />
                      {form.formState.errors.title && (
                        <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="url">URL *</Label>
                      <Input id="url" placeholder="https://example.com" {...form.register("url")} />
                      {form.formState.errors.url && (
                        <p className="text-sm text-destructive">{form.formState.errors.url.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Check out my latest work..."
                        {...form.register("description")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="icon">Icon (emoji)</Label>
                      <Input id="icon" placeholder="🌐" {...form.register("icon")} />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isCreating}>
                        {isCreating ? "Creating..." : "Create Link"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Shareable bio link */}
          <div className="flex items-center gap-2 mb-6">
            <span className="font-medium">Your Bio Link:</span>
            <Input
              value={`${process.env.NEXT_PUBLIC_API_URL || 'https://linkweaver.bhavya.live'}/u/${profileSettings.username}`}
              readOnly
              className="w-[320px] text-xs bg-muted/50 cursor-pointer"
              onClick={handleCopy}
            />
            <Button size="sm" variant="outline" onClick={handleCopy}>
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                    <p className="text-2xl font-bold">{totalViews}</p>
                  </div>
                  <Eye className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Links</p>
                    <p className="text-2xl font-bold">{links.filter((l) => l.active).length}</p>
                  </div>
                  <ExternalLink className="w-8 h-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
                    <p className="text-2xl font-bold">{links.reduce((sum, link) => sum + link.clicks, 0)}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">This Month</p>
                    <p className="text-2xl font-bold">+23%</p>
                  </div>
                  <Calendar className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Links Management */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GripVertical className="w-5 h-5" />
                    Your Links
                  </CardTitle>
                  <CardDescription>Drag and drop to reorder your links</CardDescription>
                </CardHeader>
                <CardContent>
                  {links.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">No bio links yet</h3>
                      <p className="text-muted-foreground">Create your first bio link to get started</p>
                      <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Link
                      </Button>
                    </div>
                  ) : (
                    <Reorder.Group axis="y" values={links} onReorder={reorderLinks} className="space-y-3">
                      {links.map((link) => (
                        <Reorder.Item key={link.id} value={link}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileDrag={{ scale: 1.05 }}
                            className="p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-all duration-200 cursor-grab active:cursor-grabbing"
                          >
                            <div className="flex items-center gap-4">
                              <GripVertical className="w-5 h-5 text-muted-foreground" />
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-2xl">{link.icon}</span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <p className="font-medium truncate">{link.title}</p>
                                    <Badge variant={link.active ? "default" : "secondary"} className="text-xs">
                                      {link.active ? "Active" : "Inactive"}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground truncate">{link.url}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{link.clicks} clicks</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch checked={link.active} onCheckedChange={() => toggleLinkStatus(link.id)} />
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => startEdit(link)}>
                                      <Edit className="w-4 h-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => copyToClipboard(link.url)}>
                                      <Copy className="w-4 h-4 mr-2" />
                                      Copy URL
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => window.open(link.url, "_blank")}>
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      Visit Link
                                    </DropdownMenuItem>
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
                              </div>
                            </div>
                          </motion.div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  )}
                </CardContent>
              </Card>

              {/* Customization Options */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Theme Customization
                  </CardTitle>
                  <CardDescription>Choose from professional themes for your bio page</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="themes" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="themes">Themes</TabsTrigger>
                      <TabsTrigger value="layout">Layout</TabsTrigger>
                      <TabsTrigger value="profile">Profile</TabsTrigger>
                    </TabsList>
                    <TabsContent value="themes" className="space-y-4 mt-4">
                      <div className="grid grid-cols-2 gap-3">
                        {themes.map((theme) => (
                          <motion.div
                            key={theme.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`aspect-video rounded-lg cursor-pointer border-2 transition-all ${
                              selectedTheme === theme.id ? "border-primary shadow-lg" : "border-transparent"
                            } ${theme.preview}`}
                            onClick={() => setSelectedTheme(theme.id)}
                          >
                            <div className="p-3 h-full flex flex-col justify-between">
                              <div className="text-xs font-medium">{theme.name}</div>
                              <div className="space-y-1">
                                <div className="h-1 bg-current opacity-50 rounded" />
                                <div className="h-1 bg-current opacity-30 rounded w-3/4" />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="layout" className="space-y-4 mt-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Rounded corners</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Show descriptions</span>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Show click counts</span>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Center alignment</span>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="profile" className="space-y-4 mt-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Display Name</Label>
                          <Input
                            value={profileSettings.name}
                            onChange={(e) => setProfileSettings((prev) => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Bio</Label>
                          <Textarea
                            value={profileSettings.bio}
                            onChange={(e) => setProfileSettings((prev) => ({ ...prev, bio: e.target.value }))}
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Username</Label>
                          <Input
                            value={profileSettings.username}
                            onChange={(e) => setProfileSettings((prev) => ({ ...prev, username: e.target.value }))}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* Live Preview */}
            <div className="space-y-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Live Preview</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={previewMode === "mobile" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPreviewMode("mobile")}
                      >
                        <Smartphone className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={previewMode === "desktop" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPreviewMode("desktop")}
                      >
                        <Monitor className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardTitle>
                  <CardDescription>See how your bio page looks to visitors</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <BioPreview />
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Bio Page Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total views</span>
                    <span className="font-semibold">{totalViews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active links</span>
                    <span className="font-semibold">{links.filter((l) => l.active).length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total clicks</span>
                    <span className="font-semibold">{links.reduce((sum, link) => sum + link.clicks, 0)}</span>
                  </div>
                  <Separator />
                  <Button variant="outline" className="w-full bg-transparent" onClick={openPreview}>
                    <Globe className="w-4 h-4 mr-2" />
                    View Public Page
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Edit Dialog */}
          <Dialog open={!!editingLink} onOpenChange={() => setEditingLink(null)}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Edit Bio Link</DialogTitle>
                <DialogDescription>Update your bio link information</DialogDescription>
              </DialogHeader>
              {editingLink && (
                <form onSubmit={editForm.handleSubmit(updateBioLink)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Title *</Label>
                    <Input id="edit-title" {...editForm.register("title")} />
                    {editForm.formState.errors.title && (
                      <p className="text-sm text-destructive">{editForm.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-url">URL *</Label>
                    <Input id="edit-url" {...editForm.register("url")} />
                    {editForm.formState.errors.url && (
                      <p className="text-sm text-destructive">{editForm.formState.errors.url.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea id="edit-description" {...editForm.register("description")} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-icon">Icon (emoji)</Label>
                    <Input id="edit-icon" {...editForm.register("icon")} />
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
                  This action cannot be undone. This will permanently delete your bio link.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteBioLink} className="bg-destructive text-destructive-foreground">
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
