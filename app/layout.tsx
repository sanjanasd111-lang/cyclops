import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cyclops — Skills, Internships & Placement Intelligence",
  description: "AI-powered skill intelligence platform connecting students, institutions, and industry across all academic branches. SIH Problem Statement 26044.",
  keywords: [
    "Cyclops",
    "Cyclops AI",
    "Skill Intelligence",
    "Placement Platform",
    "Smart India Hackathon",
    "Skill Digital Twin",
    "AI Resume Studio",
    "Recruitment Automation",
  ],
  authors: [{ name: "Cyclops Engineering Team" }],
  icons: {
    icon: "/cyclops-icon.png",
    shortcut: "/favicon.ico",
    apple: "/cyclops-icon.png",
  },
  openGraph: {
    title: "Cyclops — Skills, Internships & Placement Intelligence",
    description: "Turn Skills Into Opportunities with AI-powered skill intelligence.",
    siteName: "Cyclops",
    type: "website",
    images: [{ url: "/cyclops-logo.png", width: 1024, height: 1024, alt: "Cyclops" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-300`}>
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
