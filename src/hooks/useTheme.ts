"use client";
import { useEffect, useState } from "react";

const useTheme = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const checkTheme = () => {
            const stored = localStorage.getItem("theme");
            const isDark =
                stored === "dark" ||
                (!stored && document.documentElement.classList.contains("dark"));
            setIsDarkMode(isDark);
        };

        checkTheme();

        const observer = new MutationObserver(() => {
            checkTheme();
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    return { isDarkMode }; // 🔥 Return the state
};

export default useTheme;