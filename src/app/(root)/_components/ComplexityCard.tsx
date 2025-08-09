"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface ComplexityResult {
    complexity: string; // AI-provided (full)
    category: string;   // Simplified for image mapping
}

const ComplexityCard = () => {
    const editorStore = useCodeEditorStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ComplexityResult | null>(null);
    const effectRan = useRef(false);

    // Map category to image path
    const getImagePath = (category: string) => {
        if (!category) return "/Complexity/O_N.png";
        const normalized = category.trim().toLowerCase();

        if (normalized.includes("o(1)") || normalized === "constant") {
            return "/Complexity/O_1.png";
        } else if (normalized.includes("log") && normalized.includes("n")) {
            return "/Complexity/O_logN.png";
        } else if (normalized === "o(n)" || normalized === "linear") {
            return "/Complexity/O_N.png";
        } else if (normalized.includes("n log n") || normalized === "linearithmic") {
            return "/Complexity/O_NlogN.png";
        } else if (normalized.includes("n²") || normalized.includes("n^2") || normalized === "quadratic") {
            return "/Complexity/O_N2.png";
        } else if (normalized.includes("2^") || normalized.includes("^n") || normalized === "exponential") {
            return "/Complexity/O_NN.png";
        } else if (normalized.includes("n!") || normalized === "factorial") {
            return "/Complexity/O_NN.png";
        }

        return "/Complexity/O_N.png";
    };

    const analyzeComplexity = useCallback(async () => {
        const code = editorStore.getCode();
        if (!code.trim()) {
            setError("⚠️ No code to analyze");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/complexity", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code }),
            });

            if (!response.ok) {
                let message = "Failed to analyze complexity";
                try {
                    const errData = await response.json();
                    if (errData?.error) message = errData.error;
                } catch {
                    // ignore parsing error
                }
                throw new Error(message);
            }

            const data = await response.json();

            // Safety check in case API sends weird data
            if (!data?.complexity || !data?.category) {
                throw new Error("Invalid complexity data received from AI");
            }

            setResult(data);
        } catch (err) {
            console.error("Error analyzing complexity:", err);
            setError(
                err instanceof Error ? err.message : "Unexpected error occurred"
            );
        } finally {
            setIsLoading(false);
        }
    }, [editorStore]);

    useEffect(() => {
        // Prevent duplicate calls in development mode with React Strict Mode
        if (effectRan.current === false) {
            analyzeComplexity();
            effectRan.current = true;
        }
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
                    onClick={analyzeComplexity}
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

    const imagePath = getImagePath(result.category);

    return (
        <div className="relative">
            <div className="flex flex-col items-center">
                {/* Display full complexity from AI */}
                <p className="text-center z-10 text-3xl font-mono font-bold mb-4">
                    {result.complexity}
                </p>

                {/* Image with clipped top portion */}
                <div
                    className="relative w-92 h-92 overflow-hidden"
                    style={{ clipPath: "inset(20px 0 0 0)" }} // clips 20px from top
                >
                    <Image
                        src={imagePath}
                        alt={`Complexity: ${result.category}`}
                        fill
                        className="object-contain"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/Complexity/UNKNOWN.png";
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ComplexityCard;
