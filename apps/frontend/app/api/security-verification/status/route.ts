import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const API_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const response = await fetch(`${API_URL}/security-verification/status`, {
      headers: {
        'Authorization': authHeader,
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to get verification status' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error getting verification status:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get verification status' },
      { status: 500 }
    )
  }
}

