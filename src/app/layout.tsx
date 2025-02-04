import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RootLayoutClient } from "@/components/root-layout-client";
import { AuthProvider } from '@/contexts/auth-context'
import { Header } from '@/components/header'
import { ThemeProvider } from '@/contexts/theme-context'
import { Footer } from '@/components/footer'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProcLinks - Seu hub de links personalizado",
  description: "Crie sua página personalizada e compartilhe seus links em um único lugar",
};

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
              </RootLayoutClient>
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
