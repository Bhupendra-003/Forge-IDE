"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useEffect, useState } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import { Editor } from "@monaco-editor/react";
import { useClerk } from "@clerk/nextjs";
import useMounted from "@/hooks/useMounted";
import { EditorPanelSkeleton } from "@/components/EditorPanelSkeleton";
import useTheme from "@/hooks/useTheme";
import { motion, AnimatePresence } from "framer-motion";

function EditorPanel() {
    const clerk = useClerk();
    const { isDarkMode } = useTheme();
    const [isLoading, setIsLoading] = useState(true);

    const {
        language,
        theme,
        editorTheme,
        setEditorTheme,
        fontSize,
        fontWeight,
        editor,
        setFontSize,
        setEditor,
        minimap,
        scrollBeyondLastLine,
        fontFamily,
        fontLigatures,
        cursorBlinking,
        smoothScrolling,
        contextmenu,
        lineHeight,
        letterSpacing,
        roundedSelection,
    } = useCodeEditorStore();

    const mounted = useMounted();

    useEffect(() => {
        const savedCode = localStorage.getItem(`editor-code-${language}`);
        const newCode = savedCode || LANGUAGE_CONFIG[language].defaultCode;
        if (editor) editor.setValue(newCode);
    }, [language, editor]);

    useEffect(() => {
        const savedFontSize = localStorage.getItem("editor-fontSize");
        if (savedFontSize) setFontSize(parseInt(savedFontSize));
    }, [setFontSize]);

    useEffect(() => {
        if (theme === "vs-dark" || theme === "vs-light") {
            setEditorTheme(isDarkMode ? "vs-dark" : "vs-light");
        }
    }, [isDarkMode, theme, setEditorTheme]);

    const handleEditorChange = (value: string | undefined) => {
        if (value) localStorage.setItem(`editor-code-${language}`, value);
    };

    if (!mounted) return null;

    return (
        <div className="relative h-full">
            <div className="overflow-hidden h-full">
                {clerk.loaded && (
                    <Editor
                        height="100%"
                        language={LANGUAGE_CONFIG[language].monacoLanguage}
                        onChange={handleEditorChange}
                        theme={editorTheme}
                        loading={null}
                        beforeMount={defineMonacoThemes}
                        onMount={(editor) => {
                            setEditor(editor);
                            setIsLoading(false);
                        }}
                        options={{
                            minimap: { enabled: minimap },
                            fontSize,
                            fontWeight: fontWeight.toString(),
                            lineNumbersMinChars: 3,
                            scrollBeyondLastLine,
                            padding: { top: 10, bottom: 0 },
                            fontFamily,
                            fontLigatures,
                            automaticLayout: true,
                            cursorBlinking,
                            smoothScrolling,
                            contextmenu,
                            lineHeight,
                            letterSpacing,
                            roundedSelection,
                            mouseWheelZoom: true,
                            scrollbar: {
                                verticalScrollbarSize: 0,
                                horizontalScrollbarSize: 0,
                            },
                        }}
                    />
                )}

                <AnimatePresence>
                    {(!clerk.loaded || isLoading) && (
                        <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0"
                        >
                            <EditorPanelSkeleton />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default EditorPanel;
