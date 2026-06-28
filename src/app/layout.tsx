import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://playbeat.digital";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PlayBeat Digital — Premium Digital Marketplace",
    template: "%s · PlayBeat Digital",
  },
  description:
    "PlayBeat Digital is a premium marketplace for software, plugins, templates, ebooks, and digital assets. Instant delivery, license keys, subscriptions, and secure checkout powered by Lemon Squeezy.",
  keywords: [
    "digital marketplace",
    "software",
    "plugins",
    "templates",
    "ebooks",
    "license keys",
    "subscriptions",
    "Lemon Squeezy",
    "PlayBeat Digital",
  ],
  authors: [{ name: "PlayBeat Digital" }],
  creator: "PlayBeat Digital",
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "PlayBeat Digital — Premium Digital Marketplace",
    description:
      "Premium software, plugins, templates and digital assets with instant delivery and secure checkout.",
    url: SITE_URL,
    siteName: "PlayBeat Digital",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlayBeat Digital",
    description:
      "Premium digital marketplace with instant delivery, license keys and subscriptions.",
  },
  robots: {
    index: true,
    follow: true,
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
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <SonnerToaster position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
