"use client"

import {
  MoreHorizontal,
  Trash2,
  Pencil,
  Copy,
  Download,
  Play,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavFiles({
  files,
}: {
  files: {
    name: string
    url: string
    emoji: string
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Files</SidebarGroupLabel>
      <SidebarMenu>
        {files.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url} title={item.name}>
                <span>{item.emoji}</span>
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Pencil className="text-muted-foreground" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="text-muted-foreground" />
                  <span>Duplicate</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="text-muted-foreground" />
                  <span>Download</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Play className="text-muted-foreground" />
                  <span>Run File</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
