"use client"

import * as React from "react"

import { NavDocuments } from "@/components/nav-documents"
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
import { IconMusic, IconSparkles, IconLibrary, IconBolt, IconClock, IconDownload, IconSettings, IconHelp, IconSearch, IconPlaylist, IconHeart, IconHistory, IconStar } from "@tabler/icons-react"

const data = {
  user: {
    name: "Amani J.",
    email: "amani@zenomusic.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Create",
      url: "#",
      icon: <IconSparkles />,
    },
    {
      title: "My Library",
      url: "#",
      icon: <IconLibrary />,
    },
    {
      title: "Recent",
      url: "#",
      icon: <IconClock />,
    },
    {
      title: "Favorites",
      url: "#",
      icon: <IconHeart />,
    },
    {
      title: "Playlists",
      url: "#",
      icon: <IconPlaylist />,
    },
  ],
  navClouds: [],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: <IconSettings />,
    },
    {
      title: "Get Help",
      url: "#",
      icon: <IconHelp />,
    },
    {
      title: "Search",
      url: "#",
      icon: <IconSearch />,
    },
  ],
  documents: [
    {
      name: "Downloaded",
      url: "#",
      icon: <IconDownload />,
    },
    {
      name: "History",
      url: "#",
      icon: <IconHistory />,
    },
    {
      name: "Top Rated",
      url: "#",
      icon: <IconStar />,
    },
  ],
}
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
