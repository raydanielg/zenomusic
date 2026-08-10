"use client"

import { LoginForm } from "@/components/login-form"
import { IconMusic, IconSparkles, IconBolt, IconPalette } from "@tabler/icons-react"

export default function LoginPage() {
  return (
    <div className="relative grid min-h-svh lg:grid-cols-2">
      {/* Form side */}
      <div className="relative z-10 flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
              <IconMusic className="size-5 text-primary" />
            </div>
            ZenoMusic
          </a>
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to home
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-sm">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Visual side */}
      <div className="relative hidden overflow-hidden lg:block">
        {/* Background image */}
        <img
          src="/portrait-headphones.jpg"
          alt="Creator with headphones"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Color overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-violet-600/50 to-blue-700/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

        {/* Floating animated blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-primary/30 blur-[100px] animate-float-slow" />
          <div className="absolute top-1/3 -left-20 h-80 w-80 rounded-full bg-violet-500/30 blur-[90px] animate-float-medium" />
          <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-blue-500/20 blur-[80px] animate-float-fast" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-30" />

        {/* Content overlay */}
        <div className="relative z-10 flex h-full flex-col justify-center p-12">
          <div className="max-w-md">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
              <IconSparkles className="h-3.5 w-3.5 text-white" />
              <span className="text-xs font-medium text-white">AI music generation</span>
            </div>

            <h2 className="text-4xl font-bold leading-tight tracking-tight text-white">
              Turn your words into{" "}
              <span className="bg-gradient-to-r from-white via-violet-200 to-blue-200 bg-clip-text text-transparent animate-gradient-shift">
                original songs.
              </span>
            </h2>

            <p className="mt-4 text-white/80">
              Join thousands of creators using ZenoMusic to generate unique tracks with just a prompt. No music experience needed.
            </p>

            <div className="mt-10 space-y-4">
              {[
                { icon: IconBolt, title: "Ready in seconds", desc: "From prompt to track in moments" },
                { icon: IconPalette, title: "Any genre, any mood", desc: "Lo-fi, Afrobeats, Bongo Flava, and more" },
                { icon: IconSparkles, title: "Original & royalty-ready", desc: "Every track is uniquely yours" },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-md animate-fade-in-up"
                  style={{ animationDelay: `${(i + 1) * 100}ms` }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="text-xs text-white/70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
