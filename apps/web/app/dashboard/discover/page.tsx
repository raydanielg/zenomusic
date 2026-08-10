"use client"

import { useState, useEffect, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { Card } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { IconPlayerPlay, IconRefresh, IconLoader2, IconCompass, IconDots, IconEye, IconMessage2, IconHeart } from "@tabler/icons-react"

const API_BASE = "https://zenomusic.io/api"

interface DiscoverSong {
  id: string
  title: string
  status: string
  visibility: string
  genre?: string
  style?: string
  coverUrl?: string
  audioUrl?: string
  comments?: number
  plays?: number
  likes?: number
  createdAt?: string
  author?: { name?: string; avatar?: string }
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function DiscoverPage() {
  const [songs, setSongs] = useState<DiscoverSong[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchDiscover = useCallback(async () => {
    const token = localStorage.getItem("zeno_token")
    if (!token) {
      setError("Not authenticated")
      setLoading(false)
      return
    }
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_BASE}/music/discover?limit=50`, {
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
        throw new Error(`Failed to fetch discover (${res.status})`)
      }

      const data = await res.json()
      const list = Array.isArray(data) ? data : data.songs || data.data || data.tracks || []
      setSongs(list)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load discover")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDiscover()
  }, [fetchDiscover])

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
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <IconCompass className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight">Discover</h1>
                      <p className="text-sm text-muted-foreground">Explore songs from the community</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={fetchDiscover} disabled={loading}>
                    <IconRefresh className={`mr-1 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>

                {error && !loading && (
                  <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 py-12 text-center">
                    <p className="text-sm text-destructive">{error}</p>
                    <Button variant="outline" size="sm" onClick={fetchDiscover}>
                      <IconRefresh className="mr-1 h-3.5 w-3.5" />
                      Try again
                    </Button>
                  </div>
                )}

                {loading && (
                  <div className="flex flex-col items-center gap-3 py-12">
                    <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading discover...</p>
                  </div>
                )}

                {!loading && !error && songs.length === 0 && (
                  <div className="flex flex-col items-center gap-3 rounded-lg border border-border/40 py-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                      <IconCompass className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">Nothing to discover</h3>
                    <p className="max-w-xs text-sm text-muted-foreground">
                      No community songs available right now. Check back later.
                    </p>
                  </div>
                )}

                {!loading && !error && songs.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {songs.map((song, i) => (
                      <Card key={song.id || i} className="group cursor-pointer overflow-hidden p-0 transition-all hover:scale-[1.02] hover:border-primary/30">
                        <div className="relative h-36 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                          {song.coverUrl && (
                            <img src={song.coverUrl} alt={song.title} className="absolute inset-0 h-full w-full object-cover" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:opacity-100">
                              <IconPlayerPlay className="h-5 w-5 fill-white text-white" />
                            </div>
                          </div>
                          <div className="absolute top-2 right-2">
                            <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                              {song.status || "completed"}
                            </span>
                          </div>
                          {song.author?.avatar && (
                            <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                              <img src={song.author.avatar} alt={song.author.name} className="h-5 w-5 rounded-full border border-white/30" />
                              <span className="text-[10px] font-medium text-white">{song.author.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="truncate text-sm font-medium">{song.title}</h3>
                            <button className="text-muted-foreground hover:text-foreground">
                              <IconDots className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="truncate text-xs text-muted-foreground">{song.genre || song.style || "Unknown genre"}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <IconHeart className="h-3 w-3" />
                              {song.likes || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <IconMessage2 className="h-3 w-3" />
                              {song.comments || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <IconEye className="h-3 w-3" />
                              {song.plays || 0}
                            </span>
                            <span className="ml-auto text-[10px]">{timeAgo(song.createdAt)}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
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
