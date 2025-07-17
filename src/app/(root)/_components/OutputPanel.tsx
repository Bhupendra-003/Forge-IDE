"use client";
import React, { useState, useEffect, useRef } from 'react'
import { useCodeEditorStore } from '@/store/useCodeEditorStore'
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoSparklesSharp } from 'react-icons/io5';
import { IoLogoPython, IoLogoJavascript } from "react-icons/io5";
import { SiTypescript, SiGo, SiRust, SiCplusplus, SiRuby, SiSwift } from "react-icons/si";
import { RiJavaLine } from "react-icons/ri";
import { TbBrandCSharp } from "react-icons/tb";
import { CheckCircle, Copy, XCircle } from "lucide-react";
import { Ring } from 'ldrs/react'
import { FaCode } from "react-icons/fa";
import 'ldrs/react/Ring.css'
import { useAIMessageStore } from '@/store/useAIMessageStore';
import useMounted from '@/hooks/useMounted';

function OutputPanel() {
    const { output, handleInput, error, fontSize, isRunning, executionResult, language, currentFile } = useCodeEditorStore();
    const sendMessage = useAIMessageStore(state => state.sendMessage);
    const [isCopied, setIsCopied] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const content = error || output;
    const prevExecutionResultRef = useRef(executionResult);
    const mounted = useMounted();

    // Update time when execution result changes (code is run)
    useEffect(() => {
        // Only update time when executionResult changes and is not null
        if (executionResult && executionResult !== prevExecutionResultRef.current) {
            setCurrentTime(new Date().toLocaleString());
            prevExecutionResultRef.current = executionResult;

            // Make sure the output panel is visible when code is run
            // Import and use the store directly to avoid circular dependencies
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const { openOutputPanel } = require('@/store/useOutputPanelStore').useOutputPanelStore.getState();
            openOutputPanel();
        }
    }, [executionResult]);

    const handleCopy = () => {
        if (content) navigator.clipboard.writeText(content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    }
    return (
        <div className="w-full h-full rounded-sm">
            <div className="w-full h-12 px-2 flex border items-center justify-between">
                <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 bg-muted rounded-full border flex items-center justify-center '>
                        {error ? (
                            <XCircle size={24} color="var(--color-destructive)" />
                        ) : (
                            <IoMdCheckmarkCircleOutline size={24} color={output ? "var(--color-check)" : "var(--color-foreground)"} />
                        )}
                    </div>
                    <p>{">"}</p>
                    <div className='flex items-center gap-2'>
                        {/* Only render language-specific content when mounted to prevent hydration errors */}
                        {mounted ? (
                            <>
                                {/* Language icon based on current language */}
                                {(() => {
                                    switch (language) {
                                        case 'javascript':
                                            return <IoLogoJavascript size={24} />;
                                        case 'typescript':
                                            return <SiTypescript size={24} />;
                                        case 'python':
                                            return <IoLogoPython size={24} />;
                                        case 'java':
                                            return <RiJavaLine size={24} />;
                                        case 'go':
                                            return <SiGo size={24} />;
                                        case 'rust':
                                            return <SiRust size={24} />;
                                        case 'cpp':
                                            return <SiCplusplus size={24} />;
                                        case 'csharp':
                                            return <TbBrandCSharp size={24} />;
                                        case 'ruby':
                                            return <SiRuby size={24} />;
                                        case 'swift':
                                            return <SiSwift size={24} />;
                                        default:
                                            return <FaCode size={24} />;
                                    }
                                })()}
                                <p className="text-lg font-sans">
                                    {(() => {
                                        // Get current file name from the store
                                        // If we have a current file name, use it, otherwise fall back to language-based name
                                        if (currentFile) return currentFile;

                                        // Fall back to language-based naming
                                        const fileExtensions: Record<string, string> = {
                                            javascript: 'main.js',
                                            typescript: 'main.ts',
                                            python: 'main.py',
                                            java: 'Main.java',
                                            go: 'main.go',
                                            rust: 'main.rs',
                                            cpp: 'main.cpp',
                                            csharp: 'Program.cs',
                                            ruby: 'main.rb',
                                            swift: 'main.swift'
                                        };
                                        return fileExtensions[language] || 'main.txt';
                                    })()}
                                </p>
                            </>
                        ) : (
                            <>
                                <FaCode size={24} />
                                <p className="text-lg font-sans">Code</p>
                            </>
                        )}
                    </div>
                    <div className="ml-2 mt-2">
                        {isRunning && (
                            <Ring
                                size="20"
                                stroke="3"
                                bgOpacity="0"
                                speed="2"
                                color="var(--foreground)"
                            />
                        )}
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                {content && (
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded-lg transition-all">
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
                    <button
                        onClick={() => {
                            if (content) {
                                const instruction = error
                                    ? "Help me fix this error in my code:"
                                    : "Explain this output from my code:";
                                console.log("Sending to AI:", { content, instruction, language });
                                sendMessage(content, instruction);
                            }
                        }}
                        disabled={!content}
                        className='flex bg-muted flex-shrink-0 p-2 scale-90 hover:bg-muted/50 rounded-md h-full w-fit items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        <IoSparklesSharp size={20} /> <p className="text-lg font-sans">Ask AI</p>
                    </button>
                    {mounted && currentTime && (
                        <p className="text-foreground flex-shrink-0 font-sans text-sm">{currentTime}</p>
                    )}
                </div>
            </div>

            {/* Output content */}
            <div className="w-full p-4 relative h-[calc(100%-80px)]">
                <div className='space-y-3 mb-4'>
                    <p className='font-bold text-lg'>Input</p>
                    <textarea
                    className='w-full bg-accent font-mono h-fit scrollbar-custom min-h-16 max-h-68 p-3 rounded-lg outline-none'
                    spellCheck="false"
                    name="" 
                    id=""
                    rows={2}
                    onChange={(e)=>handleInput(e.target.value)}
                    style={{ fontSize: mounted ? `${fontSize}px` : '22px' }}
                    >
                    </textarea>
                </div>

                {content ? (
                    error ? <>
                    <div className="w-full h-full gap-2">
                        <pre className={`whitespace-pre-wrap text-destructive`} style={{ fontSize: mounted ? `${fontSize}px` : '22px' }}>{error}</pre>
                    </div>
                    </> : <>
                    <div className="w-full text-lg h-full gap-2">
                        <pre className={`whitespace-pre-wrap text-foreground `} style={{ fontSize: mounted ? `${fontSize}px` : '22px' }}>{output}</pre>
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
