import { SignedIn, SignedOut, SignInButton, SignOutButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <SignedOut>
        <button className="bg-blue-500 text-white font-semibold m-8 px-4 py-2 rounded">
          <SignInButton />
        </button>
      </SignedOut>
      <SignedIn>
        <button className="bg-red-500 text-white font-semibold m-8 px-4 py-2 rounded">
          <SignOutButton />
        </button>
      </SignedIn>
    </div>
  )
}
