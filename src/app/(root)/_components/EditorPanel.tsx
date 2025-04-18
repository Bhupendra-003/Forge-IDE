"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useEffect, useState } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import { Editor } from "@monaco-editor/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { RotateCcwIcon, ShareIcon, TypeIcon } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import ShareSnippetDialog from "./ShareSnippetDialog";
import useMounted from "@/hooks/useMounted";
import EditorPanelSkeleton from "./EditorPanelSkeleton";

function EditorPanel() {
    const clerk = useClerk();
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const { language, theme, fontSize, editor, setFontSize, setEditor } = useCodeEditorStore();

    const mounted = useMounted();

    useEffect(() => {
        const savedCode = localStorage.getItem(`editor-code-${language}`);
        const newCode = savedCode || LANGUAGE_CONFIG[language].defaultCode;
        if (editor) editor.setValue(newCode);
    }, [language, editor]);

    useEffect(() => {
        const savedFontSize = localStorage.getItem("editor-font-size");
        if (savedFontSize) setFontSize(parseInt(savedFontSize));
    }, [setFontSize]);

    const handleEditorChange = (value: string | undefined) => {
        if (value) localStorage.setItem(`editor-code-${language}`, value);
    };

    const handleFontSizeChange = (newSize: number) => {
        const size = Math.min(Math.max(newSize, 12), 24);
        setFontSize(size);
        localStorage.setItem("editor-font-size", size.toString());
    };

    if (!mounted) return null;

    return (
        <div className="relative">
                <div className="overflow-hidden">
                    {clerk.loaded && (
                        <Editor
                            height="600px"
                            language={LANGUAGE_CONFIG[language].monacoLanguage}
                            onChange={handleEditorChange}
                            theme={theme}
                            beforeMount={defineMonacoThemes}
                            onMount={(editor) => setEditor(editor)}
                            options={{
                                minimap: { enabled: false },
                                fontSize,
                                automaticLayout: true,
                                scrollBeyondLastLine: false,
                                padding: { top: 16, bottom: 16 },
                                renderWhitespace: "selection",
                                fontFamily: '"Fira Code", "Cascadia Code", "Consolas", "monospace"',
                                fontLigatures: true,
                                cursorBlinking: "smooth",
                                smoothScrolling: true,
                                contextmenu: true,
                                renderLineHighlight: "all",
                                lineHeight: 1.6,
                                letterSpacing: 0.5,
                                roundedSelection: true,
                                scrollbar: {
                                    verticalScrollbarSize: 8,
                                    horizontalScrollbarSize: 8,
                                },
                            }}
                        />
                    )}

                    {!clerk.loaded && <EditorPanelSkeleton />}
                </div>
            </div>
    );
}
export default EditorPanel;