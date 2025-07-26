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
import { Button } from "@/components/ui/button"
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
import useTheme from '@/hooks/useTheme';
import { FaGithub } from 'react-icons/fa';


function ClientHeader() {
    // We'll use a simplified version without server-side data
    // In a real app, you would fetch user data client-side or use a context provider
    // const isPro = false;
    const {isDarkMode} = useTheme()
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
                        <form>
                            <DialogTrigger asChild>
                                <Button className='p-2 bg-muted hover:bg-muted/50 rounded-full' variant="ghost" size={"icon"}><SettingsIcon className='scale-130' strokeWidth={1.35} /></Button>
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
                {/* {!isPro && (
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
                )} */}
                <ThemeProvider>
                    <div className="p-2 bg-muted hover:bg-muted/50 rounded-full">
                        <LuSun size={18} />
                    </div>
                </ThemeProvider>

                {/* Github Page Button */}
                <div>
                    <Button
                        className="hover:bg-sidebar-accent rounded-full w-32 bg-card"
                        size={"icon"}
                        asChild
                    >
                        <Link className="flex justify-around items-center" href="https://github.com/Bhupendra-003/Forge-IDE" target="_blank">
                            {/* <FaGithub color={isDarkMode ? 'black' : 'white'} className="text-muted-foreground scale-180 hover:text-muted-foreground/80" /> */}
                            <Star color={isDarkMode ? 'white' : 'black'} className="text-background scale-100 hover:text-accent/80" />
                            <p className="text-foreground text-md mt-0.5 ml-1">Star</p>
                            <div className="ml-2">
                                <FaGithub color={isDarkMode ? 'white' : 'black'} className="text-background scale-120 hover:text-muted-foreground/80" />
                            </div>
                        </Link>
                    </Button>   
                </div>
                {/* <HeaderProfileBtn /> */}
            </div>
        </nav>
    );
}

export default ClientHeader;
