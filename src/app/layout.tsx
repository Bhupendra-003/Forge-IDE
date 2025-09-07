import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/providers/convexClientProvider";
import PreventZoom from "@/components/PreventZoom";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"], // adjust weights as needed
});

export const metadata: Metadata = {
  title: "Forge",
  description: "Forge - Share and run code snippets",
  viewport: {
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    width: 'device-width',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body
          className={`${poppins.variable} antialiased min-h-screen max-w-full flex flex-col`}
        >
          <ConvexClientProvider>
            <PreventZoom />
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
