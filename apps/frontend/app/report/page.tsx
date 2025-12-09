'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@security-app/ui'
import { Camera, Video, Mic, FileText, MapPin, Send, X } from 'lucide-react'
import BottomNav from '@/components/bottom-nav'

type MediaType = 'photo' | 'video' | 'audio' | null

export default function ReportPage() {
  const router = useRouter()
  const [description, setDescription] = useState('')
  const [mediaType, setMediaType] = useState<MediaType>(null)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }
  }, [])

  // Cleanup: Stop recording when component unmounts
  useEffect(() => {
    return () => {
      if (isRecording && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop()
      }
      // Clean up audio preview URLs
      if (mediaPreview && mediaType === 'audio') {
        URL.revokeObjectURL(mediaPreview)
      }
    }
  }, [isRecording, mediaPreview, mediaType])

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        setAudioBlob(audioBlob)
        const audioUrl = URL.createObjectURL(audioBlob)
        setMediaPreview(audioUrl)
        
        // Create a File object from the blob
        const audioFile = new File([audioBlob], 'recording.webm', { type: 'audio/webm' })
        setMediaFile(audioFile)
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setMediaType('audio')
    } catch (error) {
      console.error('Error starting audio recording:', error)
      alert('Could not access microphone. Please check permissions.')
    }
  }

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleMediaSelect = (type: MediaType) => {
    if (type === 'audio') {
      if (isRecording) {
        stopAudioRecording()
      } else {
        startAudioRecording()
      }
      return
    }

    setMediaType(type)
    if (type === 'photo' || type === 'video') {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = type === 'photo' ? 'image/*' : 'video/*'
      input.capture = 'environment'
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          setMediaFile(file)
          if (type === 'photo') {
            setMediaPreview(URL.createObjectURL(file))
          }
        }
      }
      input.click()
    }
  }

  const handleSubmit = async () => {
    // Stop recording if still recording
    if (isRecording) {
      stopAudioRecording()
      // Wait a bit for the recording to finish
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    if (!description.trim()) {
      alert('Please enter a description')
      return
    }

    const formData = new FormData()
    formData.append('description', description)
    if (location) {
      formData.append('location', JSON.stringify(location))
    }
    if (mediaFile) {
      formData.append('media', mediaFile)
      formData.append('mediaType', mediaType || '')
    }

    try {
      // Check if online
      if (navigator.onLine) {
        try {
          const response = await fetch('/api/reports', {
            method: 'POST',
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            alert('Report submitted successfully!')
            router.push('/home')
            return
          } else {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || 'Failed to submit report')
          }
        } catch (fetchError) {
          console.error('API error:', fetchError)
          // Fall through to offline save
        }
      }
      
      // Save to IndexedDB if offline or if request failed
      const { saveReport } = await import('@/lib/offline-db')
      await saveReport({
        description,
        location,
        media: mediaFile || undefined,
      })
      
      // Show success message
      alert('Report saved offline. It will be synced when you are online.')
      router.push('/home')
    } catch (error: any) {
      console.error('Error submitting report:', error)
      alert(`Error saving report: ${error.message || 'Please try again.'}`)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Report Incident</h1>
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <X className="h-6 w-6" />
          </Button>
        </div>
      </header>

      <main className="flex-1 space-y-6 p-6">
        {/* Description */}
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg">Description</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happened..."
              className="w-full min-h-[120px] rounded-xl border-2 border-slate-200 bg-background px-5 py-4 text-base font-medium transition-all focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 dark:border-slate-700 resize-y"
            />
          </CardContent>
        </Card>

        {/* Media Options */}
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg">Add Media</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => handleMediaSelect('photo')}
                className="flex flex-col items-center justify-center h-24 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-emerald-300 active:bg-emerald-50 active:border-emerald-400 transition-all duration-200 dark:bg-slate-800 dark:border-slate-600"
              >
                <Camera className="mb-2 h-6 w-6 text-slate-600 dark:text-slate-400" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Photo</span>
              </button>
              <button
                onClick={() => handleMediaSelect('video')}
                className="flex flex-col items-center justify-center h-24 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-emerald-300 active:bg-emerald-50 active:border-emerald-400 transition-all duration-200 dark:bg-slate-800 dark:border-slate-600"
              >
                <Video className="mb-2 h-6 w-6 text-slate-600 dark:text-slate-400" />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Video</span>
              </button>
              <button
                onClick={() => handleMediaSelect('audio')}
                className={`flex flex-col items-center justify-center h-24 rounded-xl border-2 border-dashed transition-all duration-200 ${
                  isRecording
                    ? 'border-red-400 bg-red-50 active:bg-red-100 dark:bg-red-900/20 dark:border-red-500'
                    : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-emerald-300 active:bg-emerald-50 active:border-emerald-400 dark:bg-slate-800 dark:border-slate-600'
                }`}
              >
                <Mic className={`mb-2 h-6 w-6 ${isRecording ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-slate-600 dark:text-slate-400'}`} />
                <span className={`text-xs font-medium ${isRecording ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>
                  {isRecording ? 'Stop' : 'Audio'}
                </span>
              </button>
            </div>

            {mediaPreview && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                {mediaType === 'audio' ? (
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <audio
                      ref={audioRef}
                      src={mediaPreview}
                      controls
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setMediaPreview(null)
                        setMediaFile(null)
                        setAudioBlob(null)
                        setMediaType(null)
                        if (audioRef.current) {
                          audioRef.current.pause()
                        }
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="w-full rounded-lg"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setMediaPreview(null)
                        setMediaFile(null)
                        setMediaType(null)
                      }}
                      className="mt-2"
                    >
                      Remove
                    </Button>
                  </>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="rounded-2xl">
          <CardHeader className="p-6">
            <CardTitle className="text-lg">Location</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {location ? (
              <div className="flex items-center gap-3 text-base font-medium text-emerald-600">
                <MapPin className="h-5 w-5" />
                <span>Location captured</span>
              </div>
            ) : (
              <Button
                variant="outline"
                size="lg"
                className="w-full h-14 border-2"
                onClick={() => {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                      })
                    }
                  )
                }}
              >
                <MapPin className="mr-2 h-5 w-5" />
                Get Location
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <Button
          size="xl"
          onClick={handleSubmit}
          className="w-full h-16 rounded-2xl"
          disabled={!description.trim()}
        >
          <Send className="mr-2 h-5 w-5" />
          Submit Report
        </Button>
      </main>

      <BottomNav />
    </div>
  )
}

