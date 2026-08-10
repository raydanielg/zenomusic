"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { toast } from "sonner"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { Card } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { IconPlayerPlay, IconPlayerPause, IconRefresh, IconLoader2, IconCompass, IconDots, IconEye, IconMessage2, IconHeart, IconPlayerSkipForward, IconPlayerSkipBack, IconVolume, IconVolumeOff, IconDownload, IconMusic } from "@tabler/icons-react"

const API_BASE = "/api/zeno"

interface DiscoverSong {
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
  audioFile?: string
  fileUrl?: string
  url?: string
  musicUrl?: string
  songUrl?: string
  mediaUrl?: string
  downloadUrl?: string
  streamUrl?: string
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
  author?: { name?: string; username?: string; avatar?: string; photoURL?: string }
}

function getAudioUrl(song: DiscoverSong): string | null {
  const raw = song.audioUrl || song.audio || song.audioFile || song.fileUrl || song.url || song.musicUrl || song.songUrl || song.mediaUrl || song.downloadUrl || song.streamUrl
  if (!raw) return null
  if (raw.startsWith("http") || raw.startsWith("/") || raw.startsWith("data:")) return raw
  if (raw.startsWith("blob:")) return raw
  return raw
}

function getCoverUrl(song: DiscoverSong): string | null {
  const raw = song.coverArt || song.coverUrl || song.cover || song.coverImage || song.image || song.imageData
  if (!raw) return null
  if (raw.startsWith("data:") || raw.startsWith("http") || raw.startsWith("/")) return raw
  if (raw.startsWith("iVBORw0") || raw.startsWith("/9j/") || raw.startsWith("UklGR")) {
    const mime = raw.startsWith("iVBORw0") ? "image/png" : raw.startsWith("UklGR") ? "image/webp" : "image/jpeg"
    return `data:${mime};base64,${raw}`
  }
  return raw
}

function getSongTitle(song: DiscoverSong): string {
  return song.title || song.name || "Untitled"
}

function getSongGenre(song: DiscoverSong): string {
  if (song.genre) return song.genre
  if (song.style) return song.style
  if (song.tags && song.tags.length > 0) return song.tags.join(", ")
  return "Unknown genre"
}

function getSongDate(song: DiscoverSong): string {
  return song.createdAt || song.created_at || song.updatedAt || ""
}

