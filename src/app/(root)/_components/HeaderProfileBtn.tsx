"use client";
import { SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { User } from "lucide-react";

function HeaderProfileBtn() {
    return (
        <>
            <UserButton>
                <UserButton.MenuItems>
                    <UserButton.Link
                        label="Profile"
                        labelIcon={<User className="size-4" />}
                        href="/profile"
                    />
                </UserButton.MenuItems>
            </UserButton>

            <SignedOut>
                <SignInButton mode="modal">
                    <button className="bg-white rounded hover:bg-gray-100 scale-90 text-black py-2 px-4 ">
                        Sign In
                    </button>
                </SignInButton>
            </SignedOut>
        </>
    );
}
export default HeaderProfileBtn;