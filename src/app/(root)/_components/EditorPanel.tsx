"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useEffect } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import { Editor } from "@monaco-editor/react";
import useMounted from "@/hooks/useMounted";
import useTheme from "@/hooks/useTheme";
import { Braces, RotateCcwSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import LanguageSelector from "./LanguageSelector";
import BrandLoading from "./BrandLoading";

function EditorPanel() {
    const { isDarkMode } = useTheme();
    const { resetCode } = useCodeEditorStore();

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
        <div className="relative w-full h-full flex flex-col overflow-hidden">
            {/* Editor Header  */}
            <div className="h-11 w-full bg-background-2 flex items-center justify-between px-3 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <Braces size={18} />
                    <p className="text-lg font-sans">Editor</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="md:hidden"><LanguageSelector /></div>
                    <Button
                        variant="ghost"
                        title="Reset code"
                        onClick={resetCode}
                        size="icon"
                    >
                        <RotateCcwSquare size={20} />
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <Editor
                    height="100%"
                    className="h-full"
                    language={LANGUAGE_CONFIG[language].monacoLanguage}
                    onChange={handleEditorChange}
                    theme={editorTheme}
                    // loading={null}
                    loading={<BrandLoading />}
                    beforeMount={defineMonacoThemes}
                    onMount={(editor) => {
                        setEditor(editor);
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
            </div>
        </div>
    );
}

export default EditorPanel;
