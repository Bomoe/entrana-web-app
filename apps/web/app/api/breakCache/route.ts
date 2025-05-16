'use server'

import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.WEB_APP_API_KEY
    if (!apiKey) {
      console.error('Local env is missing apiKey')
      throw new Error('Unknown error')
    }
    const body: { apiKey: string; cacheName: string } | null | undefined =
      await request.json()
    console.log(body)
    if (!body) {
      throw new Error('Body missing from request to break cache')
    }

    if (!body.apiKey) {
      console.error('API key missing from request to break cache')
      throw new Error('Part of body missing from request to break cache')
    }

    if (!body.cacheName) {
      console.error('Cache name missing from request to break cache')
      throw new Error('Part of body missing from request to break cache')
    }

    if (apiKey !== body?.apiKey) {
      console.error('API Keys do not match')
      throw new Error('Uknown error')
    }

    revalidateTag(body.cacheName)

    return Response.json({ message: 'Success', data: body }, { status: 200 })
  } catch (error) {
    console.error('Error processing request:', error)
    return Response.json(
      { message: 'Error processing request' },
      { status: 500 }
    )
  }
}
