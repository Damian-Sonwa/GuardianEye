'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@security-app/ui'
import { Shield, CheckCircle, XCircle, Eye, ArrowLeft, Loader2, X } from 'lucide-react'
import { useRoleGuard } from '@/lib/role-guard'
import { getAuthToken } from '@/lib/auth-storage'

export default function SecurityVerificationsAdminPage() {
  const router = useRouter()
  const [verifications, setVerifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVerification, setSelectedVerification] = useState<any>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [approveNotes, setApproveNotes] = useState('')
  const [processing, setProcessing] = useState<string | null>(null)

  // Only admins can access
  useRoleGuard(['SUPER_ADMIN'])

  useEffect(() => {
    loadVerifications()
  }, [])

  const loadVerifications = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        router.push('/auth')
        return
      }

      const response = await fetch('/api/security-verification/pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setVerifications(data)
      }
    } catch (error) {
      console.error('Error loading verifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId: string) => {
    if (!confirm('Are you sure you want to approve this verification?')) return

    setProcessing(userId)
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch(`/api/security-verification/approve/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: approveNotes }),
      })

      if (response.ok) {
        alert('Verification approved successfully!')
        setApproveNotes('')
        setShowDetails(false)
        loadVerifications()
      } else {
        const error = await response.json().catch(() => ({}))
        alert(error.message || 'Failed to approve verification')
      }
    } catch (error) {
      console.error('Error approving verification:', error)
      alert('Failed to approve verification')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (userId: string) => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection')
      return
    }

    if (!confirm('Are you sure you want to reject this verification?')) return

    setProcessing(userId)
    try {
      const token = getAuthToken()
      if (!token) return

      const response = await fetch(`/api/security-verification/reject/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectReason }),
      })

      if (response.ok) {
        alert('Verification rejected')
        setRejectReason('')
        setShowDetails(false)
        loadVerifications()
      } else {
        const error = await response.json().catch(() => ({}))
        alert(error.message || 'Failed to reject verification')
      }
    } catch (error) {
      console.error('Error rejecting verification:', error)
      alert('Failed to reject verification')
    } finally {
      setProcessing(null)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            <h1 className="text-xl font-bold">Security Verifications</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        {verifications.length === 0 ? (
          <Card className="rounded-2xl max-w-2xl mx-auto">
            <CardContent className="p-12 text-center">
              <Shield className="h-16 w-16 mx-auto mb-4 text-slate-400" />
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                No Pending Verifications
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                All security personnel verifications have been processed.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {verifications.map((verification) => (
              <Card key={verification.id} className="rounded-2xl">
                <CardHeader className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {verification.user?.name || 'Unknown User'}
                      </CardTitle>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Email: {verification.user?.email}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                        Full Name: {verification.fullName || 'Not provided'}
                      </p>
                      {verification.securityIdNumber && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                          Security ID: {verification.securityIdNumber}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                        Submitted: {new Date(verification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedVerification(verification)
                          setShowDetails(true)
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Details Modal */}
        {showDetails && selectedVerification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white dark:bg-slate-800 border-b p-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                  Verification Details
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowDetails(false)
                    setSelectedVerification(null)
                    setRejectReason('')
                    setApproveNotes('')
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* User Info */}
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3">User Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedVerification.user?.name}</p>
                    <p><span className="font-medium">Email:</span> {selectedVerification.user?.email}</p>
                    <p><span className="font-medium">Full Name:</span> {selectedVerification.fullName || 'Not provided'}</p>
                    <p><span className="font-medium">Phone:</span> {selectedVerification.phoneNumber || 'Not provided'}</p>
                    <p><span className="font-medium">Security ID Number:</span> {selectedVerification.securityIdNumber || 'Not provided'}</p>
                  </div>
                </div>

                {/* ID Card Images */}
                {(selectedVerification.idCardFront || selectedVerification.idCardBack) && (
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3">Security ID Card</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedVerification.idCardFront && (
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Front</p>
                          <img
                            src={selectedVerification.idCardFront}
                            alt="ID Front"
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700"
                          />
                        </div>
                      )}
                      {selectedVerification.idCardBack && (
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Back</p>
                          <img
                            src={selectedVerification.idCardBack}
                            alt="ID Back"
                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Selfie */}
                {selectedVerification.selfieImage && (
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3">Selfie</h3>
                    <img
                      src={selectedVerification.selfieImage}
                      alt="Selfie"
                      className="w-64 rounded-lg border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                )}

                {/* Verification Questions */}
                {selectedVerification.verificationQuestions && (
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3">Verification Questions</h3>
                    <div className="space-y-2 text-sm">
                      {selectedVerification.verificationQuestions.agencyName && (
                        <p><span className="font-medium">Agency:</span> {selectedVerification.verificationQuestions.agencyName}</p>
                      )}
                      {selectedVerification.verificationQuestions.rank && (
                        <p><span className="font-medium">Rank:</span> {selectedVerification.verificationQuestions.rank}</p>
                      )}
                      {selectedVerification.verificationQuestions.commandArea && (
                        <p><span className="font-medium">Command Area:</span> {selectedVerification.verificationQuestions.commandArea}</p>
                      )}
                      {selectedVerification.verificationQuestions.supervisorName && (
                        <p><span className="font-medium">Supervisor:</span> {selectedVerification.verificationQuestions.supervisorName}</p>
                      )}
                      {selectedVerification.verificationQuestions.yearsOfService && (
                        <p><span className="font-medium">Years of Service:</span> {selectedVerification.verificationQuestions.yearsOfService}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Professional Info */}
                {(selectedVerification.organization || selectedVerification.department || selectedVerification.badgeNumber) && (
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3">Professional Information</h3>
                    <div className="space-y-2 text-sm">
                      {selectedVerification.organization && (
                        <p><span className="font-medium">Organization:</span> {selectedVerification.organization}</p>
                      )}
                      {selectedVerification.department && (
                        <p><span className="font-medium">Department:</span> {selectedVerification.department}</p>
                      )}
                      {selectedVerification.badgeNumber && (
                        <p><span className="font-medium">Badge Number:</span> {selectedVerification.badgeNumber}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="border-t pt-6 space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2 block">
                      Approval Notes (Optional)
                    </label>
                    <textarea
                      value={approveNotes}
                      onChange={(e) => setApproveNotes(e.target.value)}
                      placeholder="Add any notes about this approval..."
                      rows={2}
                      className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-slate-900 dark:text-slate-50 mb-2 block">
                      Rejection Reason <span className="text-red-500">*</span> (if rejecting)
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Please provide a reason for rejection..."
                      rows={3}
                      className="w-full rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApprove(selectedVerification.userId)}
                      disabled={processing === selectedVerification.userId}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500"
                    >
                      {processing === selectedVerification.userId ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedVerification.userId)}
                      disabled={processing === selectedVerification.userId || !rejectReason.trim()}
                      variant="destructive"
                      className="flex-1"
                    >
                      {processing === selectedVerification.userId ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
}

