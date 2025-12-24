import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "../providers/WalletProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlexWall",
  description: "FlexWall - Interactive Wall of Wealth on Solana.",
  keywords: [
    "FlexWall",
    "Solana",
    "crypto",
    "wealth wall",
    "blockchain",
    "NFT",
    "Web3",
  ],
  openGraph: {
    title: "FlexWall",
    description: "FlexWall - Interactive Wall of Wealth on Solana.",
    url: "https://flexwall.vercel.app",
    siteName: "FlexWall",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FlexWall - Wall of Wealth",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
