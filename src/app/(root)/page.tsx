"use client"
import { AppSidebar } from "@/app/(root)/_components/app-sidebar"
import { ResizablePanel, ResizableHandle, ResizablePanelGroup } from "@/components/ui/resizable"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import ClientHeader from "@/app/(root)/_components/ClientHeader"
import OutputPanel from "@/app/(root)/_components/OutputPanel"
import EditorPanel from "./_components/EditorPanel"
import AIWindow from "./_components/AIWindow"
import { RxCross2 } from "react-icons/rx"
// import { IoLogoPython } from "react-icons/io5"
import { useAIWindowStore } from "@/store/useAIWindowStore"
import { useOutputPanelStore } from "@/store/useOutputPanelStore"
import { Button } from "@/components/ui/button"
import { RotateCcwSquare, Braces } from "lucide-react"
import { useCodeEditorStore } from "@/store/useCodeEditorStore"

export default function Page() {
  const { isOpen: isAIWindowOpen } = useAIWindowStore();
  const { isVisible: isOutputPanelVisible, closeOutputPanel } = useOutputPanelStore();
  const { resetCode } = useCodeEditorStore();

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <ClientHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset className="flex flex-col flex-1">

            {/* Main content area */}
            <div className="flex flex-1 px-2 pb-2">
              <ResizablePanelGroup direction="horizontal">
                {/* Left panel with editor and output */}
                <ResizablePanel
                  minSize={10}
                  defaultSize={isAIWindowOpen || isOutputPanelVisible ? 50 : 100}
                  className="rounded-sm"
                >
                  <ResizablePanelGroup direction="vertical">
                    {/* Editor panel */}
                    <ResizablePanel
                      minSize={10}
                      defaultSize={isAIWindowOpen ? 70 : 80}
                      className="rounded-sm bg-muted/50"
                    >
                      {/* Editor container */}
                      <div className="h-full w-full aspect-video">
                        <div className="flex gap-2 w-full h-11 border items-center bg-background-2 rounded-sm">
                          <div className='w-fit rounded-t-md h-full flex p-1 pr-8 items-center gap-4 px-3'>
                            <Braces size={18} />    
                            <p className="text-lg font-sans">Editor</p>
                          </div>
                          <Button variant="ghost" title="Reset code" onClick={resetCode} size="icon" className="ml-auto p-1 rounded-sm hover:bg-muted transition-colors duration-300 ease-in-out"
                          >
                            <RotateCcwSquare size={20} />
                          </Button>
                        </div>
                        <EditorPanel />
                      </div>
                    </ResizablePanel>

                    {/* Output panel - only shown at bottom when AI window is open */}
                    {isAIWindowOpen && isOutputPanelVisible && (
                      <>
                        <ResizableHandle className="w-full my-1 bg-black" />
                        <ResizablePanel minSize={10} defaultSize={30} className="rounded-sm bg-muted/50">
                          <div className="h-full w-full aspect-video">
                            <div className="w-full h-10 flex bg-background-2 border border-b-0 items-center justify-between">
                              <div className='w-fit h-full rounded-t-md flex pt-1 border-t-2 border-t-primary items-center px-3 bg-muted/50'>
                                <p className="text-lg font-sans">Output</p>
                              </div>
                              <div className="flex items-center pr-2">
                                <Button
                                  onClick={closeOutputPanel}
                                  size="icon"
                                  variant="ghost"
                                  title="Close output panel"
                                  className="w-6 h-6 flex hover:scale-120 hover:rotate-90 transition-transform duration-300 ease-out items-center justify-center rounded-full"
                                >
                                  <RxCross2
                                    size={24}
                                  />

                                </Button>
                              </div>
                            </div>
                            <OutputPanel />
                          </div>
                        </ResizablePanel>
                      </>
                    )}
                  </ResizablePanelGroup>
                </ResizablePanel>


                {/* Right panel - AI Window or Output panel depending on state */}
                {(isAIWindowOpen || isOutputPanelVisible) && (
                  <>
                    <ResizableHandle className="mx-1 w-0 bg-gray-300 dark:bg-background-2 rounded-full" />
                    <ResizablePanel minSize={30} defaultSize={40} className="rounded-sm bg-muted/50">
                      {isAIWindowOpen ? (
                        // AI Window
                        <div className="h-full w-full aspect-video">
                          <AIWindow />
                        </div>
                      ) : (
                        // Output panel (when AI window is not open)
                        isOutputPanelVisible && (
                          <div className="h-full w-full aspect-video">
                            <div className="w-full h-10 flex bg-background-2 border border-b-0 items-center justify-between">
                              <div className='w-fit h-full rounded-t-md flex pt-1 border-t-2 border-t-primary items-center px-3 bg-muted/50'>
                                <p className="text-lg font-sans">Output</p>
                              </div>
                              <div className="flex items-center pr-2">
                                <Button
                                  onClick={closeOutputPanel}
                                  size="icon"
                                  variant="ghost"
                                  title="Close output panel"
                                  className="w-6 h-6 flex hover:scale-120 hover:rotate-90 transition-transform duration-300 ease-out items-center justify-center rounded-full"
                                >
                                  <RxCross2 size={18} />
                                </Button>
                              </div>
                            </div>
                            <OutputPanel />
                          </div>
                        )
                      )}
                    </ResizablePanel>
                  </>
                )}
              </ResizablePanelGroup>
            </div>

          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
