"use client"
import * as React from "react"
import {
  Sparkles,
  Inbox,
  Settings2,
  Code,
  Terminal,
} from "lucide-react"

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
import { useOutputPanelStore } from "@/store/useOutputPanelStore"

// Custom NavMain component that supports click handlers
function CustomNavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: React.ComponentType<{ size?: number }>
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
          <item.icon size={20}/>
          <span className="text-[16px]">{item.title}</span>
        </button>
      ))}
    </div>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { toggleAIWindow } = useAIWindowStore();
  const { isVisible: isOutputPanelVisible, toggleOutputPanel } = useOutputPanelStore();

  const data = {
    user: {
      name: "Bhupendra",
      email: "b@gmail.com",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
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
        title: "Output",
        url: "#",
        icon: Terminal,
        isActive: isOutputPanelVisible,
        onClick: toggleOutputPanel,
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
          <p>The changes are automatically saved.</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
