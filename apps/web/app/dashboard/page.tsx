"use client"

import { useState, useEffect, useCallback } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { Card, CardContent } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@workspace/ui/components/tabs"
import { IconSparkles, IconPlayerPlay, IconRefresh, IconMessage2, IconEye, IconLock, IconWorld, IconCoin, IconPlus, IconDots, IconLoader2, IconMusic, IconFlame, IconCheck } from "@tabler/icons-react"

const API_BASE = "/api/zeno"

const genreTags = [
  "Afrobeats", "Amapiano", "Pop", "R&B", "Hip Hop", "Gospel",
  "Reggae", "Dancehall", "Soul", "Drill", "Bongo Flava", "Taarab",
]

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

function timeAgo(dateStr: string) {
  const date = new Date(dateStr)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `about ${hours} hour${hours > 1 ? "s" : ""} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`
  const weeks = Math.floor(days / 7)
  return `${weeks} week${weeks > 1 ? "s" : ""} ago`
}

export default function Page() {
  const [songs, setSongs] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [credits, setCredits] = useState(() => {
    if (typeof window !== "undefined") {
      return parseInt(localStorage.getItem("zeno_credits") || "0")
    }
    return 0
  })
  const [lastUpdated, setLastUpdated] = useState("")
  const [token, setToken] = useState("")
  const [streak, setStreak] = useState<{ current?: number; longest?: number; lastActive?: string } | null>(null)
  const [activeTab, setActiveTab] = useState("cover")
  const [songTitle, setSongTitle] = useState("")
  const [songStyle, setSongStyle] = useState("")
  const [lyrics, setLyrics] = useState("[Verse 1]\n\n[Chorus]\n\n[Verse 2]")
  const [isPublic, setIsPublic] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createStatus, setCreateStatus] = useState("")
  const [createError, setCreateError] = useState("")

  const fetchHistory = useCallback(async () => {
    const storedToken = localStorage.getItem("zeno_token")
    if (!storedToken) {
      setError("Not authenticated")
      setLoading(false)
      return
    }
    setToken(storedToken)
    setLoading(true)
    setError("")

    try {
      const res = await fetch(`${API_BASE}/music/history?limit=50`, {
        headers: {
          Authorization: `Bearer ${storedToken}`,
          Accept: "application/json",
        },
      })

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("zeno_token")
          localStorage.removeItem("zeno_refresh_token")
          localStorage.removeItem("zeno_user_id")
          window.location.href = "/login"
          return
        }
        throw new Error(`Failed to fetch history (${res.status})`)
      }

      const data = await res.json()
      const history = Array.isArray(data) ? data : data.history || data.songs || data.data || data.items || []
      setSongs(history)
      setLastUpdated(new Date().toLocaleTimeString())

      if (data.credits !== undefined) {
        setCredits(data.credits)
        localStorage.setItem("zeno_credits", String(data.credits))
      } else {
        // Fetch credits from signin-sync
        fetch(`${API_BASE}/auth/signin-sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify({}),
        })
          .then((r) => r.json())
          .then((d) => {
            if (d.credits !== undefined) {
              setCredits(d.credits)
              localStorage.setItem("zeno_credits", String(d.credits))
            }
          })
          .catch(() => {})
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load library")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  // Fetch engagement streak
  useEffect(() => {
    const storedToken = localStorage.getItem("zeno_token")
    if (!storedToken) return

    fetch(`${API_BASE}/music/engagement/streak`, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
        Accept: "application/json",
      },
    })
      .then((r) => r.json())
      .then((data) => {
        setStreak({
          current: data.currentStreak ?? data.current ?? data.streak ?? 0,
          longest: data.longestStreak ?? data.longest ?? data.maxStreak ?? 0,
          lastActive: data.lastActiveDate ?? data.lastActive ?? data.updatedAt,
        })
      })
      .catch(() => {})
  }, [])

  const createSong = async () => {
    const storedToken = localStorage.getItem("zeno_token")
    if (!storedToken) {
      setCreateError("Not authenticated")
      return
    }

    setCreating(true)
    setCreateError("")
    setCreateStatus("Submitting your song...")

    try {
      const body: Record<string, unknown> = {
        title: songTitle || undefined,
        style: songStyle || undefined,
        visibility: isPublic ? "public" : "private",
      }

      if (activeTab === "lyrics") {
        body.lyrics = lyrics
        body.mode = "lyrics"
      } else {
        body.mode = "cover"
      }

      const res = await fetch(`${API_BASE}/music/generate-lyrics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify(body),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        const msg = data.message || data.error || `Failed to create song (${res.status})`
        setCreateError(msg)
        return
      }

      const taskId = data.taskId || data.task_id || data.id

      if (taskId) {
        setCreateStatus("Generating your song...")

        // Poll lyrics-status until complete
        const poll = async () => {
          for (let i = 0; i < 60; i++) {
            await new Promise((r) => setTimeout(r, 3000))

            const statusRes = await fetch(
              `${API_BASE}/music/lyrics-status?taskId=${taskId}`,
              { headers: { Authorization: `Bearer ${storedToken}` } }
            )

            const statusData = await statusRes.json().catch(() => ({}))
            const status = statusData.status || statusData.state

            if (status === "completed" || status === "success" || status === "done") {
              setCreateStatus("Song created successfully!")
              setCreating(false)

              // Update credits if returned
              if (statusData.credits !== undefined) {
                setCredits(statusData.credits)
                localStorage.setItem("zeno_credits", String(statusData.credits))
              }

              // Refresh library
              fetchHistory()
              return
            }

            if (status === "failed" || status === "error") {
              setCreateError(statusData.message || "Song generation failed")
              setCreating(false)
              return
            }

            setCreateStatus(`Generating... ${status || "processing"}`)
          }

          setCreateError("Song generation timed out. Please check your library later.")
          setCreating(false)
        }

        poll()
      } else {
        // No taskId — might be synchronous
        setCreateStatus("Song created successfully!")
        setCreating(false)

        if (data.credits !== undefined) {
          setCredits(data.credits)
          localStorage.setItem("zeno_credits", String(data.credits))
        }

        fetchHistory()
      }
    } catch {
      setCreateError("Failed to connect to the server")
      setCreating(false)
    }
  }

  const hasCredits = credits > 0
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-6 py-4 md:py-6">

              {/* Create Song Section */}
              <div className="px-4 lg:px-6">
                <Card className="border-border/40">
                  <CardContent className="p-6 space-y-5">
                    {/* Header with credits */}
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl font-bold tracking-tight">Create Song</h1>
                      <div className="flex items-center gap-3">
                        {streak && streak.current !== undefined && streak.current > 0 && (
                          <div className="flex items-center gap-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1.5">
                            <IconFlame className="h-4 w-4 text-orange-500" />
                            <span className="text-sm font-medium">{streak.current} day streak</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 rounded-lg border border-border/40 px-3 py-1.5">
                          <IconCoin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{credits} credits</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <IconPlus className="mr-1 h-3.5 w-3.5" />
                          Top Up
                        </Button>
                      </div>
                    </div>

                    {/* No credits warning */}
                    {!hasCredits && (
                      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
                        <p className="text-sm text-amber-600 dark:text-amber-500">
                          You have no credits left. Top up to create more songs.
                        </p>
                      </div>
                    )}

                    {/* Tabs: Cover Audio / Lyrics AI */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                      <TabsList className="grid w-full max-w-xs grid-cols-2">
                        <TabsTrigger value="cover">Cover Audio</TabsTrigger>
                        <TabsTrigger value="lyrics">Lyrics AI</TabsTrigger>
                      </TabsList>

                      <TabsContent value="cover" className="mt-5 space-y-5">
                        {/* Song Title */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Song Title <span className="text-muted-foreground">(Optional)</span></label>
                          <input
                            type="text"
                            value={songTitle}
                            onChange={(e) => setSongTitle(e.target.value)}
                            placeholder="e.g. Summer Nights"
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/30"
                          />
                        </div>

                        {/* Style / Genre */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Style / Genre</label>
                          <input
                            type="text"
                            value={songStyle}
                            onChange={(e) => setSongStyle(e.target.value)}
                            placeholder="Afrobeats, Female Vocals, Upbeat, 100 BPM"
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/30"
                          />
                        </div>

                        {/* Genre tags */}
                        <div className="flex flex-wrap gap-2">
                          {genreTags.map((genre) => (
                            <button
                              key={genre}
                              className="flex items-center gap-1 rounded-full border border-border/40 px-3 py-1 text-xs text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
                            >
                              <IconPlus className="h-3 w-3" />
                              {genre}
                            </button>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="lyrics" className="mt-5 space-y-5">
                        {/* Song Title */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Song Title <span className="text-muted-foreground">(Optional)</span></label>
                          <input
                            type="text"
                            value={songTitle}
                            onChange={(e) => setSongTitle(e.target.value)}
                            placeholder="e.g. Summer Nights"
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/30"
                          />
                        </div>

                        {/* Style / Genre */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Style / Genre</label>
                          <input
                            type="text"
                            value={songStyle}
                            onChange={(e) => setSongStyle(e.target.value)}
                            placeholder="Afrobeats, Female Vocals, Upbeat, 100 BPM"
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/30"
                          />
                        </div>

                        {/* Genre tags */}
                        <div className="flex flex-wrap gap-2">
                          {genreTags.map((genre) => (
                            <button
                              key={genre}
                              className="flex items-center gap-1 rounded-full border border-border/40 px-3 py-1 text-xs text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-foreground"
                            >
                              <IconPlus className="h-3 w-3" />
                              {genre}
                            </button>
                          ))}
                        </div>

                        {/* Lyrics */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Lyrics</label>
                          <textarea
                            rows={8}
                            value={lyrics}
                            onChange={(e) => setLyrics(e.target.value)}
                            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-ring focus:ring-[3px] focus:ring-ring/30"
                          />
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Privacy toggle */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPublic(false)}
                        className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${!isPublic ? "border-primary/40 bg-primary/5 text-foreground" : "border-border/40 text-muted-foreground hover:text-foreground"}`}
                      >
                        <IconLock className="h-4 w-4" />
                        Private
                      </button>
                      <button
                        onClick={() => setIsPublic(true)}
                        className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${isPublic ? "border-primary/40 bg-primary/5 text-foreground" : "border-border/40 text-muted-foreground hover:text-foreground"}`}
                      >
                        <IconWorld className="h-4 w-4" />
                        Public
                      </button>
                    </div>

                    {/* Create status */}
                    {createError && (
                      <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
                        <p className="text-sm text-destructive">{createError}</p>
                      </div>
                    )}
                    {createStatus && !createError && (
                      <div className="rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                        <p className="flex items-center gap-2 text-sm text-foreground">
                          {creating ? <IconLoader2 className="h-4 w-4 animate-spin" /> : <IconCheck className="h-4 w-4 text-emerald-500" />}
                          {createStatus}
                        </p>
                      </div>
                    )}

                    {/* Create button */}
                    <Button className="w-full" size="lg" disabled={!hasCredits || creating} onClick={createSong}>
                      {creating ? (
                        <>
                          <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                          {createStatus || "Creating..."}
                        </>
                      ) : (
                        <>
                          <IconSparkles className="mr-2 h-4 w-4" />
                          {hasCredits ? "Create Song" : "No Credits — Top Up First"}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* My Library Section */}
              <div className="px-4 lg:px-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">My Library</h2>
                    {lastUpdated && (
                      <span className="text-xs text-muted-foreground">Updated {lastUpdated}</span>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={fetchHistory} disabled={loading}>
                    <IconRefresh className={`mr-1 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                  </Button>
                </div>

                {/* Error state */}
                {error && !loading && (
                  <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 py-12 text-center">
                    <p className="text-sm text-destructive">{error}</p>
                    <Button variant="outline" size="sm" onClick={fetchHistory}>
                      <IconRefresh className="mr-1 h-3.5 w-3.5" />
                      Try again
                    </Button>
                  </div>
                )}

                {/* Loading state */}
                {loading && (
                  <div className="flex flex-col items-center gap-3 py-12">
                    <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Loading your library...</p>
                  </div>
                )}

                {/* Empty state */}
                {!loading && !error && songs.length === 0 && (
                  <div className="flex flex-col items-center gap-3 rounded-lg border border-border/40 py-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                      <IconMusic className="h-7 w-7 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No songs yet</h3>
                    <p className="max-w-xs text-sm text-muted-foreground">
                      Create your first song above and it will appear here.
                    </p>
                  </div>
                )}

                {/* Songs grid */}
                {!loading && !error && songs.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {songs.map((song, i) => {
                      const cover = getCoverUrl(song)
                      return (
                      <Card key={getSongId(song, i)} className="group cursor-pointer overflow-hidden p-0 transition-all hover:scale-[1.02] hover:border-primary/30">
                        {/* Cover art */}
                        <div className="relative h-32 bg-gradient-to-br from-orange-500 via-red-500 to-purple-600">
                          {cover && (
                            <img
                              src={cover}
                              alt={getSongTitle(song)}
                              className="absolute inset-0 h-full w-full object-cover"
                            />
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

                        {/* Song info */}
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

                          <p className="truncate text-xs text-muted-foreground">
                            {getSongGenre(song)}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <IconMessage2 className="h-3 w-3" />
                              {song.comments || song.commentCount || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <IconEye className="h-3 w-3" />
                              {song.plays || song.playCount || song.totalPlays || song.views || 0}
                            </span>
                            <span className="ml-auto text-[10px]">
                              {getSongDate(song) ? timeAgo(getSongDate(song)) : ""}
                            </span>
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
