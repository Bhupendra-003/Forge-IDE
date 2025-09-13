import React from 'react'
import { Bouncy } from 'ldrs/react'
import 'ldrs/react/Bouncy.css'

const BrandLoading = () => {    

    return (
        <div className='absolute top-0 left-0 z-50 bg-background backdrop-blur-sm w-full flex items-center justify-center h-screen'>
            <div className='flex items-center gap-2'>
                <Bouncy
                    size="45"
                    speed="1.75"
                    color="var(--foreground)"
                />
            </div>
        </div>
    )
}


export default BrandLoading
