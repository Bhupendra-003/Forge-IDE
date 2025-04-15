import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import Navbar from "@/components/Navbar"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <SidebarProvider>
        <div className="flex h-screen w-screen pt-2">
          <AppSidebar /> {/* Your sidebar */}
          <SidebarInset className="flex flex-col flex-1">

            <Navbar /> {/* Top navbar */}

            {/* Main content area */}
            <div className="flex flex-1 p-2">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel minSize={10} defaultSize={30} className="rounded-sm">
                  <ResizablePanelGroup direction="vertical">

                    <ResizablePanel minSize={10} defaultSize={70} className="rounded-sm bg-muted/50 p-2">
                      {/* Top resizable in Left panel content */}
                      <div className="h-full w-full aspect-video">Left Top Panel</div>
                    </ResizablePanel>

                    <ResizableHandle className="w-full my-1 bg-black " />

                    <ResizablePanel minSize={10} defaultSize={20} className="rounded-sm bg-muted/50 p-2">
                      {/* Bottom resizable in Left panel content */}
                      <div className="h-full w-full aspect-video">Left Bottom Panel</div>
                    </ResizablePanel>

                  </ResizablePanelGroup>
                </ResizablePanel>

                <ResizableHandle className="mx-1 w-0 bg-gray-300 dark:bg-gray-700" />

                <ResizablePanel minSize={10} defaultSize={20} className="rounded-sm bg-muted/50 p-2">
                  {/* Right resizable in Right panel content */}
                  <div className="h-full w-full aspect-video">Right Top Panel</div>
                </ResizablePanel>
              </ResizablePanelGroup>  
            </div>

          </SidebarInset>
        </div>
      </SidebarProvider>

    </div>
  )
}

