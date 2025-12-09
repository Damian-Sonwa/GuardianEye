import { NextRequest, NextResponse } from 'next/server'

const API_URL = process.env.API_BASE_URL || 'http://localhost:3001'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const response = await fetch(`${API_URL}/auth/users/${params.userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      return NextResponse.json(
        { error: error.message || 'Failed to delete user' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}


