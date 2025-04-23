"use client";
import React, { useState } from 'react'
import { useCodeEditorStore } from '@/store/useCodeEditorStore'
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoSparklesSharp } from 'react-icons/io5';
import { IoLogoPython } from "react-icons/io5";
import { CheckCircle } from "lucide-react";
import { Copy } from "lucide-react";
import { Ring } from 'ldrs/react'
import { FaCode } from "react-icons/fa";
import 'ldrs/react/Ring.css'

function OutputPanel() {
    const { output, error, isRunning } = useCodeEditorStore();
    const [isCopied, setIsCopied] = useState(false);
    const content = error || output;

    const handleCopy = () => {
        if (content) navigator.clipboard.writeText(content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }
    return (
        <div className="w-full h-full rounded-sm">

            <div className="w-full h-12 px-2 flex border items-center justify-between">
                <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 bg-zinc-900 rounded-full border flex items-center justify-center '>
                        <IoMdCheckmarkCircleOutline size={24} color="#0aff4d" />
                    </div>
                    <p>{">"}</p>
                    <div className='flex items-center gap-2'><IoLogoPython size={24} />
                        <p className="text-lg font-sans">palindrome.py</p>
                    </div>
                    <div className="ml-2 mt-2">
                        {isRunning && (
                            <Ring
                                size="20"
                                stroke="3"
                                bgOpacity="0"
                                speed="2"
                                color="white"
                            />
                        )}
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                {content && (
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm hover:text-white rounded-lg transition-all">
                        {isCopied ? (
                            <>
                                <CheckCircle className="w-3.5 h-3.5" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-3.5 h-3.5" />
                                Copy
                            </>
                        )}
                    </button>
                )}
                    <div className='flex bg-zinc-800 flex-shrink-0 p-2 scale-90 hover:bg-[#2e2e2e] rounded-md h-full w-fit items-center gap-2'>
                        <IoSparklesSharp size={20} /> <p className="text-lg font-sans">Ask AI</p>
                    </div>
                    <p className="text-zinc-200 flex-shrink-0 font-sans text-sm">{new Date().toLocaleString()}</p>
                </div>
            </div>

            {/* Output content */}
            <div className="w-full p-4 relative h-[calc(100%-80px)]">

                {content ? (
                    error ? <>
                    <div className="w-full h-full gap-2">
                        <pre className="whitespace-pre-wrap text-red-400 text-lg">{error}</pre>
                    </div>
                    </> : <>
                    <div className="w-full text-lg h-full gap-2">
                        <pre className="whitespace-pre-wrap text-white">{output}</pre>
                    </div>
                    </>
                ) : (
                    <div className='w-full h-full flex items-center justify-center gap-2'>
                        <span><FaCode size={24} /></span>
                        <span>Run your code to see output here</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OutputPanel
