'use server'

import { headers } from 'next/headers'
import { auth } from './auth'

export async function getSession() {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  return session
}
