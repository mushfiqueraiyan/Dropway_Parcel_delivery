import type { Metadata } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ToastProvider } from "@/components/toast";
import { SiteHeader } from "@/components/site-header";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dropway — Add a parcel, we handle the rest",
  description:
    "Book a pickup in under a minute. Dropway assigns the nearest rider, tracks every leg, and stores proof of delivery on the order.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      
      <body className="min-h-full flex flex-col">
         <SiteHeader />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
