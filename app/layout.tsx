import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import "./fonts.css";
import AppShell from "@/components/AppShell";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const argoBold = localFont({
  src: '../public/fonts/ArgoHvyB.otf',
  variable: '--font-argo-bold',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "OPEX Freelance | Complete freelance services, all in one place",
  description: "Find top freelancers for your projects or offer your services on OPEX Freelance platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${argoBold.variable} antialiased min-h-screen`}>
        <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
