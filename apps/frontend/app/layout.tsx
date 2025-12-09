import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/contexts/language-context'
import OfflineIndicator from '@/components/offline-indicator'
import { RoleRouter } from '@/components/role-router'
import { TokenValidatorProvider } from '@/components/token-validator-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Security App - Stay Safe',
  description: 'Community safety and security reporting app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Security App',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#10b981',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <RoleRouter>
              <TokenValidatorProvider>
                <OfflineIndicator />
                {children}
              </TokenValidatorProvider>
            </RoleRouter>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

