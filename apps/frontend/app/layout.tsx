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
  title: 'GuardianEye - Security Alerts Made Instant',
  description: 'Real-time alerts, live tracking, and emergency response in one powerful app. GuardianEye provides instant security notifications and peace of mind.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GuardianEye',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1D4ED8',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
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

