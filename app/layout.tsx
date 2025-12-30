import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Velligiri Hills Guide Booking | Safe & Spiritual Trek",
  description: "Book verified professional guides for your Velligiri Hills spiritual journey. Safe, reliable, and experienced trekkers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
