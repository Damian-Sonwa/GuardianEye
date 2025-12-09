import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const authHeader = request.headers.get('authorization')
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    // Include Authorization header if provided (for admin-created users)
    if (authHeader) {
      headers['Authorization'] = authHeader
    }
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    if (!response.ok) {
      // Try to parse error response as JSON, fallback to text
      let errorMessage = 'Registration failed'
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
      // If response is not JSON, return success message
      return NextResponse.json({ message: 'Registration successful' })
    }
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to register user' },
      { status: 500 }
    )
  }
}

