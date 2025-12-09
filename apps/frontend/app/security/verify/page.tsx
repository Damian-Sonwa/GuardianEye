'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@security-app/ui'
import { Upload, Shield, CheckCircle, XCircle, Lock, ArrowLeft, Camera, X } from 'lucide-react'
import { getAuthToken, storeAuthToken, storeUserData, getUserData } from '@/lib/auth-storage'

export default function SecurityVerifyPage() {
  const router = useRouter()
  
  // Personal Details
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [address, setAddress] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  
  // Identity Documents
  const [idCard, setIdCard] = useState<File | null>(null)
  const [idCardFront, setIdCardFront] = useState<File | null>(null)
  const [idCardBack, setIdCardBack] = useState<File | null>(null)
  const [securityIdNumber, setSecurityIdNumber] = useState('')
  const [workId, setWorkId] = useState<File | null>(null)
  const [policeId, setPoliceId] = useState<File | null>(null)
  const [license, setLicense] = useState<File | null>(null)
  
  // Selfie and Verification Questions
  const [selfieImage, setSelfieImage] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [verificationQuestions, setVerificationQuestions] = useState({
    agencyName: '',
    rank: '',
    commandArea: '',
    supervisorName: '',
    yearsOfService: ''
  })
  
  // Professional Details
  const [badgeNumber, setBadgeNumber] = useState('')
  const [organization, setOrganization] = useState('')
  const [department, setDepartment] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [rank, setRank] = useState('')
  const [yearsOfExperience, setYearsOfExperience] = useState('')
  const [certificate, setCertificate] = useState<File | null>(null)
  const [trainingCert, setTrainingCert] = useState<File | null>(null)
  
  // Additional Evidence
  const [previousEmployer, setPreviousEmployer] = useState('')
  const [additionalDocs, setAdditionalDocs] = useState<File[]>([])
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null)
  const [user, setUser] = useState<any>(null)
  const [activeSection, setActiveSection] = useState<'personal' | 'documents' | 'verification' | 'professional' | 'evidence'>('personal')

  useEffect(() => {
    // Get user from localStorage or check if logged in
    const pendingUser = localStorage.getItem('pending_verification_user')
    const currentUser = getUserData()
    
    if (pendingUser) {
      const parsed = JSON.parse(pendingUser)
      setUser(parsed)
      // Clear pending user
      localStorage.removeItem('pending_verification_user')
    } else if (currentUser) {
      setUser(currentUser)
      checkVerificationStatus()
    } else {
      router.push('/auth?mode=signup')
    }
  }, [router])

  const checkVerificationStatus = async () => {
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch('/api/security-verification/status', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data) {
          setVerificationStatus(data.status)
          if (data.status === 'approved') {
            // Redirect to PIN setup
            router.push('/security/setup-pin')
          }
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error)
    }
  }

  const handleFileUpload = (type: 'idCard' | 'idCardFront' | 'idCardBack' | 'workId' | 'policeId' | 'license' | 'certificate' | 'trainingCert', file: File | null) => {
    if (type === 'idCard') setIdCard(file)
    if (type === 'idCardFront') setIdCardFront(file)
    if (type === 'idCardBack') setIdCardBack(file)
    if (type === 'workId') setWorkId(file)
    if (type === 'policeId') setPoliceId(file)
    if (type === 'license') setLicense(file)
    if (type === 'certificate') setCertificate(file)
    if (type === 'trainingCert') setTrainingCert(file)
  }

  const captureSelfie = () => {
    setShowCamera(true)
  }

  const handleSelfieCapture = async (imageDataUrl: string) => {
    setSelfieImage(imageDataUrl)
    setShowCamera(false)
  }

  // Camera component
  const CameraModal = () => {
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const [stream, setStream] = React.useState<MediaStream | null>(null)

    React.useEffect(() => {
      if (showCamera) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
          .then((mediaStream) => {
            setStream(mediaStream)
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream
            }
          })
          .catch((error) => {
            console.error('Error accessing camera:', error)
            alert('Unable to access camera. Please check permissions.')
            setShowCamera(false)
          })
      }

      return () => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop())
        }
      }
    }, [showCamera])

    const capturePhoto = () => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current
        const video = videoRef.current
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0)
          const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
          handleSelfieCapture(imageDataUrl)
        }
      }
    }

    if (!showCamera) return null

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl p-6 m-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Capture Selfie</h3>
            <button
              onClick={() => {
                if (stream) {
                  stream.getTracks().forEach(track => track.stop())
                }
                setShowCamera(false)
              }}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg"
              style={{ transform: 'scaleX(-1)' }}
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <div className="mt-4 flex gap-3">
            <Button
              type="button"
              onClick={() => {
                if (stream) {
                  stream.getTracks().forEach(track => track.stop())
                }
                setShowCamera(false)
              }}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={capturePhoto}
              className="flex-1"
            >
              <Camera className="mr-2 h-5 w-5" />
              Capture
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleAdditionalDocs = (files: FileList | null) => {
    if (files) {
      setAdditionalDocs(Array.from(files))
    }
  }

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', 'verification')

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload file')
    }

    const data = await response.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!fullName.trim()) {
      alert('Please enter your full name')
      return
    }

    if (!idCardFront || !idCardBack) {
      alert('Please upload both front and back of your Security ID card')
      return
    }

    if (!securityIdNumber.trim()) {
      alert('Please enter your Security ID number')
      return
    }

    if (!verificationQuestions.agencyName.trim() || !verificationQuestions.rank.trim() || 
        !verificationQuestions.commandArea.trim() || !verificationQuestions.supervisorName.trim()) {
      alert('Please answer all verification questions')
      return
    }

    if (!selfieImage) {
      alert('Please capture a live selfie for identity verification')
      return
    }

    setIsSubmitting(true)

    try {
      // Upload all files
      const uploads: { [key: string]: string } = {}
      
      if (idCard) {
        uploads.idCardUrl = await uploadFile(idCard)
      }
      if (idCardFront) {
        uploads.idCardFront = await uploadFile(idCardFront)
      }
      if (idCardBack) {
        uploads.idCardBack = await uploadFile(idCardBack)
      }
      if (workId) {
        uploads.workIdUrl = await uploadFile(workId)
      }
      if (policeId) {
        uploads.policeIdUrl = await uploadFile(policeId)
      }
      if (license) {
        uploads.licenseUrl = await uploadFile(license)
      }
      if (certificate) {
        uploads.certificateUrl = await uploadFile(certificate)
      }
      if (trainingCert) {
        uploads.trainingCertUrl = await uploadFile(trainingCert)
      }
      
      // Upload selfie if it's a data URL
      if (selfieImage && selfieImage.startsWith('data:')) {
        const response = await fetch(selfieImage)
        const blob = await response.blob()
        const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' })
        uploads.selfieImage = await uploadFile(file)
      } else if (selfieImage) {
        uploads.selfieImage = selfieImage
      }

      // Upload additional documents
      const additionalDocUrls: string[] = []
      for (const doc of additionalDocs) {
        const url = await uploadFile(doc)
        additionalDocUrls.push(url)
      }

      // Submit verification
      const token = getAuthToken()
      if (!token) {
        alert('Please login first to submit verification')
        router.push('/auth')
        return
      }

      const submitData: any = {
        // Personal Details
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim() || undefined,
        address: address.trim() || undefined,
        dateOfBirth: dateOfBirth || undefined,
        // Identity Documents
        ...uploads,
        securityIdNumber: securityIdNumber.trim(),
        // Professional Details
        badgeNumber: badgeNumber.trim() || undefined,
        organization: organization.trim() || undefined,
        department: department.trim() || undefined,
        licenseNumber: licenseNumber.trim() || undefined,
        rank: rank.trim() || undefined,
        yearsOfExperience: yearsOfExperience ? parseInt(yearsOfExperience) : undefined,
        // Verification Requirements
        selfieImage: uploads.selfieImage,
        verificationQuestions: {
          agencyName: verificationQuestions.agencyName.trim(),
          rank: verificationQuestions.rank.trim(),
          commandArea: verificationQuestions.commandArea.trim(),
          supervisorName: verificationQuestions.supervisorName.trim(),
          yearsOfService: verificationQuestions.yearsOfService.trim() || undefined,
        },
        // Additional Evidence
        previousEmployer: previousEmployer.trim() || undefined,
        additionalDocs: additionalDocUrls.length > 0 ? additionalDocUrls.map((url, idx) => ({
          url,
          name: additionalDocs[idx]?.name || `Document ${idx + 1}`,
          type: additionalDocs[idx]?.type || 'unknown'
        })) : undefined,
      }

      const response = await fetch('/api/security-verification/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        alert('Verification documents submitted successfully! Your documents are under review. You will be notified once approved.')
        setVerificationStatus('pending')
        setTimeout(() => checkVerificationStatus(), 5000)
      } else {
        const error = await response.json().catch(() => ({}))
        alert(error.message || 'Failed to submit verification documents')
      }
    } catch (error: any) {
      console.error('Error submitting verification:', error)
      alert(`Error: ${error.message || 'Failed to submit verification'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (verificationStatus === 'approved') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="mb-8">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
              <CheckCircle className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-slate-50">
              Verification Approved!
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Your identity has been verified. Please set up your PIN for quick login.
            </p>
          </div>
          <Button size="lg" onClick={() => router.push('/security/setup-pin')} className="w-full h-14">
            <Lock className="mr-2 h-5 w-5" />
            Set Up PIN
          </Button>
        </motion.div>
      </div>
    )
  }

  const [rejectionReason, setRejectionReason] = useState<string | null>(null)

  useEffect(() => {
    if (verificationStatus === 'rejected') {
      // Fetch rejection reason
      const fetchRejectionReason = async () => {
        try {
          const token = getAuthToken()
          if (!token) return

          const response = await fetch('/api/security-verification/status', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })

          if (response.ok) {
            const data = await response.json()
            if (data?.rejectionReason) {
              setRejectionReason(data.rejectionReason)
            }
          }
        } catch (error) {
          console.error('Error fetching rejection reason:', error)
        }
      }
      fetchRejectionReason()
    }
  }, [verificationStatus])

  if (verificationStatus === 'rejected') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="mb-8">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="mb-4 text-3xl font-bold text-slate-900 dark:text-slate-50">
              Verification Rejected
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-4">
              Your verification documents were not approved.
            </p>
            {rejectionReason && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">Reason:</p>
                <p className="text-sm text-red-700 dark:text-red-300">{rejectionReason}</p>
              </div>
            )}
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Please review the requirements and resubmit your verification documents.
            </p>
          </div>
          <div className="space-y-3">
            <Button size="lg" onClick={() => setVerificationStatus(null)} className="w-full h-14">
              Resubmit Verification
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push('/login')} className="w-full h-14">
              Go to Login
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <CameraModal />
      <div className="flex min-h-screen flex-col bg-background pb-20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold">Identity Verification</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <Card className="rounded-2xl max-w-2xl mx-auto">
          <CardHeader className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              <CardTitle className="text-lg">Security Personnel Verification</CardTitle>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Please upload your identification documents to verify your identity as security personnel.
            </p>
            {verificationStatus === 'pending' && (
              <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  ⏳ Your verification is pending review. You will be notified once approved.
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section Navigation */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button
                  type="button"
                  onClick={() => setActiveSection('personal')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeSection === 'personal'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Personal Details
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('documents')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeSection === 'documents'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Security ID
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('verification')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeSection === 'verification'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Verification
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('professional')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeSection === 'professional'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Professional Info
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSection('evidence')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    activeSection === 'evidence'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Additional Evidence
                </button>
              </div>

              {/* Personal Details Section */}
              {activeSection === 'personal' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Personal Information</h3>
                  
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full legal name"
                      required
                      className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Phone Number
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter your contact number"
                      className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Address
                    </label>
                    <textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your residential or office address"
                      rows={3}
                      className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-3 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="dateOfBirth" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Date of Birth
                    </label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>
              )}

              {/* Security ID Documents Section */}
              {activeSection === 'documents' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Security ID Card</h3>
                  
                  {/* Security ID Number */}
                  <div className="space-y-2">
                    <label htmlFor="securityIdNumber" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Security ID Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="securityIdNumber"
                      type="text"
                      value={securityIdNumber}
                      onChange={(e) => setSecurityIdNumber(e.target.value)}
                      placeholder="Enter your official Security ID number"
                      required
                      className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    />
                  </div>

                  {/* Security ID Card Front */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Security ID Card - Front <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center">
                      <input
                        type="file"
                        id="idCardFront"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('idCardFront', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="idCardFront" className="cursor-pointer">
                        <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {idCardFront ? idCardFront.name : 'Click to upload Security ID card (front)'}
                        </p>
                      </label>
                    </div>
                    {idCardFront && (
                      <img src={URL.createObjectURL(idCardFront)} alt="ID Front" className="mt-2 rounded-lg max-w-full h-32 object-contain" />
                    )}
                  </div>

                  {/* Security ID Card Back */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Security ID Card - Back <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center">
                      <input
                        type="file"
                        id="idCardBack"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('idCardBack', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="idCardBack" className="cursor-pointer">
                        <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {idCardBack ? idCardBack.name : 'Click to upload Security ID card (back)'}
                        </p>
                      </label>
                    </div>
                    {idCardBack && (
                      <img src={URL.createObjectURL(idCardBack)} alt="ID Back" className="mt-2 rounded-lg max-w-full h-32 object-contain" />
                    )}
                  </div>

                  {/* Work ID Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Work ID Card
                    </label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center">
                      <input
                        type="file"
                        id="workId"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload('workId', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="workId" className="cursor-pointer">
                        <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {workId ? workId.name : 'Click to upload work ID'}
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* Police ID Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Police ID / Badge
                    </label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center">
                      <input
                        type="file"
                        id="policeId"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload('policeId', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="policeId" className="cursor-pointer">
                        <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {policeId ? policeId.name : 'Click to upload police ID'}
                        </p>
                      </label>
                    </div>
                  </div>

                  {/* License Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Professional License Document
                    </label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center">
                      <input
                        type="file"
                        id="license"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload('license', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="license" className="cursor-pointer">
                        <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {license ? license.name : 'Click to upload license document'}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Verification Section - Questions and Selfie */}
              {activeSection === 'verification' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Verification Questions & Identity</h3>
                  
                  {/* Verification Questions */}
                  <div className="space-y-4 mb-6">
                    <div className="space-y-2">
                      <label htmlFor="agencyName" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        Agency/Organization Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="agencyName"
                        type="text"
                        value={verificationQuestions.agencyName}
                        onChange={(e) => setVerificationQuestions({...verificationQuestions, agencyName: e.target.value})}
                        placeholder="Enter your security agency name"
                        required
                        className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="rank" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        Rank/Position <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="rank"
                        type="text"
                        value={verificationQuestions.rank}
                        onChange={(e) => setVerificationQuestions({...verificationQuestions, rank: e.target.value})}
                        placeholder="Enter your rank or position"
                        required
                        className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="commandArea" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        Command Area/Unit <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="commandArea"
                        type="text"
                        value={verificationQuestions.commandArea}
                        onChange={(e) => setVerificationQuestions({...verificationQuestions, commandArea: e.target.value})}
                        placeholder="Enter your command area or unit"
                        required
                        className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="supervisorName" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        Supervisor Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="supervisorName"
                        type="text"
                        value={verificationQuestions.supervisorName}
                        onChange={(e) => setVerificationQuestions({...verificationQuestions, supervisorName: e.target.value})}
                        placeholder="Enter your supervisor's name"
                        required
                        className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="yearsOfService" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                        Years of Service
                      </label>
                      <input
                        id="yearsOfService"
                        type="text"
                        value={verificationQuestions.yearsOfService}
                        onChange={(e) => setVerificationQuestions({...verificationQuestions, yearsOfService: e.target.value})}
                        placeholder="Enter years of service (optional)"
                        className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>

                  {/* Selfie Capture */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Live Selfie for Identity Verification <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center">
                      {!selfieImage ? (
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                            Capture a live selfie to verify your identity
                          </p>
                          <Button
                            type="button"
                            onClick={captureSelfie}
                            className="w-full"
                          >
                            <Upload className="mr-2 h-5 w-5" />
                            Capture Selfie
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <img src={selfieImage} alt="Selfie" className="mx-auto rounded-lg max-w-full h-48 object-contain mb-4" />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={captureSelfie}
                            className="w-full"
                          >
                            Retake Selfie
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Information Section */}
              {activeSection === 'professional' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Professional Information</h3>
                  
                  <div className="space-y-2">
                    <label htmlFor="badgeNumber" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Badge Number
                    </label>
                    <input
                      id="badgeNumber"
                      type="text"
                      value={badgeNumber}
                      onChange={(e) => setBadgeNumber(e.target.value)}
                      placeholder="Enter your badge number"
                      className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="organization" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Organization
                    </label>
                    <input
                      id="organization"
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Enter your security organization name"
                      className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="department" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Department / Unit
                    </label>
                    <input
                      id="department"
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Enter your department or unit name"
                      className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="licenseNumber" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      License Number
                    </label>
                    <input
                      id="licenseNumber"
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="Enter your professional license number"
                      className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="rank" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Rank / Position
                    </label>
                    <input
                      id="rank"
                      type="text"
                      value={rank}
                      onChange={(e) => setRank(e.target.value)}
                      placeholder="Enter your rank or position"
                      className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="yearsOfExperience" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Years of Experience
                    </label>
                    <input
                      id="yearsOfExperience"
                      type="number"
                      min="0"
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(e.target.value)}
                      placeholder="Enter years of experience"
                      className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Professional Certificate
                    </label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center">
                      <input
                        type="file"
                        id="certificate"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload('certificate', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="certificate" className="cursor-pointer">
                        <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {certificate ? certificate.name : 'Click to upload certificate'}
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Training Certificate
                    </label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center">
                      <input
                        type="file"
                        id="trainingCert"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileUpload('trainingCert', e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <label htmlFor="trainingCert" className="cursor-pointer">
                        <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {trainingCert ? trainingCert.name : 'Click to upload training certificate'}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Evidence Section */}
              {activeSection === 'evidence' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Additional Evidence</h3>
                  
                  <div className="space-y-2">
                    <label htmlFor="previousEmployer" className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Previous Employer
                    </label>
                    <input
                      id="previousEmployer"
                      type="text"
                      value={previousEmployer}
                      onChange={(e) => setPreviousEmployer(e.target.value)}
                      placeholder="Enter previous employer information (if applicable)"
                      className="w-full h-14 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 text-base font-medium text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      Additional Documents
                    </label>
                    <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center">
                      <input
                        type="file"
                        id="additionalDocs"
                        accept="image/*,.pdf"
                        multiple
                        onChange={(e) => handleAdditionalDocs(e.target.files)}
                        className="hidden"
                      />
                      <label htmlFor="additionalDocs" className="cursor-pointer">
                        <Upload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {additionalDocs.length > 0 
                            ? `${additionalDocs.length} file(s) selected`
                            : 'Click to upload additional documents (multiple files allowed)'}
                        </p>
                      </label>
                    </div>
                    {additionalDocs.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {additionalDocs.map((doc, idx) => (
                          <p key={idx} className="text-xs text-slate-600 dark:text-slate-400">
                            • {doc.name}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Submit Button - Always visible */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || !fullName.trim() || !idCardFront || !idCardBack || !securityIdNumber.trim() || !verificationQuestions.agencyName.trim() || !verificationQuestions.rank.trim() || !verificationQuestions.commandArea.trim() || !verificationQuestions.supervisorName.trim() || !selfieImage || verificationStatus === 'pending'}
                  className="w-full h-14"
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : verificationStatus === 'pending' ? (
                    'Verification Pending'
                  ) : (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      Submit for Verification
                    </>
                  )}
                </Button>
                <p className="mt-3 text-xs text-center text-slate-500 dark:text-slate-400">
                  Please fill in all required fields (*), upload Security ID front/back, answer verification questions, and capture a selfie
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
    </>
  )
}

