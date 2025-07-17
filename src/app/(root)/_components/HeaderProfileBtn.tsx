"use client";
import { SignedOut, UserButton, SignInButton } from "@clerk/nextjs";
import { dark, neobrutalism } from '@clerk/themes';
import useTheme from "@/hooks/useTheme";
import Button1 from "@/components/ui/Button1";

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
                    <div className="scale-90">
                        <Button1>Sign In</Button1>
                    </div>
                </SignInButton>
            </SignedOut>
        </>
    );
}
export default HeaderProfileBtn;