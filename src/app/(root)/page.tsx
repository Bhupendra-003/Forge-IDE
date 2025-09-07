"use client"
import ClientHeader from "@/app/(root)/_components/ClientHeader"
import EditorPanel from "./_components/EditorPanel"
import { useEffect, useState } from "react"
import BrandLoading from "./_components/BrandLoading"
import OutputPanel from "./_components/OutputPanel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AIWindow from "./_components/AIWindow"

export default function Page() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) return <BrandLoading />

  return (
    <div className="flex flex-col h-screen">
      {/* Main Header */}
      <ClientHeader />

      {/* Main Content */}
      <div className="flex-1 flex flex-col gap-1 lg:flex-row overflow-hidden">
        <div className="lg:w-1/2 w-full h-full overflow-auto">
          <EditorPanel />
        </div>

        <div className="lg:w-1/2 w-full h-full border-l border-border">
          <Tabs defaultValue="Output" className="h-full flex flex-col">
            <TabsList className="bg-background flex-shrink-0">
              <TabsTrigger className="p-4" value="Output">Output</TabsTrigger>
              <TabsTrigger className="p-4" value="AI">Forge AI</TabsTrigger>
            </TabsList>
            <TabsContent value="Output" className="flex-1 overflow-auto">
              <OutputPanel />
            </TabsContent>
            <TabsContent value="AI" className="flex-1 overflow-auto">
              <AIWindow />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>

  )

}
