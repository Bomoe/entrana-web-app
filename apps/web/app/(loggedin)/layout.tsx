'use client'

import React, { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen justify-center">
      <main className="my-10 w-full max-w-7xl px-4">{children}</main>
    </div>
  )
}
