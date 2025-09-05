"use client";
import React, { useState, useEffect } from 'react';
import { SidebarTrigger } from '../../../components/ui/sidebar';
import ThemeSelector from './ThemeSelector';
import LanguageSelector from './LanguageSelector';
import RunButton from './RunButton';
import CheckpointButton from './CheckpointButton';
import { LuSun } from "react-icons/lu";
import ThemeProvider from './ThemeProvider';
import { Settings as SettingsIcon, Star } from 'lucide-react';
import Link from 'next/link';
import Settings from './Settings';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';
import { cn } from '@/lib/utils';

function ClientHeader() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={cn(
            "sticky top-0 z-50 flex items-center px-4 py-1.5 justify-between bg-background/95 backdrop-blur-sm border-b border-border/40",
            isScrolled ? "shadow-sm" : ""
        )}>
            {/* Left section for mobile */}
            <div className="flex md:hidden items-center text-foreground">
                <SidebarTrigger
                    className="-ml-1"
                    size="lg"
                />
                <div className="relative h-9 w-10 rounded-lg overflow-hidden ml-1">
                    <Image
                        src="/logo-nobg.png"
                        width={40}
                        height={40}
                        alt="Logo"
                        className="object-contain"
                    />
                </div>
            </div>

            {/* Left Sectiopon for Desktop */}
            <div className="hidden md:flex items-center text-foreground">
                <SidebarTrigger
                    className="-ml-1"
                    size="lg"
                />
                <div className="relative h-9 w-10 rounded-lg overflow-hidden ml-1">
                    <Image
                        src="/logo-nobg.png"
                        width={40}
                        height={40}
                        alt="Logo"
                        className="object-contain"
                    />
                </div>
                <p className='font-semibold text-2xl font-sans ml-2'>Forge</p>
                <p className='relative ml-1 -top-1 font-semibold text-sm font-sans'>IDE</p>
            </div>

            {/* Middle section - Code Controls */}
            <div className="flex items-center gap-2">
                <CheckpointButton />
                <RunButton />
                <LanguageSelector />
            </div>
            {/* Right section */}
            <div className="flex items-center gap-2">
                {/* Settings button */}
                <div className="flex items-center gap-2">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button
                                className="flex p-2 hover:bg-muted/80 rounded-full cursor-pointer items-center justify-center"
                            >
                                <SettingsIcon size={18} strokeWidth={1.5} />
                            </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[900px] bg-popover border-border/40">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">
                                    Settings
                                </DialogTitle>
                                <DialogDescription className="text-muted-foreground">
                                    Tweak the Code Editor Settings here.
                                </DialogDescription>
                            </DialogHeader>
                            <Settings />
                            <DialogFooter>
                                <p className="text-sm text-muted-foreground">The changes are automatically saved.</p>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <div className="hidden md:flex"><ThemeSelector /></div>
                </div>

                <ThemeProvider>
                    <button className="p-2 hover:bg-muted/80 rounded-full">
                        <LuSun size={16} />
                    </button>
                </ThemeProvider>

                {/* Github Page Button */}
                <Link
                    href="https://github.com/Bhupendra-003/Forge-IDE"
                    target="_blank"
                    rel="noopener noreferrer">
                    <FaGithub size={16} className="text-foreground" />
                </Link>
                <Link
                    href="https://github.com/Bhupendra-003/Forge-IDE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:flex items-center gap-1.5 bg-card hover:bg-sidebar-accent rounded-full h-9 px-3.5 py-2 cursor-pointer transition-all duration-200 hover:scale-102 active:scale-98"
                >
                    <Star size={16} strokeWidth={1.8} className="text-foreground" />
                    <span className="text-sm font-medium ml-0.5">Star</span>
                    <div className="w-px h-4 bg-border mx-1.5" />
                    <FaGithub size={16} className="text-foreground" />
                </Link>
            </div>
        </nav>
    );
}

export default React.memo(ClientHeader);
