import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer/footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jogo de Cartas 21",
  description: "O Jogo de cartas Black Jack, também conhecido como 21, adaptado para o single-player!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br" className='w-full flex flex-col min-h-svh overflow-x-hidden'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} w-full flex flex-col min-h-svh antialiased`}
      >
        <main className="grow content-center">
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  );
}
