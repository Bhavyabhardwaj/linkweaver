"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Home, Users, Link2, BarChart3, QrCode, Settings, ExternalLink } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Link {
  id: string
  title: string
  url: string
  type: 'bio' | 'short'
  active: boolean
  clicks: number
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(false)

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home, shortcut: "⌘+1" },
    { name: "Bio Links", href: "/dashboard/bio-links", icon: Users, shortcut: "⌘+2" },
    { name: "Short Links", href: "/dashboard/short-links", icon: Link2, shortcut: "⌘+3" },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, shortcut: "⌘+4" },
    { name: "QR Codes", href: "/dashboard/qr-codes", icon: QrCode, shortcut: "⌘+5" },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, shortcut: "⌘+6" },
  ]

  const actions = [
    { name: "Create Bio Link", action: "create-bio", icon: Users, shortcut: "⌘+B" },
    { name: "Create Short Link", action: "create-short", icon: Link2, shortcut: "⌘+L" },
    { name: "Generate QR Code", action: "create-qr", icon: QrCode, shortcut: "⌘+Q" },
    { name: "View Analytics", action: "analytics", icon: BarChart3, shortcut: "⌘+A" },
  ]

  // Load links when command palette opens
  useEffect(() => {
    if (open && links.length === 0) {
      loadLinks()
    }
  }, [open])

  const loadLinks = async () => {
    setLoading(true)
    try {
      const [bioResponse, shortResponse] = await Promise.all([
        apiClient.getBioLinks(),
        apiClient.getShortLinks()
      ])

      const bioLinks: Link[] = (bioResponse.data || []).map((link: any) => ({
        id: link.id,
        title: link.title,
        url: link.url,
        type: 'bio' as const,
        active: link.active,
        clicks: link._count?.linkClicks || 0
      }))

      const shortLinks: Link[] = (shortResponse.data || []).map((link: any) => ({
        id: link.id,
        title: link.title || link.url,
        url: link.url,
        type: 'short' as const,
        active: link.active,
        clicks: link.clickCount || 0
      }))

      setLinks([...bioLinks, ...shortLinks])
    } catch (error) {
      console.error('Failed to load links for search:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      // Navigation shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key >= "1" && e.key <= "6") {
        e.preventDefault()
        const index = Number.parseInt(e.key) - 1
        if (navigation[index]) {
          router.push(navigation[index].href)
          onOpenChange(false)
        }
      }

      // Action shortcuts
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault()
            // Trigger create bio link
            onOpenChange(false)
            break
          case "l":
            e.preventDefault()
            // Trigger create short link
            onOpenChange(false)
            break
          case "q":
            e.preventDefault()
            // Trigger create QR code
            onOpenChange(false)
            break
          case "a":
            e.preventDefault()
            router.push("/dashboard/analytics")
            onOpenChange(false)
            break
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, router, onOpenChange])

  const handleSelect = (value: string) => {
    if (value.startsWith("/")) {
      router.push(value)
    } else if (value.startsWith("link-")) {
      // Handle link selection - navigate to the appropriate page
      const linkId = value.replace("link-", "")
      const link = links.find(l => l.id === linkId)
      if (link?.type === 'bio') {
        router.push("/dashboard/bio-links")
      } else if (link?.type === 'short') {
        router.push("/dashboard/short-links")
      }
    } else {
      // Handle actions
      switch (value) {
        case "create-bio":
        case "create-short":
          router.push("/dashboard")
          // TODO: Open create dialog
          break
        case "create-qr":
          router.push("/dashboard/qr-codes")
          break
        case "analytics":
          router.push("/dashboard/analytics")
          break
      }
    }
    onOpenChange(false)
  }

  // Filter links based on search
  const filteredLinks = links.filter(link => 
    link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.url.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8) // Limit to 8 results

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput 
        placeholder="Search for pages, actions, or links..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Navigation">
          {navigation.map((item) => (
            <CommandItem key={item.href} value={item.href} onSelect={handleSelect} className="flex items-center gap-2">
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{item.shortcut}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          {actions.map((action) => (
            <CommandItem
              key={action.action}
              value={action.action}
              onSelect={handleSelect}
              className="flex items-center gap-2"
            >
              <action.icon className="w-4 h-4" />
              <span>{action.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">{action.shortcut}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        {filteredLinks.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Your Links">
              {filteredLinks.map((link) => (
                <CommandItem
                  key={link.id}
                  value={`link-${link.id}`}
                  onSelect={handleSelect}
                  className="flex items-center gap-2"
                >
                  {link.type === 'bio' ? (
                    <Users className="w-4 h-4" />
                  ) : (
                    <Link2 className="w-4 h-4" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{link.title}</div>
                    <div className="text-xs text-muted-foreground truncate">{link.url}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {link.clicks} clicks
                  </div>
                  <div className={`text-xs px-2 py-1 rounded ${link.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {link.active ? 'Active' : 'Inactive'}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}
