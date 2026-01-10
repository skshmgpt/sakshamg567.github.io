import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://skshmgpt.tech"),
  title: {
    default: "Saksham Gupta - Full Stack Developer & CS Undergrad",
    template: "%s | Saksham Gupta",
  },
  description:
    "19 y/o CS undergrad passionate about backend development, distributed systems, networking, and infrastructure. Full Stack Developer Intern at Freestand.",
  keywords: [
    "Saksham Gupta",
    "skshmgpt",
    "Full Stack Developer",
    "Backend Developer",
    "Distributed Systems",
    "Networking",
    "Software Engineer",
    "CS Undergrad",
    "Next.js",
    "TypeScript",
    "React",
    "Go",
    "C",
  ],
  authors: [{ name: "Saksham Gupta", url: "https://skshmgpt.tech" }],
  creator: "Saksham Gupta",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://skshmgpt.tech",
    siteName: "Saksham Gupta",
    title: "Saksham Gupta - Full Stack Developer & CS Undergrad",
    description:
      "19 y/o CS undergrad passionate about backend development, distributed systems, networking, and infrastructure.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saksham Gupta - Full Stack Developer & CS Undergrad",
    description:
      "19 y/o CS undergrad passionate about backend development, distributed systems, networking, and infrastructure.",
    creator: "@skshmgpt",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.className} ${geistMono.variable} antialiased bg-black/94`}
      >
        <SmoothScroll />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
