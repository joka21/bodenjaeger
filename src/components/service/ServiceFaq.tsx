'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { SERVICE_FAQ } from '@/content/service'

/**
 * FAQ-Accordion (8 Fragen). Schlanke Eigenlösung ohne zusätzliche Dependency.
 * Als Block gedacht (Page ordnet neben Orientierung an).
 */
export default function ServiceFaq() {
  const { headline, items } = SERVICE_FAQ
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div>
      <h2 className="font-bold text-dark" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)' }}>
        {headline}
      </h2>

      <ul className="mt-8 space-y-3">
        {items.map((item, i) => {
          const open = openIndex === i
          return (
            <li key={item.frage} className="overflow-hidden rounded-2xl border border-ash bg-white shadow-sm">
              <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
              >
                <span className="font-bold text-dark">{item.frage}</span>
                <ChevronDown
                  className={`h-5 w-5 flex-shrink-0 text-brand transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                />
              </button>
              {open && (
                <div className="px-5 pb-6 text-mid md:px-6">
                  <p>{item.antwort}</p>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
