"use client"
import ClientHeader from "@/app/(root)/_components/ClientHeader"
import EditorPanel from "./_components/EditorPanel"
import { useEffect, useState } from "react"
import BrandLoading from "./_components/BrandLoading"
import OutputPanel from "./_components/OutputPanel"

export default function Page() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) return <BrandLoading />

  return (
    <div className="relative [--header-height:calc(--spacing(14))] h-screen flex flex-col">
      {/* Main Header */}
      <ClientHeader />

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-1 flex-1 h-full">
        <div className="flex-1 min-h-[300px] max-w-[50vw]">
          <EditorPanel />
        </div>

        <div className="flex-1 min-h-[300px]">
          <OutputPanel />
        </div>
      </div>

    </div>
  )

}
