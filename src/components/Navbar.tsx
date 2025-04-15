import React from 'react'
import { MoreVertical, Search } from "lucide-react";
import { LuShare2 } from "react-icons/lu";
import { GiExpand } from "react-icons/gi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { SidebarTrigger } from './ui/sidebar';
function Navbar() {
    return (
    <nav className="flex items-center p-2 justify-between bg-background text-gray-200">
        {/* Left section */}
        <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-zinc-700 rounded">
                {/* <TbLayoutSidebarLeftExpandFilled size={30} />        */}
                <SidebarTrigger className="-ml-1" size="lg" />

            </button>
            <div className="flex items-center border-l border-zinc-700 pl-2 ml-1">
                <span className="text-xl font-semibold">Devine</span>
            </div>  
        </div>

        {/* Middle section - Search - Replace it with actual input */}
        <div className="flex-grow flex justify-center">
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
            <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full">
                <GiExpand size={18} />
            </button>
            <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full">
                <LuShare2 size={18} />
            </button>
            <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full">
                <MoreVertical size={18} />
            </button>
            <div className="h-8 w-8 rounded-full overflow-hidden bg-zinc-700 flex items-center justify-center ml-2">
                <img src="https://images.unsplash.com/photo-1531891570158-e71b35a485bc?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
            </div>
            <button className="p-1 hover:bg-gray-700 rounded">
                <MdKeyboardArrowDown size={18} />
            </button>
        </div>
    </nav>
);
}

export default Navbar;
