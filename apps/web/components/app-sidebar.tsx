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

const API_BASE = "https://zenomusic.io/api"

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
          const userId = localStorage.getItem("zeno_user_id") || ""
          setUser({
            name: data.name || data.displayName || data.phoneNumber || `User ${userId.slice(-4)}`,
            email: `${data.credits ?? 0} credits`,
            avatar: data.photoURL || "/avatars/shadcn.jpg",
          })
        }
      } catch {
        // Silent fail — keep default user
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
