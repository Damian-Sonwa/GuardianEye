import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    if (!response.ok) {
      // Try to parse error response as JSON, fallback to text
      let errorMessage = 'Login failed'
      if (isJson) {
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch {
          // If JSON parsing fails, use default message
        }
      } else {
        try {
          const errorText = await response.text()
          errorMessage = errorText || errorMessage
        } catch {
          // If text parsing fails, use default message
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      )
    }

    // Parse successful response
    if (isJson) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      // If response is not JSON, return error
      return NextResponse.json(
        { error: 'Invalid response from server' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error logging in:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to login' },
      { status: 500 }
    )
  }
}

