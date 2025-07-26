"use client"
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CheckpointDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
    initialName?: string;
}

export function CheckpointDialog({ isOpen, onClose, onSave, initialName = '' }: CheckpointDialogProps) {
    const [name, setName] = useState(initialName);

    useEffect(() => {
        if (isOpen) {
            // Generate default name with timestamp
            const now = new Date();
            const defaultName = `${now.toLocaleDateString()} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            setName(initialName || defaultName);
        }
    }, [isOpen, initialName]);

    const handleSave = () => {
        if (name.trim()) {
            onSave(name.trim());
            setName('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Checkpoint</DialogTitle>
                    <DialogDescription>
                        Save your current code as a checkpoint. You can load, rename, or download it later.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyPress={handleKeyPress}
                            className="col-span-3 outline-none border-none"
                            placeholder="Enter Save name..."
                            autoFocus
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={!name.trim()}>
                        Save Checkpoint
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
