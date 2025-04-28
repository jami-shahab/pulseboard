import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
      <body className="bg-gray-50 font-sans antialiased">
        <main className="min-h-screen p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
