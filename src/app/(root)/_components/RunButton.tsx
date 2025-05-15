"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Squircle } from 'ldrs/react'
import { FaPlay } from "react-icons/fa";
import 'ldrs/react/Squircle.css'
import { useCodeEditorStore } from '@/store/useCodeEditorStore';
import { useOutputPanelStore } from '@/store/useOutputPanelStore';
// import { useUser } from '@clerk/nextjs';

function RunButton() {
    // const { user } = useUser();
    const { isRunning, runCode } = useCodeEditorStore();
    const { openOutputPanel } = useOutputPanelStore();
    const handleRun = async () => {
        openOutputPanel();
        await runCode();
    };
    return (
        <div className="flex items-center h-10 rounded justify-center bg-primary w-fit">
            <Button
                onClick={handleRun}
                className="text-white font-semibold text-lg flex items-center gap-3 py-2"
            >
                {/* Icon wrapper with fixed size */}
                <div className="w-2 mr-1 flex items-center justify-center">
                    {isRunning ? (
                        <Squircle
                            size="16"
                            stroke="3"
                            strokeLength="0.18"
                            bgOpacity="0.2"
                            speed="0.9"
                            color="white"
                        />
                    ) : (
                        <FaPlay size={30} />
                    )}
                </div>
                <p>Run Code</p>
            </Button>
        </div>
    )
}

export default RunButton
