import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const response = await fetch(`${API_URL}/panic`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error('Failed to send panic alert')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error sending panic alert:', error)
    return NextResponse.json(
      { error: 'Failed to send panic alert' },
      { status: 500 }
    )
  }
}

