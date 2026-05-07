import type { Metadata, Viewport } from "next";
import { Bagel_Fat_One, Patrick_Hand, Fredoka } from "next/font/google";
import { RegisterSW } from "@/components/RegisterSW";
import "./globals.css";

const bagel = Bagel_Fat_One({
  variable: "--font-bagel",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const patrick = Patrick_Hand({
  variable: "--font-patrick",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Harrison King — Coolest 6-Year-Old on Earth",
  description:
    "Harry's world — featuring Super Dog World! Hand-drawn cartoony PWA built with love for Harry, age 6.",
  manifest: "/manifest.webmanifest",
  applicationName: "Harrison King",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Harry",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Harrison King — Coolest 6-Year-Old on Earth",
    description: "Harry's world. Featuring Super Dog World!",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#E94B4B",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bagel.variable} ${patrick.variable} ${fredoka.variable}`}
    >
      <body className="min-h-screen">
        {children}
        <RegisterSW />
      </body>
    </html>
  );
}