function getSongId(song: DiscoverSong, index: number): string {
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
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function DiscoverPage() {
  const [songs, setSongs] = useState<DiscoverSong[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentSong, setCurrentSong] = useState<DiscoverSong | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
      toast.error(err instanceof Error ? err.message : "Failed to load discover")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDiscover()
  }, [fetchDiscover])

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setProgress(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => handleNext()

    audio.addEventListener("timeupdate", onTimeUpdate)
    audio.addEventListener("loadedmetadata", onLoadedMetadata)
    audio.addEventListener("ended", onEnded)

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate)
      audio.removeEventListener("loadedmetadata", onLoadedMetadata)
      audio.removeEventListener("ended", onEnded)
    }
  }, [currentSong])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume
    }
  }, [volume, muted])

  const playSong = async (song: DiscoverSong) => {
    let audioUrl = getAudioUrl(song)

    // If no audio URL in the song data, try fetching from the song detail endpoint
    if (!audioUrl && (song.id || song._id)) {
      const songId = song.id || song._id
      try {
        const token = localStorage.getItem("zeno_token")
        const detailRes = await fetch(`${API_BASE}/music/${songId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (detailRes.ok) {
          const detail = await detailRes.json()
          audioUrl = detail.audioUrl || detail.audio || detail.fileUrl || detail.url || detail.musicUrl || detail.songUrl || detail.mediaUrl || detail.streamUrl || null
          if (audioUrl) {
            // Update the song object with the fetched audio URL
            song = { ...song, audioUrl: audioUrl || undefined }
            setSongs(prev => prev.map(s => (s.id === song.id || s._id === song._id) ? { ...s, audioUrl: audioUrl || undefined } : s))
          }
        }
      } catch {}
    }

    if (!audioUrl) {
      toast.error("Audio not available for this song")
      return
    }

    if (currentSong?.id === song.id || currentSong?._id === song._id) {
      // Toggle play/pause
      if (isPlaying) {
        audioRef.current?.pause()
        setIsPlaying(false)
      } else {
        audioRef.current?.play()
        setIsPlaying(true)
      }
      return
    }

    setCurrentSong(song)
    setProgress(0)
    setDuration(0)

    // Increment play count
    const songId = song.id || song._id
    if (songId) {
      const token = localStorage.getItem("zeno_token")
      fetch(`${API_BASE}/music/${songId}/play`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }).then((playRes) => {
        if (playRes.ok) {
          playRes.json().then((playData) => {
            if (playData.playCount !== undefined) {
              setSongs(prev => prev.map(s => (s.id === song.id || s._id === song._id)
                ? { ...s, plays: playData.playCount, playCount: playData.playCount, totalPlays: playData.playCount }
                : s
              ))
            }
          }).catch(() => {})
        }
      }).catch(() => {})
    }

    // Play after src is set
    setTimeout(() => {
      audioRef.current?.play()
      setIsPlaying(true)
    }, 100)
  }

  const handleNext = () => {
    if (!currentSong) return
    const currentIndex = songs.findIndex((s) => (s.id || s._id) === (currentSong.id || currentSong._id))
    if (currentIndex < songs.length - 1) {
      const next = songs[currentIndex + 1]
      if (next) playSong(next)
    } else {
      setIsPlaying(false)
      setProgress(0)
    }
  }

  const handlePrev = () => {
    if (!currentSong) return
    const currentIndex = songs.findIndex((s) => (s.id || s._id) === (currentSong.id || currentSong._id))
    if (currentIndex > 0) {
      const prev = songs[currentIndex - 1]
      if (prev) playSong(prev)
    } else {
      setProgress(0)
      if (audioRef.current) audioRef.current.currentTime = 0
    }
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audioRef.current.currentTime = ratio * duration
    setProgress(ratio * duration)
  }

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

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
                  <div className="space-y-2">
                    {/* List header */}
                    <div className="hidden items-center gap-4 rounded-lg border border-border/40 bg-muted/30 px-4 py-2 text-xs font-medium text-muted-foreground sm:flex">
                      <span className="w-6 text-center">#</span>
                      <span className="flex-1">Title</span>
                      <span className="hidden w-32 md:block">Genre</span>
                      <span className="hidden w-24 sm:block">Plays</span>
                      <span className="hidden w-20 sm:block">Likes</span>
                      <span className="w-16 text-right">Time</span>
                    </div>

                    {songs.map((song, i) => {
                      const cover = getCoverUrl(song)
                      const authorAvatar = song.author?.avatar || song.author?.photoURL
                      const songId = getSongId(song, i)
                      const isActive = currentSong && (currentSong.id === song.id || currentSong._id === song._id)
                      const hasAudio = song.audioUrl || song.audio
                      return (
                        <div
                          key={songId}
                          onClick={() => hasAudio && playSong(song)}
                          className={`group flex items-center gap-4 rounded-lg border px-4 py-3 transition-all ${isActive ? "border-primary/40 bg-primary/5" : "border-border/40 hover:border-border/60 hover:bg-muted/20"} ${hasAudio ? "cursor-pointer" : "cursor-default opacity-60"}`}
                        >
                          {/* Index / Play button */}
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center">
                            {isActive && isPlaying ? (
                              <div className="flex items-end gap-0.5">
                                <span className="h-3 w-0.5 animate-pulse rounded-full bg-primary" style={{ animationDelay: "0ms" }} />
                                <span className="h-4 w-0.5 animate-pulse rounded-full bg-primary" style={{ animationDelay: "150ms" }} />
                                <span className="h-2 w-0.5 animate-pulse rounded-full bg-primary" style={{ animationDelay: "300ms" }} />
                              </div>
                            ) : (
                              <>
                                <span className="text-sm text-muted-foreground group-hover:hidden">{i + 1}</span>
                                {hasAudio && (
                                  <IconPlayerPlay className="hidden h-4 w-4 fill-current text-foreground group-hover:block" />
                                )}
                              </>
                            )}
                          </div>

                          {/* Cover + Title + Author */}
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                              {cover && (
                                <img src={cover} alt={getSongTitle(song)} className="h-full w-full object-cover" />
                              )}
                              {!cover && (
                                <div className="flex h-full w-full items-center justify-center">
                                  <IconCompass className="h-4 w-4 text-white/50" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className={`truncate text-sm font-medium ${isActive ? "text-primary" : ""}`}>{getSongTitle(song)}</h3>
                              <div className="flex items-center gap-1.5">
                                {authorAvatar && (
                                  <img src={authorAvatar} alt={song.author?.name || song.author?.username} className="h-3 w-3 rounded-full" />
                                )}
                                <span className="truncate text-xs text-muted-foreground">{song.author?.name || song.author?.username || "Unknown"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Genre */}
                          <span className="hidden w-32 shrink-0 truncate text-xs text-muted-foreground md:block">{getSongGenre(song)}</span>

                          {/* Plays */}
                          <span className="hidden w-24 shrink-0 items-center gap-1 text-xs text-muted-foreground sm:flex">
                            <IconEye className="h-3 w-3" />
                            {song.plays || song.playCount || song.totalPlays || song.views || 0}
                          </span>

                          {/* Likes */}
                          <span className="hidden w-20 shrink-0 items-center gap-1 text-xs text-muted-foreground sm:flex">
                            <IconHeart className="h-3 w-3" />
                            {song.likes || song.likeCount || 0}
                          </span>

                          {/* Time ago */}
                          <span className="w-16 shrink-0 text-right text-xs text-muted-foreground">{timeAgo(getSongDate(song))}</span>

                          {/* Download */}
                          {(() => {
                            const dlUrl = getAudioUrl(song)
                            return dlUrl ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const a = document.createElement("a")
                                  a.href = dlUrl
                                  a.download = `${getSongTitle(song)}.mp3`
                                  a.target = "_blank"
                                  a.click()
                                  toast.success("Download started", { description: getSongTitle(song) })
                                }}
                                className="ml-1 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                                title="Download"
                              >
                                <IconDownload className="h-4 w-4" />
                              </button>
                            ) : null
                          })()}

                          {/* Dots menu */}
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="ml-2 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                          >
                            <IconDots className="h-4 w-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Audio element (hidden) */}
          <audio ref={audioRef} src={currentSong?.audioUrl || currentSong?.audio || undefined} />

          {/* Bottom Player Bar */}
          {currentSong && (
            <div className="sticky bottom-0 z-50 border-t border-border/60 bg-background/95 backdrop-blur-lg">
              {/* Progress bar */}
              <div
                onClick={handleSeek}
                className="group relative h-1.5 cursor-pointer bg-muted"
              >
                <div
                  className="absolute inset-y-0 left-0 bg-primary transition-all"
                  style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
                />
                <div
                  className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-0 shadow-md transition-opacity group-hover:opacity-100"
                  style={{ left: `${duration ? (progress / duration) * 100 : 0}%` }}
                />
              </div>

              {/* Player controls */}
              <div className="flex items-center gap-4 px-4 py-3">
                {/* Current song info */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                    {getCoverUrl(currentSong) && (
                      <img src={getCoverUrl(currentSong)!} alt={getSongTitle(currentSong)} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="truncate text-sm font-medium">{getSongTitle(currentSong)}</h4>
                    <p className="truncate text-xs text-muted-foreground">
                      {currentSong.author?.name || currentSong.author?.username || "Unknown"}
                    </p>
                  </div>
                </div>

                {/* Center controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <IconPlayerSkipBack className="h-4 w-4 fill-current" />
                  </button>
                  <button
                    onClick={() => {
                      if (isPlaying) {
                        audioRef.current?.pause()
                        setIsPlaying(false)
                      } else {
                        audioRef.current?.play()
                        setIsPlaying(true)
                      }
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105"
                  >
                    {isPlaying ? (
                      <IconPlayerPause className="h-5 w-5 fill-current" />
                    ) : (
                      <IconPlayerPlay className="h-5 w-5 fill-current" />
                    )}
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <IconPlayerSkipForward className="h-4 w-4 fill-current" />
                  </button>
                  {currentSong && getAudioUrl(currentSong) && (
                    <button
                      onClick={() => {
                        const dlUrl = getAudioUrl(currentSong)
                        if (!dlUrl) return
                        const a = document.createElement("a")
                        a.href = dlUrl
                        a.download = `${getSongTitle(currentSong)}.mp3`
                        a.target = "_blank"
                        a.click()
                        toast.success("Download started", { description: getSongTitle(currentSong) })
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                      title="Download"
                    >
                      <IconDownload className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Time + Volume */}
                <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
                  <span className="hidden text-xs text-muted-foreground sm:block">{formatTime(progress)} / {formatTime(duration)}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMuted(!muted)}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {muted || volume === 0 ? (
                        <IconVolumeOff className="h-4 w-4" />
                      ) : (
                        <IconVolume className="h-4 w-4" />
                      )}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={muted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(parseFloat(e.target.value))
                        setMuted(false)
                      }}
                      className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-muted accent-primary lg:w-28"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
