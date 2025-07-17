"use client";
import { SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { dark, neobrutalism } from '@clerk/themes';
import useTheme from "@/hooks/useTheme";

function HeaderProfileBtn() {
    const { isDarkMode } = useTheme();

    return (
        <>
            <UserButton
            appearance={{
                baseTheme: isDarkMode ? dark : neobrutalism,
            }}
            >
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