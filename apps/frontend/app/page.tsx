'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Bell, 
  MapPin, 
  FileText, 
  Users, 
  Cloud, 
  Download, 
  CheckCircle2,
  Smartphone,
  UserPlus,
  Send,
  Star,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Menu,
  X,
  AlertTriangle,
  Radio
} from 'lucide-react'
import { isAuthenticated, refreshUserData } from '@/lib/auth-storage'

export default function LandingPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const checkAndRedirect = async () => {
      try {
        if (isAuthenticated()) {
          const userData = await refreshUserData()
          if (userData) {
            setIsAuthenticatedUser(true)
            const userRole = userData.role
            if (userRole === 'SUPER_ADMIN') {
              router.replace('/admin/dashboard')
            } else if (userRole === 'SECURITY_OFFICER') {
              router.replace('/security/dashboard')
            } else {
              router.replace('/home')
            }
            return
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAndRedirect()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F172A]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#1D4ED8]/20 border-t-[#1D4ED8]"></div>
          <p className="text-sm text-white/60">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticatedUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1D4ED8] to-[#0F172A] flex items-center justify-center shadow-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#0F172A] tracking-tight">GuardianEye</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-[#0F172A] hover:text-[#1D4ED8] font-semibold transition-colors">Features</a>
              <a href="#how-it-works" className="text-[#0F172A] hover:text-[#1D4ED8] font-semibold transition-colors">How It Works</a>
              <a href="#screenshots" className="text-[#0F172A] hover:text-[#1D4ED8] font-semibold transition-colors">Screenshots</a>
              <Link href="/auth" className="px-5 py-2.5 text-[#1D4ED8] font-semibold hover:text-[#0F172A] transition-colors rounded-xl">
                Sign In
              </Link>
              <Link 
                href="/auth?mode=signup" 
                className="px-6 py-2.5 bg-gradient-to-r from-[#1D4ED8] to-[#1E40AF] text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all"
              >
                Get Started
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#0F172A] rounded-lg hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden border-t border-slate-200 bg-white"
          >
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block text-[#0F172A] hover:text-[#1D4ED8] font-semibold py-2">Features</a>
              <a href="#how-it-works" className="block text-[#0F172A] hover:text-[#1D4ED8] font-semibold py-2">How It Works</a>
              <a href="#screenshots" className="block text-[#0F172A] hover:text-[#1D4ED8] font-semibold py-2">Screenshots</a>
              <Link href="/auth" className="block text-[#1D4ED8] font-semibold py-2">Sign In</Link>
              <Link 
                href="/auth?mode=signup" 
                className="block px-4 py-3 bg-gradient-to-r from-[#1D4ED8] to-[#1E40AF] text-white font-bold rounded-xl text-center"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0F172A] via-[#1D4ED8] to-[#0F172A] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1D4ED8] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#F43F5E] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                <Radio className="h-4 w-4 text-white animate-pulse" />
                <span className="text-sm font-semibold text-white">Live Security Monitoring</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight">
                GuardianEye — Security Alerts Made Instant
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed font-medium">
                Real-time alerts, live tracking, and emergency response in one powerful app.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth?mode=signup"
                  className="group px-8 py-4 bg-white text-[#1D4ED8] font-bold rounded-2xl hover:bg-white/95 transition-all shadow-2xl hover:shadow-[#1D4ED8]/50 hover:scale-105 text-center text-lg"
                >
                  Get Started
                </Link>
                <Link
                  href="#download"
                  className="px-8 py-4 bg-transparent border-2 border-white/80 text-white font-bold rounded-2xl hover:bg-white/10 hover:border-white transition-all text-center text-lg backdrop-blur-sm"
                >
                  Download App
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Phone Mockup */}
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-white to-slate-50 rounded-[3rem] p-6 shadow-2xl border-8 border-slate-900">
                  <div className="bg-[#0F172A] rounded-[2rem] overflow-hidden">
                    {/* Phone Header */}
                    <div className="bg-gradient-to-r from-[#1D4ED8] to-[#0F172A] p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Shield className="h-6 w-6 text-white" />
                          <span className="text-white font-bold text-lg">GuardianEye</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#F43F5E] animate-pulse"></div>
                          <span className="text-white/80 text-xs font-medium">Active</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Phone Content */}
                    <div className="p-6 space-y-4 bg-[#0F172A]">
                      <div className="bg-gradient-to-r from-[#1D4ED8]/30 to-[#1D4ED8]/10 rounded-2xl p-4 border border-[#1D4ED8]/30">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-[#F43F5E] flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-white font-bold text-sm mb-1">Security Alert</div>
                            <div className="text-white/70 text-xs">Incident reported 0.5km away</div>
                            <div className="text-white/50 text-xs mt-1">2 minutes ago</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-white font-semibold text-sm">Live Tracking</div>
                          <MapPin className="h-4 w-4 text-[#1D4ED8]" />
                        </div>
                        <div className="text-white/60 text-xs">3 team members active</div>
                        <div className="mt-3 h-24 bg-gradient-to-br from-[#1D4ED8]/20 to-[#0F172A] rounded-xl flex items-center justify-center">
                          <MapPin className="h-8 w-8 text-[#1D4ED8]/40" />
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="flex-1 bg-[#F43F5E] rounded-xl p-3 text-center">
                          <span className="text-white font-bold text-xs">SOS</span>
                        </div>
                        <div className="flex-1 bg-[#1D4ED8] rounded-xl p-3 text-center">
                          <span className="text-white font-bold text-xs">Report</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute -z-10 -inset-8 bg-gradient-to-r from-[#1D4ED8] to-[#F43F5E] rounded-[3rem] blur-3xl opacity-30 animate-pulse"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] mb-6 tracking-tight">
              Powerful Features
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Everything you need for comprehensive security and emergency response
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Bell,
                title: 'Real-Time Alerts',
                description: 'Instant notifications for security incidents and emergencies in your area. Stay informed with push notifications and SMS alerts.',
                color: 'from-[#1D4ED8] to-[#1E40AF]'
              },
              {
                icon: Shield,
                title: 'SOS Button',
                description: 'One-tap emergency button that sends your location and alerts your contacts immediately. Critical for emergency situations.',
                color: 'from-[#F43F5E] to-[#DC2626]'
              },
              {
                icon: MapPin,
                title: 'Live Tracking Map',
                description: 'Real-time threat visualization with heat maps and incident markers. See security threats as they happen.',
                color: 'from-[#1D4ED8] to-[#0F172A]'
              },
              {
                icon: FileText,
                title: 'Incident Reports',
                description: 'Quickly report and document security incidents with photos, videos, and precise location data. Build a comprehensive security database.',
                color: 'from-[#0F172A] to-[#1D4ED8]'
              },
              {
                icon: Users,
                title: 'Team/Family Monitoring',
                description: 'Monitor the safety of your team members or family in real-time. Get instant alerts when they need help.',
                color: 'from-[#1D4ED8] to-[#3B82F6]'
              },
              {
                icon: Cloud,
                title: 'Cloud Security Storage',
                description: 'Secure cloud backup of all reports, evidence, and emergency data. Access your information from anywhere, anytime.',
                color: 'from-[#0F172A] to-[#1E293B]'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 hover:border-[#1D4ED8] transition-all shadow-sm hover:shadow-2xl h-full transform hover:-translate-y-2">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-base">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] mb-6 tracking-tight">
              How It Works
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: '1',
                icon: Download,
                title: 'Download GuardianEye',
                description: 'Get the app from your app store or access via web browser. Quick and easy setup takes less than 2 minutes.',
                color: 'bg-gradient-to-br from-[#1D4ED8] to-[#1E40AF]'
              },
              {
                step: '2',
                icon: UserPlus,
                title: 'Setup Emergency Contacts',
                description: 'Add your emergency contacts or team members. Configure notification preferences and alert settings.',
                color: 'bg-gradient-to-br from-[#0F172A] to-[#1D4ED8]'
              },
              {
                step: '3',
                icon: Send,
                title: 'Send or Receive Alerts',
                description: 'Start receiving real-time security alerts or send instant SOS notifications when you need help.',
                color: 'bg-gradient-to-br from-[#F43F5E] to-[#DC2626]'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center relative"
              >
                <div className="relative mb-8">
                  <div className={`w-24 h-24 ${item.color} rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform hover:scale-110 transition-transform`}>
                    <item.icon className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-slate-100">
                    <span className="text-lg font-extrabold text-[#0F172A]">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-4">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed text-base">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots / Demo Section */}
      <section id="screenshots" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] mb-6 tracking-tight">
              See It In Action
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Explore the powerful features of GuardianEye
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Dashboard Overview',
                description: 'Real-time security status and quick access to all features. Monitor everything from one central location.',
                gradient: 'from-[#1D4ED8] to-[#0F172A]',
                icon: Shield
              },
              {
                title: 'Alert System',
                description: 'Instant notifications and emergency response interface. Get alerts the moment they happen.',
                gradient: 'from-[#F43F5E] to-[#DC2626]',
                icon: Bell
              },
              {
                title: 'Tracking Map',
                description: 'Live threat visualization and location-based alerts. See security threats in real-time on an interactive map.',
                gradient: 'from-[#0F172A] to-[#1D4ED8]',
                icon: MapPin
              }
            ].map((screenshot, index) => (
              <motion.div
                key={screenshot.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
                  <div className={`bg-gradient-to-br ${screenshot.gradient} rounded-2xl p-12 h-80 flex flex-col items-center justify-center mb-6 group-hover:scale-105 transition-transform shadow-lg relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <screenshot.icon className="h-32 w-32 text-white/30 relative z-10" />
                    <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <div className="text-white text-sm font-semibold">{screenshot.title}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-3">{screenshot.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{screenshot.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0F172A] via-[#1D4ED8] to-[#0F172A] relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#F43F5E] rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#1D4ED8] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Why Choose GuardianEye
            </h2>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              Trusted by thousands for reliable security and peace of mind
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'Faster emergency response times',
              'Peace of mind for families and teams',
              'Works even with low network connectivity',
              'Accurate location-based alerts',
              '24/7 monitoring options',
              'Secure and encrypted data storage'
            ].map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all transform hover:scale-105"
              >
                <div className="flex-shrink-0">
                  <CheckCircle2 className="h-7 w-7 text-white" />
                </div>
                <span className="text-white font-semibold text-lg">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0F172A] mb-6 tracking-tight">
              What Users Say
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Trusted by security professionals and families worldwide
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Security Manager',
                rating: 5,
                text: 'GuardianEye has transformed how our security team responds to incidents. The real-time alerts are incredibly reliable and have helped us prevent multiple security threats.',
                avatar: 'SJ',
                color: 'from-[#1D4ED8] to-[#1E40AF]'
              },
              {
                name: 'Michael Chen',
                role: 'Family User',
                rating: 5,
                text: 'As a parent, GuardianEye gives me peace of mind knowing I can track my family\'s safety in real-time. The SOS button is a lifesaver. Highly recommended!',
                avatar: 'MC',
                color: 'from-[#F43F5E] to-[#DC2626]'
              },
              {
                name: 'David Okafor',
                role: 'Community Leader',
                rating: 5,
                text: 'The incident reporting feature is excellent. Our community feels safer with GuardianEye monitoring our area. The map visualization helps us identify problem zones quickly.',
                avatar: 'DO',
                color: 'from-[#0F172A] to-[#1D4ED8]'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-[#1D4ED8] text-[#1D4ED8]" />
                  ))}
                </div>
                <p className="text-slate-700 mb-8 leading-relaxed text-base font-medium">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-[#0F172A] text-lg">{testimonial.name}</div>
                    <div className="text-sm text-slate-600 font-medium">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1D4ED8] to-[#0F172A] flex items-center justify-center shadow-lg">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <span className="text-2xl font-bold">GuardianEye</span>
              </div>
              <p className="text-white/70 leading-relaxed text-lg max-w-md">
                Security alerts made instant. Real-time protection for you and your loved ones. Trusted by thousands worldwide.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Product</h4>
              <ul className="space-y-3 text-white/70">
                <li><a href="#features" className="hover:text-white transition-colors font-medium">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors font-medium">How It Works</a></li>
                <li><a href="#screenshots" className="hover:text-white transition-colors font-medium">Screenshots</a></li>
                <li><a href="#download" className="hover:text-white transition-colors font-medium">Download</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-6">Legal</h4>
              <ul className="space-y-3 text-white/70">
                <li><Link href="/privacy" className="hover:text-white transition-colors font-medium">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors font-medium">Terms of Service</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors font-medium">Contact</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <p className="text-white/60 text-center md:text-left">
                &copy; {new Date().getFullYear()} GuardianEye. All rights reserved.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors backdrop-blur-sm">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
