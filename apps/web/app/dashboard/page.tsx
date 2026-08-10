import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { IconSparkles, IconWand, IconPlayerPlay, IconDownload, IconHeart, IconClock, IconMusic, IconDots } from "@tabler/icons-react"

const recentTracks = [
  { title: "Midnight in Dar", genre: "Bongo Flava", duration: "3:24", color: "from-orange-500 to-red-500", date: "2 hours ago" },
  { title: "Rainy Lo-fi Nights", genre: "Lo-fi", duration: "2:48", color: "from-blue-500 to-indigo-500", date: "Yesterday" },
  { title: "Sahara Dreams", genre: "Afrobeats", duration: "3:12", color: "from-amber-500 to-yellow-500", date: "2 days ago" },
  { title: "Voltage", genre: "Amapiano", duration: "4:01", color: "from-violet-500 to-purple-500", date: "3 days ago" },
  { title: "Ocean Drive", genre: "Synthwave", duration: "3:45", color: "from-cyan-500 to-blue-500", date: "5 days ago" },
  { title: "Golden Hour", genre: "Lo-fi", duration: "2:30", color: "from-pink-500 to-rose-500", date: "1 week ago" },
]

const genres = ["Lo-fi", "Afrobeats", "Bongo Flava", "Pop", "Amapiano", "Hip-Hop", "Cinematic", "R&B"]

export default function Page() {
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
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />

              {/* AI Music Generation */}
              <div className="px-4 lg:px-6">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <IconSparkles className="h-5 w-5 text-primary" />
                      </div>
                      Create a new track
                    </CardTitle>
                    <CardDescription>
                      Describe what you want and let AI compose it for you
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Prompt input */}
                    <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/40 p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <IconWand className="h-5 w-5 text-primary" />
                      </div>
                      <input
                        type="text"
                        placeholder="Describe your song... e.g. rainy lo-fi for late-night studying"
                        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
                      />
                      <Button size="sm">
                        <IconSparkles className="mr-1 h-3.5 w-3.5" />
                        Generate
                      </Button>
                    </div>

                    {/* Genre tags */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted-foreground">Genre:</span>
                      {genres.map((genre) => (
                        <span
                          key={genre}
                          className="cursor-pointer rounded-full border border-border/40 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent tracks */}
              <div className="px-4 lg:px-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Recent tracks</h2>
                  <Button variant="ghost" size="sm">
                    View all
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recentTracks.map((track) => (
                    <Card
                      key={track.title}
                      className="group cursor-pointer overflow-hidden p-0 transition-all hover:scale-[1.02] hover:border-primary/30"
                    >
                      <div className={`relative h-28 bg-gradient-to-br ${track.color}`}>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-all group-hover:scale-110 group-hover:opacity-100">
                            <IconPlayerPlay className="h-5 w-5 fill-white text-white" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-3">
                          <span className="rounded-full bg-black/30 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                            {track.genre}
                          </span>
                        </div>
                        <div className="absolute bottom-2 right-3 flex items-center gap-1 text-xs text-white/80">
                          <IconClock className="h-3 w-3" />
                          {track.duration}
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3">
                        <div>
                          <h3 className="truncate text-sm font-medium">{track.title}</h3>
                          <p className="mt-0.5 text-xs text-muted-foreground">{track.date}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-primary">
                            <IconHeart className="h-4 w-4" />
                          </button>
                          <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                            <IconDownload className="h-4 w-4" />
                          </button>
                          <button className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                            <IconDots className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Chart */}
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
