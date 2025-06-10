"use client"

import {
  MoreHorizontal,
  Trash2,
  Pencil,
  Copy,
  Download,
  Play,
} from "lucide-react"
import { useState } from "react"

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
import { useCodeEditorStore } from "@/store/useCodeEditorStore"
import { useCheckpointStore } from "@/store/useCheckpointStore"
import { Checkpoint } from "@/types/index"
import { Input } from "@/components/ui/input"

export function NavFiles({
  files,
}: {
  files: Checkpoint[]
}) {
  const { isMobile } = useSidebar()
  const { setCurrentFile, editor, setLanguage } = useCodeEditorStore()
  const { renameCheckpoint, deleteCheckpoint, downloadCheckpoint } = useCheckpointStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const handleLoadCheckpoint = (checkpoint: Checkpoint) => {
    if (editor) {
      editor.setValue(checkpoint.code)
      setLanguage(checkpoint.language)
      setCurrentFile(checkpoint.name)
    }
  }

  const handleRename = (id: string, currentName: string) => {
    setEditingId(id)
    setEditingName(currentName)
  }

  const handleSaveRename = (id: string) => {
    if (editingName.trim()) {
      renameCheckpoint(id, editingName.trim())
    }
    setEditingId(null)
    setEditingName('')
  }

  const handleCancelRename = () => {
    setEditingId(null)
    setEditingName('')
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Checkpoints</SidebarGroupLabel>
      <SidebarMenu>
        {files.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              onClick={() => handleLoadCheckpoint(item)}
              className="w-full flex items-center gap-2 text-left cursor-pointer"
              title={item.name}
            >
              <span>{item.emoji}</span>
              {editingId === item.id ? (
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => handleSaveRename(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveRename(item.id)
                    if (e.key === 'Escape') handleCancelRename()
                  }}
                  className="h-6 text-sm"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span>{item.name}</span>
              )}
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
                <DropdownMenuItem onClick={() => handleLoadCheckpoint(item)}>
                  <Play className="text-muted-foreground" />
                  <span>Load Checkpoint</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRename(item.id, item.name)}>
                  <Pencil className="text-muted-foreground" />
                  <span>Rename</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadCheckpoint(item.id)}>
                  <Download className="text-muted-foreground" />
                  <span>Download</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => deleteCheckpoint(item.id)}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="text-red-600" />
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
