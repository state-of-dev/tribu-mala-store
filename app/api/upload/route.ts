import { put } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' }, 
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const filename = searchParams.get('filename')

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename requerido' }, 
        { status: 400 }
      )
    }

    const blob = await put(filename, request.body!, {
      access: 'public',
    })

    return NextResponse.json({ 
      success: true, 
      url: blob.url,
      filename: filename 
    })

  } catch (error) {
    console.error('Error uploading to blob:', error)
    return NextResponse.json(
      { error: 'Error al subir imagen' }, 
      { status: 500 }
    )
  }
}