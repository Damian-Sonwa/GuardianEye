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
  X
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#0F172A] flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-[#0F172A]">GuardianEye</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-[#0F172A] hover:text-[#1D4ED8] font-medium transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-[#0F172A] hover:text-[#1D4ED8] font-medium transition-colors">How It Works</Link>
              <Link href="#screenshots" className="text-[#0F172A] hover:text-[#1D4ED8] font-medium transition-colors">Screenshots</Link>
              <Link href="/auth" className="px-4 py-2 text-[#1D4ED8] font-semibold hover:text-[#0F172A] transition-colors">Sign In</Link>
              <Link href="/auth?mode=signup" className="px-6 py-2 bg-[#1D4ED8] text-white font-semibold rounded-xl hover:bg-[#1E40AF] transition-colors">
                Get Started
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#0F172A]"
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
            className="md:hidden border-t border-slate-200 bg-white"
          >
            <div className="px-4 py-4 space-y-4">
              <Link href="#features" className="block text-[#0F172A] hover:text-[#1D4ED8] font-medium">Features</Link>
              <Link href="#how-it-works" className="block text-[#0F172A] hover:text-[#1D4ED8] font-medium">How It Works</Link>
              <Link href="#screenshots" className="block text-[#0F172A] hover:text-[#1D4ED8] font-medium">Screenshots</Link>
              <Link href="/auth" className="block text-[#1D4ED8] font-semibold">Sign In</Link>
              <Link href="/auth?mode=signup" className="block px-4 py-2 bg-[#1D4ED8] text-white font-semibold rounded-xl text-center">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0F172A] via-[#1D4ED8] to-[#0F172A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                GuardianEye — Security Alerts Made Instant
              </h1>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Real-time alerts, live tracking, and emergency response in one powerful app.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auth?mode=signup"
                  className="px-8 py-4 bg-white text-[#1D4ED8] font-bold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
                <Link
                  href="#download"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                >
                  Download App
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <div className="bg-gradient-to-br from-white to-slate-100 rounded-3xl p-8 shadow-2xl">
                  <div className="bg-[#0F172A] rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-[#1D4ED8]" />
                        <span className="text-white font-bold">GuardianEye</span>
                      </div>
                      <div className="w-3 h-3 rounded-full bg-[#F43F5E] animate-pulse"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-[#1D4ED8]/20 rounded-lg p-3">
                        <div className="text-white text-sm font-semibold">Security Alert</div>
                        <div className="text-white/60 text-xs">Incident reported nearby</div>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-3">
                        <div className="text-white text-sm font-semibold">Live Tracking</div>
                        <div className="text-white/60 text-xs">3 team members active</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 -inset-4 bg-gradient-to-r from-[#1D4ED8] to-[#0F172A] rounded-3xl blur-2xl opacity-50"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need for comprehensive security and emergency response
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Bell,
                title: 'Real-Time Alerts',
                description: 'Instant notifications for security incidents and emergencies in your area.',
                color: 'from-[#1D4ED8] to-[#1E40AF]'
              },
              {
                icon: Shield,
                title: 'SOS Button',
                description: 'One-tap emergency button that sends your location and alerts your contacts immediately.',
                color: 'from-[#F43F5E] to-[#DC2626]'
              },
              {
                icon: MapPin,
                title: 'Live Tracking Map',
                description: 'Real-time threat visualization with heat maps and incident markers.',
                color: 'from-[#1D4ED8] to-[#0F172A]'
              },
              {
                icon: FileText,
                title: 'Incident Reports',
                description: 'Quickly report and document security incidents with photos and location data.',
                color: 'from-[#0F172A] to-[#1D4ED8]'
              },
              {
                icon: Users,
                title: 'Team/Family Monitoring',
                description: 'Monitor the safety of your team members or family in real-time.',
                color: 'from-[#1D4ED8] to-[#3B82F6]'
              },
              {
                icon: Cloud,
                title: 'Cloud Security Storage',
                description: 'Secure cloud backup of all reports, evidence, and emergency data.',
                color: 'from-[#0F172A] to-[#1E293B]'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-[#1D4ED8] transition-all shadow-sm hover:shadow-xl h-full">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">How It Works</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: Download,
                title: 'Download GuardianEye',
                description: 'Get the app from your app store or access via web browser. Quick and easy setup.',
                color: 'bg-[#1D4ED8]'
              },
              {
                step: '2',
                icon: UserPlus,
                title: 'Setup Emergency Contacts',
                description: 'Add your emergency contacts or team members. Configure notification preferences.',
                color: 'bg-[#0F172A]'
              },
              {
                step: '3',
                icon: Send,
                title: 'Send or Receive Alerts',
                description: 'Start receiving real-time security alerts or send instant SOS notifications when needed.',
                color: 'bg-[#F43F5E]'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="relative mb-6">
                  <div className={`w-20 h-20 ${item.color} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-slate-200">
                    <span className="text-sm font-bold text-[#0F172A]">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots / Demo Section */}
      <section id="screenshots" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">See It In Action</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Explore the powerful features of GuardianEye
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Dashboard Overview',
                description: 'Real-time security status and quick access to all features',
                gradient: 'from-[#1D4ED8] to-[#0F172A]'
              },
              {
                title: 'Alert System',
                description: 'Instant notifications and emergency response interface',
                gradient: 'from-[#F43F5E] to-[#DC2626]'
              },
              {
                title: 'Tracking Map',
                description: 'Live threat visualization and location-based alerts',
                gradient: 'from-[#0F172A] to-[#1D4ED8]'
              }
            ].map((screenshot, index) => (
              <motion.div
                key={screenshot.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all">
                  <div className={`bg-gradient-to-br ${screenshot.gradient} rounded-xl p-8 h-64 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform`}>
                    <Smartphone className="h-24 w-24 text-white/20" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] mb-2">{screenshot.title}</h3>
                  <p className="text-slate-600">{screenshot.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#0F172A] to-[#1D4ED8]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Why Choose GuardianEye</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
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
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <CheckCircle2 className="h-6 w-6 text-white flex-shrink-0" />
                <span className="text-white font-medium text-lg">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#0F172A] mb-4">What Users Say</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Trusted by security professionals and families worldwide
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Security Manager',
                rating: 5,
                text: 'GuardianEye has transformed how our security team responds to incidents. The real-time alerts are incredibly reliable.',
                avatar: 'SJ'
              },
              {
                name: 'Michael Chen',
                role: 'Family User',
                rating: 5,
                text: 'As a parent, GuardianEye gives me peace of mind knowing I can track my family\'s safety in real-time. Highly recommended!',
                avatar: 'MC'
              },
              {
                name: 'David Okafor',
                role: 'Community Leader',
                rating: 5,
                text: 'The incident reporting feature is excellent. Our community feels safer with GuardianEye monitoring our area.',
                avatar: 'DO'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[#1D4ED8] text-[#1D4ED8]" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1D4ED8] to-[#0F172A] flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-[#0F172A]">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1D4ED8] to-[#0F172A] flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">GuardianEye</span>
              </div>
              <p className="text-white/60 leading-relaxed">
                Security alerts made instant. Real-time protection for you and your loved ones.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-white/60">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link href="#screenshots" className="hover:text-white transition-colors">Screenshots</Link></li>
                <li><Link href="#download" className="hover:text-white transition-colors">Download</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-white/60">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-white/60">
            <p>&copy; {new Date().getFullYear()} GuardianEye. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
