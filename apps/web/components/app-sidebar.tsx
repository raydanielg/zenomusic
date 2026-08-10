"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import { IconMusic, IconSparkles, IconLibrary, IconVideo, IconCompass, IconPlaylist, IconUser, IconLogout } from "@tabler/icons-react"

const API_BASE = "/api/zeno"

const data = {
  navMain: [
    {
      title: "Create",
      url: "/dashboard",
      icon: <IconSparkles />,
    },
    {
      title: "Library",
      url: "/dashboard/library",
      icon: <IconLibrary />,
    },
    {
      title: "Video",
      url: "/dashboard/video",
      icon: <IconVideo />,
    },
    {
      title: "Discover",
      url: "/dashboard/discover",
      icon: <IconCompass />,
    },
    {
      title: "Playlists",
      url: "/dashboard/playlists",
      icon: <IconPlaylist />,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: <IconUser />,
    },
  ],
  navClouds: [],
  navSecondary: [
    {
      title: "Sign Out",
      url: "/login",
      icon: <IconLogout />,
    },
  ],
  documents: [],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: "Zeno User",
    email: "Loading...",
    avatar: "/avatars/shadcn.jpg",
  })

  React.useEffect(() => {
    // Read from localStorage first (set during login)
    const storedName = localStorage.getItem("zeno_display_name")
    const storedCredits = localStorage.getItem("zeno_credits")
    const storedAvatar = localStorage.getItem("zeno_avatar")
    const storedUsername = localStorage.getItem("zeno_username")

    if (storedName || storedCredits || storedAvatar) {
      setUser({
        name: storedName || (storedUsername ? `@${storedUsername}` : "Zeno User"),
        email: `${storedCredits || 0} credits`,
        avatar: storedAvatar || "/avatars/shadcn.jpg",
      })
    }

    const token = localStorage.getItem("zeno_token")
    if (!token) return

    async function fetchUser() {
      try {
        const res = await fetch(`${API_BASE}/auth/signin-sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        })

        if (res.ok) {
          const data = await res.json().catch(() => ({}))
          const username = data.username || data.userId || data.id || storedUsername || ""
          const credits = data.credits ?? parseInt(storedCredits || "0")
          const name = data.displayName || data.name || data.phoneNumber || (username ? `@${username}` : "Zeno User")
          const avatar = data.photoURL || data.avatar || storedAvatar || "/avatars/shadcn.jpg"

          // Update localStorage with fresh data
          if (username) localStorage.setItem("zeno_username", username)
          if (data.credits !== undefined) localStorage.setItem("zeno_credits", String(data.credits))
          if (data.displayName || data.name) localStorage.setItem("zeno_display_name", data.displayName || data.name)
          if (data.photoURL || data.avatar) localStorage.setItem("zeno_avatar", data.photoURL || data.avatar)

          setUser({ name, email: `${credits} credits`, avatar })
        }
      } catch {
        // Silent fail — keep localStorage data
      }
    }

    fetchUser()
  }, [])

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5!"
              render={<a href="/" />}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <IconMusic className="h-5 w-5 text-primary" />
              </div>
              <span className="text-base font-semibold">ZenoMusic</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
