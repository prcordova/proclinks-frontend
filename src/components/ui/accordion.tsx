'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export function Accordion({ title, children, defaultOpen = false, className }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className={cn('border rounded-lg overflow-hidden', className)}>
      <button
        className="w-full px-4 py-3 flex justify-between items-center bg-gray-50 dark:bg-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium">{title}</h3>
        <ChevronDown
          className={cn(
            'w-5 h-5 transition-transform',
            isOpen ? 'transform rotate-180' : ''
          )}
        />
      </button>
      <div
        className={cn(
          'transition-all duration-200 ease-in-out',
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
} 