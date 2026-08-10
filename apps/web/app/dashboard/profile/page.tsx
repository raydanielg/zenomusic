"use client"

import { useState, useEffect, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { IconRefresh, IconLoader2, IconUser, IconMusic, IconEye, IconHeart, IconCoin, IconEdit, IconCalendar } from "@tabler/icons-react"

const API_BASE = "https://zenomusic.io/api"

interface UserProfile {
  id?: string
  username?: string
  displayName?: string
  name?: string
  email?: string
  phoneNumber?: string
  photoURL?: string
  avatar?: string
  bio?: string
  credits?: number
  createdAt?: string
  stats?: {
    songs?: number
    plays?: number
    likes?: number
    followers?: number
    following?: number
  }
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("zeno_token")
    const userId = localStorage.getItem("zeno_user_id") || ""
    if (!token) {
      setError("Not authenticated")
      setLoading(false)
      return
    }
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_BASE}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login"
          return
        }
        throw new Error(`Failed to fetch profile (${res.status})`)
      }

      const data = await res.json()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const displayName = profile?.displayName || profile?.name || profile?.username || "Zeno User"
  const avatar = profile?.photoURL || profile?.avatar || "/avatars/shadcn.jpg"
  const stats = profile?.stats || {}

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-6 py-4 md:py-6">
              <div className="px-4 lg:px-6">
                <div className="mb-6 flex items-center justify-between">
                  <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <IconEdit className="mr-1 h-3.5 w-3.5" />
                      Edit Profile
                    </Button>
                    <Button variant="ghost" size="sm" onClick={fetchProfile} disabled={loading}>
                      <IconRefresh className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                  </div>
                </div>

                {error && !loading && (
                  <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 py-12 text-center">
                    <p className="text-sm text-destructive">{error}</p>
                    <Button variant="outline" size="sm" onClick={fetchProfile}>
                      <IconRefresh className="mr-1 h-3.5 w-3.5" />
                      Try again
                    </Button>
                  </div>
                )}

                {loading && (
                  <div className="flex flex-col items-center gap-3 py-12">
                    <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading profile...</p>
                  </div>
                )}

                {!loading && !error && profile && (
                  <div className="space-y-6">
                    {/* Profile header card */}
                    <Card className="overflow-hidden border-border/40">
                      <div className="h-32 bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
                      <CardContent className="p-6">
                        <div className="-mt-16 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
                          <div className="relative">
                            <img
                              src={avatar}
                              alt={displayName}
                              className="h-24 w-24 rounded-full border-4 border-background object-cover"
                            />
                          </div>
                          <div className="flex-1 pb-2">
                            <h2 className="text-xl font-bold">{displayName}</h2>
                            {profile.username && (
                              <p className="text-sm text-muted-foreground">@{profile.username}</p>
                            )}
                            {profile.bio && (
                              <p className="mt-2 text-sm text-muted-foreground">{profile.bio}</p>
                            )}
                            {profile.createdAt && (
                              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                                <IconCalendar className="h-3 w-3" />
                                Joined {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 rounded-lg border border-border/40 px-3 py-1.5">
                            <IconCoin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{profile.credits ?? 0} credits</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <Card className="border-border/40">
                        <CardContent className="flex flex-col items-center gap-2 p-5 text-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                            <IconMusic className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{stats.songs ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Songs</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-border/40">
                        <CardContent className="flex flex-col items-center gap-2 p-5 text-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                            <IconEye className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{stats.plays ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Plays</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-border/40">
                        <CardContent className="flex flex-col items-center gap-2 p-5 text-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                            <IconHeart className="h-5 w-5 text-red-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{stats.likes ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Likes</p>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-border/40">
                        <CardContent className="flex flex-col items-center gap-2 p-5 text-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                            <IconUser className="h-5 w-5 text-emerald-500" />
                          </div>
                          <div>
                            <p className="text-2xl font-bold">{stats.followers ?? 0}</p>
                            <p className="text-xs text-muted-foreground">Followers</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
