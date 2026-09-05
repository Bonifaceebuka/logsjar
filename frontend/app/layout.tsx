import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import { Toaster as Sonner } from "@/components/ui/sonner";
import TanstackQueryProvider from "@/common/providers/TanstackQueryProvider";
import { APP_CONFIGS } from "@/common/configs";
import { GoogleOAuthProvider } from "@react-oauth/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const satoshi = localFont({
  src: "../assets/fonts/Satoshi-Bold.otf",
  variable: "--font-satoshi",
  weight: "700",
});

export const metadata: Metadata = {
  title: "Logsjar",
  description: "Production-worthy Opensource real-time software logs monitoring tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${satoshi.variable} antialiased`}
        suppressHydrationWarning
      >
        <TanstackQueryProvider>
            <GoogleOAuthProvider clientId={APP_CONFIGS.GOOGLE_CLIENT_ID as string}>
              {children}
            </GoogleOAuthProvider>
          <Sonner richColors position="top-right" />
        </TanstackQueryProvider>
      </body>
    </html>
  );
}
