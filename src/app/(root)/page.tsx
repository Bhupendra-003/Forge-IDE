"use client"
import ClientHeader from "@/app/(root)/_components/ClientHeader"
import EditorPanel from "./_components/EditorPanel"
import { useAIWindowStore } from "@/store/useAIWindowStore"
import { useOutputPanelStore } from "@/store/useOutputPanelStore"
import { useCodeEditorStore } from "@/store/useCodeEditorStore"
import { useEffect, useState } from "react"
import BrandLoading from "./_components/BrandLoading"

export default function Page() {
  const { isOpen: isAIWindowOpen } = useAIWindowStore();
  const { isVisible: isOutputPanelVisible, closeOutputPanel } = useOutputPanelStore();
  const { resetCode } = useCodeEditorStore();
  const [isLoading, setIsLoading] = useState(true);

  // 📱 detect mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);
  
  if (isLoading) return <BrandLoading />

  return (
    <div className="relative [--header-height:calc(--spacing(14))] h-screen flex flex-col">
      <ClientHeader />
      <div className="flex-1">
        <EditorPanel />
      </div>
    </div>
  )

}
