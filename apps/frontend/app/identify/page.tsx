'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@security-app/ui'
import { Camera, Upload, User, AlertCircle, CheckCircle } from 'lucide-react'
import BottomNav from '@/components/bottom-nav'

export default function IdentifyPage() {
  const router = useRouter()
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [results, setResults] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
      setResults(null)
    }
  }

  const handleIdentify = async () => {
    if (!image) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('image', image)

      const response = await fetch('/api/ai/face-match', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      setResults(data.matches || [])
    } catch (error) {
      console.error('Error identifying face:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">AI Face Identification</h1>
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            ×
          </Button>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        {/* Upload Section */}
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg">Upload Photo</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-6">
            {!preview ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-12 space-y-6 bg-slate-50 dark:bg-slate-800">
                <Camera className="h-16 w-16 text-slate-400" />
                <div className="text-center space-y-4">
                  <p className="text-base font-medium text-slate-600 dark:text-slate-400">
                    Take a photo or upload an image
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-14 border-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-5 w-5" />
                      Choose File
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-14 border-2"
                      onClick={() => {
                        const input = document.createElement('input')
                        input.type = 'file'
                        input.accept = 'image/*'
                        input.capture = 'environment'
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0]
                          if (file) {
                            setImage(file)
                            setPreview(URL.createObjectURL(file))
                          }
                        }
                        input.click()
                      }}
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Take Photo
                    </Button>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.1)]"
                />
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 h-14 border-2"
                    onClick={() => {
                      setPreview(null)
                      setImage(null)
                      setResults(null)
                    }}
                  >
                    Remove
                  </Button>
                  <Button
                    size="lg"
                    className="flex-1 h-14"
                    onClick={handleIdentify}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Identify'}
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card className="rounded-2xl">
              <CardHeader className="p-6">
                <CardTitle className="text-lg">Match Results</CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                {results.length > 0 ? (
                  <div className="space-y-3">
                    {results.map((match, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-5 border-2 border-slate-200 rounded-xl hover:border-emerald-200 transition-colors dark:border-slate-700"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <User className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                          </div>
                          <div>
                            <p className="font-semibold text-base">{match.name || 'Unknown'}</p>
                            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                              Confidence: {(match.confidence * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                        {match.confidence > 0.8 ? (
                          <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                        ) : (
                          <CheckCircle className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-600 dark:text-slate-400">
                    <p className="text-base font-medium">No matches found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Disclaimer */}
        <Card className="border-2 border-amber-200 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200 leading-relaxed">
              <strong className="font-semibold">Note:</strong> This is an AI-powered identification tool. Results should be
              verified by security personnel. False positives are possible.
            </p>
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  )
}

