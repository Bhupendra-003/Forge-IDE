"use client"
import * as React from "react"
import { BsThreeDots } from "react-icons/bs";
import { ChevronRight, File, Folder, PlusCircle } from "lucide-react"
import { LuFilePlus, LuFolderPlus } from "react-icons/lu";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [treeData, setTreeData] = React.useState<any[]>([]) // No demo files
    const [search, setSearch] = React.useState("")

    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [newItemType, setNewItemType] = React.useState<"file" | "folder">("file")
    const [newItemName, setNewItemName] = React.useState("")

    const openCreateDialog = (type: "file" | "folder") => {
        setNewItemType(type)
        setNewItemName("")
        setIsDialogOpen(true)
    }

    const handleCreate = () => {
        if (!newItemName.trim()) return
        const newItem = newItemType === "file" ? newItemName : [newItemName, []]
        setTreeData((prev) => [...prev, newItem])
        setIsDialogOpen(false)
    }

    const filteredTree = filterTree(treeData, search)

    return (
        <>
            <Sidebar variant="floating" {...props}>
                <div className="p-2 space-y-2">
                    <Input
                        className="focus:outline-none"
                        type="search"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <SidebarContent>
                    <Collapsible>
                        <CollapsibleTrigger className="hover:bg-zinc-800">
                            <div className="flex justify-between items-center p-2 w-[238px] h-10 border-y">
                                <div className="flex items-center justify-center gap-1"><ChevronRight className="transition-transform" />
                                    <p>Files</p>
                                </div>

                                <div className="flex items-center justify-center gap-1">
                                    <div className="cursor-pointer w-8 h-8 hover:bg-zinc-800 flex items-center justify-center rounded-full" onClick={() => openCreateDialog("file")}><LuFilePlus size={18} /></div>
                                    <div className="cursor-pointer w-8 h-8 hover:bg-zinc-800 flex items-center justify-center rounded-full" onClick={() => openCreateDialog("folder")}><LuFolderPlus size={18} /></div>
                                    <div className="cursor-pointer w-7 h-7 hover:bg-zinc-800 flex items-center justify-center rounded-full"><BsThreeDots size={18} /></div>
                                </div>
                            </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {filteredTree.map((item, index) => (
                                        <Tree key={index} item={item} />
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </CollapsibleContent>
                    </Collapsible>
                </SidebarContent>
                <SidebarRail />
            </Sidebar>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create {newItemType}</DialogTitle>
                    </DialogHeader>
                    <Input
                        placeholder={`Enter ${newItemType} name`}
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        autoFocus
                    />
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate}>Create</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

function Tree({ item }: { item: string | any[] }) {
    const [name, ...items] = Array.isArray(item) ? item : [item]

    if (!items.length) {
        return (
            <SidebarMenuButton
                isActive={false}
                className="data-[active=true]:bg-transparent"
            >
                <File />
                {name}
            </SidebarMenuButton>
        )
    }

    return (
        <SidebarMenuItem>
            <Collapsible
                className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
                defaultOpen={false}
            >
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                        <ChevronRight className="transition-transform" />
                        <Folder />
                        {name}
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {items.map((subItem, index) => (
                            <Tree key={index} item={subItem} />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    )
}

function filterTree(tree: any[], search: string): any[] {
    if (!search) return tree

    return tree
        .map((item) => {
            if (typeof item === "string") {
                return item.toLowerCase().includes(search.toLowerCase()) ? item : null
            }

            const [name, ...children] = item
            const filteredChildren = children
                .map((child: any) => filterTree([child], search)[0])
                .filter(Boolean)

            if (
                name.toLowerCase().includes(search.toLowerCase()) ||
                filteredChildren.length > 0
            ) {
                return [name, ...filteredChildren]
            }

            return null
        })
        .filter(Boolean)
}
