import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootLayoutClient } from "@/components/root-layout-client";
import { AuthProvider } from '@/contexts/auth-context'
import { Header } from '@/components/header'
import { ThemeProvider } from '@/contexts/theme-context'
import { Footer } from '@/components/footer'
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from 'react-hot-toast'
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProcLinks - Seu hub de links personalizado",
  description: "Crie sua página personalizada e compartilhe seus links em um único lugar",
  icons: {
    icon: '/icon.ico'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main>
              <RootLayoutClient>
                {children}
                <Analytics />
              </RootLayoutClient>
            </main>
            <Footer />
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
