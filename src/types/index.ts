import * as monaco from "monaco-editor";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Monaco } from "@monaco-editor/react";
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
    editor: monaco.editor.IStandaloneCodeEditor | null;
    executionResult: ExecutionResult | null;
    currentFile: string | null;

    setEditor: (editor: monaco.editor.IStandaloneCodeEditor) => void;
    getCode: () => string;
    setLanguage: (language: string) => void;
    setTheme: (theme: string) => void;
    setFontSize: (fontSize: number) => void;
    setCurrentFile: (fileName: string | null) => void;
    runCode: () => Promise<void>;
    resetCode: () => void;
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