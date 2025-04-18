import React from 'react'
import { MoreVertical, Search } from "lucide-react";
import { LuShare2 } from "react-icons/lu";
import { GiExpand } from "react-icons/gi";
import { SidebarTrigger } from '../../../components/ui/sidebar';
import { ConvexHttpClient } from 'convex/browser';
import { currentUser } from '@clerk/nextjs/server';
import { api } from '../../../../convex/_generated/api';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import HeaderProfileBtn from './HeaderProfileBtn';
import ThemeSelector from './ThemeSelector';
import LanguageSelector from './LanguageSelector';

async function Header() {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const user = await currentUser()

    const convexUser = await convex.query(api.users.getUser, {
        userId: user?.id!,
    });

    console.log({ convexUser })

    return (
        <nav className="relative flex items-end px-4 p-2 justify-between bg-background text-gray-200">
            {/* Left section */}
            <div className="flex items-center space-x-2">
                <SidebarTrigger className="-ml-1 scale-160" size="lg" />
                <div className="flex items-center border-l border-zinc-700 pl-2 ml-1">
                    <span className="text-2xl font-semibold">Devine</span>
                </div>
            </div>

            {/* Middle section - Search */}
            <div className="absolute mx-auto left-[50%] -translate-x-1/2 flex justify-center">
                <div className="bg-sidebar rounded px-4 py-2 flex items-center w-72">
                    <Search size={16} className="text-zinc-400 mr-2" />
                    <span className="text-zinc-400 text-sm">Ask AI & Search</span>
                    <div className="ml-auto flex items-center">
                        <span className="text-xs text-zinc-400 px-1">Ctrl</span>
                        <span className="text-xs text-zinc-400 px-1">+</span>
                        <span className="text-xs text-zinc-400 px-1">K</span>
                    </div>
                </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                    <LanguageSelector hasAccess={convexUser?.isPro} />
                    <ThemeSelector />
                </div>
                {!convexUser?.isPro && (
                    <Link
                        href="/pricing"
                        className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-purple-500/20 hover:border-purple-500/40 bg-gradient-to-r from-purple-500/10 
                to-purple-500/10 hover:from-purple-500/20 hover:to-purple-500/20 
                transition-all duration-300"
                    >
                        <Sparkles className="w-4 h-4 text-purple-500 hover:text-purple-300" />
                        <span className="text-sm font-medium text-purple-500/90 hover:text-purple-300">
                            Pro
                        </span>
                    </Link>
                )}
                <div className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full">
                    <GiExpand size={18} />
                </div>
                <div className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full">
                    <LuShare2 size={18} />
                </div>
                <div className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full">
                    <MoreVertical size={18} />
                </div>
                <HeaderProfileBtn />
            </div>
        </nav>
    );
}

export default Header;
