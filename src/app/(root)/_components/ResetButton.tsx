"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { VscDebugRestart } from "react-icons/vsc";
import { useCodeEditorStore } from '@/store/useCodeEditorStore';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function ResetButton() {
    const { resetCode } = useCodeEditorStore();
    
    const handleReset = () => {
        // Confirm before resetting
        if (window.confirm('Are you sure you want to reset the code to default? This action cannot be undone.')) {
            resetCode();
        }
    };
    
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-center h-10 rounded justify-center bg-secondary w-fit mr-2">
                        <Button
                            onClick={handleReset}
                            variant="secondary"
                            className="text-foreground font-semibold text-lg flex items-center gap-3 py-2"
                        >
                            <div className="w-2 mr-1 flex items-center justify-center">
                                <VscDebugRestart size={24} />
                            </div>
                            <p>Reset</p>
                        </Button>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Reset code to default</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default ResetButton
