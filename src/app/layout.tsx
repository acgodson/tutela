import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "@/providers/providers";

const testRobot = localFont({
  src: "./fonts/regular.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Tutela",
  description: "Real-time monitoring system - Powered by Hedera Consensus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`
          ${testRobot.className}  antialiased`}
        suppressHydrationWarning={true}
      >
        <Providers> {children} </Providers>
      </body>
    </html>
  );
}
