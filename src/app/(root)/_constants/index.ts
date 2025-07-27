import { Monaco } from "@monaco-editor/react";
import { Theme } from "../../../types";
import { editor } from "monaco-editor";
type LanguageConfig = Record<
    string,
    {
        id: string;
        label: string;
        logoPath: string;
        pistonRuntime: { language: string; version: string };
        monacoLanguage: string;
        defaultCode: string;
    }
>;

export const LANGUAGE_CONFIG: LanguageConfig = {
    javascript: {
        id: "javascript",
        label: "JavaScript",
        logoPath: "/javascript.png",
        pistonRuntime: { language: "javascript", version: "18.15.0" },
        monacoLanguage: "javascript",
        defaultCode: `// JavaScript Playground
console.log("Hello Forge");`,
    },
    typescript: {
        id: "typescript",
        label: "TypeScript",
        logoPath: "/typescript.png",
        pistonRuntime: { language: "typescript", version: "5.0.3" },
        monacoLanguage: "typescript",
        defaultCode: `// TypeScript Playground
console.log("Hello Forge");`,
    },
    python: {
        id: "python",
        label: "Python",
        logoPath: "/python.png",
        pistonRuntime: { language: "python", version: "3.10.0" },
        monacoLanguage: "python",
        defaultCode: `# Python Playground
print("Hello Forge")`,
    },
    java: {
        id: "java",
        label: "Java",
        logoPath: "/java.png",
        pistonRuntime: { language: "java", version: "15.0.2" },
        monacoLanguage: "java",
        defaultCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello Forge");
    }
}`,
    },
    go: {
        id: "go",
        label: "Go",
        logoPath: "/go.png",
        pistonRuntime: { language: "go", version: "1.16.2" },
        monacoLanguage: "go",
        defaultCode: `package main

import "fmt"

func main() {
    fmt.Println("Hello Forge")
}`,
    },
    rust: {
        id: "rust",
        label: "Rust",
        logoPath: "/rust.png",
        pistonRuntime: { language: "rust", version: "1.68.2" },
        monacoLanguage: "rust",
        defaultCode: `fn main() {
    println!("Hello Forge");
}`,
    },
    cpp: {
        id: "cpp",
        label: "C++",
        logoPath: "/cpp.png",
        pistonRuntime: { language: "cpp", version: "10.2.0" },
        monacoLanguage: "cpp",
        defaultCode: `#include <iostream>

