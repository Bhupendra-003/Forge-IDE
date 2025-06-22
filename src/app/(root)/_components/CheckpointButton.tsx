"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
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
            <div className="flex items-center h-10 rounded justify-center bg-secondary w-fit">
                <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="text-foreground font-semibold text-lg flex items-center gap-3 py-2 bg-secondary hover:bg-secondary/80"
                    variant="secondary"
                >
                    {/* Icon wrapper with fixed size */}
                    <div className="w-2 mr-1 flex items-center justify-center">
                        <Bookmark size={16} />
                    </div>
                    <p>Create Checkpoint</p>
                </Button>
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
