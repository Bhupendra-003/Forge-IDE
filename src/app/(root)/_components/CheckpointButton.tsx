"use client"
import React, { useState } from 'react'
import { Bookmark } from "lucide-react";
import { useCodeEditorStore } from '@/store/useCodeEditorStore';
import { useCheckpointStore } from '@/store/useCheckpointStore';
import { CheckpointDialog } from './CheckpointDialog';

function CheckpointButton() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { getCode, language } = useCodeEditorStore();
    const { createCheckpoint } = useCheckpointStore();

    const handleCreateCheckpoint = (name: string) => {
        const code = getCode();
        if (!code.trim()) {
            alert('No code to save as checkpoint');
            return;
        }
        
        createCheckpoint(name, code, language);
        setIsDialogOpen(false);
    };

    return (
        <>
            <div className="flex items-center h-10 rounded justify-center md:bg-card w-fit">
                <div
                    onClick={() => setIsDialogOpen(true)}
                    className="text-foreground text-nowrap text-md flex items-center gap-3 py-2 hover:bg-secondary/80 cursor-pointer rounded-md px-2 md:px-4"
                >
                    {/* Icon wrapper with fixed size */}
                    <div className="flex items-center justify-center">
                        <Bookmark size={18}/>
                    </div>
                    <p className='hidden lg:block'>Create Checkpoint</p>
                </div>
            </div>

            <CheckpointDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleCreateCheckpoint}
            />
        </>
    )
}

export default CheckpointButton
