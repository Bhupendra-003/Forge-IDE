import { create } from "zustand";
import { CheckpointState, Checkpoint } from "../types/index";

const CHECKPOINT_STORAGE_KEY = 'devine-checkpoints';

const getStoredCheckpoints = (): Checkpoint[] => {
    if (typeof window === 'undefined') return [];
    
    try {
        const stored = localStorage.getItem(CHECKPOINT_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading checkpoints:', error);
        return [];
    }
};

const saveCheckpoints = (checkpoints: Checkpoint[]) => {
    if (typeof window === 'undefined') return;
    
    try {
        localStorage.setItem(CHECKPOINT_STORAGE_KEY, JSON.stringify(checkpoints));
    } catch (error) {
        console.error('Error saving checkpoints:', error);
    }
};

const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const getLanguageEmoji = (language: string): string => {
    const emojiMap: Record<string, string> = {
        javascript: '🟨',
        typescript: '🔷',
        python: '🐍',
        java: '☕',
        go: '🐹',
        rust: '🦀',
        cpp: '⚡',
        csharp: '🔵',
        ruby: '💎',
        swift: '🍎',
    };
    return emojiMap[language] || '📄';
};

export const useCheckpointStore = create<CheckpointState>((set, get) => ({
    checkpoints: [],
    isCreating: false,
    isHydrated: false,

    createCheckpoint: (name: string, code: string, language: string) => {
        const newCheckpoint: Checkpoint = {
            id: generateId(),
            name: name.trim() || `Checkpoint ${Date.now()}`,
            code,
            language,
            timestamp: Date.now(),
            emoji: getLanguageEmoji(language),
        };

        const updatedCheckpoints = [...get().checkpoints, newCheckpoint];
        saveCheckpoints(updatedCheckpoints);
        set({ checkpoints: updatedCheckpoints });
    },

    loadCheckpoint: (id: string) => {
        const checkpoint = get().checkpoints.find(cp => cp.id === id);
        if (!checkpoint) return;

        // We'll need to access the code editor store to load the checkpoint
        // This will be handled by the component that calls this function
        return checkpoint;
    },

    renameCheckpoint: (id: string, newName: string) => {
        const checkpoints = get().checkpoints.map(cp =>
            cp.id === id ? { ...cp, name: newName.trim() || cp.name } : cp
        );
        saveCheckpoints(checkpoints);
        set({ checkpoints });
    },

    deleteCheckpoint: (id: string) => {
        const checkpoints = get().checkpoints.filter(cp => cp.id !== id);
        saveCheckpoints(checkpoints);
        set({ checkpoints });
    },

    downloadCheckpoint: (id: string) => {
        const checkpoint = get().checkpoints.find(cp => cp.id === id);
        if (!checkpoint) return;

        const fileExtensions: Record<string, string> = {
            javascript: 'js',
            typescript: 'ts',
            python: 'py',
            java: 'java',
            go: 'go',
            rust: 'rs',
            cpp: 'cpp',
            csharp: 'cs',
            ruby: 'rb',
            swift: 'swift',
        };

        const extension = fileExtensions[checkpoint.language] || 'txt';
        const fileName = `${checkpoint.name}.${extension}`;
        
        const blob = new Blob([checkpoint.code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    },

    getCheckpoint: (id: string) => {
        return get().checkpoints.find(cp => cp.id === id);
    },
}));
