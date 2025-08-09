"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useCodeEditorStore } from '@/store/useCodeEditorStore';
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoSparklesSharp, IoLogoPython, IoLogoJavascript } from 'react-icons/io5';
import { SiTypescript, SiGo, SiRust, SiCplusplus, SiRuby, SiSwift } from "react-icons/si";
import { RiJavaLine } from "react-icons/ri";
import { TbBrandCSharp } from "react-icons/tb";
import { CheckCircle, Copy, XCircle } from "lucide-react";
import { Ring } from 'ldrs/react';
import { FaCode } from "react-icons/fa";
import 'ldrs/react/Ring.css';
import { useAIMessageStore } from '@/store/useAIMessageStore';
import useMounted from '@/hooks/useMounted';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import ComplexityCard from '@/app/(root)/_components/ComplexityCard';
import { DialogTitle } from '@radix-ui/react-dialog';

// Constants for language icons and file extensions
const LANGUAGE_ICONS: Record<string, React.ReactNode> = {
    javascript: <IoLogoJavascript size={24} />,
    typescript: <SiTypescript size={24} />,
    python: <IoLogoPython size={24} />,
    java: <RiJavaLine size={24} />,
    go: <SiGo size={24} />,
    rust: <SiRust size={24} />,
    cpp: <SiCplusplus size={24} />,
    csharp: <TbBrandCSharp size={24} />,
    ruby: <SiRuby size={24} />,
    swift: <SiSwift size={24} />,
    default: <FaCode size={24} />
};

const FILE_EXTENSIONS: Record<string, string> = {
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

function OutputPanel() {
    const {
        output,
        handleInput,
        error,
        fontSize,
        isRunning,
        executionResult,
        language,
        currentFile
    } = useCodeEditorStore();

    const sendMessage = useAIMessageStore(state => state.sendMessage);
    const [isCopied, setIsCopied] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const mounted = useMounted();
    const content = error || output;
    const fontSizeValue = mounted ? `${fontSize}px` : undefined;
    const showSuccessIcon = !error && output;

    // Memoize the file name to prevent recalculation
    const fileName = useMemo(() =>
        currentFile || FILE_EXTENSIONS[language] || 'main.txt',
        [currentFile, language]
    );

    // Handle execution result changes
    useEffect(() => {
        if (executionResult) {
            setCurrentTime(new Date().toLocaleString());
            // Use dynamic import to avoid circular dependencies
            import('@/store/useOutputPanelStore')
                .then(module => {
                    const { openOutputPanel } = module.useOutputPanelStore.getState();
                    openOutputPanel();
                })
                .catch(console.error);
        }
    }, [executionResult]);

    const handleCopy = useCallback(() => {
        if (!content) return;
        navigator.clipboard.writeText(content);
        setIsCopied(true);
        const timer = setTimeout(() => setIsCopied(false), 2000);
        return () => clearTimeout(timer);
    }, [content]);

    const handleAIAssist = useCallback(() => {
        if (!content) return;
        const instruction = error
            ? "Help me fix this error in my code:"
            : "Explain this output from my code:";
        console.log("Sending to AI:", { content, instruction, language });
        sendMessage(content, instruction);
    }, [content, error, language, sendMessage]);
    return (
        <div className="w-full h-full rounded-sm">
            <div className="w-full h-12 px-2 flex border items-center justify-between">
                <div className='flex items-center gap-2'>

                    {/* Success or Error Icon */}
                    <div className='w-8 h-8 bg-muted rounded-full border flex items-center justify-center'>
                        {error ? (
                            <XCircle size={24} color="var(--color-destructive)" />
                        ) : (
                            <IoMdCheckmarkCircleOutline
                                size={24}
                                color={showSuccessIcon ? "var(--color-check)" : "var(--color-foreground)"}
                            />
                        )}
                    </div>
                    <p>{">"}</p>

                    {/* File Name */}
                    <div className='flex items-center gap-2'>
                        {mounted ? (
                            <>
                                {LANGUAGE_ICONS[language] || LANGUAGE_ICONS.default}
                                <p className="text-lg font-sans">
                                    {fileName}
                                </p>
                            </>
                        ) : (
                            <>
                                <FaCode size={24} />
                                <p className="text-lg font-sans">Code</p>
                            </>
                        )}
                    </div>

                    {/* Complexity Analysis Button */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="text-lg font-sans text-gradient cursor-pointer glow">
                                Complexity
                            </button>
                        </DialogTrigger>
                        <DialogTitle className='hidden'>Time Complexity</DialogTitle>
                        <DialogContent className="sm:max-w-[425px] bg-popover">
                            <ComplexityCard />
                        </DialogContent>
                    </Dialog>

                    {/* Running Icon */}
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
                        // Copy Button
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
                    {/* Ask AI Button */}
                    <button
                        onClick={handleAIAssist}
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
            <div className="w-full p-4 relative h-[calc(100%-80px)] overflow-auto scrollbar-custom">
                <div className='space-y-3 mb-4'>
                    <p className='font-bold text-lg'>Input</p>
                    <textarea
                        className='w-full bg-accent font-mono h-fit scrollbar-custom min-h-16 max-h-68 p-3 rounded-lg outline-none'
                        spellCheck="false"
                        name=""
                        id=""
                        rows={2}
                        onChange={(e) => handleInput(e.target.value)}
                        style={{ fontSize: fontSizeValue }}
                    >
                    </textarea>
                </div>

                {content && (
                    <div className={`w-full h-full gap-2 ${error ? 'text-destructive' : 'text-foreground'}`}>
                        <pre className="whitespace-pre-wrap" style={{ fontSize: fontSizeValue }}>
                            {content}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OutputPanel
