"use client";
import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

function Stopwatch() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning]);

    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor((milliseconds % 1000) / 10);

        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
    };

    const toggleRunning = () => {
        setIsRunning(!isRunning);
    };

    const reset = () => {
        setIsRunning(false);
        setTime(0);
    };

    return (
        <div className="flex items-center gap-2 bg-card rounded-full px-3 py-1.5 border border-border/40">
            {/* Time Display */}
            <div className="font-mono text-sm font-medium tabular-nums text-center">
                {formatTime(time)}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1">
                {/* Play/Pause Button */}
                <button
                    onClick={toggleRunning}
                    className={cn(
                        "p-1.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-95",
                        isRunning
                            ? "bg-amber-500/20 hover:bg-amber-500/30"
                            : "bg-green-500/20 hover:bg-green-500/30"
                    )}
                    aria-label={isRunning ? "Pause" : "Play"}>
                    {isRunning ? (
                        <Pause
                            size={14}
                            className="text-amber-600 dark:text-amber-400"
                        />
                    ) : (
                        <Play
                            size={14}
                            className="text-green-600 dark:text-green-400"
                        />
                    )}
                </button>

                {/* Reset Button */}
                <button
                    onClick={reset}
                    className="p-1.5 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 bg-muted/50 hover:bg-muted"
                    aria-label="Reset">
                    <RotateCcw size={14} className="text-foreground/70" />
                </button>
            </div>
        </div>
    );
}

export default Stopwatch;
