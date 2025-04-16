"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { IoPlay } from "react-icons/io5"
import { Squircle } from 'ldrs/react'
import 'ldrs/react/Squircle.css'

function RunButton() {
    const [isRunning, setIsRunning] = React.useState(false)

    return (
        <div className="flex items-center rounded justify-center bg-primary w-fit">
            <Button 
                onClick={() => setIsRunning(!isRunning)} 
                className="text-white font-semibold text-md flex items-center gap-2 py-2"
            >
                {/* Icon wrapper with fixed size */}
                <div className="w-2 mr-1 flex items-center justify-center">
                    {isRunning ? (
                        <Squircle
                            size="12"
                            stroke="3"
                            strokeLength="0.18"
                            bgOpacity="0.2"
                            speed="0.9"
                            color="white"
                        />
                    ) : (
                        <IoPlay size={12} />
                    )}
                </div>
                <p>Run</p>
            </Button>
        </div>
    )       
}

export default RunButton
