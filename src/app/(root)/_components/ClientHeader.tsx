"use client";
import React from 'react';
import { MoreVertical } from "lucide-react";
import { LuShare2 } from "react-icons/lu";
import { SidebarTrigger } from '../../../components/ui/sidebar';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import HeaderProfileBtn from './HeaderProfileBtn';
import ThemeSelector from './ThemeSelector';
import LanguageSelector from './LanguageSelector';
import RunButton from './RunButton';
import { LuSun } from "react-icons/lu";
import ThemeProvider from './ThemeProvider';

function ClientHeader() {
    // We'll use a simplified version without server-side data
    // In a real app, you would fetch user data client-side or use a context provider
    const isPro = false;

    return (
        <nav className="relative flex items-end px-4 p-2 justify-between bg-background text-foreground">
            {/* Left section */}
            <div className="flex items-center space-x-2">
                <SidebarTrigger className="-ml-1 scale-160" size="lg" />
                <div className="flex items-center border-l border-zinc-700 pl-2 ml-1">
                    <span className="text-2xl font-semibold text-foreground">Devine</span>
                </div>
            </div>

            {/* Middle section - Search */}
            <div className="ml-[25vw]">
                <RunButton />
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                    <LanguageSelector />
                    <ThemeSelector />
                </div>
                {!isPro && (
                    <Link
                        href="/pricing"
                        className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-purple-500/20 hover:border-purple-500/40 bg-gradient-to-r from-purple-500/10
                to-purple-500/10 hover:from-purple-500/20 hover:to-purple-500/20
                transition-all duration-300"
                    >
                        <Sparkles className="w-4 h-4 text-purple-500 hover:text-purple-300" />
                        <span className="text-sm font-medium text-purple-500/90 ">
                            Pro
                        </span>
                    </Link>
                )}
                <ThemeProvider>
                    <div className="p-2 bg-muted hover:bg-muted/50 rounded-full">
                        <LuSun size={18} />
                    </div>
                </ThemeProvider>
                <div className="p-2 bg-muted hover:bg-muted/50 rounded-full">
                    <LuShare2 size={18} />
                </div>
                <div className="p-2 bg-muted hover:bg-muted/50 rounded-full">
                    <MoreVertical size={18} />
                </div>
                <HeaderProfileBtn />
            </div>
        </nav>
    );
}

export default ClientHeader;
