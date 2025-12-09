import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: body.token }),
    })

    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    if (!response.ok) {
      let errorMessage = 'Email verification failed'
      if (isJson) {
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch {
          // If JSON parsing fails, use default message
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    if (isJson) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      return NextResponse.json(
        { error: 'Invalid response from server' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error verifying email:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to verify email' },
      { status: 500 }
    )
  }
}

