'use client'

import { useEffect } from 'react'
import { useLoading } from '@/contexts/loading-context'

export default function Loading() {
  const { setIsLoading } = useLoading()

  useEffect(() => {
    setIsLoading(true)
    return () => setIsLoading(false)
  }, [setIsLoading])

  return null
} 