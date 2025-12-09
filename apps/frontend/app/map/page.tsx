'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Button, Card, CardContent, CardHeader, CardTitle } from '@security-app/ui'
import { AlertTriangle, Navigation, Filter } from 'lucide-react'
import BottomNav from '@/components/bottom-nav'

export default function MapPage() {
  const router = useRouter()
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [mapboxToken, setMapboxToken] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Get token from environment variable (client-side)
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''
    setMapboxToken(token)

    if (!mapContainer.current) return

    // Check if token exists
    if (!token || token === '') {
      setHasError(true)
      return
    }

    try {
      mapboxgl.accessToken = token

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [8.6753, 9.0820], // Default to Nigeria
        zoom: 12,
      })

      // Wait for map to load before adding controls and markers
      map.current.on('load', () => {
        // Add navigation controls
        map.current?.addControl(new mapboxgl.NavigationControl(), 'top-right')

        // Add sample markers (in production, fetch from API)
        const sampleMarkers = [
          {
            id: 1,
            lat: 9.0820,
            lng: 8.6753,
            type: 'danger',
            title: 'Reported Incident',
          },
          {
            id: 2,
            lat: 9.0920,
            lng: 8.6853,
            type: 'warning',
            title: 'Suspicious Activity',
          },
        ]

        sampleMarkers.forEach((marker) => {
          const el = document.createElement('div')
          el.className = `w-4 h-4 rounded-full border-2 border-white ${
            marker.type === 'danger' ? 'bg-red-500' : 'bg-amber-500'
          }`

          new mapboxgl.Marker(el)
            .setLngLat([marker.lng, marker.lat])
            .setPopup(
              new mapboxgl.Popup().setHTML(`
            <div class="p-2">
              <h3 class="font-semibold">${marker.title}</h3>
              <p class="text-sm text-gray-600">Reported 2 hours ago</p>
            </div>
          `)
            )
            .addTo(map.current!)
        })

        setMarkers(sampleMarkers)
      })
    } catch (error) {
      console.error('Error initializing map:', error)
      setHasError(true)
    }

    return () => {
      map.current?.remove()
    }
  }, [])

  const centerOnUser = () => {
    if (navigator.geolocation && map.current) {
      navigator.geolocation.getCurrentPosition((position) => {
        map.current?.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          zoom: 15,
        })

        // Add user marker
        new mapboxgl.Marker({ color: '#10b981' })
          .setLngLat([position.coords.longitude, position.coords.latitude])
          .addTo(map.current!)
      })
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Threat Map</h1>
          <div className="flex gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={centerOnUser}
              className="h-12 w-12 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-[0_4px_12px_rgba(0,0,0,0.15)] backdrop-blur-sm"
            >
              <Navigation className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-12 w-12 rounded-full bg-white/90 dark:bg-zinc-800/90 shadow-[0_4px_12px_rgba(0,0,0,0.15)] backdrop-blur-sm"
            >
              <Filter className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        {hasError || !mapboxToken ? (
          <div className="flex h-full items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Mapbox Token Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  To use the map feature, you need to add a Mapbox access token.
                </p>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">Steps to add token:</p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>Get a free token from <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a></li>
                    <li>Add it to <code className="bg-muted px-1 rounded">apps/frontend/.env.local</code></li>
                    <li>Set: <code className="bg-muted px-1 rounded">NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here</code></li>
                    <li>Restart the dev server</li>
                  </ol>
                </div>
                <Button
                  variant="outline"
                  onClick={() => router.push('/home')}
                  className="w-full"
                >
                  Go Back
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div ref={mapContainer} className="h-full w-full" />

        {/* Legend */}
        <div className="absolute bottom-6 left-4 right-4">
          <Card className="rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
            <CardHeader className="p-5">
              <CardTitle className="text-base font-semibold">Legend</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className="flex gap-6 text-sm font-medium">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow-sm"></div>
                  <span>High Risk</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow-sm"></div>
                  <span>Warning</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-sm"></div>
                  <span>You</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

