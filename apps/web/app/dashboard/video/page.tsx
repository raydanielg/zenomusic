"use client"

import { useState, useEffect, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { Card } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { IconPlayerPlay, IconRefresh, IconLoader2, IconVideo, IconDots, IconEye, IconMessage2 } from "@tabler/icons-react"

const API_BASE = "/api/zeno"

interface VideoItem {
  id?: string
  _id?: string
  title?: string
  name?: string
  songTitle?: string
  status?: string
  videoUrl?: string
  video?: string
  thumbnailUrl?: string
  thumbnail?: string
  coverArt?: string
  coverUrl?: string
  cover?: string
  coverImage?: string
  image?: string
  imageData?: string
  genre?: string
  style?: string
  tags?: string[]
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

function getVideoCover(video: VideoItem): string | null {
  const raw = video.thumbnailUrl || video.thumbnail || video.coverArt || video.coverUrl || video.cover || video.coverImage || video.image || video.imageData
  if (!raw) return null
  if (raw.startsWith("data:") || raw.startsWith("http") || raw.startsWith("/")) return raw
  if (raw.startsWith("iVBORw0") || raw.startsWith("/9j/") || raw.startsWith("UklGR")) {
    const mime = raw.startsWith("iVBORw0") ? "image/png" : raw.startsWith("UklGR") ? "image/webp" : "image/jpeg"
    return `data:${mime};base64,${raw}`
  }
  return raw
}

function getVideoTitle(video: VideoItem): string {
  return video.title || video.name || video.songTitle || "Untitled"
}

function getVideoGenre(video: VideoItem): string {
  if (video.genre) return video.genre
  if (video.style) return video.style
  if (video.tags && video.tags.length > 0) return video.tags.join(", ")
  return ""
}

function getVideoDate(video: VideoItem): string {
  return video.createdAt || video.created_at || video.updatedAt || ""
}

function getVideoId(video: VideoItem, index: number): string {
  return video.id || video._id || `video-${index}`
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
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function VideoPage() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchVideos = useCallback(async () => {
    const token = localStorage.getItem("zeno_token")
    if (!token) {
      setError("Not authenticated")
      setLoading(false)
      return
    }
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_BASE}/video`, {
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
        throw new Error(`Failed to fetch videos (${res.status})`)
      }

      const data = await res.json()
      const list = Array.isArray(data) ? data : data.videos || data.data || []
      setVideos(list)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load videos")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

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
                      <IconVideo className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight">My Videos</h1>
                      <p className="text-sm text-muted-foreground">AI-generated music videos</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={fetchVideos} disabled={loading}>
                    <IconRefresh className={`mr-1 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>

                {error && !loading && (
                  <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 py-12 text-center">
                    <p className="text-sm text-destructive">{error}</p>
                    <Button variant="outline" size="sm" onClick={fetchVideos}>
                      <IconRefresh className="mr-1 h-3.5 w-3.5" />
                      Try again
                    </Button>
                  </div>
                )}

                {loading && (
                  <div className="flex flex-col items-center gap-3 py-12">
                    <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading videos...</p>
                  </div>
                )}

                {!loading && !error && videos.length === 0 && (
                  <div className="flex flex-col items-center gap-3 rounded-lg border border-border/40 py-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                      <IconVideo className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No videos yet</h3>
                    <p className="max-w-xs text-sm text-muted-foreground">
                      Create a song first, then generate a video from it.
                    </p>
                  </div>
                )}

                {!loading && !error && videos.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {videos.map((video, i) => {
                      const thumb = getVideoCover(video)
                      return (
                      <Card key={getVideoId(video, i)} className="group cursor-pointer overflow-hidden p-0 transition-all hover:scale-[1.02] hover:border-primary/30">
                        <div className="relative aspect-video bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500">
                          {thumb && (
                            <img src={thumb} alt={getVideoTitle(video)} className="absolute inset-0 h-full w-full object-cover" />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:opacity-100">
                              <IconPlayerPlay className="h-6 w-6 fill-white text-white" />
                            </div>
                          </div>
                          <div className="absolute top-2 right-2">
                            <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                              {video.status || "ready"}
                            </span>
                          </div>
                        </div>
                        <div className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="truncate text-sm font-medium">{getVideoTitle(video)}</h3>
                            <button className="text-muted-foreground hover:text-foreground">
                              <IconDots className="h-4 w-4" />
                            </button>
                          </div>
                          {getVideoGenre(video) && (
                            <p className="truncate text-xs text-muted-foreground">{getVideoGenre(video)}</p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <IconMessage2 className="h-3 w-3" />
                              {video.comments || video.commentCount || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <IconEye className="h-3 w-3" />
                              {video.plays || video.playCount || video.totalPlays || video.views || 0}
                            </span>
                            <span className="ml-auto text-[10px]">{timeAgo(getVideoDate(video))}</span>
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
