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

    // Font size change handler - used by Settings component
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleFontSizeChange = (newSize: number) => {
        const size = Math.min(Math.max(newSize, 12), 24);
        setFontSize(size);
        localStorage.setItem("editor-font-size", size.toString());
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
                                minimap: { enabled: false },
                                fontSize,
                                lineNumbersMinChars: 2,
                                glyphMargin: false,
                                automaticLayout: true,
                                scrollBeyondLastLine: false,
                                padding: { top: 10, bottom: 0 },
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