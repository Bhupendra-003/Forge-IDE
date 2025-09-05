import { Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"

export function EditorPanelSkeleton() {
    return (
        <div className="space-y-4 p-4 w-full h-full">
            {/* Code lines */}
            <div className="space-y-2">
                {Array.from({ length: 20 }).map((_, i) => (
                    <Skeleton key={i} className={`h-4 ${i % 3 === 0 ? 'w-3/4' : 'w-5/6'} rounded`} />
                ))}
            </div>
        </div>

    )
}

export function OutputPanelSkeleton() {
    return (
        <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between m-3">
                <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-white" />
                    <div className={`w-16 h-4 bg-white/5 rounded`} />
                </div>
            </div>

            {/* Output Area Skeleton */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-b from-[#1e1e2e] to-[#1a1a2e] rounded-xl -z-10" />
                <div className="relative bg-sidebar/50 backdrop-blur-sm rounded-xl p-4 h-[600px]">
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <div className={`w-12 h-12 mx-auto mb-4 bg-white/5 rounded-xl`} />
                            <div className={`w-48 h-4 mx-auto bg-white/5 rounded`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}