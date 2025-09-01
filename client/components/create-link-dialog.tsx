"use client"

import { useState } from "react"
import { Link2, Users, ExternalLink, Eye, Globe } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { B              <div className="space-y-2">
                <Label htmlFor="short-url">URL *</Label>
                <Input 
                  id="short-url" 
                  placeholder="https://example.com" 
                  {...shortForm.register("url")}
                  onChange={(e) => {
                    shortForm.register("url").onChange(e)
                    validateUrl(e.target.value)
                  }}
                />
                {shortForm.formState.errors.url && (
                  <p className="text-sm text-destructive">{shortForm.formState.errors.url.message}</p>
                )}
                {isValidatingUrl && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <LoadingSpinner size="sm" />
                    <span>Validating URL...</span>
                  </div>
                )}
                {urlPreview && !isValidatingUrl && (
                  <Card className="p-3 bg-muted/50">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-medium">Valid URL</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-auto p-1"
                        onClick={() => window.open(urlPreview, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                )}
              </div> from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading"
import { useToast } from "@/hooks/use-toast"
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

const shortLinkSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  slug: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
})

type BioLinkForm = z.infer<typeof bioLinkSchema>
type ShortLinkForm = z.infer<typeof shortLinkSchema>

interface CreateLinkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void // Add callback for when link is created successfully
}

export function CreateLinkDialog({ open, onOpenChange, onSuccess }: CreateLinkDialogProps) {
  const [activeTab, setActiveTab] = useState("bio")
  const [isLoading, setIsLoading] = useState(false)
  const [urlPreview, setUrlPreview] = useState<string | null>(null)
  const [isValidatingUrl, setIsValidatingUrl] = useState(false)
  const { toast } = useToast()

  const bioForm = useForm<BioLinkForm>({
    resolver: zodResolver(bioLinkSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
      icon: "",
    },
  })

  const shortForm = useForm<ShortLinkForm>({
    resolver: zodResolver(shortLinkSchema),
    defaultValues: {
      url: "",
      slug: "",
      title: "",
      description: "",
    },
  })

  // URL validation and preview
  const validateUrl = async (url: string) => {
    if (!url || !url.startsWith('http')) return

    setIsValidatingUrl(true)
    try {
      // Simple URL validation
      new URL(url)
      setUrlPreview(url)
    } catch (error) {
      setUrlPreview(null)
    } finally {
      setIsValidatingUrl(false)
    }
  }

  const onBioSubmit = async (data: BioLinkForm) => {
    setIsLoading(true)
    try {
      await apiClient.createBioLink(data)
      toast({
        title: "Bio link created!",
        description: "Your bio link has been added successfully.",
      })
      bioForm.reset()
      onOpenChange(false)
      // Call the success callback if provided, otherwise refresh the page
      if (onSuccess) {
        onSuccess()
      } else {
        window.location.reload()
      }
    } catch (error: any) {
      console.error('Bio link creation error:', error)
      toast({
        title: "Failed to create bio link",
        description: error?.message || "There was an error creating your bio link.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onShortSubmit = async (data: ShortLinkForm) => {
    setIsLoading(true)
    try {
      await apiClient.createShortLink(data)
      toast({
        title: "Short link created!",
        description: "Your short link has been created successfully.",
      })
      shortForm.reset()
      onOpenChange(false)
      // Call the success callback if provided, otherwise refresh the page
      if (onSuccess) {
        onSuccess()
      } else {
        window.location.reload()
      }
    } catch (error: any) {
      console.error('Short link creation error:', error)
      toast({
        title: "Failed to create short link",
        description: error?.message || "There was an error creating your short link.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Link</DialogTitle>
          <DialogDescription>Choose the type of link you want to create and fill in the details.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bio" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Bio Link
            </TabsTrigger>
            <TabsTrigger value="short" className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Short Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bio" className="space-y-4 mt-6">
            <form onSubmit={bioForm.handleSubmit(onBioSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio-title">Title *</Label>
                <Input id="bio-title" placeholder="My Portfolio" {...bioForm.register("title")} />
                {bioForm.formState.errors.title && (
                  <p className="text-sm text-destructive">{bioForm.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio-url">URL *</Label>
                <Input 
                  id="bio-url" 
                  placeholder="https://example.com" 
                  {...bioForm.register("url")}
                  onChange={(e) => {
                    bioForm.register("url").onChange(e)
                    validateUrl(e.target.value)
                  }}
                />
                {bioForm.formState.errors.url && (
                  <p className="text-sm text-destructive">{bioForm.formState.errors.url.message}</p>
                )}
                {isValidatingUrl && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <LoadingSpinner size="sm" />
                    <span>Validating URL...</span>
                  </div>
                )}
                {urlPreview && !isValidatingUrl && (
                  <Card className="p-3 bg-muted/50">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-medium">Valid URL</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-auto h-auto p-1"
                        onClick={() => window.open(urlPreview, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </Card>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio-description">Description</Label>
                <Textarea
                  id="bio-description"
                  placeholder="Check out my latest work..."
                  {...bioForm.register("description")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio-icon">Icon (emoji)</Label>
                <Input id="bio-icon" placeholder="🌐" {...bioForm.register("icon")} />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Bio Link"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="short" className="space-y-4 mt-6">
            <form onSubmit={shortForm.handleSubmit(onShortSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="short-url">URL *</Label>
                <Input id="short-url" placeholder="https://example.com/very-long-url" {...shortForm.register("url")} />
                {shortForm.formState.errors.url && (
                  <p className="text-sm text-destructive">{shortForm.formState.errors.url.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="short-slug">Custom Slug (optional)</Label>
                <Input id="short-slug" placeholder="my-link" {...shortForm.register("slug")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short-title">Title</Label>
                <Input id="short-title" placeholder="My Awesome Link" {...shortForm.register("title")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="short-description">Description</Label>
                <Textarea
                  id="short-description"
                  placeholder="Description of your link..."
                  {...shortForm.register("description")}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Short Link"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
