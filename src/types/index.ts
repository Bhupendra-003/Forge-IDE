import * as monaco from "monaco-editor";
import { Id } from "../../convex/_generated/dataModel";

export interface Theme {
    id: string;
    label: string;
    color: string;
}

export interface Language {
    id: string;
    label: string;
    logoPath: string;
    monacoLanguage: string;
    defaultCode: string;
    pistonRuntime: LanguageRuntime;
}

export interface LanguageRuntime {
    language: string;
    version: string;
}

export interface ExecuteCodeResponse {
    compile?: {
        output: string;
    };
    run?: {
        output: string;
        stderr: string;
    };
}

export interface ExecutionResult {
    code: string;
    output: string;
    error: string | null;
}

export interface Checkpoint {
    id: string;
    name: string;
    code: string;
    language: string;
    timestamp: number;
    emoji: string;
}

export interface CheckpointState {
    checkpoints: Checkpoint[];
    isCreating: boolean;
    isHydrated: boolean;

    hydrate: () => void;
    createCheckpoint: (name: string, code: string, language: string) => void;
    loadCheckpoint: (id: string) => void;
    renameCheckpoint: (id: string, newName: string) => void;
    deleteCheckpoint: (id: string) => void;
    downloadCheckpoint: (id: string) => void;
    getCheckpoint: (id: string) => Checkpoint | undefined;
}

export interface CodeEditorState {
    language: string;
    output: string;
    isRunning: boolean;
    error: string | null;
    theme: string;
    fontSize: number;
    fontWeight: number;
    editor: monaco.editor.IStandaloneCodeEditor | null;
    executionResult: ExecutionResult | null;
    currentFile: string | null;
    input: string | null;
    minimap: boolean;
    scrollBeyondLastLine: boolean;
    fontFamily: string;
    fontLigatures: boolean;
    cursorBlinking: "blink" | "smooth" | "phase" | "expand" | "solid";
    smoothScrolling: boolean;
    contextmenu: boolean;
    lineHeight: number;
    letterSpacing: number;
    roundedSelection: boolean;

    setEditor: (editor: monaco.editor.IStandaloneCodeEditor) => void;
    getCode: () => string;
    setLanguage: (language: string) => void;
    setTheme: (theme: string) => void;
    setFontSize: (fontSize: number) => void;
    setFontWeight: (fontWeight: number) => void;
    setCurrentFile: (fileName: string | null) => void;
    runCode: () => Promise<void>;
    resetCode: () => void;
    handleInput: (value: string) => void;
    setMinimap: (minimap: boolean) => void;
    setScrollBeyondLastLine: (scrollBeyondLastLine: boolean) => void;
    setFontFamily: (fontFamily: string) => void;
    setFontLigatures: (fontLigatures: boolean) => void;
    setCursorBlinking: (cursorBlinking: "blink" | "smooth" | "phase" | "expand" | "solid") => void;
    setSmoothScrolling: (smoothScrolling: boolean) => void;
    setContextmenu: (contextmenu: boolean) => void;
    setLineHeight: (lineHeight: number) => void;
    setLetterSpacing: (letterSpacing: number) => void;
    setRoundedSelection: (roundedSelection: boolean) => void;
}

export interface Snippet {
    _id: Id<"snippets">;
    _creationTime: number;
    userId: string;
    language: string;
    code: string;
    title: string;
    userName: string;
}