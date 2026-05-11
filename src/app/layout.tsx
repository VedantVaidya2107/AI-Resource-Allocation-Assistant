import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { StoreProvider } from "@/lib/store";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "AI Resource Allocation Assistant",
  description: "Next-gen resource management powered by Gemini AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-inter flex min-h-screen bg-background overflow-hidden`}>
        <StoreProvider>
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <Sidebar />
          <main className="flex-1 flex flex-col h-screen overflow-y-auto">
            <div className="p-8 max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </StoreProvider>
      </body>
    </html>
  );
}
