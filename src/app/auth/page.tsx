import React from 'react'
import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs";

function page() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Sign in</h1>
            <SignedOut>
                <SignInButton mode="modal">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                        Sign In
                    </button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <SignOutButton>
                    <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                        Sign Out
                    </button>
                </SignOutButton>
            </SignedIn>
        </div>
    )
}

export default page
