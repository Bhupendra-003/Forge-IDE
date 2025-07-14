"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useEffect } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import { Editor } from "@monaco-editor/react";
import { useClerk } from "@clerk/nextjs";
import useMounted from "@/hooks/useMounted";
import { EditorPanelSkeleton } from "@/components/EditorPanelSkeleton";

function EditorPanel() {
    const clerk = useClerk();
    const {
        language,
        theme,
        fontSize,
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
        verticalScrollbarSize,
        horizontalScrollbarSize
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
                            theme={theme}
                            beforeMount={defineMonacoThemes}
                            onMount={(editor) => setEditor(editor)}
                            options={{
                                minimap: { enabled: minimap },
                                fontSize,
                                lineNumbersMinChars: 2,
                                scrollBeyondLastLine,
                                padding: { top: 10, bottom: 0 },
                                fontFamily,
                                fontLigatures,
                                cursorBlinking,
                                smoothScrolling,
                                contextmenu,
                                lineHeight,
                                letterSpacing,
                                roundedSelection,
                                scrollbar: {
                                    verticalScrollbarSize,
                                    horizontalScrollbarSize,
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