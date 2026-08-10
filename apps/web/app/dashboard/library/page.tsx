"use client"

import { useState, useEffect, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { Card } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { IconPlayerPlay, IconRefresh, IconLoader2, IconLibrary, IconDots, IconEye, IconMessage2, IconMusic } from "@tabler/icons-react"

const API_BASE = "/api/zeno"

interface Song {
  id?: string
  _id?: string
  title?: string
  name?: string
  status?: string
  visibility?: string
  isPublic?: boolean
  genre?: string
  style?: string
  tags?: string[]
  coverArt?: string
  coverUrl?: string
  cover?: string
  coverImage?: string
  image?: string
  imageData?: string
  audioUrl?: string
  audio?: string
  comments?: number
  commentCount?: number
  plays?: number
  playCount?: number
  totalPlays?: number
  views?: number
  likes?: number
  likeCount?: number
  createdAt?: string
  created_at?: string
  updatedAt?: string
}

function getCoverUrl(song: Song): string | null {
  const raw = song.coverArt || song.coverUrl || song.cover || song.coverImage || song.image || song.imageData
  if (!raw) return null
  if (raw.startsWith("data:") || raw.startsWith("http") || raw.startsWith("/")) return raw
  if (raw.startsWith("iVBORw0") || raw.startsWith("/9j/") || raw.startsWith("UklGR")) {
    const mime = raw.startsWith("iVBORw0") ? "image/png" : raw.startsWith("UklGR") ? "image/webp" : "image/jpeg"
    return `data:${mime};base64,${raw}`
  }
  return raw
}

function getSongTitle(song: Song): string {
  return song.title || song.name || "Untitled"
}

function getSongGenre(song: Song): string {
  if (song.genre) return song.genre
  if (song.style) return song.style
  if (song.tags && song.tags.length > 0) return song.tags.join(", ")
  return "Unknown genre"
}

function getSongDate(song: Song): string {
  return song.createdAt || song.created_at || song.updatedAt || ""
}

function getSongId(song: Song, index: number): string {
  return song.id || song._id || `song-${index}`
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return ""
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ""
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `about ${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function LibraryPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [lastUpdated, setLastUpdated] = useState("")

  const fetchHistory = useCallback(async () => {
    const token = localStorage.getItem("zeno_token")
    if (!token) {
      setError("Not authenticated")
      setLoading(false)
      return
    }
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_BASE}/music/history?limit=100`, {
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
        throw new Error(`Failed to fetch library (${res.status})`)
      }

      const data = await res.json()
      const list = Array.isArray(data) ? data : data.history || data.songs || data.data || []
      setSongs(list)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load library")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

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
                      <IconLibrary className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight">My Library</h1>
                      {lastUpdated && (
                        <p className="text-sm text-muted-foreground">Updated {lastUpdated}</p>
                      )}
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={fetchHistory} disabled={loading}>
                    <IconRefresh className={`mr-1 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>

                {error && !loading && (
                  <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 py-12 text-center">
                    <p className="text-sm text-destructive">{error}</p>
                    <Button variant="outline" size="sm" onClick={fetchHistory}>
                      <IconRefresh className="mr-1 h-3.5 w-3.5" />
                      Try again
                    </Button>
                  </div>
                )}

                {loading && (
                  <div className="flex flex-col items-center gap-3 py-12">
                    <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading your library...</p>
                  </div>
                )}

                {!loading && !error && songs.length === 0 && (
                  <div className="flex flex-col items-center gap-3 rounded-lg border border-border/40 py-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                      <IconMusic className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No songs yet</h3>
                    <p className="max-w-xs text-sm text-muted-foreground">
                      Create your first song and it will appear here.
                    </p>
                  </div>
                )}

                {!loading && !error && songs.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {songs.map((song, i) => {
                      const cover = getCoverUrl(song)
                      return (
                      <Card key={getSongId(song, i)} className="group cursor-pointer overflow-hidden p-0 transition-all hover:scale-[1.02] hover:border-primary/30">
                        <div className="relative h-32 bg-gradient-to-br from-orange-500 via-red-500 to-purple-600">
                          {cover && (
                            <img src={cover} alt={getSongTitle(song)} className="absolute inset-0 h-full w-full object-cover" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:opacity-100">
                              <IconPlayerPlay className="h-5 w-5 fill-white text-white" />
                            </div>
                          </div>
                          <div className="absolute top-2 right-2">
                            <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                              {song.status || "completed"}
                            </span>
                          </div>
                        </div>
                        <div className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="truncate text-sm font-medium">{getSongTitle(song)}</h3>
                            <button className="text-muted-foreground hover:text-foreground">
                              <IconDots className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              {song.visibility || (song.isPublic ? "Public" : "Private")}
                            </span>
                          </div>
                          <p className="truncate text-xs text-muted-foreground">{getSongGenre(song)}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <IconMessage2 className="h-3 w-3" />
                              {song.comments || song.commentCount || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <IconEye className="h-3 w-3" />
                              {song.plays || song.playCount || song.totalPlays || song.views || 0}
                            </span>
                            <span className="ml-auto text-[10px]">{timeAgo(getSongDate(song))}</span>
                          </div>
                        </div>
                      </Card>
                      )
                    })}
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
