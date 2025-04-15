"use client"
import React, { useState } from 'react';
import { FiSearch, FiChevronRight, FiChevronDown, FiFile, FiMoreHorizontal } from 'react-icons/fi';
import { HiOutlineFolderAdd } from 'react-icons/hi';
import { BiMessageSquareDots } from 'react-icons/bi';
import { AiOutlineCode } from 'react-icons/ai';
import { MdOutlineNotes, MdTerminal } from 'react-icons/md';
import { VscDebugConsole } from 'react-icons/vsc';
import { TbBrandVscode } from 'react-icons/tb';

export default function Sidebar() {
    const [filesExpanded, setFilesExpanded] = useState(true);
    const [managerExpanded, setManagerExpanded] = useState(false);
    const [widgetsExpanded, setWidgetsExpanded] = useState(true);
    const [selectedWidget, setSelectedWidget] = useState('AI Chat');

    const widgets = [
        { name: 'AI Chat', icon: <BiMessageSquareDots /> },
        { name: 'Output', icon: <AiOutlineCode /> },
        { name: 'Notes', icon: <MdOutlineNotes /> },
        { name: 'Debugger', icon: <VscDebugConsole /> },
        { name: 'Terminal', icon: <MdTerminal /> },
        { name: 'Integration', icon: <TbBrandVscode /> },
    ];

    return (
        <div className="w-64 h-screen bg-gray-900 text-gray-300 flex flex-col">
            {/* Search bar */}
            <div className="p-2 flex items-center border-b border-gray-800">
                <span className="text-sm mr-2">Search</span>
                <div className="flex-grow" />
                <FiSearch className="text-gray-500" />
            </div>

            {/* Files section */}
            <div className="flex-grow overflow-auto">
                <div
                    className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-800"
                    onClick={() => setFilesExpanded(!filesExpanded)}
                >
                    {filesExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                    <span className="ml-1 text-sm">Files</span>
                    <div className="flex-grow" />
                    <HiOutlineFolderAdd className="text-gray-500 mx-1" size={16} />
                    <FiFile className="text-gray-500 mx-1" size={16} />
                    <FiMoreHorizontal className="text-gray-500 mx-1" size={16} />
                </div>

                {filesExpanded && (
                    <div className="pl-6">
                        <div className="flex items-center py-1 px-2 hover:bg-gray-800 cursor-pointer">
                            <FiFile size={14} className="text-gray-400 mr-2" />
                            <span className="text-sm">palindrome.py</span>
                        </div>
                    </div>
                )}

                {/* Manager section */}
                <div
                    className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-800"
                    onClick={() => setManagerExpanded(!managerExpanded)}
                >
                    {managerExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                    <span className="ml-1 text-sm">Manager</span>
                    <div className="flex-grow" />
                    <FiMoreHorizontal className="text-gray-500 mx-1" size={16} />
                </div>

                {/* Widgets section */}
                <div
                    className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-800"
                    onClick={() => setWidgetsExpanded(!widgetsExpanded)}
                >
                    {widgetsExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
                    <span className="ml-1 text-sm">Widgets</span>
                    <div className="flex-grow" />
                    <FiMoreHorizontal className="text-gray-500 mx-1" size={16} />
                </div>

                {widgetsExpanded && (
                    <div className="pl-6">
                        {widgets.map((widget) => (
                            <div
                                key={widget.name}
                                className={`flex items-center py-1 px-2 cursor-pointer ${selectedWidget === widget.name ? 'bg-blue-900' : 'hover:bg-gray-800'
                                    }`}
                                onClick={() => setSelectedWidget(widget.name)}
                            >
                                <span className="mr-2 text-purple-400">{widget.icon}</span>
                                <span className="text-sm">{widget.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Status bar */}
            <div className="h-1 bg-blue-600"></div>
        </div>
    );
}

