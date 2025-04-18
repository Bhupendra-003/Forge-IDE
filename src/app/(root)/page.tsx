import { AppSidebar } from "@/app/(root)/_components/app-sidebar"
import { ResizablePanel, ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import Header from "@/app/(root)/_components/Header"
import RunButton from "@/app/(root)/_components/RunButton"
import OutputPanel from "@/app/(root)/_components/OutputPanel"

export const iframeHeight = "800px"

export const description = "A sidebar with a header and a search form."

export default function Page() {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <Header />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset className="flex flex-col flex-1">

            {/* Main content area */}
            <div className="flex flex-1 px-2 pb-2">
              <ResizablePanelGroup direction="horizontal">
                <ResizablePanel minSize={10} defaultSize={30} className="rounded-sm">
                  <ResizablePanelGroup direction="vertical">

                    <ResizablePanel minSize={10} defaultSize={70} className="rounded-sm bg-muted/50">
                      {/* Top resizable in Left panel content */}
                      <div className="h-full w-full aspect-video">
                        <div className="flex gap-2 w-full h-9 py-2 items-center justify-between bg-background-2 rounded-sm">
                          <div>Files</div>
                          <div><RunButton /></div>
                        </div>
                      </div>
                    </ResizablePanel>

                    <ResizableHandle className="w-full my-1 bg-black " />

                    <ResizablePanel minSize={10} defaultSize={20} className="rounded-sm bg-muted/50">
                      {/* Bottom resizable in Left panel content */}
                      <div className="h-full w-full aspect-video">Left Bottom Panel</div>
                    </ResizablePanel>

                  </ResizablePanelGroup>
                </ResizablePanel>

                <ResizableHandle className="mx-1 w-0 bg-gray-300 dark:bg-gray-700" />

                <ResizablePanel minSize={10} defaultSize={20} className="rounded-sm bg-muted/50">
                  {/* Right resizable in Right panel content */}
                  <div className="h-full w-full aspect-video">
                    <OutputPanel />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>

          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
