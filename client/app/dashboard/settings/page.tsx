"use client"

import type React from "react"

import { useState } from "react"
import { User, Bell, Shield, CreditCard, Palette, Trash2, Upload, Save, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ThemeToggle } from "@/components/theme-toggle"
import DashboardLayout from "@/components/dashboard-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { useTheme } from "@/contexts/theme-context"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
    linkUpdates: true,
  })
  const { user } = useAuth()
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      username: user?.username || "",
      bio: "",
      website: "",
    },
  })

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onProfileSubmit = async (data: ProfileForm) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to update profile",
        description: "There was an error updating your profile.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordForm) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      passwordForm.reset()
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      })
    } catch (error) {
      toast({
        title: "Failed to update password",
        description: "There was an error updating your password.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Simulate file upload
      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated.",
      })
    }
  }

  const updateNotification = (key: keyof typeof notifications, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }))
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    })
  }

  const deleteAccount = async () => {
    toast({
      title: "Account deletion initiated",
      description: "We've sent you an email with instructions to confirm account deletion.",
      variant: "destructive",
    })
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-0 pb-6">
          {/* Header - Mobile Responsive */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-inter">Settings</h1>
            <p className="text-muted-foreground font-dm-sans text-sm sm:text-base">Manage your account settings and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
            {/* Mobile-Responsive Tabs */}
            <div className="overflow-x-auto">
              <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 min-w-max w-full">
                <TabsTrigger value="profile" className="font-work-sans text-xs sm:text-sm">Profile</TabsTrigger>
                <TabsTrigger value="security" className="font-work-sans text-xs sm:text-sm">Security</TabsTrigger>
                <TabsTrigger value="notifications" className="font-work-sans text-xs sm:text-sm">Notifications</TabsTrigger>
                <TabsTrigger value="appearance" className="font-work-sans text-xs sm:text-sm">Appearance</TabsTrigger>
                <TabsTrigger value="billing" className="font-work-sans text-xs sm:text-sm">Billing</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription className="text-sm">Update your profile information and public bio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                  {/* Avatar Upload - Mobile Responsive */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <Avatar className="w-16 h-16 sm:w-20 sm:h-20 mx-auto sm:mx-0">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-base sm:text-lg">{user?.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2 text-center sm:text-left">
                      <Label htmlFor="avatar-upload">Profile Picture</Label>
                      <div className="flex flex-col sm:flex-row items-center gap-2">
                        <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                          <label htmlFor="avatar-upload" className="cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload
                          </label>
                        </Button>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarUpload}
                        />
                        <Button variant="ghost" size="sm" className="w-full sm:w-auto">
                          Remove
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Profile Form - Mobile Responsive */}
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" {...profileForm.register("name")} />
                        {profileForm.formState.errors.name && (
                          <p className="text-sm text-destructive">{profileForm.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" {...profileForm.register("username")} />
                        {profileForm.formState.errors.username && (
                          <p className="text-sm text-destructive">{profileForm.formState.errors.username.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" {...profileForm.register("email")} />
                      {profileForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{profileForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        placeholder="Tell us about yourself..." 
                        {...profileForm.register("bio")}
                        className="resize-none" 
                      />
                      <p className="text-xs text-muted-foreground">
                        {profileForm.watch("bio")?.length || 0}/160 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input id="website" placeholder="https://example.com" {...profileForm.register("website")} />
                      {profileForm.formState.errors.website && (
                        <p className="text-sm text-destructive">{profileForm.formState.errors.website.message}</p>
                      )}
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                    Password & Security
                  </CardTitle>
                  <CardDescription className="text-sm">Manage your password and security settings</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          {...passwordForm.register("currentPassword")}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="text-sm text-destructive">
                          {passwordForm.formState.errors.currentPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          {...passwordForm.register("newPassword")}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {passwordForm.formState.errors.newPassword && (
                        <p className="text-sm text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          {...passwordForm.register("confirmPassword")}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-destructive">
                          {passwordForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                        {isLoading ? "Updating..." : "Update Password"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-destructive text-base sm:text-lg">Danger Zone</CardTitle>
                  <CardDescription className="text-sm">Irreversible and destructive actions</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full sm:w-auto">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="mx-4 sm:mx-0">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove all your
                          data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={deleteAccount}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Delete Account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription className="text-sm">Choose what notifications you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <Label className="text-sm sm:text-base">Email Notifications</Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Receive email notifications about your account activity
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => updateNotification("emailNotifications", checked)}
                        className="flex-shrink-0"
                      />
                    </div>

                    <Separator />

                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <Label className="text-sm sm:text-base">Marketing Emails</Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Receive emails about new features and promotions
                        </p>
                      </div>
                      <Switch
                        checked={notifications.marketingEmails}
                        onCheckedChange={(checked) => updateNotification("marketingEmails", checked)}
                        className="flex-shrink-0"
                      />
                    </div>

                    <Separator />

                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <Label className="text-sm sm:text-base">Security Alerts</Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">Get notified about important security events</p>
                      </div>
                      <Switch
                        checked={notifications.securityAlerts}
                        onCheckedChange={(checked) => updateNotification("securityAlerts", checked)}
                        className="flex-shrink-0"
                      />
                    </div>

                    <Separator />

                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <Label className="text-sm sm:text-base">Link Updates</Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">Notifications when your links receive clicks</p>
                      </div>
                      <Switch
                        checked={notifications.linkUpdates}
                        onCheckedChange={(checked) => updateNotification("linkUpdates", checked)}
                        className="flex-shrink-0"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
                    Appearance Settings
                  </CardTitle>
                  <CardDescription className="text-sm">Customize how LinkWeaver looks and feels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <Label className="text-sm sm:text-base">Theme</Label>
                        <p className="text-xs sm:text-sm text-muted-foreground">Choose your preferred theme</p>
                      </div>
                      <ThemeToggle />
                    </div>

                    <Separator />

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="space-y-0.5">
                        <Label className="text-sm sm:text-base">Language</Label>
                        <p className="text-xs sm:text-sm text-muted-foreground sm:hidden">Select your preferred language</p>
                      </div>
                      <Select defaultValue="en">
                        <SelectTrigger className="w-full sm:w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="space-y-0.5">
                        <Label className="text-sm sm:text-base">Timezone</Label>
                        <p className="text-xs sm:text-sm text-muted-foreground sm:hidden">Select your timezone</p>
                      </div>
                      <Select defaultValue="utc">
                        <SelectTrigger className="w-full sm:w-[200px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc">UTC</SelectItem>
                          <SelectItem value="est">Eastern Time</SelectItem>
                          <SelectItem value="pst">Pacific Time</SelectItem>
                          <SelectItem value="cet">Central European Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-4 sm:space-y-6">
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                    Billing & Subscription
                  </CardTitle>
                  <CardDescription className="text-sm">Manage your subscription and billing information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base">Current Plan</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        You're currently on the {user?.plan || "Free"} plan
                      </p>
                    </div>
                    <Badge variant="secondary" className="capitalize self-start sm:self-center">
                      {user?.plan || "Free"}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium text-sm sm:text-base">Usage This Month</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span>Links Created</span>
                          <span>24 / 100</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: "24%" }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span>Total Clicks</span>
                          <span>1,247 / 10,000</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: "12.47%" }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button className="w-full sm:w-auto">Upgrade Plan</Button>
                    <Button variant="outline" className="w-full sm:w-auto">View Billing History</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  )
}
