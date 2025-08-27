"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Plus,
  Download,
  Copy,
  Edit,
  Trash2,
  MoreHorizontal,
  Search,
  QrCodeIcon,
  Smartphone,
  Monitor,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import DashboardLayout from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import apiClient from "@/lib/api-client"

const qrCodeSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  size: z.number().min(100).max(1000).default(300),
  color: z.string().default("#000000"),
  backgroundColor: z.string().default("#ffffff"),
})

type QRCodeForm = z.infer<typeof qrCodeSchema>

interface QRCode {
  id: string
  title: string
  url: string
  description?: string
  scans: number
  createdAt: string
  qrCodeUrl: string
}

export default function QRCodesPage() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const form = useForm<QRCodeForm>({
    resolver: zodResolver(qrCodeSchema),
    defaultValues: {
      url: "",
      title: "",
      description: "",
      size: 300,
      color: "#000000",
      backgroundColor: "#ffffff",
    },
  })

  useEffect(() => {
    loadQRCodes()
  }, [])

  const loadQRCodes = async () => {
    try {
      setLoading(true)
      console.log('Loading QR codes...')
      const response = await apiClient.getQRCodes()
      console.log('QR codes response:', response)
      
      // Handle different response formats
      let qrData = []
      if (response && response.data && Array.isArray(response.data)) {
        qrData = response.data
      } else if (Array.isArray(response)) {
        qrData = response
      } else {
        console.warn('Unexpected QR response format:', response)
        qrData = []
      }
      
      console.log('Setting QR codes data:', qrData)
      setQrCodes(qrData)
    } catch (error) {
      console.error('Failed to load QR codes:', error)
      toast({
        title: "Failed to load QR codes",
        description: "There was an error loading your QR codes.",
        variant: "destructive",
      })
      setQrCodes([])
    } finally {
      setLoading(false)
    }
  }

  const generateQRCode = async (data: QRCodeForm) => {
    setIsGenerating(true)
    try {
      // Ensure all required fields are provided with proper defaults
      const qrData = {
        title: data.title.trim(),
        url: data.url.trim(),
        description: data.description?.trim() || undefined,
        size: data.size || 300,
        color: data.color || "#000000",
        backgroundColor: data.backgroundColor || "#ffffff"
      }

      console.log('Generating QR code with data:', qrData)
      
      const response = await apiClient.generateQRCode(qrData)
      console.log('QR code generated successfully:', response)
      
      // Add the new QR code to the list and refresh
      setQrCodes([response, ...qrCodes])
      await loadQRCodes() // Refresh the list
      
      form.reset()
      setCreateDialogOpen(false)

      toast({
        title: "QR code generated!",
        description: "Your QR code has been created successfully.",
      })
    } catch (error) {
      console.error('QR code generation error:', error)
      toast({
        title: "Failed to generate QR code",
        description: error instanceof Error ? error.message : "There was an error generating your QR code.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQRCode = (qrCode: QRCode) => {
    // Create a temporary link to download the QR code
    const link = document.createElement("a")
    link.href = qrCode.qrCodeUrl
    link.download = `${qrCode.title.replace(/\s+/g, "-").toLowerCase()}-qr-code.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "QR code downloaded",
      description: "Your QR code has been saved to your downloads.",
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The URL has been copied to your clipboard.",
    })
  }

  const deleteQRCode = (id: string) => {
    setQrCodes(qrCodes.filter((qr) => qr.id !== id))
    toast({
      title: "QR code deleted",
      description: "Your QR code has been deleted.",
    })
  }

  const filteredQRCodes = qrCodes.filter(
    (qr) =>
      qr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qr.url.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scans, 0)

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <h1 className="text-3xl font-bold">QR Codes</h1>
              <p className="text-muted-foreground">Generate and manage QR codes for your links</p>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Generate QR Code
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Generate QR Code</DialogTitle>
                  <DialogDescription>Create a QR code for any URL with customizable options.</DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(generateQRCode)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input id="title" placeholder="My QR Code" {...form.register("title")} />
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
                      placeholder="Optional description..."
                      {...form.register("description")}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="size">Size (px)</Label>
                      <Input
                        id="size"
                        type="number"
                        min="100"
                        max="1000"
                        {...form.register("size", { valueAsNumber: true })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">Foreground Color</Label>
                      <Input id="color" type="color" {...form.register("color")} />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isGenerating}>
                      {isGenerating ? "Generating..." : "Generate QR Code"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Scans</p>
                    <p className="text-2xl font-bold">{totalScans.toLocaleString()}</p>
                  </div>
                  <Smartphone className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">QR Codes</p>
                    <p className="text-2xl font-bold">{qrCodes.length}</p>
                  </div>
                  <QrCodeIcon className="w-8 h-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg. Scans</p>
                    <p className="text-2xl font-bold">
                      {qrCodes.length > 0 ? Math.round(totalScans / qrCodes.length) : 0}
                    </p>
                  </div>
                  <Monitor className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search QR codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* QR Codes Grid */}
          {filteredQRCodes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <QrCodeIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No QR codes yet</h3>
                <p className="text-muted-foreground">Generate your first QR code to get started</p>
                <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate QR Code
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQRCodes.map((qrCode) => (
                <motion.div
                  key={qrCode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{qrCode.title}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => downloadQRCode(qrCode)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyToClipboard(qrCode.url)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy URL
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => deleteQRCode(qrCode.id)} className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {qrCode.description && <CardDescription>{qrCode.description}</CardDescription>}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* QR Code Preview */}
                        <div className="flex justify-center">
                          <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                            <QrCodeIcon className="w-16 h-16 text-muted-foreground" />
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Scans</span>
                          <Badge variant="secondary">{qrCode.scans}</Badge>
                        </div>

                        {/* URL */}
                        <div className="text-sm">
                          <p className="text-muted-foreground mb-1">URL</p>
                          <p className="font-mono text-xs truncate">{qrCode.url}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => downloadQRCode(qrCode)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(qrCode.url)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
