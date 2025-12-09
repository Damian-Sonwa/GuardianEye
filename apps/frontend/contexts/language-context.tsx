'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'fr' | 'sw' | 'yo' | 'ig' | 'ha' | 'zu' | 'xh' | 'am'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Helper function to get all translation keys
const getBaseTranslations = () => ({
  // Navigation
  'nav.home': 'Home',
  'nav.map': 'Map',
  'nav.panic': 'Panic',
  'nav.profile': 'Profile',
  'nav.settings': 'Settings',
  
  // Common
  'common.back': 'Back',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.close': 'Close',
  
  // Settings
  'settings.title': 'Settings',
  'settings.appearance': 'Appearance',
  'settings.theme': 'Theme',
  'settings.light': 'Light',
  'settings.dark': 'Dark',
  'settings.system': 'System',
  'settings.notifications': 'Notifications',
  'settings.pushNotifications': 'Push Notifications',
  'settings.privacy': 'Privacy & Security',
  'settings.locationSharing': 'Location Sharing',
  'settings.language': 'Language',
  'settings.about': 'About',
  'settings.version': 'Security App v1.0.0',
  'settings.description': 'Community safety and security reporting platform',
  
  // Profile
  'profile.title': 'Profile',
  'profile.guestUser': 'Guest User',
  'profile.notSignedIn': 'Not signed in',
  'profile.reports': 'Reports',
  'profile.alerts': 'Alerts',
  'profile.notifications': 'Notifications',
  'profile.communityWatch': 'Community Watch',
  'profile.signOut': 'Sign Out',
  
  // Home
  'home.title': 'Security App',
  'home.quickActions': 'Quick Actions',
  'home.panicButton': 'Panic Button',
  'home.emergencyAlert': 'Emergency alert',
  'home.report': 'Report',
  'home.fileIncident': 'File an incident',
  'home.threatMap': 'Threat Map',
  'home.viewHotspots': 'View hotspots',
  'home.identify': 'Identify',
  'home.aiFaceScan': 'AI face scan',
  'home.communityAlerts': 'Community Alerts',
  'home.safeRoutes': 'Safe Route Suggestions',
  'home.recommendedPaths': 'Recommended paths based on recent reports',
  'home.viewRoutes': 'View Routes',
  
  // Panic
  'panic.title': 'Panic Button',
  'panic.emergencyAlert': 'Emergency Alert',
  'panic.pressButton': 'Press the button below to send an emergency alert with your location',
  'panic.activate': 'ACTIVATE PANIC',
  'panic.pressToActivate': 'Press to Activate',
  'panic.locationReady': 'Location ready',
  'panic.alertSent': 'ALERT SENT!',
  'panic.helpOnWay': 'Your emergency alert has been sent to security agencies',
  'panic.helpOnWay2': 'Help is on the way',
  'panic.call911': 'Call 911',
  
  // Report
  'report.title': 'Report Incident',
  'report.description': 'Description',
  'report.describePlaceholder': 'Describe what happened...',
  'report.addMedia': 'Add Media',
  'report.photo': 'Photo',
  'report.video': 'Video',
  'report.audio': 'Audio',
  'report.location': 'Location',
  'report.locationCaptured': 'Location captured',
  'report.getLocation': 'Get Location',
  'report.submit': 'Submit Report',
  'report.remove': 'Remove',
  
  // Map
  'map.title': 'Threat Map',
  'map.legend': 'Legend',
  'map.highRisk': 'High Risk',
  'map.warning': 'Warning',
  'map.you': 'You',
  
  // Identify
  'identify.title': 'AI Face Identification',
  'identify.uploadPhoto': 'Upload Photo',
  'identify.takePhoto': 'Take a photo or upload an image',
  'identify.chooseFile': 'Choose File',
  'identify.takePhotoBtn': 'Take Photo',
  'identify.remove': 'Remove',
  'identify.identify': 'Identify',
  'identify.processing': 'Processing...',
  'identify.matchResults': 'Match Results',
  'identify.noMatches': 'No matches found',
  'identify.confidence': 'Confidence',
  'identify.disclaimer': 'Note: This is an AI-powered identification tool. Results should be verified by security personnel. False positives are possible.',
})

