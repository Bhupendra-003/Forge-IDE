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
import useTheme from "@/hooks/useTheme";

const THEME_ICONS: Record<string, string> = {
    "vs-dark" : "#2d2d2d",
    "vs-light" : "#f3f3f3",
    "github-dark" : "#24292e",
    "monokai" : "#3e3d32",
    "solarized-dark" : "#6C850A",
    "andromeda" : "#F66061",
    "dracula" : "#854C74",
    "nord" : "#637A92",

}

function ThemeSelector() {
    const { isDarkMode } = useTheme();
    const { theme, setTheme } = useCodeEditorStore();

    const handleSelectChange = (themeId: string) => {
        setTheme(themeId);
        console.log("Theme changed to: " + themeId);
    };

    const filteredThemes = THEMES.filter((themeItem) => {
        if (isDarkMode) {
            return themeItem.light === false;
        }
        return themeItem.light === true;
    });

    // Ensure the current theme is valid for the current mode
    const isCurrentThemeValid = filteredThemes.some(t => t.id === theme);
    const displayTheme = isCurrentThemeValid ? theme : (isDarkMode ? "vs-dark" : "vs-light");

    // Auto-switch theme when dark/light mode changes, but only if using default themes
    React.useEffect(() => {
        const isUsingDefaultTheme = theme === "vs-dark" || theme === "vs-light";
        if (isUsingDefaultTheme) {
            const newTheme = isDarkMode ? "vs-dark" : "vs-light";
            if (theme !== newTheme) {
                setTheme(newTheme);
            }
        }
    }, [isDarkMode, theme, setTheme]);
    return (
        <div>
            <Select value={displayTheme} onValueChange={handleSelectChange}>
                <SelectTrigger className="w-[180px] border">
                    <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                    {filteredThemes.map((themeItem) => (
                        <SelectItem key={themeItem.id} value={themeItem.id}>
                            <div style={{ backgroundColor: THEME_ICONS[themeItem.id as keyof typeof THEME_ICONS] }} className="w-2 h-2 rounded-full mr-2" />
                            {themeItem.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default ThemeSelector
