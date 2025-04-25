import { AppSidebar } from "@/app/(root)/_components/app-sidebar"
import { ResizablePanel, ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import Header from "@/app/(root)/_components/Header"
import OutputPanel from "@/app/(root)/_components/OutputPanel"
import EditorPanel from "./_components/EditorPanel"
import { RxCross2 } from "react-icons/rx"
import { IoLogoPython } from "react-icons/io5"

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
                      {/* Left resizable */}
                      <div className="h-full w-full aspect-video"> {/* Container */}
                        <div className="flex gap-2  w-full h-10 border items-center bg-background-2 rounded-sm"> {/* Header */}
                          <div className='w-fit h-full flex pt-1 border-t-2 border-t-primary items-center gap-2 px-3 bg-muted/50'>
                            <IoLogoPython size={24} />
                            <p className="text-lg font-sans">palindrome.py</p>
                            <div className="ml-2 w-6 h-6 flex items-center justify-center hover:bg-input rounded-full"><RxCross2 size={18} /></div>
                          </div>
                        </div>
                        <EditorPanel />
                      </div>

                    </ResizablePanel>
                    <ResizableHandle className="w-full my-1 bg-black " />

                    <ResizablePanel minSize={10} defaultSize={20} className="rounded-sm bg-muted/50">
                      {/* Bottom resizable in Left panel content */}
                      <div className="h-full w-full aspect-video"> {/* Container */}
                        <div className="w-full  h-10 flex bg-background-2 border border-b-0 items-center justify-between"> {/* Header */}
                          <div className='w-fit h-full flex pt-1 border-t-2 border-t-primary items-center px-3 bg-muted/50'>
                            <p className="text-lg font-sans">Output</p>
                            <div className="ml-2 w-6 h-6 flex items-center justify-center hover:bg-input rounded-full"><RxCross2 size={18} /></div>
                          </div>
                        </div>
                        <OutputPanel />
                      </div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                </ResizablePanel>

                <ResizableHandle className="mx-1 w-2 bg-gray-300 dark:bg-background-2 rounded-full" />

                <ResizablePanel minSize={10} defaultSize={50} className="rounded-sm bg-muted/50">
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