const translations: Record<Language, Record<string, string>> = {
  en: getBaseTranslations(),
  
  fr: {
    ...getBaseTranslations(),
    'nav.home': 'Accueil',
    'nav.map': 'Carte',
    'nav.panic': 'Panique',
    'nav.profile': 'Profil',
    'nav.settings': 'Paramètres',
    'settings.title': 'Paramètres',
    'settings.language': 'Langue',
    'home.title': 'Application de sécurité',
  },
  
  sw: {
    ...getBaseTranslations(),
    'nav.home': 'Nyumbani',
    'nav.map': 'Ramani',
    'nav.panic': 'Hofu',
    'nav.profile': 'Wasifu',
    'nav.settings': 'Mipangilio',
    'settings.title': 'Mipangilio',
    'settings.language': 'Lugha',
    'home.title': 'Programu ya Usalama',
  },
  
  // Yoruba (Nigeria)
  yo: {
    ...getBaseTranslations(),
    'nav.home': 'Ile',
    'nav.map': 'Maapu',
    'nav.panic': 'Irora',
    'nav.profile': 'Profaili',
    'nav.settings': 'Eto',
    'settings.title': 'Eto',
    'settings.language': 'Ede',
    'home.title': 'Ohun elo Aabo',
    'panic.title': 'Bọtini Irora',
    'panic.activate': 'MU IRORA SE',
    'report.title': 'Fi Iṣẹlẹ Jẹ',
    'report.submit': 'Fi Ijẹrẹ Forukọsilẹ',
  },
  
  // Igbo (Nigeria)
  ig: {
    ...getBaseTranslations(),
    'nav.home': 'Ụlọ',
    'nav.map': 'Map',
    'nav.panic': 'Ụjọ',
    'nav.profile': 'Profaịlụ',
    'nav.settings': 'Ntọala',
    'settings.title': 'Ntọala',
    'settings.language': 'Asụsụ',
    'home.title': 'Ngwa Nchekwa',
    'panic.title': 'Bọtịn Ụjọ',
    'panic.activate': 'MEE ỤJỌ',
    'report.title': 'Kọọ Ihe Mere',
    'report.submit': 'Ziga Akụkọ',
  },
  
  // Hausa (Nigeria, Niger)
  ha: {
    ...getBaseTranslations(),
    'nav.home': 'Gida',
    'nav.map': 'Taswira',
    'nav.panic': 'Tsoro',
    'nav.profile': 'Bayanan',
    'nav.settings': 'Saituna',
    'settings.title': 'Saituna',
    'settings.language': 'Harshe',
    'home.title': 'App na Tsaro',
    'panic.title': 'Maballin Tsoro',
    'panic.activate': 'KUNNA TSORO',
    'report.title': 'Bayar da Rahoto',
    'report.submit': 'Aika Rahoto',
  },
  
  // Zulu (South Africa)
  zu: {
    ...getBaseTranslations(),
    'nav.home': 'Ikhaya',
    'nav.map': 'Imephu',
    'nav.panic': 'Ukwesaba',
    'nav.profile': 'Iphrofayili',
    'nav.settings': 'Izilungiselelo',
    'settings.title': 'Izilungiselelo',
    'settings.language': 'Ulimi',
    'home.title': 'Uhlelo Lokuphepha',
    'panic.title': 'Inkinobho Yokwesaba',
    'panic.activate': 'SEBENZISA UKWESABA',
    'report.title': 'Bika Isigameko',
    'report.submit': 'Thumela Umbiko',
  },
  
  // Xhosa (South Africa)
  xh: {
    ...getBaseTranslations(),
    'nav.home': 'Indlu',
    'nav.map': 'Imephu',
    'nav.panic': 'Ukoyika',
    'nav.profile': 'Iprofayile',
    'nav.settings': 'Izicwangciso',
    'settings.title': 'Izicwangciso',
    'settings.language': 'Ulwimi',
    'home.title': 'Isicelo soKhuseleko',
    'panic.title': 'Iqhosha loKoyika',
    'panic.activate': 'SEBENZISA UKOYIKA',
    'report.title': 'Xela Isigameko',
    'report.submit': 'Thumela Ingxelo',
  },
  
  // Amharic (Ethiopia)
  am: {
    ...getBaseTranslations(),
    'nav.home': 'ቤት',
    'nav.map': 'ካርታ',
    'nav.panic': 'ፓኒክ',
    'nav.profile': 'መገለጫ',
    'nav.settings': 'ቅንብሮች',
    'settings.title': 'ቅንብሮች',
    'settings.language': 'ቋንቋ',
    'home.title': 'ደህንነት መተግበሪያ',
    'panic.title': 'ፓኒክ ቁልፍ',
    'panic.activate': 'ፓኒክ ያግብሩ',
    'report.title': 'ክስተት ሪፖርት',
    'report.submit': 'ሪፖርት ላክ',
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('app-language') as Language
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('app-language', lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
