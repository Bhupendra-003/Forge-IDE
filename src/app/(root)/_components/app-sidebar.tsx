"use client"
import * as React from "react"
import {
  Trash2, 
  Search,
  Sparkles,
  Home,
  Inbox,
  Settings2,  
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { SearchForm } from "@/components/search-form"
import { NavFiles } from "@/components/nav-files"

const data = {
  user: {
    name: "Bhupendra",
    email: "b@gmail.com",
    avatar: "/avatars/bhupi.png",
  },
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    {
      title: "Ask AI",
      url: "#",
      icon: Sparkles,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
    },
  ],
  files: [
    {
      name: "main.py",
      url: "#",
      emoji: "",
    },
  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="rounded top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SearchForm />
        <div className="mt-2"><NavMain items={data.navMain} /></div>
      </SidebarHeader>
      <SidebarContent>
        <NavFiles files={data.files} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
