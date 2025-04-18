import { create } from "zustand";
import { CodeEditorState } from "../types/index";
import * as monaco from "monaco-editor";
import { Theme } from "@monaco-editor/react";

const getInitialState = () => {
    //if we are on the server, return values
    if (typeof window === 'undefined') {
        return {
            language: 'javascript',
            fontSize: 14,
            theme: 'vs-dark',
        }
    }
    const savedLanguage = localStorage.getItem('editor-language') || 'javascript';
    const savedFontSize = localStorage.getItem('editor-fontSize') || '14';
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
    }
})