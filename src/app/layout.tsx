import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ApolloProviderWrapper from "@/components/providers/ApolloProviderWrapper";
import Header from "@/components/layout/Header";
import "./globals.css";

// Using Inter font
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Pulseboard - Real-time OSS Health",
  description: "Monitor the pulse of open-source projects in real-time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-neutral-100 font-sans antialiased">
        <ApolloProviderWrapper>
          <Header />
          <main className="min-h-screen p-6 md:p-8">
            {/* TODO: Add Header/Navbar Component Here */} 
            {children}
            {/* TODO: Add Footer Component Here */} 
          </main>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}
