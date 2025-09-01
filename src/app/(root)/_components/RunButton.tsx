"use client"
import React from 'react'
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
        <div className="flex cursor-default p-4 gap-2 font-bold items-center h-10 rounded-full active:bg-primary transition duration-100 ease-in-out justify-center bg-primary w-fit"
            onClick={handleRun}
        >
                {/* Icon wrapper with fixed size */}
                <div className="flex items-center justify-center">
                    {isRunning ? (
                        <Squircle
                            size="18"
                            stroke="3"
                            strokeLength="0.18"
                            bgOpacity="0.2"
                            speed="0.9"
                            color="white"
                        />
                    ) : (
                        <FaPlay size={16} color='white' />
                    )}
                </div>
                <p className='hidden text-white lg:block text-nowrap'>Run Code</p>
        </div>
    )
}

export default RunButton
