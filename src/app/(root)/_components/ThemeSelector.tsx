"use client";
import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { THEMES } from '../_constants';

const THEME_ICONS: Record<string, string> = {
    "vs-dark" : "#2d2d2d",
    "vs-light" : "#f3f3f3",
    "github-dark" : "#24292e",
    "monokai" : "#3e3d32",
    "solarized-dark" : "#002b36"
}

function ThemeSelector() {
    const { theme, setTheme } = useCodeEditorStore();
    const handleSelectChange = (themeId: string) => {
        setTheme(themeId);
        console.log("Theme changed to: " + themeId);
    };
    return (
        <div>
            <Select value={theme} onValueChange={handleSelectChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                    {THEMES.map((theme) => (
                        <SelectItem key={theme.id} value={theme.id}>
                            <div style={{ backgroundColor: THEME_ICONS[theme.id as keyof typeof THEME_ICONS] }} className="w-2 h-2 rounded-full mr-2" />
                            {theme.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default ThemeSelector
