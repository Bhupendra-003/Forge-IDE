"use client"
import * as React from "react"
import {
  Trash2,
  Search,
  Sparkles,
  Home,
  Inbox,
  Settings2,
  Code,
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
import { useAIWindowStore } from "@/store/useAIWindowStore"

// Custom NavMain component that supports click handlers
function CustomNavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: React.ComponentType
    isActive?: boolean
    onClick?: () => void
  }[]
}) {
  return (
    <div className="flex flex-col gap-1">
      {items.map((item) => (
        <button
          key={item.title}
          onClick={item.onClick}
          className={`w-full justify-start h-8 flex gap-2 items-center border-none outline-none text-white rounded-md hover:bg-muted p-2 ${
            item.isActive ? "bg-muted" : ""
          }`}
        >
          <item.icon size={20} />
          <span className="text-[16px]">{item.title}</span>
        </button>
      ))}
    </div>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleAIWindow } = useAIWindowStore();

  const data = {
    user: {
      name: "Bhupendra",
      email: "b@gmail.com",
      avatar: "/avatars/bhupi.png",
    },
    navMain: [
      {
        title: "Editor",
        url: "#",
        icon: Code,
        onClick: () => {},
      },
      {
        title: "Devine AI",
        url: "#",
        icon: Sparkles,
        onClick: toggleAIWindow,
      },
      {
        title: "Inbox",
        url: "#",
        icon: Inbox,
        onClick: () => {},
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
  return (
    <Sidebar
      className="rounded top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SearchForm />
        <div className="mt-2"><CustomNavMain items={data.navMain} /></div>
      </SidebarHeader>
      <SidebarContent>
        <NavFiles files={data.files} />
      </SidebarContent>
      <SidebarFooter>
        <DialogDemo />
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Settings from "./Settings"

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full justify-start h-8 flex gap-2 items-center border-none outline-none text-white rounded-md hover:bg-muted p-2" variant="ghost">
          <Settings2 size={20} />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] bg-popover">
        <DialogHeader>
          <DialogTitle>
            Settings
          </DialogTitle>
          <DialogDescription>
            Tweak the Code Editor Settings here.
          </DialogDescription>
        </DialogHeader>
        <Settings />
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