int main() {
    std::cout << "Hello Forge" << std::endl;
    return 0;
}`,
    },
    csharp: {
        id: "csharp",
        label: "C#",
        logoPath: "/csharp.png",
        pistonRuntime: { language: "csharp", version: "6.12.0" },
        monacoLanguage: "csharp",
        defaultCode: `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello Forge");
    }
}`,
    },
    ruby: {
        id: "ruby",
        label: "Ruby",
        logoPath: "/ruby.png",
        pistonRuntime: { language: "ruby", version: "3.0.1" },
        monacoLanguage: "ruby",
        defaultCode: `puts "Hello Forge"`,
    },
    swift: {
        id: "swift",
        label: "Swift",
        logoPath: "/swift.png",
        pistonRuntime: { language: "swift", version: "5.3.3" },
        monacoLanguage: "swift",
        defaultCode: `print("Hello Forge")`,
    },
};


export const THEMES: Theme[] = [
    { id: "vs-dark", label: "VS Dark", color: "#1e1e1e" },
    { id: "vs-light", label: "VS Light", color: "#ffffff" },
    { id: "github-dark", label: "GitHub Dark", color: "#0d1117" },
    { id: "monokai", label: "Monokai", color: "#272822" },
    { id: "solarized-dark", label: "Solarized Dark", color: "#002b36" },
    { id: "andromeda", label: "Andromeda", color: "#262335" },
    { id: "dracula", label: "Dracula", color: "#282a36" },
    { id: "nord", label: "Nord", color: "#2e3440" },
];

export const THEME_DEFINITONS = {
    "github-dark": {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: "comment", foreground: "6e7681" },
            { token: "string", foreground: "a5d6ff" },
            { token: "keyword", foreground: "ff7b72" },
            { token: "number", foreground: "79c0ff" },
            { token: "type", foreground: "ffa657" },
            { token: "class", foreground: "ffa657" },
            { token: "function", foreground: "d2a8ff" },
            { token: "variable", foreground: "ffa657" },
            { token: "operator", foreground: "ff7b72" },
        ],
        colors: {
            "editor.background": "#0d1117",
            "editor.foreground": "#c9d1d9",
            "editor.lineHighlightBackground": "#161b22",
            "editorLineNumber.foreground": "#6e7681",
            "editorIndentGuide.background": "#21262d",
            "editor.selectionBackground": "#264f78",
            "editor.inactiveSelectionBackground": "#264f7855",
        },
    },
    monokai: {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: "comment", foreground: "75715E" },
            { token: "string", foreground: "E6DB74" },
            { token: "keyword", foreground: "F92672" },
            { token: "number", foreground: "AE81FF" },
            { token: "type", foreground: "66D9EF" },
            { token: "class", foreground: "A6E22E" },
            { token: "function", foreground: "A6E22E" },
            { token: "variable", foreground: "F8F8F2" },
            { token: "operator", foreground: "F92672" },
        ],
        colors: {
            "editor.background": "#18181B",
            "editor.foreground": "#F8F8F2",
            "editorLineNumber.foreground": "#75715E",
            "editor.selectionBackground": "#3e3d32",
            "editor.lineHighlightBackground": "#21201a",
            "editorCursor.foreground": "#F8F8F2",
            "editor.selectionHighlightBackground": "#49483E",
        },
    },
    "solarized-dark": {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: "comment", foreground: "586e75" },
            { token: "string", foreground: "2aa198" },
            { token: "keyword", foreground: "859900" },
            { token: "number", foreground: "d33682" },
            { token: "type", foreground: "b58900" },
            { token: "class", foreground: "b58900" },
            { token: "function", foreground: "268bd2" },
            { token: "variable", foreground: "b58900" },
            { token: "operator", foreground: "859900" },
        ],
        colors: {
            "editor.background": "#18181B",
            "editor.foreground": "#839496",
            "editorLineNumber.foreground": "#586e75",
            "editor.selectionBackground": "#073642",
            "editor.lineHighlightBackground": "#26262d",
            "editorCursor.foreground": "#839496",
            "editor.selectionHighlightBackground": "#073642",
        },
    },
    andromeda: {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: "comment", foreground: "5c6370" },
            { token: "string", foreground: "ecc48d" },
            { token: "keyword", foreground: "ff6363" },
            { token: "number", foreground: "f78c6c" },
            { token: "type", foreground: "82aaff" },
            { token: "class", foreground: "c792ea" },
            { token: "function", foreground: "82aaff" },
            { token: "variable", foreground: "f07178" },
            { token: "operator", foreground: "89ddff" },
        ],
        colors: {
            "editor.background": "#18181B",
            "editor.foreground": "#e6e6e6",
            "editorLineNumber.foreground": "#5c6370",
            "editor.selectionBackground": "#3c3c3c",
            "editor.lineHighlightBackground": "#26262d",
            "editorCursor.foreground": "#ffcc00",
            "editor.selectionHighlightBackground": "#3c3c3c",
        },
    },
    dracula: {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: "comment", foreground: "6272a4" },
            { token: "string", foreground: "f1fa8c" },
            { token: "keyword", foreground: "ff79c6" },
            { token: "number", foreground: "bd93f9" },
            { token: "type", foreground: "8be9fd" },
            { token: "class", foreground: "50fa7b" },
            { token: "function", foreground: "50fa7b" },
            { token: "variable", foreground: "f8f8f2" },
            { token: "operator", foreground: "ff79c6" },
        ],
        colors: {
            "editor.background": "#18181B",
            "editor.foreground": "#f8f8f2",
            "editorLineNumber.foreground": "#44475a",
            "editor.selectionBackground": "#44475a",
            "editor.lineHighlightBackground": "#27272A",
            "editorCursor.foreground": "#f8f8f2",
            "editor.selectionHighlightBackground": "#44475a",
        },
    },
    nord: {
        base: "vs-dark",
        inherit: true,
        rules: [
            { token: "comment", foreground: "616e88" },
            { token: "string", foreground: "a3be8c" },
            { token: "keyword", foreground: "81a1c1" },
            { token: "number", foreground: "b48ead" },
            { token: "type", foreground: "8fbcbb" },
            { token: "class", foreground: "88c0d0" },
            { token: "function", foreground: "88c0d0" },
            { token: "variable", foreground: "d8dee9" },
            { token: "operator", foreground: "81a1c1" },
        ],
        colors: {
            "editor.background": "#18181B",
            "editor.foreground": "#d8dee9",
            "editorLineNumber.foreground": "#4c566a",
            "editor.selectionBackground": "#434c5e",
            "editor.lineHighlightBackground": "#26262d",
            "editorCursor.foreground": "#d8dee9",
            "editor.selectionHighlightBackground": "#434c5e",
        },
    },
};

// Helper function to define themes in Monaco
export const defineMonacoThemes = (monaco: Monaco) => {
    Object.entries(THEME_DEFINITONS).forEach(([themeName, themeData]) => {
        monaco.editor.defineTheme(themeName, {
            base: themeData.base as editor.BuiltinTheme,
            inherit: themeData.inherit,
            rules: themeData.rules.map((rule) => ({
                ...rule,
                foreground: rule.foreground,
            })),
            colors: themeData.colors,
        });
    });
};