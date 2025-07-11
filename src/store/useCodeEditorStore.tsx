import { create } from "zustand";
import { CodeEditorState } from "../types/index";
import * as monaco from "monaco-editor";
import { LANGUAGE_CONFIG } from "@/app/(root)/_constants";


const getInitialState = () => {
    //if we are on the server, return values
    if (typeof window === 'undefined') {
        return {
            language: 'javascript',
            fontSize: 22,
            theme: 'vs-dark',
        }
    }
    const savedLanguage = localStorage.getItem('editor-language') || 'javascript';
    const savedFontSize = localStorage.getItem('editor-fontSize') || '22';
    const savedTheme = localStorage.getItem('editor-theme') || 'vs-dark';
    return {
        language: savedLanguage,
        fontSize: Number(savedFontSize),
        theme: savedTheme,
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
            set({ theme });
        },

        setFontSize: (fontSize: number) => {
            localStorage.setItem("editor-font-size", fontSize.toString());
            set({ fontSize });
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
                set({ error: "Please enter some code" })
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
                set({ error: "Error running code", executionResult: {code, output: "", error: "Error running code"} })
            } finally {
                set({ isRunning: false })
            }
        }
    }
})