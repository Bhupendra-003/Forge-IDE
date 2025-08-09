"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useCodeEditorStore } from '@/store/useCodeEditorStore';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface ComplexityResult {
    complexity: string;
    category: string;
}

const ComplexityCard = () => {
    const editorStore = useCodeEditorStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ComplexityResult | null>(null);

    // Map of complexity to image path
    const getImagePath = (complexity: string) => {
        if (!complexity) return '/Complexity/O_N.png';
        
        // Clean and normalize the complexity string
        const normalized = complexity.trim().toLowerCase();
        
        // Map complexity to the corresponding image
        if (normalized.includes('o(1)') || normalized === 'constant') {
            return '/Complexity/O_1.png';
        } else if (normalized.includes('log') && normalized.includes('n')) {
            return '/Complexity/O_logN.png';
        } else if (normalized === 'o(n)' || normalized === 'linear') {
            return '/Complexity/O_N.png';
        } else if (normalized.includes('n log n') || normalized === 'linearithmic') {
            return '/Complexity/O_NlogN.png';
        } else if (normalized.includes('n²') || normalized.includes('n^2') || normalized === 'quadratic') {
            return '/Complexity/O_N2.png';
        } else if (normalized.includes('2^') || normalized.includes('^n') || normalized === 'exponential') {
            return '/Complexity/O_NN.png';
        } else if (normalized.includes('n!') || normalized === 'factorial') {
            return '/Complexity/O_NN.png'; // Using exponential as fallback for factorial
        }
        
        // Default fallback
        return '/Complexity/O_N.png';
    };

    const analyzeComplexity = useCallback(async () => {
        const code = editorStore.getCode();
        if (!code.trim()) {
            setError('No code to analyze');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/complexity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || 'Failed to analyze complexity');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error('Error analyzing complexity:', err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [editorStore]);

    useEffect(() => {
        analyzeComplexity();
    }, [analyzeComplexity]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-6">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-center text-sm text-muted-foreground">
                    Analyzing code complexity...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center">
                <div className="text-destructive">
                    <p className="font-medium">Error analyzing complexity</p>
                    <p className="text-sm mt-2">{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 text-sm text-primary hover:underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="p-6 text-center">
                <p>No code to analyze or unable to determine complexity.</p>
            </div>
        );
    }

    const imagePath = getImagePath(result?.category || '');
    const complexityFormatted = result?.complexity
        ? result.complexity.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        : '';

    return (
        <div className="relative">
            <div className="flex flex-col items-center">
            <div className="text-center">
                    <div
                        className="absolute z-10 text-3xl font-mono font-bold mb-2"
                        dangerouslySetInnerHTML={{ __html: complexityFormatted }}
                    />
                </div>

                <div className="relative w-92 h-92">
                    <Image
                        src={imagePath}
                        alt={`Complexity: ${result.complexity}`}
                        fill
                        className="object-contain"
                        onError={(e) => {
                            // Fallback to unknown image if the specific one doesn't exist
                            const target = e.target as HTMLImageElement;
                            target.src = '/Complexity/UNKNOWN.png';
                        }}
                    />
                </div>

                
            </div>
        </div>
    );
};

export default ComplexityCard;
