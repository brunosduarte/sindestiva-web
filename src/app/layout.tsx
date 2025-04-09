import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AuthProvider } from '@/components/AuthProvider';
import { QueryProvider } from '@/components/QueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME || 'Sindicato dos Estivadores de Rio Grande',
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || 'Sindicato dos Estivadores de Rio Grande'}`
  },
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Site oficial do Sindicato dos Estivadores de Rio Grande',
  keywords: ['sindicato', 'estivadores', 'rio grande', 'trabalho portuário', 'porto', 'trabalhadores'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
          <QueryProvider>
            <AuthProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster />
            </AuthProvider>
          </QueryProvider>
      </body>
    </html>
  );
}