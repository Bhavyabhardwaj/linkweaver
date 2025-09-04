'use client'

// Environment-based API configuration for deployment
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://linkweaver.bhavya.live'
  : 'http://localhost:3000'

// API client with caching and performance optimizations
class ApiClient {
  private baseURL: string
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>

  constructor() {
    this.baseURL = API_BASE_URL
    this.cache = new Map()
  }

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    const now = Date.now()
    if (now - cached.timestamp > cached.ttl) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  private setCache(key: string, data: any, ttl: number = 300000): void { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  private async request(endpoint: string, options: RequestInit = {}, useCache: boolean = false, cacheTTL?: number): Promise<any> {
    // For production, use relative URLs; for development, use full URL
    const url = this.baseURL ? `${this.baseURL}${endpoint}` : endpoint
    const cacheKey = `${url}_${JSON.stringify(options)}`

    // Check cache first for GET requests
    if (useCache && (!options.method || options.method === 'GET')) {
      const cached = this.getFromCache(cacheKey)
      if (cached) return cached
    }

    const token = this.getAuthToken()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (!response.ok) {
        let errorMessage = `API Error: ${response.status} ${response.statusText}`
        try {
          const errorData = await response.json()
          if (errorData.message) {
            errorMessage = errorData.message
          } else if (errorData.error) {
            errorMessage = errorData.error
          }
        } catch (e) {
          // If response isn't JSON, use default error message
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()

      // Cache successful GET requests
      if (useCache && (!options.method || options.method === 'GET')) {
        this.setCache(cacheKey, data, cacheTTL)
      }

      return data
    } catch (error) {
      console.error('API Request failed:', error)
      throw error
    }
  }

  // Authentication
  async signIn(credentials: { username: string; password: string }) {
    return this.request('/api/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  async signUp(data: { username: string; email: string; password: string }) {
    return this.request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Bio Links
  async getBioLinks(includeInactive = true) {
    const params = includeInactive ? '?includeInactive=true' : ''
    return this.request(`/api/links/bio${params}`, {}, true, 30000) // Cache for 30 seconds
  }

  async createBioLink(data: any) {
    const result = await this.request('/api/links/bio', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    // Clear bio links cache
    this.clearCacheByPattern('/api/links/bio')
    return result
  }

  async updateBioLink(id: string, data: any) {
    const result = await this.request(`/api/links/update-link/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    // Clear bio links cache
    this.clearCacheByPattern('/api/links/bio')
    return result
  }

  async deleteBioLink(id: string) {
    const result = await this.request(`/api/links/delete-link/${id}`, {
      method: 'DELETE',
    })
    // Clear bio links cache
    this.clearCacheByPattern('/api/links/bio')
    return result
  }

  async reorderBioLinks(linkIds: string[]) {
    const result = await this.request('/api/links/reorder-links', {
      method: 'PATCH',
      body: JSON.stringify({ linkIds }),
    })
    // Clear bio links cache
    this.clearCacheByPattern('/api/links/bio')
    return result
  }

  async updateLink(id: string, data: any) {
    const result = await this.request(`/api/links/update-link/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    // Clear related caches
    this.clearCacheByPattern('/api/links/')
    return result
  }

  async deleteLink(id: string) {
    const result = await this.request(`/api/links/delete-link/${id}`, {
      method: 'DELETE',
    })
    // Clear related caches
    this.clearCacheByPattern('/api/links/')
    return result
  }

  // Short Links
  async getShortLinks() {
    return this.request('/api/links/short', {}, true, 30000) // Cache for 30 seconds
  }

  async createShortLink(data: any) {
    const result = await this.request('/api/links/short', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    // Clear short links cache
    this.clearCacheByPattern('/api/links/short')
    return result
  }

  // Analytics
  async getLinkAnalytics(linkId: string) {
    return this.request(`/api/links/${linkId}/analytics`, {}, true, 60000) // Cache for 1 minute
  }

  // Dashboard Analytics Methods
  async getAnalyticsOverview() {
    try {
      // Get bio links and their total views
      const [bioLinks, shortLinks, totalBioViews, qrScans] = await Promise.all([
        this.getBioLinks(),
        this.getShortLinks(),
        this.getTotalBioLinkViews(),
        this.getTotalQRScans()
      ]);

      // Calculate total clicks from all links
      const totalClicks = bioLinks.reduce((sum: number, link: any) => sum + (link._count?.linkClicks || 0), 0) +
        shortLinks.reduce((sum: number, link: any) => sum + (link.clickCount || 0), 0);

      // Calculate total active links
      const totalLinks = bioLinks.length + shortLinks.length;

      return {
        totalClicks,
        totalLinks,
        totalQRScans: qrScans.totalScans,
        totalBioViews: totalBioViews.totalViews || 0,
        recentActivity: [], // Empty for now
        topCountries: [], // Empty for now
      }
    } catch (error) {
      console.error('Failed to load analytics overview:', error);
      // Return zeros if there's an error
      return {
        totalClicks: 0,
        totalLinks: 0,
        totalQRScans: 0,
        totalBioViews: 0,
        recentActivity: [],
        topCountries: [],
      }
    }
  }

  async getCountryAnalytics() {
    return { data: [] }
  }

  async getDeviceAnalytics() {
    return { data: [] }
  }

  async getReferrerAnalytics() {
    return { data: [] }
  }

  async getClickAnalytics(params: { startDate: string; endDate: string }) {
    return { data: [] }
  }

  // Public Profile
  async getPublicProfile(username: string) {
    return this.request(`/api/public/u/${username}`, {}, true, 120000) // Cache for 2 minutes
  }

  // Public Bio Page
  async getPublicBioPage(username: string) {
    return this.request(`/api/public/u/${username}`, {}, true, 120000) // Cache for 2 minutes
  }

  // Public Link (for slug redirects) 
  async getPublicLink(slug: string) {
    return this.request(`/${slug}/info`, {}, true, 60000) // Cache for 1 minute
  }

  // QR Code
  async generateQRCode(data: any) {
    // For standalone QR code creation
    const result = await this.request('/api/qr-codes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return result
  }

  async getQRCodeForLink(linkId: string) {
    return this.request(`/api/links/generate-qr-code/${linkId}`, {}, true, 300000) // Cache for 5 minutes
  }

  async getQRCodes() {
    return this.request('/api/qr-codes', {}, true, 30000) // Cache for 30 seconds
  }

  async deleteQRCode(id: string) {
    const result = await this.request(`/api/qr-codes/${id}`, {
      method: 'DELETE',
    })
    return result
  }

  // Get total views for all bio links for the authenticated user
  async getTotalBioLinkViews() {
    return this.request('/api/links/bio/total-views', {}, true, 30000)
  }

  async getTotalQRScans() {
    // Try to get QR scan analytics from the existing QR codes
    try {
      const qrCodes = await this.getQRCodes()
      // Sum up scans from all QR codes if they have scan data
      const totalScans = qrCodes.reduce((sum: number, qr: any) => sum + (qr.scans || qr.scanCount || 0), 0)
      return { totalScans }
    } catch (error) {
      console.warn('Could not fetch QR scan data:', error)
      return { totalScans: 0 }
    }
  }

  // Utility method to clear cache
  private clearCacheByPattern(pattern: string) {
    for (const [key] of this.cache) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }

  // Clear all cache
  clearCache() {
    this.cache.clear()
  }
}

export const apiClient = new ApiClient()
export default apiClient
