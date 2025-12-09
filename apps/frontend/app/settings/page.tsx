'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@security-app/ui'
import { Moon, Sun, Bell, Shield, Globe, ArrowLeft, Fingerprint } from 'lucide-react'
import { useTheme } from 'next-themes'
import BottomNav from '@/components/bottom-nav'
import { useLanguage, type Language } from '@/contexts/language-context'
import {
  isBiometricAvailable,
  getBiometricType,
  registerBiometric,
  getStoredCredentialId,
  removeStoredCredentialId,
} from '@/lib/webauthn'
import { getUserData } from '@/lib/auth-storage'

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()
  const [notifications, setNotifications] = useState(true)
  const [locationSharing, setLocationSharing] = useState(true)
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const [biometricType, setBiometricType] = useState('Biometric')
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [isRegisteringBiometric, setIsRegisteringBiometric] = useState(false)

  useEffect(() => {
    const checkBiometric = async () => {
      const available = await isBiometricAvailable()
      setBiometricAvailable(available)
      
      if (available) {
        const type = await getBiometricType()
        setBiometricType(type)
        
        // Check if biometric is already registered
        const userData = getUserData()
        if (userData?.id) {
          const credentialId = getStoredCredentialId(userData.id)
          setBiometricEnabled(!!credentialId)
        }
      }
    }
    
    checkBiometric()
  }, [])

  const handleToggleBiometric = async () => {
    if (biometricEnabled) {
      // Disable biometric
      const userData = getUserData()
      if (userData?.id) {
        removeStoredCredentialId(userData.id)
        setBiometricEnabled(false)
        alert(`${biometricType} login disabled`)
      }
    } else {
      // Enable biometric
      await handleRegisterBiometric()
    }
  }

  const handleRegisterBiometric = async () => {
    setIsRegisteringBiometric(true)
    try {
      const userData = getUserData()
      if (!userData) {
        alert('Please sign in first to enable biometric login')
        return
      }

      const credential = await registerBiometric({
        username: userData.email || userData.id,
        displayName: userData.name || userData.email || 'User',
      })

      if (credential) {
        // Store credential ID
        const { arrayBufferToBase64, storeCredentialId } = await import('@/lib/webauthn')
        const credentialIdBase64 = arrayBufferToBase64(credential.rawId)
        storeCredentialId(userData.id, credentialIdBase64)
        
        setBiometricEnabled(true)
        alert(`${biometricType} login enabled successfully!`)
      }
    } catch (error: any) {
      console.error('Error registering biometric:', error)
      if (error.message.includes('cancelled')) {
        // User cancelled - don't show error
        return
      }
      alert(`Failed to enable ${biometricType}: ${error.message}`)
    } finally {
      setIsRegisteringBiometric(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <header className="sticky top-0 z-10 border-b-2 border-slate-200 bg-background/95 backdrop-blur-[10px] supports-[backdrop-filter]:bg-background/80 dark:border-slate-700">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">{t('settings.title')}</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        {/* Appearance */}
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg">{t('settings.appearance')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  {theme === 'dark' ? (
                    <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                  ) : (
                    <Sun className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                  )}
                </div>
                <span className="text-base font-medium">{t('settings.theme')}</span>
              </div>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="rounded-xl border-2 border-slate-200 bg-background px-4 py-3 text-base font-medium transition-all focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 dark:border-slate-700"
              >
                <option value="light">{t('settings.light')}</option>
                <option value="dark">{t('settings.dark')}</option>
                <option value="system">{t('settings.system')}</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg">{t('settings.notifications')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                </div>
                <span className="text-base font-medium">{t('settings.pushNotifications')}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg">{t('settings.privacy')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                </div>
                <span className="text-base font-medium">{t('settings.locationSharing')}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={locationSharing}
                  onChange={(e) => setLocationSharing(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Biometric Authentication */}
        {biometricAvailable && (
          <Card className="rounded-2xl">
            <CardHeader className="p-6">
              <CardTitle className="text-lg">Biometric Login</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                    <Fingerprint className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-base font-medium block">{biometricType} Login</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {biometricEnabled ? 'Enabled' : 'Not set up'}
                    </span>
                  </div>
                </div>
                {isRegisteringBiometric ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"></div>
                ) : (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={biometricEnabled}
                      onChange={handleToggleBiometric}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-600/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Language */}
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg">{t('settings.language')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                </div>
                <span className="text-base font-medium">{t('settings.language')}</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="rounded-xl border-2 border-slate-200 bg-background px-4 py-3 text-base font-medium transition-all focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 dark:border-slate-700"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="sw">Kiswahili</option>
                <option value="yo">Yorùbá (Nigeria)</option>
                <option value="ig">Igbo (Nigeria)</option>
                <option value="ha">Hausa (Nigeria/Niger)</option>
                <option value="zu">isiZulu (South Africa)</option>
                <option value="xh">isiXhosa (South Africa)</option>
                <option value="am">አማርኛ (Ethiopia)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg">{t('settings.about')}</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {t('settings.version')}
            </p>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-3">
              {t('settings.description')}
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}
