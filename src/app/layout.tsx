import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpeakUp IELTS — Interactive Speaking Practice Game",
  description:
    "Practice IELTS Speaking across 15+ topics with timed Part 1/2/3 modes, voice recording, transcript analysis, vocabulary flashcards, and band-score self-assessment.",
  keywords: [
    "IELTS",
    "Speaking",
    "English practice",
    "Speaking game",
    "Band score",
    "Cue card",
  ],
  authors: [{ name: "SpeakUp" }],
  openGraph: {
    title: "SpeakUp IELTS — Interactive Speaking Practice",
    description: "Practice IELTS Speaking across 15+ topics with timed modes and self-assessment.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
