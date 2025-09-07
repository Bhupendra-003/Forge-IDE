"use client"
import { useState, useEffect } from "react"
import ClientHeader from "@/app/(root)/_components/ClientHeader"
import EditorPanel from "./_components/EditorPanel"
import BrandLoading from "./_components/BrandLoading"
import OutputPanel from "./_components/OutputPanel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AIWindow from "./_components/AIWindow"

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Output');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-full">
      {/* Loading Overlay */}
      <div 
        className={`absolute inset-0 z-50 bg-background flex items-center justify-center transition-opacity duration-300 ${
          isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <BrandLoading />
      </div>

      {/* Main Content */}
      <div className={`transition-opacity duration-300 ${
        isLoading ? 'opacity-0' : 'opacity-100'
      }`}>
        <ClientHeader />
        <div className="flex-1 flex flex-col gap-[.4rem] lg:flex-row overflow-hidden h-[calc(100vh-4rem)]">
          <div className="lg:w-2/3 w-full h-full overflow-auto">
            <EditorPanel />
          </div>

          <div className="lg:w-1/3 w-full h-full border-l border-border">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="bg-background flex-shrink-0">
                <TabsTrigger className="p-4" value="Output">Output</TabsTrigger>
                <TabsTrigger className="p-4" value="AI">Forge AI</TabsTrigger>
              </TabsList>
              <TabsContent value="Output" className="flex-1 overflow-auto">
                <OutputPanel onAskAI={() => setActiveTab('AI')} />
              </TabsContent>
              <TabsContent value="AI" className="flex-1 overflow-auto">
                <AIWindow />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
