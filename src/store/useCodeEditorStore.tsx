import { create } from "zustand";
import { CodeEditorState } from "../types/index";
import * as monaco from "monaco-editor";
import { LANGUAGE_CONFIG } from "@/app/(root)/_constants";


const getInitialState = () => {
    //if we are on the server, return values
    if (typeof window === 'undefined') {
        return {
            language: 'python',
            fontSize: 22,
            fontWeight: 500,
            theme: 'vs-dark',
            editorTheme: 'vs-dark',
            minimap: false,
            scrollBeyondLastLine: true,
            fontFamily: '"Fira Code", "Cascadia Code", "Consolas", "monospace"',
            fontLigatures: true,
            cursorBlinking: 'smooth' as const,
            smoothScrolling: true,
            contextmenu: true,
            lineHeight: 1.6,
            letterSpacing: 0.5,
            roundedSelection: true,
            verticalScrollbarSize: 16,
            horizontalScrollbarSize: 16,
        }
    }
    const savedLanguage = localStorage.getItem('editor-language') || 'python';
    const savedFontSize = localStorage.getItem('editor-fontSize') || '22';
    const savedFontWeight = localStorage.getItem('editor-fontWeight') || 500;
    const savedTheme = localStorage.getItem('editor-theme') || 'vs-dark';
    const savedEditorTheme = localStorage.getItem('editor-theme') || 'vs-dark';
    const savedMinimap = localStorage.getItem('editor-minimap') === 'true';
    const savedScrollBeyondLastLine = localStorage.getItem('editor-scrollBeyondLastLine') !== 'false';
    const savedFontFamily = localStorage.getItem('editor-fontFamily') || '"Fira Code", "Cascadia Code", "Consolas", "monospace"';
    const savedFontLigatures = localStorage.getItem('editor-fontLigatures') !== 'false';
    const savedCursorBlinking = (localStorage.getItem('editor-cursorBlinking') || 'smooth') as "blink" | "smooth" | "phase" | "expand" | "solid";
    const savedSmoothScrolling = localStorage.getItem('editor-smoothScrolling') !== 'false';
    const savedContextmenu = localStorage.getItem('editor-contextmenu') !== 'false';
    const savedLineHeight = Number(localStorage.getItem('editor-lineHeight')) || 1.6;
    const savedLetterSpacing = Number(localStorage.getItem('editor-letterSpacing')) || 0.5;
    const savedRoundedSelection = localStorage.getItem('editor-roundedSelection') !== 'false';

    return {
        language: savedLanguage,
        fontSize: Number(savedFontSize),
        fontWeight: Number(savedFontWeight),
        theme: savedTheme,
        editorTheme: savedEditorTheme,
        minimap: savedMinimap,
        scrollBeyondLastLine: savedScrollBeyondLastLine,
        fontFamily: savedFontFamily,
        fontLigatures: savedFontLigatures,
        cursorBlinking: savedCursorBlinking,
        smoothScrolling: savedSmoothScrolling,
        contextmenu: savedContextmenu,
        lineHeight: savedLineHeight,
        letterSpacing: savedLetterSpacing,
        roundedSelection: savedRoundedSelection,

    }
}

