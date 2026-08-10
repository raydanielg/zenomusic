import Link from "next/link"
import { Button, buttonVariants } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@workspace/ui/components/accordion"
import {
  IconSparkles, IconMusic, IconPlayerPlay, IconShare2,
  IconWand, IconCheck, IconChevronRight, IconBrandApple,
  IconBrandGooglePlay, IconDeviceMobile, IconBolt, IconLibrary,
  IconPalette, IconCircleCheck, IconChartDots, IconClock,
  IconStars, IconHeart, IconBookmark, IconBrandInstagram,
} from "@tabler/icons-react"
import { TypewriterText } from "@/components/typewriter-text"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"

const navLinks = [
  { label: "How it works", href: "#how" },
  { label: "Songs", href: "#songs" },
  { label: "Pricing", href: "#pricing" },
  { label: "Download", href: "#download" },
  { label: "FAQ", href: "#faq" },
]

const steps = [
  { num: "01", title: "Describe it", desc: "Type the mood, story or scene you hear in your head — \"rainy lo-fi for late-night studying,\" \"triumphant film score,\" anything.", icon: IconWand },
  { num: "02", title: "Pick a style", desc: "Choose a genre and mood, or let ZenoMusic read it straight from your words. Lo-fi, hip-hop, cinematic, pop, Afrobeats and more.", icon: IconPalette },
  { num: "03", title: "Generate", desc: "Hit generate and your unique track is composed in seconds — ready to play, download and save to your library.", icon: IconBolt },
]

const features = [
  { icon: IconWand, title: "AI-powered creation", desc: "Describe any vibe and our AI composes a unique, original track in seconds — no two prompts sound the same.", gradient: "from-violet-500 to-purple-500" },
  { icon: IconPalette, title: "Any genre, any mood", desc: "Lo-fi, hip-hop, cinematic, pop, Afrobeats, Amapiano — whatever you imagine, ZenoMusic delivers.", gradient: "from-blue-500 to-cyan-500" },
  { icon: IconLibrary, title: "Your personal library", desc: "Every song you create is saved automatically and playable any time from your own personal library.", gradient: "from-emerald-500 to-teal-500" },
  { icon: IconBolt, title: "Instant results", desc: "No waiting around. Your song is ready within moments of hitting generate — then refine and try again.", gradient: "from-amber-500 to-orange-500" },
]

const stats = [
  { value: "50K+", label: "Songs created" },
  { value: "12K+", label: "Active creators" },
  { value: "30+", label: "Genres available" },
  { value: "99.9%", label: "Uptime" },
]

const communitySongs = [
  { title: "Midnight in Dar", author: "Amani J.", genre: "Bongo Flava", color: "from-orange-500 via-red-500 to-pink-500", plays: "12.4K" },
  { title: "Sahara Dreams", author: "Leyla M.", genre: "Afrobeats", color: "from-amber-500 via-yellow-500 to-orange-500", plays: "8.7K" },
  { title: "Voltage", author: "Kofi A.", genre: "Amapiano", color: "from-violet-500 via-purple-500 to-fuchsia-500", plays: "15.2K" },
  { title: "Ocean Drive", author: "Zara T.", genre: "Synthwave", color: "from-cyan-500 via-blue-500 to-indigo-500", plays: "6.3K" },
  { title: "Golden Hour", author: "Brian K.", genre: "Lo-fi", color: "from-pink-500 via-rose-500 to-red-500", plays: "21.8K" },
  { title: "Mama Africa", author: "Grace N.", genre: "Pop", color: "from-emerald-500 via-teal-500 to-cyan-500", plays: "9.1K" },
]

const pricingPlans = [
  { name: "Starter", price: "2,000", credits: "3 song credits", features: ["3 AI songs", "Full quality audio", "Download all tracks"], popular: false },
  { name: "Pro", price: "5,000", credits: "9 song credits", features: ["9 AI songs", "Full quality audio", "Download all tracks", "Priority queue"], popular: true },
  { name: "Mega", price: "10,000", credits: "21 song credits", features: ["21 AI songs", "Full quality audio", "Download all tracks", "Priority queue"], popular: false },
  { name: "Unlimited", price: "100,000", credits: "Unlimited songs / month", features: ["Unlimited AI songs", "Full quality audio", "Download all tracks", "Priority queue", "Monthly access"], popular: false },
]

const paymentMethods = ["M-Pesa", "Tigo Pesa", "Airtel Money", "Visa / Mastercard"]

