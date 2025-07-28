"use client";
import { useEffect, useState } from "react";

// Helper function to determine theme that can be used for initial state
const getThemeState = (): boolean => {
    // Only run in browser environment
    if (typeof window === 'undefined' || typeof document === 'undefined') {
        return false; // Default for SSR
    }

    try {
        const stored = localStorage.getItem("theme");
        return stored === "dark" ||
               (!stored && document.documentElement.classList.contains("dark"));
    } catch {
        // Fallback in case localStorage is not available
        return document.documentElement.classList.contains("dark");
    }
};

const useTheme = () => {
    // Use the helper function for initial state to avoid flickering
    const [isDarkMode, setIsDarkMode] = useState(() => getThemeState());

    useEffect(() => {
        const checkTheme = () => {
            const isDark = getThemeState();
            setIsDarkMode(isDark);
        };

        // Set initial theme
        checkTheme();

        // Set up observer to detect theme changes
        const observer = new MutationObserver(() => {
            checkTheme();
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    return { isDarkMode };
};

export default useTheme;