export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
    const initialState = getInitialState();
    return {
        ...initialState,
        output: '',
        isRunning: false,
        error: null,
        editor: null as monaco.editor.IStandaloneCodeEditor | null,
        executionResult: null,
        currentFile: typeof window !== 'undefined' ? localStorage.getItem('editor-current-file') : null,
        input: '',

        getCode: () => get().editor?.getValue() || '',

        setEditor: (editor: monaco.editor.IStandaloneCodeEditor) => {
            const savedCode = localStorage.getItem('editor-code-' + get().language) || '';
            if (savedCode) {
                editor.setValue(savedCode);
            }
            set({ editor });
        },

        setTheme: (theme: string) => {
            localStorage.setItem("editor-theme", theme);
            set({ theme, editorTheme: theme });
        },

        setEditorTheme: (editorTheme: string) => {
            set({ editorTheme });
        },

        setFontSize: (fontSize: number) => {
            localStorage.setItem("editor-fontSize", fontSize.toString());
            set({ fontSize });
        },
        
        setFontWeight: (fontWeight: number) => {
            localStorage.setItem("editor-fontWeight", fontWeight.toString());
            set({ fontWeight });
        },

        setCurrentFile: (fileName: string | null) => {
            if (typeof window !== 'undefined') {
                if (fileName) {
                    localStorage.setItem('editor-current-file', fileName);
                } else {
                    localStorage.removeItem('editor-current-file');
                }
            }
            set({ currentFile: fileName });
        },

        setLanguage: (language: string) => {
            // Save current language code before switching
            const currentCode = get().editor?.getValue();
            if (currentCode) {
                localStorage.setItem(`editor-code-${get().language}`, currentCode);
            }

            localStorage.setItem("editor-language", language);

            set({
                language,
                output: "",
                error: null,
            });
        },

        handleInput: (value: string) => {
            // setInput(e.target.value) // Remove local state update
            set({ input: value }); // Update Zustand store state
        },

        setMinimap: (minimap: boolean) => {
            localStorage.setItem("editor-minimap", minimap.toString());
            set({ minimap });
        },
        setScrollBeyondLastLine: (scrollBeyondLastLine: boolean) => {
            localStorage.setItem("editor-scrollBeyondLastLine", scrollBeyondLastLine.toString());
            set({ scrollBeyondLastLine });
        },
        setFontFamily: (fontFamily: string) => {
            localStorage.setItem("editor-fontFamily", fontFamily);
            set({ fontFamily });
        },
        setFontLigatures: (fontLigatures: boolean) => {
            localStorage.setItem("editor-fontLigatures", fontLigatures.toString());
            set({ fontLigatures });
        },
        setCursorBlinking: (cursorBlinking: "blink" | "smooth" | "phase" | "expand" | "solid") => {
            localStorage.setItem("editor-cursorBlinking", cursorBlinking);
            set({ cursorBlinking });
        },
        setSmoothScrolling: (smoothScrolling: boolean) => {
            localStorage.setItem("editor-smoothScrolling", smoothScrolling.toString());
            set({ smoothScrolling });
        },
        setContextmenu: (contextmenu: boolean) => {
            localStorage.setItem("editor-contextmenu", contextmenu.toString());
            set({ contextmenu });
        },
        setLineHeight: (lineHeight: number) => {
            localStorage.setItem("editor-lineHeight", lineHeight.toString());
            set({ lineHeight });
        },
        setLetterSpacing: (letterSpacing: number) => {
            localStorage.setItem("editor-letterSpacing", letterSpacing.toString());
            set({ letterSpacing });
        },
        setRoundedSelection: (roundedSelection: boolean) => {
            localStorage.setItem("editor-roundedSelection", roundedSelection.toString());
            set({ roundedSelection });
        },

        resetCode: () => {
            const { language, editor } = get();
            if (editor) {
                // Get default code for current language
                const defaultCode = LANGUAGE_CONFIG[language].defaultCode;

                // Set editor value to default code
                editor.setValue(defaultCode);

                // Remove saved code from localStorage
                localStorage.removeItem(`editor-code-${language}`);

                // Clear current file since we're resetting to default code
                localStorage.removeItem("editor-current-file");

                // Clear output and error
                set({
                    output: "",
                    error: null,
                    executionResult: null,
                    currentFile: null
                });
            }
        },

        runCode: async () => {
            const { language, getCode, input } = get();
            const code = getCode();
            if (!code) {
                set({ error: "Error: No code to run" })
                return;
            }

            set({ isRunning: true, error: null, output: "" })
            try {
                
                const runtime = LANGUAGE_CONFIG[language].pistonRuntime;
                const response = await fetch("https://emkc.org/api/v2/piston/execute", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        language: runtime.language,
                        version: runtime.version,
                        files: [{
                            content: code
                        }],
                        stdin: input
                    })
                })
                const data = await response.json();
                console.log("Data from piston", data)

                //Compile-time error
                if (data.compile && data.compile.code != 0) {
                    const error = data.compile.stderr || data.compile.output;
                    set({
                        error,
                        executionResult: {
                            code,
                            output: error,
                            error
                        }
                    })
                    return;
                }

                //Runtime error
                if (data.run && data.run.code != 0) {
                    const error = data.run.stderr || data.run.output;
                    set({
                        error,
                        executionResult: {
                            code,
                            output: error,
                            error
                        }
                    })
                    return;
                }

                //Execution success
                const output = data.run.stdout;
                set({
                    output: output.trim(),
                    executionResult: {
                        code,
                        output: output.trim(),
                        error: null
                    }
                })
            } catch (error) {
                console.log("Error running code", error)
                set({ error: "Error: Error running code, Please try again", executionResult: {code, output: "", error: "Error: Error running code, Please try again"} })
            } finally {
                set({ isRunning: false })
            }
        }
    }
})