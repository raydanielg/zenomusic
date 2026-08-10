"use client"

import { useState, useEffect, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { IconPlaylist, IconRefresh, IconLoader2, IconDots, IconPlus, IconMusic } from "@tabler/icons-react"

const API_BASE = "/api/zeno"

interface Playlist {
  id?: string
  _id?: string
  name?: string
  title?: string
  description?: string
  coverArt?: string
  coverUrl?: string
  cover?: string
  coverImage?: string
  image?: string
  imageData?: string
  songCount?: number
  songs?: { id?: string; _id?: string; title?: string; name?: string; coverUrl?: string }[]
  createdAt?: string
  created_at?: string
  updatedAt?: string
}

function getPlaylistCover(playlist: Playlist): string | null {
  const raw = playlist.coverArt || playlist.coverUrl || playlist.cover || playlist.coverImage || playlist.image || playlist.imageData
  if (!raw) return null
  if (raw.startsWith("data:") || raw.startsWith("http") || raw.startsWith("/")) return raw
  if (raw.startsWith("iVBORw0") || raw.startsWith("/9j/") || raw.startsWith("UklGR")) {
    const mime = raw.startsWith("iVBORw0") ? "image/png" : raw.startsWith("UklGR") ? "image/webp" : "image/jpeg"
    return `data:${mime};base64,${raw}`
  }
  return raw
}

function getPlaylistName(playlist: Playlist): string {
  return playlist.name || playlist.title || "Untitled Playlist"
}

function getPlaylistId(playlist: Playlist, index: number): string {
  return playlist.id || playlist._id || `playlist-${index}`
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchPlaylists = useCallback(async () => {
    const token = localStorage.getItem("zeno_token")
    if (!token) {
      setError("Not authenticated")
      setLoading(false)
      return
    }
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_BASE}/music/playlists`, {
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
        throw new Error(`Failed to fetch playlists (${res.status})`)
      }

      const data = await res.json()
      const list = Array.isArray(data) ? data : data.playlists || data.data || data.items || []
      setPlaylists(list)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load playlists")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPlaylists()
  }, [fetchPlaylists])

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
                      <IconPlaylist className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight">Playlists</h1>
                      <p className="text-sm text-muted-foreground">Your curated collections</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <IconPlus className="mr-1 h-3.5 w-3.5" />
                      New Playlist
                    </Button>
                    <Button variant="ghost" size="sm" onClick={fetchPlaylists} disabled={loading}>
                      <IconRefresh className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                  </div>
                </div>

                {error && !loading && (
                  <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 py-12 text-center">
                    <p className="text-sm text-destructive">{error}</p>
                    <Button variant="outline" size="sm" onClick={fetchPlaylists}>
                      <IconRefresh className="mr-1 h-3.5 w-3.5" />
                      Try again
                    </Button>
                  </div>
                )}

                {loading && (
                  <div className="flex flex-col items-center gap-3 py-12">
                    <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading playlists...</p>
                  </div>
                )}

                {!loading && !error && playlists.length === 0 && (
                  <div className="flex flex-col items-center gap-3 rounded-lg border border-border/40 py-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                      <IconPlaylist className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No playlists yet</h3>
                    <p className="max-w-xs text-sm text-muted-foreground">
                      Create a playlist to organize your favorite songs.
                    </p>
                    <Button size="sm" className="mt-2">
                      <IconPlus className="mr-1 h-3.5 w-3.5" />
                      Create Playlist
                    </Button>
                  </div>
                )}

                {!loading && !error && playlists.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {playlists.map((playlist, i) => {
                      const cover = getPlaylistCover(playlist)
                      return (
                      <Card key={getPlaylistId(playlist, i)} className="group cursor-pointer overflow-hidden p-0 transition-all hover:scale-[1.02] hover:border-primary/30">
                        <div className="relative h-40 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600">
                          {cover && (
                            <img src={cover} alt={getPlaylistName(playlist)} className="absolute inset-0 h-full w-full object-cover" />
                          )}
                          {!cover && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <IconMusic className="h-12 w-12 text-white/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="truncate text-base font-semibold text-white">{getPlaylistName(playlist)}</h3>
                            {playlist.description && (
                              <p className="truncate text-xs text-white/70">{playlist.description}</p>
                            )}
                          </div>
                          <div className="absolute top-2 right-2">
                            <button className="flex h-7 w-7 items-center justify-center rounded-md bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50">
                              <IconDots className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{playlist.songCount || playlist.songs?.length || 0} songs</span>
                          </div>
                        </CardContent>
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
