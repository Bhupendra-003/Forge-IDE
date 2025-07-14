"use client";
import { SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { User } from "lucide-react";
import { dark, neobrutalism } from '@clerk/themes';
import { useEffect, useState } from "react";

function HeaderProfileBtn() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check initial theme
        const checkTheme = () => {
            const stored = localStorage.getItem("theme");
            const isDark = stored === "dark" || (!stored && document.documentElement.classList.contains("dark"));
            setIsDarkMode(isDark);
        };

        checkTheme();

        // Listen for theme changes
        const observer = new MutationObserver(() => {
            checkTheme();
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <UserButton
            appearance={{
                baseTheme: isDarkMode ? dark : neobrutalism,
            }}
            >
            </UserButton>

            <SignedOut>
                <SignInButton mode="modal">
                    <button className="bg-white rounded hover:bg-gray-100 scale-90 text-black py-2 px-4 ">
                        Sign In
                    </button>
                </SignInButton>
            </SignedOut>
        </>
    );
}
export default HeaderProfileBtn;