const faqs = [
  { q: "Do I need any music experience?", a: "Not at all. If you can describe what you want in words, ZenoMusic can create it. No instruments, no software, no experience required." },
  { q: "How long does a song take to generate?", a: "Most songs are ready within seconds of hitting generate. Priority queue users get even faster turnaround." },
  { q: "Who owns the songs I create?", a: "You do. Every track you generate with ZenoMusic is yours to use, download, and share." },
  { q: "How do I pay, and do credits expire?", a: "Pay with M-Pesa, Tigo Pesa, Airtel Money, or Visa/Mastercard. Credits don't expire — use them whenever you want." },
  { q: "What genres can I make?", a: "Lo-fi, hip-hop, cinematic, pop, Afrobeats, Amapiano, Bongo Flava, and many more. If you can describe it, we can compose it." },
  { q: "Can I download my tracks?", a: "Yes. Every plan includes full-quality downloads of all your generated tracks." },
]

const genres = ["Lo-fi", "Hip-Hop", "Cinematic", "Pop", "Afrobeats", "Amapiano", "Bongo Flava", "Synthwave", "Jazz", "Ambient", "R&B", "Dancehall"]

function Waveform({ bars = 40, className = "" }: { bars?: number; className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-[2px] ${className}`}>
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="waveform-bar w-[3px] rounded-full bg-current"
          style={{
            animationDelay: `${i * 0.05}s`,
            height: `${20 + Math.sin(i * 0.5) * 30 + Math.random() * 20}%`,
          }}
        />
      ))}
    </div>
  )
}

export default function Page() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      {/* Layered animated background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute inset-0 noise-texture" />
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/15 blur-[140px] animate-float-slow" />
        <div className="absolute top-1/4 -left-40 h-[500px] w-[500px] rounded-full bg-violet-500/15 blur-[120px] animate-float-medium" />
        <div className="absolute bottom-0 right-1/4 h-[550px] w-[550px] rounded-full bg-blue-500/10 blur-[130px] animate-float-fast" />
        <div className="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-fuchsia-500/5 blur-[100px] animate-float-slow" />
        <div className="absolute bottom-1/4 left-1/3 h-[300px] w-[300px] rounded-full bg-emerald-500/5 blur-[90px] animate-float-medium" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 border-b border-border/30 bg-background/60 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-2.5 transition-transform hover:scale-105">
            <div className="relative">
              <div className="absolute inset-0 animate-glow-pulse rounded-lg" />
              <img src="/zeno-logo.png" alt="ZenoMusic" className="relative h-8 w-auto" />
            </div>
          </a>
          <div className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                Sign in
              </Link>
              <Link href="/login" className={buttonVariants({ size: "sm" })}>
                Get started free
                <IconChevronRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </div>
            <MobileNav />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pt-20 text-center md:pt-32">
        <div className="mb-8 inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-border/40 bg-background/40 px-4 py-2 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <IconSparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-xs font-medium">AI music generation — now in beta</span>
        </div>

        <h1 className="max-w-4xl animate-fade-in-up text-5xl font-bold tracking-tight delay-100 md:text-7xl">
          Create music with
          <TypewriterText />
        </h1>

        <p className="mt-8 max-w-xl animate-fade-in-up text-lg text-muted-foreground delay-200 md:text-xl">
          ZenoMusic turns your words into original songs. Type what you feel, pick your style, and let AI do the rest — a finished track in seconds.
        </p>

        <div className="mt-10 animate-fade-in-up delay-300">
          <Link href="/login" className={buttonVariants({ size: "lg" })}>
            <IconSparkles className="mr-1.5 h-4 w-4" />
            Get started free
          </Link>
        </div>

        {/* Prompt input card */}
        <div className="mt-16 w-full max-w-2xl animate-scale-in delay-500">
          <Card className="glass overflow-hidden border-border/30 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border/20 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400/50" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/50" />
                <div className="h-3 w-3 rounded-full bg-green-400/50" />
              </div>
              <span className="ml-2 text-xs text-muted-foreground">zeno · new track</span>
            </div>
            <div className="p-6">
              {/* Input row */}
              <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/40 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <IconWand className="h-5 w-5 text-primary" />
                </div>
                <input
                  type="text"
                  placeholder="Describe your song... e.g. rainy lo-fi for late-night studying"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
                  readOnly
                />
                <Link href="/login" className={buttonVariants({ size: "sm" })}>
                  <IconSparkles className="mr-1 h-3.5 w-3.5" />
                  Generate
                </Link>
              </div>

              {/* Style tags */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Popular:</span>
                {["Lo-fi", "Afrobeats", "Bongo Flava", "Pop", "Amapiano"].map((tag) => (
                  <span key={tag} className="rounded-full border border-border/40 px-3 py-1 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Animated waveform */}
              <div className="mt-5 flex h-16 items-center justify-center rounded-lg bg-primary/5 text-primary/40">
                <Waveform bars={50} className="h-12 w-full px-2" />
              </div>
            </div>
          </Card>
        </div>

        {/* Feature bullets marquee */}
        <div className="mt-12 overflow-hidden">
          <div className="flex animate-marquee gap-3 whitespace-nowrap">
            {[...["No music experience needed", "Original, royalty-ready tracks", "Ready in seconds", "Any genre, any mood", "Download and share"], ...["No music experience needed", "Original, royalty-ready tracks", "Ready in seconds", "Any genre, any mood", "Download and share"]].map((item, i) => (
              <span
                key={i}
                className="glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-muted-foreground"
              >
                <IconCircleCheck className="h-4 w-4 text-primary" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Genre marquee */}
      <section className="relative z-10 overflow-hidden py-6">
        <div className="flex animate-marquee gap-3 whitespace-nowrap">
          {[...genres, ...genres].map((genre, i) => (
            <span
              key={i}
              className="glass inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium text-muted-foreground"
            >
              <IconMusic className="h-3.5 w-3.5 text-primary" />
              {genre}
            </span>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/40 px-4 py-1.5 backdrop-blur-sm">
            <IconChartDots className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium">Simple process</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">How it works</h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Three steps from idea to song. No software to learn, no instruments to play. If you can describe it, ZenoMusic can compose it.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.num} className="relative">
              <Card className="glass h-full overflow-hidden p-8">
                {/* Step number badge */}
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold">
                    {step.num}
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{step.desc}</p>
              </Card>
              {/* Connecting line */}
              {i < 2 && (
                <div className="absolute top-1/2 -right-4 hidden h-px w-8 bg-gradient-to-r from-primary/30 to-transparent md:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Why ZenoMusic */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/40 px-4 py-1.5 backdrop-blur-sm">
            <IconStars className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium">Features</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Why ZenoMusic</h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Everything you need to turn words into music.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="glass flex flex-col p-7"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Made with ZenoMusic */}
      <section id="songs" className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/40 px-4 py-1.5 backdrop-blur-sm">
            <IconHeart className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium">Community</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Made with ZenoMusic</h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Songs from a single sentence. A taste of what the community has created. Press play — real songs made by ZenoMusic users.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-5 md:grid-cols-3">
          {communitySongs.map((song, i) => (
            <Card
              key={song.title}
              className={`group glass animate-scale-in delay-${(i + 1) * 100} cursor-pointer overflow-hidden p-0 transition-all duration-300 hover:scale-[1.04] hover:border-primary/30`}
            >
              <div className={`relative h-40 bg-gradient-to-br ${song.color} md:h-52`}>
                {/* Animated overlay pattern */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 30%, white 1px, transparent 1px)",
                  backgroundSize: "30px 30px",
                }} />
                {/* Waveform overlay */}
                <div className="absolute inset-0 flex items-center justify-center text-white/30">
                  <Waveform bars={30} className="h-10 w-full px-3" />
                </div>
                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:opacity-100">
                    <IconPlayerPlay className="h-6 w-6 fill-white text-white" />
                  </div>
                </div>
                {/* Genre badge */}
                <div className="absolute bottom-3 left-3">
                  <span className="glass rounded-full px-3 py-1 text-xs font-medium text-white">
                    {song.genre}
                  </span>
                </div>
                {/* Plays count */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs text-white/80">
                  <IconPlayerPlay className="h-3 w-3 fill-white/80" />
                  {song.plays}
                </div>
              </div>
              <div className="p-4">
                <h3 className="truncate text-sm font-medium">{song.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">by {song.author}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Get the app */}
      <section id="download" className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32">
        <Card className="glass relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/15 blur-[100px] animate-float-slow" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-violet-500/15 blur-[100px] animate-float-medium" />
          </div>
          <div className="relative grid grid-cols-1 items-center gap-8 p-8 md:grid-cols-2 md:p-14">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/40 px-4 py-1.5 backdrop-blur-sm">
                <IconDeviceMobile className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-medium">Mobile app</span>
              </div>
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Get the app</h2>
              <p className="mt-4 text-muted-foreground">
                Make music on the move. Take ZenoMusic everywhere. Generate songs, build your library and play your tracks from your phone — free on iPhone and Android.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" variant="outline" className="justify-start">
                  <IconBrandApple className="mr-2 h-5 w-5" />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">Download on the</div>
                    <div className="text-sm font-semibold">App Store</div>
                  </div>
                </Button>
                <Button size="lg" variant="outline" className="justify-start">
                  <IconBrandGooglePlay className="mr-2 h-5 w-5" />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">Get it on</div>
                    <div className="text-sm font-semibold">Google Play</div>
                  </div>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/15" />
                <div className="absolute inset-0 animate-spin-slow rounded-full border-2 border-dashed border-primary/20" />
                <div className="relative flex h-36 w-36 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-violet-500/20 backdrop-blur-sm md:h-52 md:w-52">
                  <IconDeviceMobile className="h-18 w-18 text-primary md:h-28 md:w-28" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Pricing */}
      <section id="pricing" className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/40 px-4 py-1.5 backdrop-blur-sm">
            <IconBookmark className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium">Pricing</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Pricing</h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Start free. Pay only for what you create. Simple top-ups by card or mobile money — no subscription required.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className="glass flex flex-col items-center p-7 text-center min-h-[400px]"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <IconMusic className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-sm text-muted-foreground">TZS</span>
                <span className="text-3xl font-bold">{plan.price}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{plan.credits}</p>
              <Separator className="my-5" />
              <ul className="flex-1 space-y-3 text-left">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <IconCheck className="h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full">
                Buy credits
              </Button>
            </Card>
          ))}
        </div>

        {/* Payment methods */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <span className="text-sm text-muted-foreground">Pay with:</span>
          {paymentMethods.map((method) => (
            <span key={method} className="glass rounded-lg px-3.5 py-1.5 text-sm font-medium text-muted-foreground">
              {method}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:py-32">
        <div className="glass relative overflow-hidden rounded-3xl p-12 text-center md:p-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/20 blur-[100px] animate-float-slow" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-violet-500/20 blur-[100px] animate-float-medium" />
            <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-[80px] animate-float-fast" />
          </div>
          <div className="relative">
            <div className="mb-6 flex justify-center">
              <Waveform bars={30} className="h-12 w-48 text-primary/40" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
              Your next song is
              <span className="block bg-gradient-to-r from-primary via-violet-500 to-blue-500 bg-clip-text text-transparent animate-gradient-shift">
                one prompt away.
              </span>
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-muted-foreground md:text-lg">
              Join ZenoMusic and start generating original tracks today — no music experience required.
            </p>
            <Link href="/login" className={buttonVariants({ size: "lg", className: "mt-10" })}>
              <IconSparkles className="mr-1 h-4 w-4" />
              Get started free
              <IconChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="relative z-10 mx-auto max-w-3xl px-6 py-24 md:py-32">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/40 px-4 py-1.5 backdrop-blur-sm">
            <IconCircleCheck className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium">Support</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">FAQ</h2>
          <p className="mt-4 text-muted-foreground">Questions, answered.</p>
        </div>

        <div className="mt-12 space-y-4">
          <Accordion className="border-border/30">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} className="glass rounded-xl border-border/30 not-last:border-b">
                <AccordionTrigger className="px-6 py-5 text-base font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="px-6 text-sm text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="glass mt-6 flex flex-col items-center justify-between gap-4 rounded-xl p-6 sm:flex-row">
            <div>
              <p className="text-sm font-medium">Still have questions?</p>
              <p className="mt-1 text-sm text-muted-foreground">We&apos;re here to help. Reach out and we&apos;ll get back to you.</p>
            </div>
            <Link href="/login" className={buttonVariants({ size: "sm" })}>
              Contact us
              <IconChevronRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 bg-background/40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2">
                <img src="/zeno-logo.png" alt="ZenoMusic" className="h-7 w-auto" />
              </div>
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                Turn your words into original songs. AI music generation.
              </p>
              <div className="mt-4 flex items-center gap-3">
                <a href="#" className="glass flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-primary">
                  <IconBrandInstagram className="h-4 w-4" />
                </a>
                <a href="#" className="glass flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-primary">
                  <IconShare2 className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold">Product</h4>
              <ul className="mt-4 space-y-3">
                {["How it works", "Features", "Songs", "Pricing", "Download app"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold">Company</h4>
              <ul className="mt-4 space-y-3">
                {["About", "FAQ", "Contact"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold">Legal</h4>
              <ul className="mt-4 space-y-3">
                {["Terms", "Privacy", "Licence"].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-muted-foreground">© 2026 ZenoMusic. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Made with <IconHeart className="inline h-3 w-3 text-primary" /> in Tanzania</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
