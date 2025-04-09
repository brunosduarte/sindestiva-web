import type { Metadata } from 'next'
import { Inter, Roboto_Mono as RobotoMono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AuthProvider } from '@/components/AuthProvider'
import { QueryProvider } from '@/components/QueryProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const robotoMono = RobotoMono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default:
      process.env.NEXT_PUBLIC_SITE_NAME ||
      'Sindicato dos Estivadores de Rio Grande',
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || 'Sindicato dos Estivadores de Rio Grande'}`,
  },
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    'Site oficial do Sindicato dos Estivadores de Rio Grande',
  keywords: [
    'sindicato',
    'estivadores',
    'rio grande',
    'trabalho portuário',
    'porto',
    'trabalhadores',
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${robotoMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <QueryProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen antialiased vsc-initialized">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
