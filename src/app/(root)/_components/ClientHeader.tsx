"use client";
import React from 'react';
// import { MoreVertical } from "lucide-react";
// import { LuShare2 } from "react-icons/lu";
import { SidebarTrigger } from '../../../components/ui/sidebar';
// import Link from 'next/link';
// import { Sparkles } from 'lucide-react';
// import HeaderProfileBtn from './HeaderProfileBtn';
import ThemeSelector from './ThemeSelector';
import LanguageSelector from './LanguageSelector';
import RunButton from './RunButton';
import CheckpointButton from './CheckpointButton';
import { LuSun } from "react-icons/lu";
import ThemeProvider from './ThemeProvider';
import { Settings as SettingsIcon, Star } from 'lucide-react';
import Link from 'next/link';
import Settings from './Settings';
// Dialog Imports
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Image from 'next/image';
import { FaGithub } from 'react-icons/fa';


function ClientHeader() {
    // We'll use a simplified version without server-side data
    // In a real app, you would fetch user data client-side or use a context provider
    // const isPro = false;
    return (
        <nav className="relative flex items-center px-4 p-2 justify-between bg-background text-foreground">
            {/* Left section */}
            <div className="flex items-center text-foreground">
                <SidebarTrigger className="-ml-1 scale-160" size="lg" />
                <div className="relative h-10 rounded-lg pl-2 ml-1 overflow-hidden">
                    <Image
                        src="/logo-nobg.png"
                        width={50}
                        height={50}
                        alt="Logo"
                        className="relative top-1/2 left-[1vw] -translate-x-1/2 -translate-y-1/2"
                    />
                </div>
                <p className='font-semibold text-2xl font-sans'>Forge</p>
                <p className='relative ml-1 -top-1 font-semibold text-sm font-sans'>IDE</p>
            </div>

            {/* Middle section - Code Controls */}
            <div className="ml-[10vw] flex items-center gap-3">
                <CheckpointButton />
                <RunButton />
                <LanguageSelector />
            </div>
            {/* Right section */}
            <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                    <Dialog>
                        <form className=' hidden lg:block '>
                            <DialogTrigger asChild>
                                <div className='p-2 bg-muted hover:bg-muted/50 rounded-full cursor-pointer inline-flex items-center justify-center'>
                                    <SettingsIcon size={20} strokeWidth={1.35} />
                                </div>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[900px] bg-popover">
                                <DialogHeader>
                                    <DialogTitle>
                                        Settings
                                    </DialogTitle>
                                    <DialogDescription>
                                        Tweak the Code Editor Settings here.
                                    </DialogDescription>
                                </DialogHeader>
                                <Settings />
                                <DialogFooter>
                                    <p>The changes are automatically saved.</p>
                                </DialogFooter>
                            </DialogContent>
                        </form>
                    </Dialog>
                    <ThemeSelector />
                </div>
                <ThemeProvider>
                    <div className="p-2 bg-muted hover:bg-muted/50 rounded-full">
                        <LuSun size={18} />
                    </div>
                </ThemeProvider>

                {/* Github Page Button */}
                <div>
                    <Link className="flex justify-around items-center hover:bg-sidebar-accent bg-card rounded-full w-32 h-9 px-4 py-2 cursor-pointer" href="https://github.com/Bhupendra-003/Forge-IDE" target="_blank">
                        <Star size={18} strokeWidth={1.60} className="text-foreground hover:text-accent/80" />
                        <p className="text-foreground text-md mt-0.5 ml-1">Star</p>
                        <div className="ml-2">
                            <FaGithub size={18} className="text-foreground hover:text-muted-foreground/80" />
                        </div>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default ClientHeader;
    