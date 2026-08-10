"use client"

import * as React from "react"
import Link from "next/link"
import { buttonVariants } from "@workspace/ui/components/button"
import { IconMenu2, IconX } from "@tabler/icons-react"

const navLinks = [
  { label: "How it works", href: "#how" },
  { label: "Songs", href: "#songs" },
  { label: "Pricing", href: "#pricing" },
  { label: "Download", href: "#download" },
  { label: "FAQ", href: "#faq" },
]

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Toggle menu"
      >
        {open ? <IconX className="h-5 w-5" /> : <IconMenu2 className="h-5 w-5" />}
      </button>

      {open && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Menu panel */}
          <div className="fixed right-0 top-0 z-50 flex h-full w-72 flex-col border-l border-border/30 bg-background/95 backdrop-blur-xl animate-slide-in-right">
            <div className="flex items-center justify-between border-b border-border/30 px-6 py-4">
              <span className="text-sm font-semibold">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-2 border-t border-border/30 p-4">
              <Link
                href="/login"
                className={buttonVariants({ variant: "outline", size: "sm", className: "w-full" })}
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
              <Link
                href="/login"
                className={buttonVariants({ size: "sm", className: "w-full" })}
                onClick={() => setOpen(false)}
              >
                Get started free
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
