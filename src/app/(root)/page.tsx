"use client"
import ClientHeader from "@/app/(root)/_components/ClientHeader"
import EditorPanel from "./_components/EditorPanel"
import { useEffect, useState } from "react"
import BrandLoading from "./_components/BrandLoading"
import OutputPanel from "./_components/OutputPanel"
import Tabs from "./_components/Tabs"

export default function Page() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) return <BrandLoading />

  return (
    <div className="h-screen flex flex-col">
      {/* Main Header */}
      <ClientHeader />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-1 flex-1 h-full">
        <div className="lg:w-1/2 w-full lg:h-full h-1/2">
          <EditorPanel />
        </div>

        <div className="lg:w-1/2 w-full lg:h-full h-1/2 mt-10">
          <OutputPanel />
        </div>
      </div>

      {/* Tabs */}
      <Tabs />
    </div>
  )

}
