import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const response = await fetch(`${API_URL}/ai/face-match`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to match face')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error matching face:', error)
    return NextResponse.json(
      { error: 'Failed to match face', matches: [] },
      { status: 500 }
    )
  }
}

