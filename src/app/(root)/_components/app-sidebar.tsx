"use client"
import * as React from "react"
import {
  Sparkles,
  Settings2,
  Code,
  Terminal,
  MessageCircle
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavFiles } from "@/components/nav-files"
import { useAIWindowStore } from "@/store/useAIWindowStore"
import { useOutputPanelStore } from "@/store/useOutputPanelStore"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className="flex flex-col gap-1 text-nowrap">
      {items.map((item) => (
        <Tooltip key={item.title}>
          <TooltipTrigger asChild>
            <button
              onClick={item.onClick}
              className={`w-full justify-${isCollapsed ? "center" : "start"} h-8 flex gap-2 items-center border-none outline-none text-foreground rounded-md hover:bg-muted p-2 ${item.isActive ? "bg-muted" : ""
                }`}
            >
              <item.icon size={isCollapsed ? 18 : 14} />
              {!isCollapsed && <span className="text-[16px]">{item.title}</span>}
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            align="center"
            hidden={!isCollapsed || isMobile}
          >
            {item.title}
          </TooltipContent>
        </Tooltip>
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
        onClick: () => { },
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
        title: "Chat",
        url: "#",
        icon: MessageCircle,
        onClick: () => { },
      },
    ],
    checkpoints: [
      {
        name: "cp1",
        emoji: "",
      },
    ],
  }
  return (
    <Sidebar
      collapsible="icon"
      className="rounded-md top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <div className="mt-2"><CustomNavMain items={data.navMain} /></div>
      </SidebarHeader>
      <SidebarContent>
        <NavFiles files={data.checkpoints} />
      </SidebarContent>
      <SidebarFooter>
        <DialogDemo />
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
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              className={`w-full justify-start h-8 flex gap-2 items-center border-none outline-none text-white rounded-md hover:bg-muted p-2`}
              variant="ghost"
            >
              <Settings2 size={isCollapsed ? 18 : 20} />
              {!isCollapsed && "Settings"}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={!isCollapsed || isMobile}
        >
          Settings
        </TooltipContent>
      </Tooltip>
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
